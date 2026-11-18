import { featureCopy } from '../i18n/features/impact';
import { useEffect, useId, useMemo, useState } from 'react';
import type { JSX } from 'react';
import { evidenceTarget, fetchSelectionImpact } from './selection-impact';
import type { SelectionImpact, SelectionImpactFinding, SelectionImpactTarget } from './selection-impact';
import { FILE_IMPACT_REFRESH } from './impact-strings';
import { RefreshControl, useRefreshFeedback } from '../ui/refresh/refresh-feedback';
import './file-impact-summary.css';

export interface FileImpactSummaryProps {
    project: string;
    target?: SelectionImpactTarget;
    onOpen: (target: SelectionImpactTarget) => void;
    expectedGeneration?: string;
    /** Production reads the same-origin graph and local Git endpoint. */
    load?: typeof fetchSelectionImpact;
}

export interface ImpactFileGroup {
    filePath: string;
    symbols: number;
    distance: number;
    testCandidate: boolean;
    target: SelectionImpactTarget;
}

/** File totals come only from returned evidence, never from a node-count estimate. */
export function aggregateFileImpact(data: SelectionImpact): {
    files: ImpactFileGroup[];
    testFiles: number;
    filesIncomplete: boolean;
    cochanges: SelectionImpact['history']['cochanges'];
} {
    const byFile = new Map<string, { findings: Map<number, SelectionImpactFinding> }>();
    if (data.structural.available) for (const finding of data.structural.findings) {
        if (!finding.file_path) continue;
        let group = byFile.get(finding.file_path);
        if (!group) { group = { findings: new Map() }; byFile.set(finding.file_path, group); }
        group.findings.set(finding.id, finding);
    }
    const files = [...byFile.entries()].map(([filePath, group]): ImpactFileGroup => {
        const findings = [...group.findings.values()].sort((a, b) => a.distance - b.distance || a.line - b.line || a.id - b.id);
        const first = findings[0]!;
        return { filePath, symbols: findings.length, distance: first.distance,
            testCandidate: findings.some(finding => finding.test_candidate), target: evidenceTarget(first) };
    }).sort((a, b) => a.distance - b.distance || b.symbols - a.symbols || a.filePath.localeCompare(b.filePath));
    const cochanges = data.history.available
        ? [...new Map(data.history.cochanges.map(row => [row.file_path, row])).values()]
            .sort((a, b) => b.shared_commits - a.shared_commits || a.file_path.localeCompare(b.file_path))
        : [];
    return { files, testFiles: files.filter(file => file.testCandidate).length,
        filesIncomplete: data.structural.truncated || data.structural.reachable > data.structural.findings.length,
        cochanges };
}

type Reading = { key: string } & (
    | { status: 'loading' | 'pending' | 'busy' }
    | { status: 'failed'; error: string }
    | { status: 'ready'; data: SelectionImpact }
);

function countLabel(count: number, noun: string, incomplete = false): string {
    return `${incomplete ? 'at least ' : ''}${count} ${noun}${count === 1 ? '' : 's'}`;
}

export default function FileImpactSummary({ project, target, onOpen, expectedGeneration,
    load = fetchSelectionImpact }: FileImpactSummaryProps): JSX.Element {
    const [reading, setReading] = useState<Reading>();
    // The last ready evidence and the selection it belongs to: a refresh of the same selection shows it until the new one is there.
    const [lastReady, setLastReady] = useState<{ key: string; data: SelectionImpact }>();
    const [retry, setRetry] = useState({ key: '', count: 0 });
    const [expandedKey, setExpandedKey] = useState('');
    const [limits, setLimits] = useState({ key: '', files: 6, history: 4 });
    const detailsId = useId();
    const file = target?.filePath, qualifiedName = target?.qualifiedName, id = target?.id;
    const selectionKey = JSON.stringify([project, file, qualifiedName, id, expectedGeneration]);
    const retryCount = retry.key === selectionKey ? retry.count : 0;
    const requestKey = JSON.stringify([selectionKey, retryCount]);
    // Bind every state (including errors) before effects run; a newly selected
    // file or symbol must never inherit the previous selection's evidence.
    const current = reading?.key === requestKey ? reading : undefined;
    const waiting = !current || ['loading', 'pending', 'busy'].includes(current.status);
    /*
     * Review of K42: Refresh folded the details into "Reading dependencies…"
     * and then showed the same numbers, with nothing left to say that it had
     * run. A refresh of the same selection keeps the last evidence on screen,
     * the button says that it runs, and the status beside it says when and
     * whether anything changed. Another selection never shows it.
     */
    const kept = waiting && lastReady?.key === selectionKey ? lastReady.data : undefined;
    const data = current?.status === 'ready' ? current.data : kept;
    const aggregate = useMemo(() => data ? aggregateFileImpact(data) : undefined, [data]);
    const expanded = expandedKey === selectionKey;
    const fileLimit = limits.key === selectionKey ? limits.files : 6;
    const historyLimit = limits.key === selectionKey ? limits.history : 4;
    const retryNow = (): void => setRetry(value => ({ key: selectionKey,
        count: value.key === selectionKey ? value.count + 1 : 1 }));

    useEffect(() => {
        if (!project || !file) return;
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;
        const read = async (): Promise<void> => {
            setReading({ key: requestKey, status: 'loading' });
            try {
                const reply = await load(project, { filePath: file, qualifiedName, id }, controller.signal,
                    retryCount > 0 && attempts === 0);
                if (controller.signal.aborted) return;
                attempts++;
                if (reply.status === 'ready') {
                    if (reply.project !== project || reply.file_path !== file)
                        throw new Error(featureCopy.The_response_belongs_to_another_selection_e4b4620);
                    setReading({ key: requestKey, status: 'ready', data: reply });
                    setLastReady({ key: selectionKey, data: reply });
                } else if (reply.status === 'failed') {
                    setReading({ key: requestKey, status: 'failed', error: reply.error });
                } else if (attempts < 80) {
                    setReading({ key: requestKey, status: reply.status });
                    timer = setTimeout(() => { void read(); }, 500);
                } else setReading({ key: requestKey, status: 'failed', error: 'Still waiting for the local analysis.' });
            } catch (cause) {
                if (!controller.signal.aborted) setReading({ key: requestKey, status: 'failed',
                    error: cause instanceof Error ? cause.message : String(cause) });
            }
        };
        void read();
        return () => { controller.abort(); if (timer !== undefined) clearTimeout(timer); };
    }, [project, file, qualifiedName, id, load, requestKey, retryCount, selectionKey]);
    // What counts as a change: the evidence shown, not the time stamp of its computation.
    const refresh = useRefreshFeedback({ key: requestKey, settled: !waiting, error: current?.status === 'failed' ? '' : undefined,
        value: data && aggregate ? { generation: data.snapshot.generation, revision: data.snapshot.index_revision, direct: data.structural.direct,
            files: aggregate.files.map(row => [row.filePath, row.distance, row.symbols, row.testCandidate]), cochanges: aggregate.cochanges.map(row => [row.file_path, row.shared_commits]),
            commits: data.history.selection_commits } : undefined });

    const notes: string[] = [];
    if (data && aggregate) {
        if (expectedGeneration && expectedGeneration !== data.snapshot.generation) notes.push('Index snapshot differs');
        else if (data.snapshot.index_revision === 'unknown') notes.push('Index freshness unverified');
        if (aggregate.filesIncomplete && data.structural.available) notes.push('Graph sample limited');
        if (data.snapshot.coverage.some(row => row.count > 0)) notes.push('Index gaps');
        else if (data.snapshot.coverage_recording !== 'complete') notes.push('Coverage incomplete');
        if (data.history.available && (data.history.truncated || data.history.shallow || data.history.cochanges_omitted > 0)) notes.push('Git sample limited');
        if (data.history.selection_uncommitted) notes.push('File has uncommitted changes');
        if (data.scope === 'file' && (qualifiedName || id !== undefined)) notes.push('File-level evidence');
    }
    const scope = qualifiedName || id !== undefined ? target?.name ?? qualifiedName ?? 'Selected symbol' : 'File';
    return <section className="file-impact-summary" aria-label={featureCopy.File_impact_summary_e880206}
        data-status={file ? current?.status ?? 'loading' : 'idle'}>
        <div className="file-impact-summary-row">
            <span className="file-impact-summary-label" title={file}>{scope}{featureCopy.impact_77db41e}</span>
            {!file && <span className="file-impact-summary-muted">{featureCopy.Select_a_file_to_see_its_dependents_275ddda}</span>}
            {file && waiting && !kept
                && <span role="status" className="file-impact-summary-muted">{current?.status === 'busy' ? featureCopy.Waiting_for_local_analysis_f68e77f : featureCopy.Reading_dependencies_a14aaa8}</span>}
            {current?.status === 'failed' && <><span role="alert" className="file-impact-summary-warning"
                title={current.error}>{featureCopy.Impact_unavailable_ba1647e}</span><button type="button" onClick={retryNow}>{featureCopy.Retry_9f5cd8a}</button></>}
            {data && aggregate && <>
                <div className="file-impact-summary-metrics">
                    {data.structural.available ? <>
                        <span title={featureCopy.Indexed_caller_and_importer_nodes_not_a_runtime_count_6742fc2}>{countLabel(data.structural.direct, 'direct dependent', data.structural.truncated)}</span>
                        <span>{countLabel(aggregate.files.length, 'affected file', aggregate.filesIncomplete)}</span>
                        <span title={featureCopy.Distinct_returned_files_with_a_test_candidate_dependency_File_pat_be4222a}>{countLabel(aggregate.testFiles, 'test file', aggregate.filesIncomplete)}</span>
                    </> : <span className="file-impact-summary-warning" title={data.structural.error}>{featureCopy.Graph_unavailable_0ab407b}</span>}
                    {data.history.available ? <span title={featureCopy.Local_Git_sample_0_commits_up_to_1_days_Historical_association_is_2a3b1eb(data.history.commits_scanned, data.history.window_days)}>{featureCopy.Git_1322d26}{countLabel(data.history.selection_commits, 'sampled commit')} · {countLabel(aggregate.cochanges.length, 'co-changed file', data.history.cochanges_omitted > 0)}
                    </span> : <span className="file-impact-summary-muted" title={data.history.error}>{featureCopy.Git_unavailable_5fab322}</span>}
                </div>
                <button type="button" className="file-impact-summary-toggle" aria-expanded={expanded} aria-controls={detailsId}
                    onClick={() => setExpandedKey(expanded ? '' : selectionKey)}>{expanded ? featureCopy.Less_526cb74 : featureCopy.Details_dc3decb} <span aria-hidden="true">{expanded ? '▴' : '▾'}</span></button>
            </>}
        </div>
        {notes.length > 0 && <p className="file-impact-summary-note">{notes.join(' · ')}</p>}
        {data?.structural.available && data.structural.reachable === 0
            && <p className="file-impact-summary-note">{featureCopy.No_dependents_found_in_this_index_this_does_not_establish_safety_2bb84cf}</p>}
        {expanded && data && aggregate && <div className="file-impact-summary-details" id={detailsId}>
            <div className="file-impact-summary-detail-grid">
                <section aria-label={featureCopy.Affected_files_c9ea7d7}><h4>{featureCopy.Affected_files_c9ea7d7}</h4>
                    {!data.structural.available ? <p>{data.structural.error ?? featureCopy.No_usable_graph_evidence_for_this_selection_4337393}</p>
                        : aggregate.files.length === 0 ? <p>{featureCopy.No_file_paths_returned_by_this_graph_walk_eb6ef84}</p>
                            : <ul>{aggregate.files.slice(0, fileLimit).map(row => <li key={row.filePath}>
                                <button type="button" onClick={() => onOpen(row.target)} title={row.filePath}>{row.filePath}</button>
                                <span>{row.distance === 1 ? featureCopy.direct_24a1733 : featureCopy.message_0_hops_8fc4586(row.distance)} · {countLabel(row.symbols, 'symbol')}{row.testCandidate ? featureCopy.test_candidate_4ec855f : ''}</span>
                            </li>)}</ul>}
                    {aggregate.files.length > fileLimit && <button type="button" onClick={() => setLimits({ key: selectionKey, files: fileLimit + 6, history: historyLimit })}>{featureCopy.More_files_1940082}{aggregate.files.length - fileLimit})</button>}
                </section>
                <section aria-label={featureCopy.Files_changed_together_87414e0}><h4>{featureCopy.Changed_together_90709ef}<span>{featureCopy.Git_sample_1dcd764}</span></h4>
                    {!data.history.available ? <p>{data.history.error ?? featureCopy.Local_Git_history_is_unavailable_e1cf513}</p>
                        : aggregate.cochanges.length === 0 ? <p>{featureCopy.No_co_changed_files_in_this_sample_e2876d8}</p>
                            : <ul>{aggregate.cochanges.slice(0, historyLimit).map(row => <li key={row.file_path}>
                                <button type="button" onClick={() => onOpen({ filePath: row.file_path })} title={row.file_path}>{row.file_path}</button>
                                <span>{countLabel(row.shared_commits, 'shared commit')}</span>
                            </li>)}</ul>}
                    {aggregate.cochanges.length > historyLimit && <button type="button" onClick={() => setLimits({ key: selectionKey, files: fileLimit, history: historyLimit + 4 })}>{featureCopy.More_co_changed_files_45dac3a}{aggregate.cochanges.length - historyLimit})</button>}
                </section>
            </div>
            <footer><span>{featureCopy.Indexed_calls_imports_up_to_6a4b1bf}{data.structural.max_depth}{featureCopy.hops_Test_files_are_candidates_Git_co_changes_are_associations_787a55c}</span>
                <RefreshControl labels={FILE_IMPACT_REFRESH} feedback={refresh.feedback} onRefresh={() => { refresh.begin(); retryNow(); }} /></footer>
        </div>}
    </section>;
}
