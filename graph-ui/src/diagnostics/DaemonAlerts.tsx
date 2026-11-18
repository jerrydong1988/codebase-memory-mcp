import { featureCopy } from '../i18n/features/diagnostics';
import { useEffect, useMemo, useState } from 'react';
import type { LogTail } from '../projects/projects-model';
import { logLevel } from '../system/system-model';
import type { SystemReading } from '../system/useSystemPoll';
import type { CoverageIndex } from '../app/tree-model';
import { diagnosticCategory, diagnosticRecords } from './diagnostics-model';
import './diagnostics.css';

function readableMessage(raw: string): string {
    try {
        const record: unknown = JSON.parse(raw);
        if (record && typeof record === 'object' && !Array.isArray(record) && 'message' in record && typeof record.message === 'string') return record.message;
    } catch { /* Plain daemon log lines already are the display message. */ }
    return raw;
}

export interface DaemonAlertsProps {
    project?: string;
    scope?: 'project' | 'daemon';
    onScopeChange?: (scope: 'project' | 'daemon') => void;
    reading: SystemReading<LogTail> & { refresh?: () => void };
    onDiagnose?: () => void;
    coverage?: CoverageIndex | null;
    coverageKnown?: boolean;
    coverageError?: string | null;
}

/** Priority feed independent of graph selection; these are daemon events, not graph facts. */
export default function DaemonAlerts({ reading, onDiagnose, coverage, coverageKnown, coverageError, project, scope = 'project', onScopeChange }: DaemonAlertsProps) {
    const [expanded, setExpanded] = useState(scope === 'daemon');
    const [seen, setSeen] = useState<{ generation: string; id: number }>();
    const generation = reading.data?.generation ?? 'legacy';
    const cursor = Math.max(0, ...(reading.data?.records ?? []).map(row => row.id));
    useEffect(() => {
        if (reading.data && seen?.generation !== generation) setSeen({ generation, id: cursor });
    }, [reading.data, seen?.generation, generation, cursor]);
    const records = useMemo(() => {
        const rows = reading.data?.records?.map((record) => ({
            ...record, key: `${reading.data?.generation ?? 'daemon'}:${record.id}`,
            severity: logLevel(`level=${record.level}`),
        })) ?? (reading.data?.lines ?? []).map((line, index) => ({
            key: `legacy:${index}`, id: index, ts: '', level: '', source: 'Daemon log', message: line, severity: logLevel(line),
        }));
        return rows.filter((row) => row.severity === 'error' || row.severity === 'warn')
            .sort((left, right) => (left.severity === 'error' ? 0 : 1) - (right.severity === 'error' ? 0 : 1) || right.id - left.id);
    }, [reading.data]);
    const errors = records.filter((record) => record.severity === 'error').length;
    const fresh = seen?.generation === generation ? records.filter(row => row.id > seen.id) : [];
    const newErrors = scope === 'project' ? fresh.filter(row => row.severity === 'error') : [];
    const visible = expanded ? records : newErrors.slice(0, 1);
    const acknowledge = () => { setSeen({ generation, id: cursor }); setExpanded(false); };
    const coverageSummary = useMemo(() => {
        if (coverageError) return 'Index coverage unavailable; the map may be incomplete.';
        if (!coverage || coverageKnown === false) return 'Index coverage unknown.';
        const rows = diagnosticRecords(coverage);
        if (!rows.length) return 'No coverage gaps recorded; complete indexing is not guaranteed.';
        const partial = rows.filter((row) => row.state === 'partial').length;
        const excluded = rows.filter((row) => diagnosticCategory(row) === 'excluded').length;
        const skipped = rows.filter((row) => row.state === 'skipped').length;
        return `Index coverage: ${partial} partially parsed paths · ${skipped} skipped · ${excluded} intentionally excluded${coverage.truncations.length ? ' · detail listing incomplete' : ''}.`;
    }, [coverage, coverageKnown, coverageError]);
    return <section className={`daemon-alerts${newErrors.length || reading.error ? ' daemon-alerts-has-errors' : ''}${expanded ? ' daemon-alerts-expanded' : ' daemon-alerts-collapsed'}`} aria-label={featureCopy.Daemon_errors_and_warnings_1075da2} data-testid="daemon-alerts">
        <div className="daemon-alerts-heading">
            <strong>{scope === 'daemon' ? featureCopy.Daemon_history_all_projects_6a17aaa : newErrors.length ? featureCopy.message_0_new_recorded_errors_1_2a3a7c5(newErrors.length, project ?? 'this project') : featureCopy.Project_events_0_5ad1fe9(project ? ` · ${project}` : '')}</strong>
            <span>{reading.error ? featureCopy.Connection_interrupted_last_reading_131ce57 : reading.loading && !reading.data ? featureCopy.Reading_events_6ef1bc5 : reading.updatedAt ? featureCopy.Last_checked_0_67a9acf(new Date(reading.updatedAt).toLocaleTimeString()) : featureCopy.No_event_reading_yet_ed606f4}</span>
            <button type="button" onClick={() => setExpanded(!expanded)}>{expanded ? featureCopy.Close_history_7bf06ef : featureCopy.History_0_retained_04b65b0(reading.data?.total ?? records.length)}</button>
            {newErrors.length > 0 && <button type="button" onClick={acknowledge}>{featureCopy.Acknowledge_new_events_4f07a06}</button>}
            {expanded && onScopeChange && <button type="button" onClick={() => onScopeChange(scope === 'project' ? 'daemon' : 'project')}>{scope === 'project' ? featureCopy.All_daemon_history_d8b23e0 : featureCopy.This_project_only_61fd3f8}</button>}
            {expanded && reading.refresh && <button type="button" onClick={reading.refresh} disabled={reading.loading}>{featureCopy.Refresh_events_cfa71d5}</button>}
            {onDiagnose && <button type="button" onClick={onDiagnose}>{featureCopy.Inspect_index_coverage_333e636}</button>}
        </div>
        {(coverageKnown !== undefined || coverage !== undefined || coverageError) && <p className="daemon-coverage-summary" title={coverageSummary}>{coverageSummary}</p>}
        {reading.error && <p role="alert" className="diagnostics-error">{featureCopy.Event_updates_failed_1e8eb1f}{reading.error}. A missing update does not mean the daemon recovered.</p>}
        {reading.data?.persistent !== true && reading.data && <p className="diagnostics-caveat">{featureCopy.Persistent_event_history_unavailable_This_log_tail_may_not_surviv_3ce7ff9}</p>}
        {expanded && <p className="diagnostics-caveat">{featureCopy.Recorded_history_not_a_count_of_active_failures_aa0e6e0}{scope === 'project' ? featureCopy.Only_events_attributed_to_this_project_older_unattributed_records_5a555b7 : featureCopy.Includes_other_projects_and_older_events_without_project_attribut_64fc448}{featureCopy.Acknowledging_events_does_not_resolve_their_causes_or_delete_them_38d9781}</p>}
        {visible.length > 0 && <ol className="daemon-alert-list">{visible.map((record) => {
            const message = readableMessage(record.message);
            return <li key={record.key} className={`daemon-alert-${record.severity}`}>
            <div><strong>{record.severity === 'error' ? featureCopy.ERROR_9484277 : featureCopy.WARNING_452bee1}</strong> <span>{record.source || featureCopy.Source_not_reported_4f81323}</span> {record.ts && <time dateTime={record.ts}>{record.ts}</time>} {reading.data?.records && <span>{featureCopy.Event_baeb32b}{record.id}</span>}{scope === 'daemon' && <span>{featureCopy.Project_604452e}{'project' in record && typeof record.project === 'string' ? record.project : featureCopy.not_recorded_9925ee3}</span>}</div>
            <pre>{message.length > 400 ? `${message.slice(0, 400)}…` : message}</pre>
            <details><summary>{featureCopy.Full_recorded_event_53a6e6c}</summary><pre>{record.message}</pre></details>
        </li>})}</ol>}
        {expanded && records.length === 0 && reading.data && <p>{featureCopy.No_attributed_warning_error_events_in_this_retained_reading_Unrec_048edfc}</p>}
        {reading.data && expanded && <p className="diagnostics-caveat">{records.length}{featureCopy.of_607f2de}{reading.data.total}{featureCopy.matching_retained_events_shown_451196a}{errors}{featureCopy.errors_in_this_page_1a7a8e9}{reading.data.retentionLimit !== undefined ? featureCopy.shared_history_limit_0_af98ecf(reading.data.retentionLimit) : ''}. Older events may have expired. Project and file details appear only when recorded.</p>}
    </section>;
}
