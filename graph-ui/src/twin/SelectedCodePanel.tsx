import { featureCopy } from '../i18n/features/twin';
import { useEffect, useState, type ReactNode } from 'react';

import type { SymbolRef } from '../core/focus-protocol';
import type { Evidence, SemanticIR } from '../core/semantic-ir';
import type { ImportsGroup } from '../pseudocode/imports-group';
import { SectionView, type TwinStatus } from './TwinPanel';
import {
    buildSections, evidenceFor, importsSection, runtimeSection,
    type TwinRow, type TwinSection,
} from './twin-view-model';
import './selected-code.css';

export interface SelectedCodeRange {
    /** Editor coordinates, 1-based. Text is the literal selection, unmodified. */
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    text: string;
}

export interface SelectedCodePanelProps {
    filePath: string;
    symbol?: SymbolRef;
    ir?: SemanticIR;
    status: TwinStatus;
    message?: string;
    selection?: SelectedCodeRange;
    fileSymbols?: readonly SymbolRef[];
    fileSymbolsStatus?: 'loading' | 'ready' | 'error';
    fileSymbolsMessage?: string;
    coverageNote?: string;
    pinned: boolean;
    onTogglePin: () => void;
    onAsk: () => void;
    onShowGraph: () => void;
    onFollow: (symbol: SymbolRef) => void;
    onPointRow?: (row: TwinRow | undefined) => void;
    onOpenFlow?: () => void;
    callOutline?: ReactNode;
    imports?: ImportsGroup;
    selectionContext?: ReactNode;
    impact?: ReactNode;
}

const SECTION_TITLES: Readonly<Record<string, string>> = {
    purpose: featureCopy.Indexed_summary_8319771,
    steps: featureCopy.Outgoing_calls_e99846a,
    callers: featureCopy.Called_by_8cbfefc,
    state: 'References and environment',
    errors: featureCopy.Error_types_791a69f,
    effects: featureCopy.External_effects_7d33fc9,
    tests: featureCopy.Related_tests_b3ff536,
    risks: featureCopy.Structural_observations_4f4b8ea,
    runtime: featureCopy.Recorded_runtime_calls_adbd817,
    imports: featureCopy.File_imports_c3d01f3,
};

function unavailableText(section: TwinSection): string | undefined {
    if (section.state === 'notIndexed') return 'This information is not indexed yet.';
    if (section.state === 'unsupported') return 'The current index does not provide this information.';
    if (section.state === 'unknown') return 'This information is unavailable from the current index.';
    return undefined;
}

function sectionSummary(section: TwinSection): string {
    if (section.rows.length > 0) return String(section.rows.length);
    if (unavailableText(section)) return 'Unavailable';
    if (section.text) return '';
    return section.state === 'ambiguous' ? 'Unresolved' : 'None found';
}

/** Reuse evidence-bearing rows without the legacy reader levels or model controls. */
function FactDisclosure(props: {
    section: TwinSection;
    openEvidence?: string;
    entriesFor: (path: string) => Evidence[];
    onToggleEvidence: (path: string) => void;
    onFollow: (symbol: SymbolRef) => void;
    onPointRow?: (row: TwinRow | undefined) => void;
}) {
    const title = SECTION_TITLES[props.section.name] ?? props.section.title;
    const unavailable = unavailableText(props.section);
    const section: TwinSection = {
        ...props.section,
        title,
        // Missing answers must never inherit a checked-empty sentence.
        emptyText: unavailable ?? props.section.emptyText,
        ...(props.section.name === 'tests'
            ? { note: featureCopy.Links_inferred_from_indexed_callers_these_are_not_test_results_or_8e1bb60 }
            : {}),
    };
    return (
        <details className="selected-code-fact" data-section={section.name}>
            <summary>
                <span>{title}</span>
                <span className="selected-code-count">{sectionSummary(section)}</span>
            </summary>
            <SectionView
                section={section}
                voiceOf={() => undefined}
                openEvidence={props.openEvidence}
                entriesFor={props.entriesFor}
                onToggleEvidence={props.onToggleEvidence}
                onActivate={(row) => { if (row.target) props.onFollow(row.target); }}
                onPoint={props.onPointRow}
            />
        </details>
    );
}

export default function SelectedCodePanel(props: SelectedCodePanelProps) {
    const { filePath, symbol, selection, ir, imports } = props;
    const [openEvidence, setOpenEvidence] = useState<string>();
    const identity = `${filePath}:${symbol?.qualifiedName ?? symbol?.name ?? ''}:${ir?.generation ?? ''}`;
    useEffect(() => setOpenEvidence(undefined), [identity]);
    const ready = props.status === 'ready' && ir !== undefined && symbol !== undefined;
    const sections = ready ? buildSections(ir).filter((section) =>
        section.name !== 'purpose' && (section.name !== 'effects' || section.populated)
        && (section.name !== 'risks' || section.populated)) : [];
    const runtime = ready && ir.runtime && ir.runtime.value.length > 0 ? runtimeSection(ir) : undefined;
    if (runtime) sections.push(runtime);
    if (imports) sections.push(importsSection(imports));
    const entriesFor = (path: string): Evidence[] =>
        imports?.entries.find((entry) => entry.factPath === path)?.evidence
        ?? (ready ? evidenceFor(ir, path) : []);
    const hasFile = filePath.length > 0;
    const range = symbol
        ? `${symbol.range.start.line + 1}-${Math.max(symbol.range.start.line + 1, symbol.range.end.line + (symbol.range.end.character > 0 ? 1 : 0))}`
        : undefined;
    const noSymbolMessage = props.status === 'loading' ? 'Reading selected code...'
        : props.status === 'failed' ? (props.message || 'Could not read symbol details.')
        : props.status === 'not-indexed' ? (props.message || 'This file is not indexed yet.')
        : undefined;
    return (
        <section className="selected-code" aria-label={featureCopy.Selected_code_3f3e266} data-testid="selected-code-panel" data-pinned={props.pinned}>
            <header className="selected-code-header">
                <h2>{featureCopy.Selected_code_3f3e266}</h2>
                <button type="button" className="selected-code-pin" disabled={!hasFile || (!props.pinned && (props.status === 'loading' || props.fileSymbolsStatus === 'loading'))}
                    aria-pressed={props.pinned} onClick={props.onTogglePin}
                    title={props.pinned ? featureCopy.Follow_the_current_editor_selection_61ac0ed : featureCopy.Keep_this_context_while_exploring_elsewhere_3a3915b}>
                    {props.pinned ? featureCopy.Pinned_f931216 : featureCopy.Pin_9c91841}
                </button>
            </header>
            {!hasFile ? (
                <p className="selected-code-message">{featureCopy.Open_a_file_to_inspect_its_symbols_and_connections_b9333ec}</p>
            ) : (
                <>
                    <div className="selected-code-identity">
                        {symbol && <div className="selected-code-symbol"><strong>{symbol.name}</strong><span>{symbol.kind}</span></div>}
                        <div className="selected-code-path" title={filePath}>{filePath}{range && <span>:{range}</span>}</div>
                        {props.pinned && <p className="selected-code-note">{featureCopy.Context_pinned_Unpin_to_follow_the_editor_3aabe03}</p>}
                        {ready && ir.signature?.value && <code className="selected-code-signature">{ir.signature.value}</code>}
                    </div>
                    {selection && selection.text.length > 0 && (
                        <div className="selected-code-selection" data-testid="selected-code-selection">
                            <details>
                                <summary>{featureCopy.Exact_selection_84126af}<span>{selection.startLine}:{selection.startColumn}{featureCopy.to_3a59c4e}{selection.endLine}:{selection.endColumn}</span></summary>
                                <pre><code>{selection.text}</code></pre>
                            </details>
                            <p className="selected-code-note">{featureCopy.Chat_receives_the_marked_text_408b1ac}{symbol ? featureCopy.Relationships_below_describe_0_f089fe1(symbol.name) : featureCopy.File_connections_remain_separate_from_the_selection_a945a13}</p>
                        </div>
                    )}
                    <div className="selected-code-actions">
                        <button type="button" className="selected-code-ask" onClick={props.onAsk}>{featureCopy.Ask_about_this_85161df}</button>
                        <button type="button" onClick={props.onShowGraph}>{featureCopy.Show_in_graph_1c8a690}</button>
                    </div>
                    {props.selectionContext}
                    {props.impact}
                    {noSymbolMessage && <p className="selected-code-message" role="status">{noSymbolMessage}</p>}
                    {!symbol && (
                        <div className="selected-code-file" data-testid="selected-code-file">
                            <h3>{featureCopy.Symbols_in_this_file_ceffbef}</h3>
                            {props.fileSymbolsStatus === 'loading' ? <p className="selected-code-note">{featureCopy.Loading_symbols_727f4ea}</p>
                                : props.fileSymbolsStatus === 'error' ? <p className="selected-code-note" role="status">{props.fileSymbolsMessage || featureCopy.Could_not_load_file_symbols_16ec9b0}</p>
                                : props.fileSymbols && props.fileSymbols.length > 0 ? (
                                    <ul>{props.fileSymbols.map((entry) => <li key={`${entry.qualifiedName ?? entry.name}:${entry.range.start.line}`}>
                                        <button type="button" onClick={() => props.onFollow(entry)}>
                                            <span>{entry.name}</span><span>{entry.kind} · {entry.range.start.line + 1}</span>
                                        </button>
                                    </li>)}</ul>
                                ) : <p className="selected-code-note">{props.fileSymbolsStatus === 'ready' ? featureCopy.No_symbols_found_in_the_current_index_c078ef6 : featureCopy.Select_code_in_the_reader_to_inspect_it_86f8cbb}</p>}
                            {props.fileSymbolsMessage && props.fileSymbolsStatus !== 'error' && <p className="selected-code-note">{props.fileSymbolsMessage}</p>}
                        </div>
                    )}
                    <div className="selected-code-facts" key={identity}>
                        {sections.map((section) => <FactDisclosure key={section.name} section={section}
                            openEvidence={openEvidence} entriesFor={entriesFor}
                            onToggleEvidence={(path) => setOpenEvidence((current) => current === path ? undefined : path)}
                            onFollow={props.onFollow} onPointRow={props.onPointRow} />)}
                        {ready && (props.callOutline || props.onOpenFlow) && (
                            <details className="selected-code-fact" data-section="outline">
                                <summary><span>{featureCopy.Call_outline_c9de541}</span></summary>
                                <p className="selected-code-note">{featureCopy.Indexed_call_sequence_not_complete_control_flow_bc0f622}</p>
                                {props.onOpenFlow && <button type="button" className="selected-code-flow" onClick={props.onOpenFlow}>{featureCopy.Open_flow_view_c8b3e77}</button>}
                                {props.callOutline}
                            </details>
                        )}
                        {ready && (ir.writes.state === 'unsupported' || ir.externalEffects.state === 'unsupported') && (
                            <details className="selected-code-fact" data-section="limits">
                                <summary><span>{featureCopy.Index_limits_ed9a1ae}</span></summary>
                                <p className="selected-code-note">{[ir.writes.state === 'unsupported' ? 'Assignments and writes are not tracked.' : '', ir.externalEffects.state === 'unsupported' ? 'External side effects are not tracked.' : ''].filter(Boolean).join(' ')}{featureCopy.Absence_of_a_relationship_is_not_proof_that_it_cannot_occur_0697766}</p>
                            </details>
                        )}
                    </div>
                    {props.coverageNote && <p className="selected-code-note selected-code-coverage">{props.coverageNote}</p>}
                </>
            )}
        </section>
    );
}
