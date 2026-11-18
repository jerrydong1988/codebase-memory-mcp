import { featureCopy } from '../i18n/features/impact';
import { useEffect, useId, useState } from 'react';
import type { JSX } from 'react';
import { evidenceTarget, fetchSelectionImpact, localCommitCommand, selectionRisk } from './selection-impact';
import type { SelectionImpact, SelectionImpactTarget } from './selection-impact';
import LocalEvidenceCommand from './LocalEvidenceCommand';
import './selection-impact.css';

export interface SelectionImpactWidgetProps {
    project: string;
    target?: SelectionImpactTarget;
    onOpen: (target: SelectionImpactTarget) => void;
    onDiagnose?: () => void;
    /** Shared repository-map snapshot, when available. */
    expectedGeneration?: string;
    /** The shared workspace already displays file and symbol controls. */
    compact?: boolean;
    /** Test seam; production always reads the same daemon origin. */
    load?: typeof fetchSelectionImpact;
}

function stamp(value: number): string {
    return new Date(value * 1000).toLocaleString();
}

export default function SelectionImpactWidget({ project, target, onOpen, onDiagnose,
    expectedGeneration, compact = false, load = fetchSelectionImpact }: SelectionImpactWidgetProps): JSX.Element {
    const [reading, setReading] = useState<{ key: string; data: SelectionImpact }>();
    const [error, setError] = useState('');
    const [state, setState] = useState('idle');
    const [refresh, setRefresh] = useState(0);
    const [findingLimit, setFindingLimit] = useState(8);
    const [historyLimit, setHistoryLimit] = useState(5);
    const [tab, setTab] = useState('dependencies');
    const panelId = useId();
    const file = target?.filePath, qn = target?.qualifiedName, id = target?.id;
    const selectionKey = JSON.stringify([project, file, qn, id, expectedGeneration]);
    // A prop change can paint before its effect runs: never label an older
    // result with the new selection, including two symbols in the same file.
    const data = reading?.key === selectionKey ? reading.data : undefined;
    useEffect(() => {
        setReading(undefined); setError(''); setState('idle');
        setFindingLimit(8); setHistoryLimit(5); setTab('dependencies');
        if (!project || !file) return;
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;
        const selection = { filePath: file, qualifiedName: qn, id };
        const read = async (): Promise<void> => {
            try {
                setState('loading');
                const reply = await load(project, selection, controller.signal, refresh > 0 && attempts === 0);
                if (controller.signal.aborted) return;
                attempts++;
                if (reply.status === 'ready') { setReading({ key: selectionKey, data: reply }); setState('ready'); }
                else if (reply.status === 'failed') { setError(reply.error); setState('failed'); }
                else if (attempts < 80) {
                    setState(reply.status);
                    timer = setTimeout(() => { void read(); }, 500);
                } else { setError(featureCopy.Analysis_is_taking_longer_than_expected_Refresh_to_retry_36e0740); setState('failed'); }
            } catch (cause) {
                if (!controller.signal.aborted) {
                    setError(cause instanceof Error ? cause.message : String(cause)); setState('failed');
                }
            }
        };
        void read();
        return () => { controller.abort(); if (timer !== undefined) clearTimeout(timer); };
    }, [project, file, qn, id, refresh, load, expectedGeneration, selectionKey]);
    const risk = data ? selectionRisk(data) : undefined;
    return <section className="selection-impact" data-testid="selection-impact" data-status={state}
        aria-label={featureCopy.Selection_impact_analysis_6bd771d}>
        {!compact && <header><div><h3>{featureCopy.Selection_evidence_518b9fa}</h3></div>
            {file && <button type="button" onClick={() => setRefresh(value => value + 1)}>{featureCopy.Refresh_analysis_b7a6756}</button>}
        </header>}
        {compact && file && !data && <div><button type="button" onClick={() => setRefresh(value => value + 1)}>{featureCopy.Refresh_analysis_b7a6756}</button></div>}
        {!file && <p>{featureCopy.Select_an_indexed_file_or_symbol_to_inspect_its_dependency_paths__cd63efe}</p>}
        {file && !compact && <p className="selection-impact-scope"><strong>{target?.name ?? file}</strong><br />{file}
            {(qn || id !== undefined) ? featureCopy.selected_symbol_bc6cb6e : featureCopy.whole_file_9336aa1}</p>}
        {(state === 'loading' || state === 'pending' || state === 'busy')
            && <p role="status">{state === 'busy' ? featureCopy.Waiting_for_the_current_local_analysis_adb0161 : featureCopy.Reading_the_graph_snapshot_and_bounded_local_Git_history_6680edc}</p>}
        {error && <p role="alert">{featureCopy.Impact_evidence_unavailable_73ba929}{error}{featureCopy.Risk_remains_unresolved_9f97862}</p>}
        {data && risk && <>
            {expectedGeneration && expectedGeneration !== data.snapshot.generation
                && <p role="alert">{featureCopy.The_repository_map_and_this_impact_analysis_use_different_index_g_a342867}</p>}
            <div className="selection-impact-risk" data-level={risk.level}>
                <div className="selection-impact-risk-heading"><strong>{risk.label}</strong>
                    {compact ? <button type="button" onClick={() => setRefresh(value => value + 1)}>{featureCopy.Refresh_analysis_b7a6756}</button>
                        : <span>{featureCopy.Heuristic_no_defect_probability_3356de8}</span>}</div>
                {compact && <small>{featureCopy.Transparent_heuristic_no_defect_probability_cecc1f8}</small>}
                <ul>{risk.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
                <button type="button" className="selection-impact-quality-link" onClick={() => setTab('quality')}>{risk.uncertainties.length}{featureCopy.data_limitations_inspect_before_relying_on_absence_of_findings_4eb087a}</button>
            </div>
            <nav className="selection-impact-tabs" aria-label={featureCopy.Impact_evidence_8c8f92a} role="tablist">
                {([['dependencies', `Dependencies · ${data.structural.reachable}`],
                    ['tests', `Tests to review · ${data.structural.test_candidates}`],
                    ['history', `Git history · ${data.history.cochanges.length}`],
                    ['quality', `Data quality · ${risk.uncertainties.length}`]] as const).map(([value, label]) =>
                    <button type="button" role="tab" key={value} id={`${panelId}-${value}-tab`}
                        aria-controls={`${panelId}-${value}`} aria-selected={tab === value} onClick={() => setTab(value)}>{label}</button>)}
            </nav>
            <div className="selection-impact-panels">
            <section className="selection-impact-quality" role="tabpanel" id={`${panelId}-quality`}
                aria-labelledby={`${panelId}-quality-tab`} hidden={tab !== 'quality'}>
                <h4>{featureCopy.Data_quality_and_revision_0093a8b}{risk.uncertainties.length}{featureCopy.limitations_04f7fb4}</h4>
                <p>{featureCopy.Computed_89e87eb}{stamp(data.computed_at)}{featureCopy.cached_for_up_to_4af3308}{data.cache_seconds}s.<br />{featureCopy.Index_d9f4d8c}{data.snapshot.indexed_at || featureCopy.unknown_timestamp_ebaadec}{featureCopy.generation_03a95b8}<code>{data.snapshot.generation || 'unknown'}</code><br />{featureCopy.Git_HEAD_c689b1a}<code>{data.history.head ?? 'unavailable'}</code><br />{featureCopy.Scope_1172dab}{data.scope === 'symbol' ? featureCopy.selected_symbol_Git_evidence_is_file_level_9ca4c4a : featureCopy.selected_file_bounded_indexed_declarations_dbb3508}.<br />{featureCopy.Graph_scope_68b55e6}{data.structural.seed_count}{featureCopy.starting_nodes_at_most_99feebc}{data.structural.visit_cap}{featureCopy.visited_nodes_100cf79}{data.structural.result_cap}{featureCopy.returned_findings_2e764a8}</p>
                <ul>{risk.uncertainties.map(reason => <li key={reason}>{reason}</li>)}</ul>
                {onDiagnose && <button type="button" onClick={onDiagnose}>{featureCopy.Inspect_local_indexing_diagnostics_244f932}</button>}
            </section>
            <section role="tabpanel" id={`${panelId}-dependencies`} aria-labelledby={`${panelId}-dependencies-tab`} hidden={tab !== 'dependencies'}><h4>{featureCopy.Structural_impact_indexed_dependencies_d89977b}</h4>
                <p>{data.structural.direct}{featureCopy.direct_a09b458}{data.structural.reachable}{featureCopy.total_dependents_within_bf04d90}{data.structural.max_depth}{featureCopy.hops_4a8dd90}{' '}{featureCopy.CALLS_means_a_static_call_relation_IMPORTS_means_an_import_depend_2755951}</p>
                {data.structural.findings.length === 0 && <p>{featureCopy.No_dependency_path_was_established_for_this_selection_in_the_curr_5235f9a}</p>}
                <p>{featureCopy.Showing_85a4af0}{Math.min(findingLimit, data.structural.findings.length)}{featureCopy.of_607f2de}{data.structural.findings.length}{featureCopy.returned_evidence_paths_7e5263f}</p>
                <ol className="selection-impact-findings">{data.structural.findings.slice(0, findingLimit).map(finding => <li key={finding.id}>
                    <button type="button" onClick={() => onOpen(evidenceTarget(finding))}>{finding.name}</button>
                    <span>{finding.distance === 1 ? featureCopy.direct_dependency_b1ca6a2 : featureCopy.message_0_hops_8fc4586(finding.distance)}{finding.test_candidate ? featureCopy.test_candidate_path_heuristic_0ac2960 : ''}</span>
                    <small>{finding.file_path}:{finding.line}</small>
                    <details><summary>{featureCopy.Show_indexed_path_ee6daa8}{finding.path.length}{featureCopy.edge_52a2688}{finding.path.length === 1 ? '' : 's'})</summary>
                        <ol>{finding.path.map(edge => <li key={edge.edge_id}>
                            <button type="button" onClick={() => onOpen(evidenceTarget(edge.from))}>{edge.from.name}</button>
                            {' '}<code>{edge.type}</code>{' '}
                            <button type="button" onClick={() => onOpen(evidenceTarget(edge.to))}>{edge.to.name}</button>
                            <small>{featureCopy.Graph_edge_6c5b3fb}{edge.edge_id}{featureCopy.source_c9b1c91}{edge.from.file_path}:{edge.from.line}</small>
                        </li>)}</ol>
                    </details>
                </li>)}</ol>
                {findingLimit < data.structural.findings.length && <button type="button"
                    onClick={() => setFindingLimit(value => value + 8)}>{featureCopy.Show_more_affected_symbols_8f109cf}{findingLimit}{featureCopy.of_607f2de}{data.structural.findings.length})
                </button>}
            </section>
            <section role="tabpanel" id={`${panelId}-history`} aria-labelledby={`${panelId}-history-tab`} hidden={tab !== 'history'}><h4>{featureCopy.Historical_evidence_files_changed_together_5dcff7e}</h4>
                <p>{data.history.selection_commits}{featureCopy.ordinary_commits_touched_this_file_in_a_sample_of_adb5f3b}{data.history.commits_scanned}{featureCopy.commits_up_to_d1bcc9d}{data.history.window_days}{featureCopy.days_Excluded_7b5482b}{data.history.merges_excluded}{featureCopy.merges_and_24d86ed}{data.history.mass_changes_excluded}{featureCopy.changes_touching_more_than_55998ca}{data.history.mass_change_threshold}{featureCopy.files_Rename_history_is_not_followed_a4d586c}</p>
                <p>{featureCopy.Co_changes_are_historical_association_not_functional_dependency_o_5a90988}</p>
                {data.history.cochanges.length === 0 && <p>{featureCopy.No_co_change_evidence_is_available_in_this_sample_0d22d45}</p>}
                {data.history.cochanges.length > 0 && <p>{featureCopy.Showing_85a4af0}{Math.min(historyLimit, data.history.cochanges.length)}{featureCopy.of_607f2de}{data.history.cochanges.length}{featureCopy.returned_files_69c590f}{data.history.cochanges_omitted > 0 && ` ${data.history.cochanges_omitted} further co-change files were omitted by the server limit.`}</p>}
                <ul className="selection-impact-history">{data.history.cochanges.slice(0, historyLimit).map(row => <li key={row.file_path}>
                    <button type="button" onClick={() => onOpen({ filePath: row.file_path, name: row.file_path })}>{row.file_path}</button>
                    {' '}· {row.shared_commits}{featureCopy.shared_commit_8c25b11}{row.shared_commits === 1 ? '' : 's'}
                    <details><summary>{featureCopy.Inspect_local_Git_evidence_5483a9a}</summary>
                        {row.commit_refs.map(hash => {
                            const commit = data.history.commits.find(commit => commit.hash === hash);
                            return <div className="selection-impact-commit" key={hash}><p><code>{hash}</code>{commit && <> · {stamp(commit.time)}<br />{commit.subject} · {commit.files}{featureCopy.changed_files_556ffeb}</>}</p>
                                <LocalEvidenceCommand command={localCommitCommand(hash, data.file_path, row.file_path)} label={featureCopy.Copy_local_Git_evidence_command_91f46ac} /></div>;
                        })}
                    </details>
                </li>)}</ul>
                {historyLimit < data.history.cochanges.length && <button type="button"
                    onClick={() => setHistoryLimit(value => value + 5)}>{featureCopy.Show_more_historical_associations_a339d63}{historyLimit}{featureCopy.of_607f2de}{data.history.cochanges.length})
                </button>}
            </section>
            <section role="tabpanel" id={`${panelId}-tests`} aria-labelledby={`${panelId}-tests-tab`} hidden={tab !== 'tests'}>
                <h4>{featureCopy.Tests_to_review_e3f4218}</h4>
                <p>{data.structural.test_candidates}{featureCopy.test_candidates_reach_the_selection_in_the_bounded_graph_walk_Fil_9d968b0}</p>
                {data.structural.test_candidates === 0 && <p>{featureCopy.No_test_dependency_was_established_Search_the_test_directories_an_fb1e25e}</p>}
                <ul className="selection-impact-tests">{data.structural.findings.filter(finding => finding.test_candidate).map(finding => <li key={finding.id}>
                    <button type="button" onClick={() => onOpen(evidenceTarget(finding))}>{featureCopy.Open_test_source_13bf57b}{finding.name}</button>
                    <small>{finding.file_path}:{finding.line} · {finding.distance}{featureCopy.indexed_hop_9b7fe32}{finding.distance === 1 ? '' : 's'}</small>
                    <details><summary>{featureCopy.Inspect_test_dependency_path_dce5eb9}</summary><ol>{finding.path.map(edge => <li key={edge.edge_id}>
                        <button type="button" onClick={() => onOpen(evidenceTarget(edge.from))}>{edge.from.name}</button>{' '}
                        <code>{edge.type}</code>{' '}<button type="button" onClick={() => onOpen(evidenceTarget(edge.to))}>{edge.to.name}</button>
                        <small>{featureCopy.Graph_edge_6c5b3fb}{edge.edge_id}{featureCopy.source_c9b1c91}{edge.from.file_path}:{edge.from.line}</small>
                    </li>)}</ol></details>
                </li>)}</ul>
                {data.structural.test_candidates > data.structural.findings.filter(finding => finding.test_candidate).length
                    && <p role="alert">{featureCopy.Some_test_candidates_are_outside_the_returned_evidence_limit_Refi_78eea85}</p>}
                <h4>{featureCopy.Next_checks_28d4370}</h4><ol>{risk.next.map(next => <li key={next}>{next}</li>)}</ol>
            </section>
            </div>
        </>}
    </section>;
}
