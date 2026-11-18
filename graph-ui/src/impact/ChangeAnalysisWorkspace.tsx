import { featureCopy } from '../i18n/features/impact';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import SelectionImpactWidget from './SelectionImpactWidget';
import type { SelectionImpactTarget, fetchSelectionImpact } from './selection-impact';
import { changedAreas, loadChangeSet, loadFileImpactSymbols, localDiffCommand, validChangeRef } from './change-set';
import type { ChangeSetReading, ChangeSymbolSource } from './change-set';
import LocalEvidenceCommand from './LocalEvidenceCommand';
import './change-analysis.css';

export type ChangeAnalysisMode = 'selection' | 'worktree' | 'since-ref';
export interface ChangeAnalysisWorkspaceProps {
    project: string;
    selectedTarget?: SelectionImpactTarget;
    expectedGeneration?: string;
    client?: ChangeSymbolSource;
    onOpenSource: (target: SelectionImpactTarget) => void;
    onDiagnose?: () => void;
    onClose?: () => void;
    initialMode?: ChangeAnalysisMode;
    /** Tests can supply deferred readings without a daemon. */
    loadChanges?: typeof loadChangeSet;
    loadSymbols?: typeof loadFileImpactSymbols;
    loadImpact?: typeof fetchSelectionImpact;
}

/** One shared, full-size flow for a selected declaration and an actual Git change set. */
export default function ChangeAnalysisWorkspace({ project, selectedTarget, expectedGeneration, client,
    onOpenSource, onDiagnose, onClose, initialMode, loadChanges = loadChangeSet, loadSymbols = loadFileImpactSymbols, loadImpact,
}: ChangeAnalysisWorkspaceProps) {
    const [mode, setMode] = useState<ChangeAnalysisMode>(initialMode ?? (selectedTarget?.filePath ? 'selection' : 'worktree'));
    const [ref, setRef] = useState('HEAD');
    const [appliedRef, setAppliedRef] = useState('HEAD');
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState('');
    const [chosen, setChosen] = useState<{ owner: string; target: SelectionImpactTarget }>();
    const [reading, setReading] = useState<{ key: string; data?: ChangeSetReading; error?: string; loading: boolean }>();
    const [symbols, setSymbols] = useState<{ key: string; rows: SelectionImpactTarget[]; error?: string }>();
    const workspace = useRef<HTMLElement>(null);
    const selectionIdentity = JSON.stringify([project, selectedTarget?.filePath, selectedTarget?.qualifiedName, selectedTarget?.id]);
    const base = mode === 'worktree' ? 'HEAD' : appliedRef;
    const readingKey = JSON.stringify([project, mode, base, refresh]);
    const ownedReading = reading?.key === readingKey ? reading : undefined;
    const target = chosen?.owner === selectionIdentity ? chosen.target : selectedTarget;
    const symbolKey = JSON.stringify([project, target?.filePath, expectedGeneration]);
    const ownedSymbols = symbols?.key === symbolKey ? symbols : undefined;

    useLayoutEffect(() => {
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
        (workspace.current?.querySelector<HTMLElement>('button') ?? workspace.current)?.focus();
        return () => { if (previous?.isConnected) previous.focus(); };
    }, []);
    const keyboard = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape' && onClose) { event.preventDefault(); event.stopPropagation(); onClose(); return; }
        if (event.key !== 'Tab' || !workspace.current) return;
        const controls = [...workspace.current.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, summary, [tabindex="0"]')]
            .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]'));
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus(); }
    };

    useEffect(() => {
        setChosen(selectedTarget?.filePath ? { owner: selectionIdentity, target: selectedTarget } : undefined);
        setFilter('');
    }, [selectionIdentity]); // Stable identity, not a new callback-created prop object.
    useEffect(() => {
        if (mode === 'selection' || !project) return;
        const controller = new AbortController();
        setReading({ key: readingKey, loading: true });
        void loadChanges(project, base, controller.signal).then(data => {
            if (!controller.signal.aborted) setReading({ key: readingKey, data, loading: false });
        }, error => {
            if (!controller.signal.aborted) setReading({ key: readingKey, loading: false,
                error: error instanceof Error ? error.message : String(error) });
        });
        return () => controller.abort();
    }, [project, mode, base, refresh, loadChanges, readingKey]);
    useEffect(() => {
        if (!client || !target?.filePath) return;
        let current = true;
        const file = target.filePath;
        void loadSymbols(client, project, file).then(rows => {
            if (current) setSymbols({ key: symbolKey, rows });
        }, error => {
            if (current) setSymbols({ key: symbolKey, rows: [], error: error instanceof Error ? error.message : String(error) });
        });
        return () => { current = false; };
    }, [client, project, target?.filePath, expectedGeneration, symbolKey, loadSymbols]);
    const areas = useMemo(() => changedAreas((ownedReading?.data?.files ?? []).filter(file => file.toLowerCase().includes(filter.toLowerCase())),
        selectedTarget?.filePath), [ownedReading?.data, filter, selectedTarget?.filePath]);
    const select = (next: SelectionImpactTarget) => setChosen({ owner: selectionIdentity, target: next });
    const selectedChanged = ownedReading?.data?.files.includes(target?.filePath ?? '');

    return <section ref={workspace} tabIndex={-1} onKeyDown={keyboard} className="change-analysis" data-testid="change-analysis-workspace" aria-label={featureCopy.Change_impact_workspace_13fc717}>
        <header className="change-analysis-header"><h2>{featureCopy.Change_impact_b4223a0}</h2>
            {onClose && <button type="button" onClick={onClose}>{featureCopy.Close_change_impact_83546d8}</button>}</header>
        <div className="change-analysis-toolbar">
            <div role="tablist" aria-label={featureCopy.Change_analysis_scope_540ad5b}>{([
                ['selection', 'Current selection'], ['worktree', 'Working tree'], ['since-ref', 'Since ref'],
            ] as const).map(([value, label]) => <button role="tab" type="button" key={value} aria-selected={mode === value}
                onClick={() => setMode(value)}>{label}</button>)}</div>
            {mode === 'since-ref' && <form onSubmit={event => { event.preventDefault(); if (validChangeRef(ref)) { setAppliedRef(ref); setRefresh(value => value + 1); } }}>
                <label>{featureCopy.Baseline_revision_44f72ec}<input value={ref} onChange={event => setRef(event.currentTarget.value)} placeholder={featureCopy.HEAD_1_or_branch_name_7816978} /></label>
                <button type="submit" disabled={!validChangeRef(ref)}>{featureCopy.Read_changes_ca5f785}</button></form>}
            {mode !== 'selection' && <button type="button" onClick={() => setRefresh(value => value + 1)} disabled={ownedReading?.loading}>{featureCopy.Refresh_changes_a4e297a}</button>}
            <span>{project || featureCopy.No_project_selected_e92a1f7}</span>
        </div>
        <div className="change-analysis-columns" data-has-changes={mode !== 'selection'}>
            {mode !== 'selection' && <aside className="change-analysis-files" aria-label={featureCopy.Changed_files_fe25abc}>
                <h3>{mode === 'worktree' ? featureCopy.Uncommitted_changes_79d1aca : featureCopy.Changes_since_0_4667876(appliedRef)}</h3>
                <p>{mode === 'worktree' ? featureCopy.Compared_explicitly_with_HEAD_staged_unstaged_and_untracked_paths_6ceda41
                    : featureCopy.The_daemon_compares_the_merge_base_with_HEAD_and_includes_current_b6cbf1e}</p>
                {(!ownedReading || ownedReading.loading) && <p role="status">{featureCopy.Reading_the_local_Git_change_set_e7f6474}</p>}
                {ownedReading?.error && <p role="alert">{featureCopy.Change_set_unavailable_33df021}{ownedReading.error}{featureCopy.No_low_risk_result_was_inferred_71e3e56}</p>}
                {ownedReading?.data && <>
                    <p><strong>{ownedReading.data.files.length}{featureCopy.of_607f2de}{ownedReading.data.totalFiles}{featureCopy.changed_paths_loaded_079ee0c}</strong></p>
                    <details><summary>{featureCopy.Change_set_revision_and_limits_cba646f}</summary><p>{featureCopy.Baseline_cffa37c}{ownedReading.data.base}{featureCopy.merge_base_0cc1e6d}<code>{ownedReading.data.mergeBase}</code><br />{featureCopy.Read_e755e58}{ownedReading.data.checkedAt}</p>
                        <p>{featureCopy.Changes_may_continue_while_this_view_is_open_Refresh_before_relyi_88575a1}</p>
                        {ownedReading.data.limitations.map(note => <p key={note}>{note}</p>)}</details>
                    {!ownedReading.data.complete && <p role="alert">{featureCopy.The_changed_file_listing_is_incomplete_Missing_files_are_not_evid_b764e90}</p>}
                    {ownedReading.data.totalFiles === 0 && <p>{featureCopy.No_changed_paths_were_reported_for_this_revision_Select_a_file_fr_93af843}</p>}
                    <label className="change-analysis-filter">{featureCopy.Filter_changed_paths_6893913}<input type="search" value={filter} onChange={event => setFilter(event.currentTarget.value)} /></label>
                    <p className="change-analysis-note">{featureCopy.Areas_are_grouped_by_path_and_ordered_by_changed_file_count_with__cd498c6}</p>
                    {areas.map(area => <details className="change-analysis-area" key={area.path} open={areas.length <= 3 || area.files.includes(selectedTarget?.filePath ?? '')}>
                        <summary>{area.path} · {area.files.length}{featureCopy.changed_paths_21bf9c4}</summary>
                        {area.files.map(file => <button type="button" key={file} aria-pressed={target?.filePath === file}
                            onClick={() => select({ filePath: file, name: file.split('/').at(-1) })}>{file}</button>)}
                    </details>)}
                    {areas.length === 0 && ownedReading.data.totalFiles > 0 && <p>{featureCopy.No_changed_path_matches_this_filter_9874992}</p>}
                </>}
            </aside>}
            <main className="change-analysis-evidence">
                <div className="change-analysis-selection">
                    {selectedTarget?.filePath && <button type="button" onClick={() => select(selectedTarget)}>{featureCopy.Use_current_editor_selection_10f8c88}</button>}
                    {target?.filePath ? <>
                        <strong>{target.filePath}</strong>
                        <label>{featureCopy.Analysis_scope_e5b777e}<select aria-label={featureCopy.Analysis_scope_fc09ab3} value={target.qualifiedName ?? ''} onChange={event => {
                            const next = ownedSymbols?.rows.find(row => row.qualifiedName === event.currentTarget.value);
                            select(next ?? { filePath: target.filePath, name: target.filePath.split('/').at(-1) });
                        }}><option value="">{featureCopy.Entire_indexed_file_1301b0c}</option>
                            {target.qualifiedName && !ownedSymbols?.rows.some(row => row.qualifiedName === target.qualifiedName)
                                && <option value={target.qualifiedName}>{target.name ?? target.qualifiedName}</option>}
                            {ownedSymbols?.rows.map(row => <option key={row.qualifiedName} value={row.qualifiedName}>{row.name}{featureCopy.line_8e52ab7}{row.line ?? '?'}</option>)}
                        </select></label>
                        <button type="button" onClick={() => onOpenSource(target)}>{featureCopy.Open_source_evidence_7b05e6d}</button>
                        {client && !ownedSymbols && <small role="status">{featureCopy.Reading_indexed_function_and_method_choices_f9ed831}</small>}
                        {mode !== 'selection' && ownedReading?.data && <>
                            <span>{selectedChanged ? featureCopy.This_file_is_in_the_detected_change_set_2f14c29 : featureCopy.This_selection_is_outside_the_loaded_changed_file_list_814bcbb}</span>
                            <small>{target.qualifiedName ? featureCopy.This_symbol_was_selected_manually_edited_lines_are_not_automatica_56e5346
                                : featureCopy.Whole_file_impact_includes_unchanged_declarations_Select_a_functi_3a0423a}</small>
                            <details className="change-analysis-diff"><summary>{featureCopy.Inspect_this_file_s_local_diff_c9e7824}</summary>
                                <LocalEvidenceCommand command={localDiffCommand(ownedReading.data.mergeBase, target.filePath)} label={featureCopy.Copy_local_diff_command_e934b60} />
                                <small>{featureCopy.Git_diff_shows_tracked_changes_For_an_untracked_path_inspect_its__262c355}</small></details>
                        </>}
                        {ownedSymbols?.error && <p role="alert">{featureCopy.Symbol_choices_unavailable_1939700}{ownedSymbols.error}. Whole-file analysis remains available.</p>}
                        {ownedSymbols && ownedSymbols.rows.length >= 200 && <small>{featureCopy.Symbol_choices_are_bounded_to_the_first_200_functions_and_200_met_b36a7ea}</small>}
                    </> : <p>{featureCopy.Select_a_changed_file_or_open_a_repository_file_to_start_the_anal_dcdd3fa}</p>}
                </div>
                <SelectionImpactWidget project={project} target={target} expectedGeneration={expectedGeneration}
                    onOpen={onOpenSource} onDiagnose={onDiagnose} load={loadImpact} compact />
            </main>
        </div>
    </section>;
}
