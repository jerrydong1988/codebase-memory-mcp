import { systemStrings, useSystemText } from './system-strings';
import { useUiLanguage } from '../i18n/ui-language';
import { localizedSetting } from '../settings/configuration-metadata';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AtlasApi } from '../app/atlas-api';
import type { ProjectHealth } from '../projects/projects-model';
import type { ProjectEntry } from '../provider/rpc-schemas';
import type { ConfigSnapshot } from '../settings/config-model';
import { useSystemPoll } from './useSystemPoll';

export type IndexesApi = Partial<Pick<AtlasApi, 'projectHealth' | 'configuration' | 'saveConfiguration'>>;
interface IndexReading { project: ProjectEntry; health: ProjectHealth | null; error: string | null }
interface Props {
    api: IndexesApi;
    listProjects?: () => Promise<ProjectEntry[]>;
    active: boolean;
    paused: boolean;
    refreshToken: number;
    pollMs?: number;
    onOpenProjects: () => void;
}

const failureText = (error: unknown) => error instanceof Error ? error.message : String(error);
const booleanText = (value: string | null | undefined, text: typeof systemStrings.en) => value === 'true' ? text.on : value === 'false' ? text.off : text.unknown;
const watcherText = (health: ProjectHealth | null, failed: boolean, text: typeof systemStrings.en) => {
    if (failed || health?.watchRegistered == null || health.watcherRunning == null) return text.unknown;
    return health.watchRegistered ? health.watcherRunning ? text.active : text.registeredStopped : text.notRegistered;
};

function WatcherSetting({ api, active, paused, pollMs, refreshToken }: Omit<Props, 'listProjects' | 'onOpenProjects'> & { pollMs: number }) {
    const text = useSystemText();
    const language = useUiLanguage();
    const [snapshot, setSnapshot] = useState<ConfigSnapshot | null>(null);
    const [optimistic, setOptimistic] = useState<boolean | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const pending = useRef(false);
    const readConfiguration = useCallback(async () => {
        if (!api.configuration) throw new Error(text.watcherUnavailable);
        return api.configuration();
    }, [api, text]);
    const reading = useSystemPoll(readConfiguration, active, paused || saving, pollMs);
    useEffect(() => { if (reading.data) setSnapshot(reading.data); }, [reading.data]);
    useEffect(() => { if (active && refreshToken > 0) reading.refresh(); }, [active, refreshToken, reading.refresh]);
    const setting = snapshot?.settings.find(item => item.key === 'watcher_enabled');
    const saved = setting?.override ?? setting?.value;
    const known = saved === 'true' || saved === 'false';
    const change = async (enabled: boolean) => {
        if (!snapshot || !setting?.editable || !api.saveConfiguration || pending.current) return;
        pending.current = true; setSaving(true); setOptimistic(enabled); setSaveError('');
        try { setSnapshot(await api.saveConfiguration(snapshot.revision, { watcher_enabled: enabled ? 'true' : 'false' })); }
        catch (error) { setSaveError(text.watcherSaveError(failureText(error))); }
        finally { pending.current = false; setSaving(false); setOptimistic(null); }
    };
    return <section className="system-watcher-setting" aria-label={text.watcherConfiguration}>
        <label className="system-watcher-toggle"><input type="checkbox" role="switch" aria-label={text.watcher} checked={optimistic ?? saved === 'true'} disabled={!known || !setting?.editable || !api.saveConfiguration || saving || !!reading.error || reading.loading} onChange={event => { void change(event.currentTarget.checked); }} /><span>{text.watcher}{" "}<small>{text.afterRestart}</small></span></label>
        <div className="system-watcher-details"><span>{saving ? text.saving : text.saved(booleanText(saved, text))}</span><span>{text.runningSetting}{" "}{setting?.effectiveKnown === false ? text.unknown : booleanText(setting?.effective, text)}</span>{setting?.pendingRestart && <strong>{text.restartPending}</strong>}</div>
        {setting?.readOnlyReason && <p className="system-muted">{localizedSetting(setting, language).readOnlyReason}</p>}
        {(!setting && !reading.loading) && <p className="system-muted">{text.watcherReadOnly}</p>}
        {(saveError || reading.error) && <p className="system-warning" role="alert">{saveError || reading.error}</p>}
        <p className="system-muted">{text.watcherScope}</p>
    </section>;
}

export default function IndexesPanel({ api, listProjects, active, paused, refreshToken, pollMs = 15000, onOpenProjects }: Props) {
    const text = useSystemText();
    const previous = useRef(new Map<string, IndexReading>());
    const enabled = useRef(active);
    enabled.current = active;
    const inFlight = useRef<Promise<IndexReading[]> | null>(null);
    const readIndexes = useCallback(async () => {
        if (inFlight.current) return inFlight.current;
        const read = async () => {
            if (!listProjects) throw new Error(text.inventoryUnavailable);
            const projects = await listProjects();
            const rows = new Array<IndexReading>(projects.length);
            let cursor = 0;
            const worker = async () => {
                while (cursor < projects.length) {
                    if (!enabled.current || document.visibilityState === 'hidden') throw new Error(text.indexPaused);
                    const index = cursor++;
                    const project = projects[index];
                    try {
                        if (!api.projectHealth) throw new Error(text.healthUnavailable);
                        rows[index] = { project, health: await api.projectHealth(project.name), error: null };
                    } catch (error) {
                        rows[index] = { project, health: previous.current.get(project.name)?.health ?? null, error: failureText(error) };
                    }
                }
            };
            const work = await Promise.allSettled(Array.from({ length: Math.min(4, projects.length) }, worker));
            const failed = work.find(result => result.status === 'rejected');
            if (failed?.status === 'rejected') throw failed.reason;
            previous.current = new Map(rows.map(row => [row.project.name, row]));
            return rows;
        };
        const request = read();
        inFlight.current = request;
        try { return await request; }
        finally { if (inFlight.current === request) inFlight.current = null; }
    }, [api, listProjects, text]);
    const reading = useSystemPoll(readIndexes, active, paused, pollMs);
    useEffect(() => { if (active && refreshToken > 0) reading.refresh(); }, [active, refreshToken, reading.refresh]);
    return <section className="system-section system-indexes" aria-label={text.projectIndexes}>
        <div className="system-section-heading"><div><h2>{text.indexes}</h2><p>{text.indexDescription}</p></div><button type="button" onClick={onOpenProjects}>{text.addIndex}</button></div>
        <WatcherSetting api={api} active={active} paused={paused} pollMs={pollMs} refreshToken={refreshToken} />
        <div className="system-index-reading"><span>{reading.loading ? text.updatingIndexes : paused ? text.paused : text.every15}</span>{reading.updatedAt !== null && <span>{text.readAt}{" "}<time dateTime={new Date(reading.updatedAt).toISOString()}>{new Date(reading.updatedAt).toLocaleTimeString()}</time></span>}</div>
        {reading.error && <p className="system-warning" role="alert">{reading.error}{reading.data ? text.oldInventory : ''}</p>}
        <div className="system-table-wrap"><table className="system-index-table"><thead><tr><th>{text.project}</th><th title={text.timestampHint}>{text.indexTimestamp}</th><th>{text.indexContents}</th><th>{text.watcher}</th></tr></thead><tbody>
            {reading.data?.map(({ project, health, error }) => <tr key={project.name}>
                <th scope="row"><strong>{project.name}</strong>{project.root_path && <small className="system-index-path" title={project.root_path}>{project.root_path}</small>}{health?.status !== 'healthy' && <small>{health?.status === 'corrupt' ? text.corrupt : health?.status === 'missing' ? text.missing : text.healthUnknown}</small>}{error && <small className="system-warning">{text.updateError(error)}{health ? text.showingLast : ''}</small>}</th>
                <td>{health?.indexedAt ? <time dateTime={health.indexedAt}>{new Date(health.indexedAt).toLocaleString()}</time> : <span>{text.unknown}</span>}</td>
                <td><span>{health?.nodes ?? project.nodes ?? text.unknown}{" "}{text.nodes}</span><small>{health?.edges ?? project.edges ?? text.unknown}{" "}{text.edges}</small></td>
                <td>{watcherText(health, !!error || !!reading.error, text)}</td>
            </tr>)}
        </tbody></table></div>
        {!reading.data && !reading.error && <p className="system-empty">{text.readingIndexes}</p>}
        {reading.data?.length === 0 && <p className="system-empty">{text.noIndexes}</p>}
    </section>;
}
