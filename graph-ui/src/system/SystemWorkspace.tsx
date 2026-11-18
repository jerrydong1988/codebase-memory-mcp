import { useSystemText } from './system-strings';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { AtlasApi } from '../app/atlas-api';
import type { ProjectEntry } from '../provider/rpc-schemas';
import IndexesPanel, { type IndexesApi } from './IndexesPanel';
import { collapseRepeats, cpuText, logLevel, memoryLabel, memoryText, repeatTitle } from './system-model';
import { useSystemPoll, type SystemReading } from './useSystemPoll';
import './system.css';

export interface SystemWorkspaceProps {
    api: Pick<AtlasApi, 'processes' | 'logs' | 'indexJobs'> & IndexesApi;
    onOpenProjects: () => void;
    active?: boolean;
    version?: string;
    pollMs?: number;
    project?: string;
    configuration?: ReactNode | ((active: boolean) => ReactNode);
    listProjects?: () => Promise<ProjectEntry[]>;
}

type SystemTab = 'overview' | 'configuration' | 'indexes' | 'logs';
const TABS: SystemTab[] = ['overview', 'configuration', 'indexes', 'logs'];


function ReadStatus({ reading, paused }: { reading: SystemReading<unknown>; paused: boolean }) {
    const text = useSystemText();
    return <div className="system-read-status">
        <span className={reading.error ? 'system-warning' : ''}>
            {reading.error ? reading.data ? text.lastReading : text.failed : paused ? text.paused : reading.loading ? text.updating : text.live}
        </span>
        <span>{reading.updatedAt === null ? text.noReading : <>{text.updated}{" "}<time dateTime={new Date(reading.updatedAt).toISOString()}>{new Date(reading.updatedAt).toLocaleTimeString()}</time></>}</span>
        {reading.error && <p role="alert">{reading.error}</p>}
    </div>;
}

/** Daemon readings and configuration; project indexing uses the existing dialog. */
export default function SystemWorkspace({ api, onOpenProjects, active = true, version, pollMs = 3000, project, configuration, listProjects }: SystemWorkspaceProps) {
    const text = useSystemText();
    const [tab, setTab] = useState<SystemTab>('overview');
    const [paused, setPaused] = useState(false);
    const [level, setLevel] = useState<'all' | 'error' | 'warn' | 'info'>('all');
    const [scope, setScope] = useState<'daemon' | 'project' | 'unattributed'>('daemon');
    const [copyStatus, setCopyStatus] = useState('');
    const [followTail, setFollowTail] = useState(true);
    const [indexesRefresh, setIndexesRefresh] = useState(0);
    const logRef = useRef<HTMLDivElement>(null);
    const readProcesses = useCallback(() => api.processes(), [api]);
    const selectedProject = scope === 'project' ? project : undefined;
    const readLogs = useCallback(async () => {
        if (scope === 'project' && !selectedProject) throw new Error(text.selectProject);
        const data = await api.logs(200, level === 'all' ? undefined : level, selectedProject, {
            ...(scope === 'unattributed' ? { scope: 'unattributed' as const } : {}),
        });
        if ((scope !== 'daemon' || level !== 'all') && data.persistent !== true) throw new Error(text.persistentRequired);
        if (scope === 'project' && (data.scope !== 'project' || data.project !== selectedProject)) throw new Error(text.scopeUnconfirmed);
        if (scope === 'unattributed' && data.scope !== 'unattributed') throw new Error(text.unattributedUnconfirmed);
        return data;
    }, [api, level, selectedProject, scope, text]);
    const readJobs = useCallback(() => api.indexJobs(), [api]);
    const processes = useSystemPoll(readProcesses, active, paused, pollMs);
    const logs = useSystemPoll(readLogs, active && tab === 'logs', paused, pollMs);
    const jobs = useSystemPoll(readJobs, active && tab === 'indexes', paused, pollMs);
    const report = processes.data;
    const self = report?.processes.find((process) => process.isSelf);
    const visibleLines = logs.data?.lines ?? [];
    const visibleRecords = logs.data?.records;
    // Identical messages read as one line with a count; a repeated warning cannot push the rest out of view.
    const logRows = useMemo(() => visibleRecords ? collapseRepeats(visibleRecords) : undefined, [visibleRecords]);
    const selectedReading = tab === 'logs' ? logs : tab === 'indexes' ? jobs : processes;

    useEffect(() => {
        if (followTail && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs.data, followTail, tab]);
    useEffect(() => { setCopyStatus(''); }, [level, logs.data]);

    const copyLogs = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(text.clipboardUnavailable);
            await navigator.clipboard.writeText(logRows ? logRows.map(({ record, count }) => `${record.ts} ${record.level.toUpperCase()} ${record.source} #${record.id}${count > 1 ? ` ×${count}` : ''}\n${record.message}`).join('\n') : visibleLines.join('\n'));
            setCopyStatus(text.copied);
        } catch (error) {
            setCopyStatus(error instanceof Error ? error.message : text.copyFailed);
        }
    };
    const moveTab = (event: KeyboardEvent<HTMLButtonElement>, current: SystemTab) => {
        const index = TABS.indexOf(current);
        const target = event.key === 'ArrowDown' ? TABS[(index + 1) % TABS.length]
            : event.key === 'ArrowUp' ? TABS[(index + TABS.length - 1) % TABS.length]
            : event.key === 'Home' ? TABS[0] : event.key === 'End' ? TABS[TABS.length - 1] : undefined;
        if (!target) return;
        event.preventDefault();
        setTab(target);
        document.getElementById(`system-tab-${target}`)?.focus();
    };

    return <section className="system-workspace" aria-label={text.title} hidden={!active} data-testid="system-workspace">
        <header className="system-heading">
            <div><p className="system-eyebrow">{text.daemon}</p><h1>{text.title}</h1><p>{text.description}</p></div>
            <div className="system-heading-actions">
                {version && <span className="system-version">{version}</span>}
                {tab !== 'configuration' && <>
                    <button type="button" onClick={() => { selectedReading.refresh(); if (tab === 'indexes') setIndexesRefresh(value => value + 1); }} disabled={selectedReading.loading}>{text.refresh}</button>
                    <button type="button" aria-label={paused ? text.resumeAria : text.pauseAria} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? text.resume : text.pause}</button>
                </>}
            </div>
        </header>
        <div className="system-layout">
        <div className="system-tabs" role="tablist" aria-label={text.views} aria-orientation="vertical">
            {TABS.map((name) => <button key={name} id={`system-tab-${name}`} type="button" role="tab" aria-selected={tab === name} aria-controls={`system-panel-${name}`} tabIndex={tab === name ? 0 : -1} onKeyDown={(event) => moveTab(event, name)} onClick={() => setTab(name)}>{text[name]}</button>)}
        </div>
        <div className="system-view">
        {tab !== 'configuration' && tab !== 'indexes' && <ReadStatus reading={selectedReading} paused={paused} />}

        <div id="system-panel-overview" role="tabpanel" aria-labelledby="system-tab-overview" hidden={tab !== 'overview'}>
            <div className="system-metrics">
                <article><span>{text.servingProcess}</span><strong>{report && report.selfPid > 0 ? `PID ${report.selfPid}` : text.unavailable}</strong><small>{self?.elapsed ? text.elapsed(self.elapsed) : text.noUptime}</small></article>
                <article><span>{memoryLabel(report?.telemetry?.selfMemoryKind, text)}</span><strong>{memoryText(report?.telemetry?.selfMemoryMb, text)}</strong><small>{text.servingDaemon}</small></article>
                <article><span>{report?.telemetry?.cpuUnit === 'seconds' ? text.cpuTime : 'CPU'}</span><strong>{cpuText(self?.telemetry?.cpu, report?.telemetry?.cpuUnit, text)}</strong><small>{report?.telemetry?.cpuUnit === 'seconds' ? text.totalCpu : report?.telemetry?.cpuUnit === 'percent' ? text.hostCpu : text.missingUnit}</small></article>
                <article><span>{text.processCount}</span><strong>{report ? report.processes.length : text.unavailable}</strong><small>{text.visible}</small></article>
            </div>
            <section className="system-section" aria-label={text.daemonProcesses}>
                <div className="system-section-heading"><h2>{text.processes}</h2><span>{memoryLabel(report?.telemetry?.memoryKind, text)} · MiB</span></div>
                <div className="system-table-wrap"><table><thead><tr><th>{text.process}</th><th>CPU</th><th>{text.memory}</th><th>{text.uptime}</th><th>{text.command}</th></tr></thead><tbody>
                    {report?.processes.map((process, index) => <tr key={`${process.pid}-${index}`}>
                        <th scope="row">{process.pid > 0 ? process.pid : text.unavailable} {process.isSelf && <span className="system-tag">{text.serving}</span>}</th>
                        <td>{cpuText(process.telemetry?.cpu, report.telemetry?.cpuUnit, text)}</td><td>{memoryText(process.telemetry?.memoryMb, text)}</td><td>{process.elapsed || text.unavailable}</td><td><code>{process.command || text.unavailable}</code></td>
                    </tr>)}
                </tbody></table></div>
                {!report && <p className="system-empty">{processes.loading ? text.reading : text.noProcesses}</p>}
                {report?.processes.length === 0 && <p className="system-empty">{text.empty}</p>}
            </section>
        </div>

        <div id="system-panel-configuration" role="tabpanel" aria-labelledby="system-tab-configuration" hidden={tab !== 'configuration'}>
            {(typeof configuration === 'function' ? configuration(active && tab === 'configuration') : configuration) ?? <p className="system-empty">{text.configurationUnavailable}</p>}
        </div>

        <div id="system-panel-indexes" role="tabpanel" aria-labelledby="system-tab-indexes" hidden={tab !== 'indexes'}>
            <IndexesPanel api={api} listProjects={listProjects} active={active && tab === 'indexes'} paused={paused} refreshToken={indexesRefresh} onOpenProjects={onOpenProjects} />
            <details className="system-index-activity">
                <summary>{text.recentActivity}{jobs.data ? text.jobSlots(jobs.data.length) : ''}</summary><p className="system-muted">{text.jobHistory}</p>
                <div className="system-table-wrap"><table><thead><tr><th>{text.repository}</th><th>{text.state}</th><th>{text.details}</th></tr></thead><tbody>
                    {jobs.data?.map((job, index) => <tr key={`${job.slot}-${index}`}><th scope="row"><code>{job.path || text.pathUnavailable}</code></th><td><span className={`system-job-state system-job-${job.status}`}>{job.status === 'indexing' ? text.indexing : job.status === 'done' ? text.complete : job.status === 'error' ? text.jobFailed : text.unknown}</span></td><td>{job.error || text.noDetails}</td></tr>)}
                </tbody></table></div>
                {jobs.data?.length === 0 && <p className="system-empty">{text.noActivity}</p>}
                {!jobs.data && <p className="system-empty">{jobs.loading ? text.readingActivity : text.noIndexReading}</p>}
                {jobs.error && <p className="system-warning" role="alert">{text.jobError(jobs.error)}</p>}
            </details>
        </div>

        <div id="system-panel-logs" role="tabpanel" aria-labelledby="system-tab-logs" hidden={tab !== 'logs'}>
            <section className="system-section">
                <div className="system-section-heading"><div><h2>{text.errorsLogs}</h2><p>{report && report.selfPid > 0 ? text.processPid(report.selfPid) : text.servingDaemon}{" "}{text.latestEvents}</p></div><button type="button" disabled={(visibleRecords?.length ?? visibleLines.length) === 0} onClick={() => { void copyLogs(); }}>{text.copyVisible}</button></div>
                {logs.data && <p className="system-muted">{logs.data.persistent === true ? text.retention(logs.data.retentionLimit ?? text.bounded) : text.historyUnavailable}{" "}{text.eventAttribution}</p>}
                <div className="system-log-controls">
                    <label><span>{text.scope}</span><select aria-label={text.logScope} value={scope} onChange={(event) => setScope(event.currentTarget.value as typeof scope)}>
                        <option value="daemon">{text.allProjects}</option>
                        <option value="project" disabled={!project}>{text.currentProject}{project ? ` · ${project}` : text.noneSelected}</option>
                        <option value="unattributed">{text.unattributed}</option>
                    </select></label>
                    <label><span>{text.severity}</span><select aria-label={text.logSeverity} value={level} onChange={(event) => setLevel(event.currentTarget.value as typeof level)}>
                        <option value="all">{text.allLevels}</option><option value="info">{text.infoAbove}</option>
                        <option value="warn">{text.warningsErrors}</option><option value="error">{text.errors}</option>
                    </select></label>
                    <label className="system-tail-toggle"><input type="checkbox" checked={followTail} onChange={(event) => setFollowTail(event.currentTarget.checked)} />{" "}{text.followTail}</label>
                </div>
                <p className="system-muted">{text.filterDescription}{" "}{scope === 'project' ? text.onlyProject(project ?? text.selectedProject) : scope === 'unattributed' ? text.unattributedDescription : text.allDescription}</p>
                <div className="system-log-meta"><span>{text.shownEvents(visibleRecords?.length ?? visibleLines.length, logs.data?.total ?? text.unknown)}</span><span role="status">{copyStatus}</span></div>
                <div className="system-log" aria-label={text.logLines} tabIndex={0} ref={logRef} onScroll={() => {
                    const element = logRef.current;
                    if (element && element.scrollHeight - element.scrollTop - element.clientHeight > 32) setFollowTail(false);
                }}>
                    {logRows ? logRows.map((row) => { const { record } = row; return <div className={`system-log-line system-log-record system-log-${logLevel(`level=${record.level}`)}`} key={`${logs.data?.generation ?? ''}:${record.id}`}><strong>{record.level.toUpperCase() || text.unclassified}</strong> · <time dateTime={record.ts}>{record.ts || text.timeUnavailable}</time> · {record.source || text.sourceUnavailable} · {text.event(record.id)} · {record.project ? text.projectLabel(record.project) : text.projectUnknown}{row.count > 1 && <> · <span className="system-log-repeat" title={repeatTitle(row, text)}>×{row.count}</span></>}<pre>{record.message}</pre></div>; }) : visibleLines.map((line, index) => <div className={`system-log-line system-log-${logLevel(line)}`} key={index}>{line || '\u00a0'}</div>)}
                    {(visibleRecords?.length ?? visibleLines.length) === 0 && <p>{logs.loading ? text.readingLog : !logs.data ? text.noLogReading : text.noLogMatch}</p>}
                </div>
            </section>
        </div>
        </div>
        </div>
    </section>;
}
