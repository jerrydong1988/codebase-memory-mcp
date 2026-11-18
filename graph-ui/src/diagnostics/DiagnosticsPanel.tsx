import { featureCopy } from '../i18n/features/diagnostics';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadCoverage, loadPathCoverage, type CoverageReading } from '../app/coverage-source';
import type { CoverageIndex } from '../app/tree-model';
import type { RpcIntelligenceClient } from '../provider/rpc-client';
import { DIAGNOSTIC_LABELS, diagnosticAction, diagnosticCategory, diagnosticRecords, freshnessText, localDiagnosticReport, type LocalDiagnosis } from './diagnostics-model';
import './diagnostics.css';

export interface DiagnosticsPanelProps {
    project: string;
    client: RpcIntelligenceClient;
    coverage?: CoverageIndex | null;
    coverageError?: string | null;
    active: boolean;
    path?: string;
    indexDetails?: ReactNode;
    onNavigate: (path: string) => void;
    /** App can update its shared coverage reading from the same diagnosis. */
    onCoverage?: (reading: CoverageReading) => void;
}

export default function DiagnosticsPanel({ project, client, coverage, coverageError, active, path, indexDetails, onNavigate, onCoverage }: DiagnosticsPanelProps) {
    const [diagnosis, setDiagnosis] = useState<LocalDiagnosis | null>(null);
    const [report, setReport] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [recordLimit, setRecordLimit] = useState(100);
    const request = useRef(0);
    useEffect(() => {
        request.current += 1;
        setDiagnosis(null); setReport(''); setBusy(false); setError(null); setStatus(''); setRecordLimit(100);
        return () => { request.current += 1; };
    }, [project, path, active]);
    const index = diagnosis?.reading.index ?? coverage;
    const records = useMemo(() => diagnosticRecords(index), [index]);
    const run = async () => {
        const ticket = ++request.current;
        setBusy(true); setError(null); setStatus('');
        try {
            const reading = await loadCoverage(client, project);
            if (ticket !== request.current) return;
            const pathAnswer = path ? await loadPathCoverage(client, project, path) : undefined;
            if (ticket !== request.current) return;
            const result: LocalDiagnosis = { project, requestedPath: path, checkedAt: new Date().toISOString(), reading, pathAnswer };
            setDiagnosis(result); setReport(localDiagnosticReport(result)); onCoverage?.(reading);
        } catch (reason) {
            if (ticket === request.current) setError(reason instanceof Error ? reason.message : String(reason));
        } finally {
            if (ticket === request.current) setBusy(false);
        }
    };
    const copy = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(featureCopy.Clipboard_unavailable_select_the_draft_and_copy_it_manually_e402fc7);
            await navigator.clipboard.writeText(report); setStatus('Edited report copied locally. Nothing was sent.');
        } catch (reason) { setStatus(reason instanceof Error ? reason.message : String(reason)); }
    };
    const download = () => {
        const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'local-index-diagnosis.txt';
        anchor.click(); URL.revokeObjectURL(url); setStatus('Edited report downloaded locally. Nothing was sent.');
    };
    if (!active) return null;
    return <section className="diagnostics-panel" aria-label={featureCopy.Coverage_80e1354} data-testid="diagnostics-panel">
        <header><div><p className="diagnostics-eyebrow">{project}</p><h2>{featureCopy.Coverage_80e1354}</h2>{path && <p>{featureCopy.Selected_04c51f0}<code>{path}</code></p>}</div></header>
        <p>{featureCopy.The_map_can_omit_excluded_files_unsupported_inputs_and_failed_or__b26d3ae}</p>
        {(error || coverageError) && <p role="alert" className="diagnostics-error">{featureCopy.Coverage_reading_failed_74b5023}{error || coverageError}. {index ? featureCopy.Previous_records_remain_visible_this_is_not_a_fresh_reading_5d2f58f : featureCopy.Completeness_is_unknown_376bf3c}</p>}
        <div className="diagnostics-actions"><button type="button" disabled={busy || !project} onClick={() => { void run(); }}>{busy ? featureCopy.Reading_local_diagnosis_4ed9b4b : featureCopy.Run_local_diagnosis_b6400fb}</button><span>{featureCopy.Reads_existing_coverage_metadata_through_this_daemon_No_agent_upl_632440b}</span></div>
        {!index && <p>{featureCopy.Coverage_evidence_has_not_been_loaded_Run_a_local_diagnosis_to_in_a19e283}</p>}
        {index && <>
            <div className="diagnostics-counts">{(['partial', 'excluded', 'unsupported', 'skipped', 'unknown'] as const).map((category) => <span key={category}>{DIAGNOSTIC_LABELS[category]}: <strong>{records.filter((record) => diagnosticCategory(record) === category).length}</strong></span>)}</div>
            <p className="diagnostics-caveat">{featureCopy.Counts_describe_returned_path_records_including_directories_They__8d6fd59}</p>
            <p className="diagnostics-caveat">{featureCopy.Partial_parses_mark_source_ranges_the_index_parser_could_not_inte_107eb40}</p>
            {index.listingComplete && <p className="diagnostics-caveat">{featureCopy.All_recorded_coverage_entries_have_been_loaded_The_parser_limitat_71a1be5}</p>}
            {index.truncations.map((note) => <p key={note} className="diagnostics-caveat">{featureCopy.Incomplete_list_a858fde}{note}</p>)}
        </>}
        {indexDetails && <details className="diagnostics-inventory"><summary>{featureCopy.Index_inventory_and_legend_eb279ec}</summary>{indexDetails}</details>}
        {diagnosis && <div className="diagnostics-reading"><p>{featureCopy.Checked_aca936b}{diagnosis.checkedAt}{featureCopy.Index_generation_7e91289}<code>{diagnosis.reading.answer.metadata.generation || 'unavailable'}</code>{featureCopy.Recording_db52f40}{diagnosis.reading.answer.metadata.recordingStatus || featureCopy.unavailable_1d5ee31}</p>
            {!diagnosis.reading.answer.metadata.generationMatches && <p className="diagnostics-error">{featureCopy.Coverage_generation_does_not_confirm_the_current_index_Treat_the__b84a314}</p>}
            {path && <p>{diagnosis.pathAnswer ? freshnessText(diagnosis.pathAnswer.freshness) : featureCopy.No_path_specific_evidence_returned_Freshness_is_unknown_f8a0c5f}</p>}
            {diagnosis.pathAnswer?.coverage.map((row, i) => <p key={`${row.path}:${i}`}><code>{row.path}</code> · {row.kind} · {row.detail || featureCopy.No_detail_recorded_28dd2bd}</p>)}
            {diagnosis.reading.answer.caveat && <p className="diagnostics-caveat">{diagnosis.reading.answer.caveat}</p>}
        </div>}
        {records.length > 0 && <details><summary>{featureCopy.Recorded_paths_f8b18eb}{records.length}</summary>
            <ol className="diagnostics-records">{records.slice(0, recordLimit).map((record) => <li key={record.path} className={`diagnostics-record-${diagnosticCategory(record)}`}>
                <div><strong>{DIAGNOSTIC_LABELS[diagnosticCategory(record)]}</strong> · {record.kind} <button type="button" onClick={() => onNavigate(record.path)}><code>{record.path}</code></button></div>
                <p><strong>{featureCopy.Recorded_reason_6725e46}</strong> {record.reason || featureCopy.No_reason_recorded_c3d1bbd}</p>
                <p><strong>{featureCopy.Evidence_3ef3540}</strong> {record.sources.join(', ') || featureCopy.Source_not_reported_4f81323}</p>
                <p>{diagnosticAction(record)}</p>
            </li>)}</ol><p className="diagnostics-caveat">{featureCopy.Showing_85a4af0}{Math.min(recordLimit, records.length)}{featureCopy.of_607f2de}{records.length}{featureCopy.records_9cde55c}</p>
            {recordLimit < records.length && <button type="button" onClick={() => setRecordLimit(limit => limit + 100)}>{featureCopy.Show_more_paths_c2ddcd6}</button>}</details>}
        {index && records.length === 0 && <p>{featureCopy.No_gap_records_returned_This_does_not_prove_complete_indexing_und_21c64ed}</p>}
        {diagnosis && <section aria-label={featureCopy.Local_diagnostic_report_39b3f2e}><h3>{featureCopy.Review_the_local_report_0935401}</h3><p>{featureCopy.This_draft_contains_paths_and_recorded_reasons_Edit_it_before_sha_64e48d6}</p>
            <textarea aria-label={featureCopy.Editable_local_diagnostic_report_878a9bf} value={report} onChange={(event) => setReport(event.currentTarget.value)} spellCheck={false} />
            <div className="diagnostics-actions"><button type="button" onClick={() => { void copy(); }}>{featureCopy.Copy_edited_report_64037b3}</button><button type="button" onClick={download}>{featureCopy.Download_edited_report_f6252b3}</button><span role="status">{status}</span></div>
        </section>}
    </section>;
}
