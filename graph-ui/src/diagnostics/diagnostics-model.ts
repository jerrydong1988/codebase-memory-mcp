import { featureLanguage } from '../i18n/feature-language';
import { featureCopy } from '../i18n/features/diagnostics';
import type { CoverageReading } from '../app/coverage-source';
import type { CoverageIndex, CoveragePathAnswer, CoverageRecord } from '../app/tree-model';

export type DiagnosticCategory = 'partial' | 'excluded' | 'unsupported' | 'skipped' | 'unknown';
export const DIAGNOSTIC_LABELS: Record<DiagnosticCategory, string> = {
    partial: featureCopy.Partial_parse_61e99de, excluded: featureCopy.Excluded_by_index_rules_6815e7a, unsupported: featureCopy.Unsupported_language_5190b23,
    skipped: featureCopy.Indexing_skipped_2e8889b, unknown: featureCopy.Unclassified_coverage_record_5b321de,
};

/** Display the existing coverage join; only a specific recorded reason identifies unsupported input. */
export function diagnosticCategory(record: CoverageRecord): DiagnosticCategory {
    if (record.state === 'partial') return 'partial';
    if (record.state === 'ignored' || record.state === 'not-indexed') return 'excluded';
    // cbm.c emits this exact error; don't guess support from a file extension.
    if (record.state === 'skipped' && /^unsupported language(?:\s*\/|$)/.test(record.reason)) return 'unsupported';
    return record.state === 'skipped' ? 'skipped' : 'unknown';
}

export function diagnosticAction(record: CoverageRecord): string {
    const category = diagnosticCategory(record);
    if (category === 'partial') return featureCopy.Read_the_reported_source_ranges_verify_missing_symbols_before_rel_20eb19a;
    if (category === 'excluded') return featureCopy.Review_the_recorded_exclusion_rule_open_the_source_directly_or_ad_fefb9a5;
    if (category === 'unsupported') return featureCopy.Read_this_file_directly_check_parser_support_before_requesting_an_885c26f;
    if (category === 'skipped') return featureCopy.Inspect_the_recorded_reason_and_source_correct_the_cause_before_r_f301604;
    return featureCopy.Inspect_the_existing_coverage_evidence_completeness_cannot_be_inf_3d4492d;
}

export function diagnosticRecords(index: CoverageIndex | null | undefined): CoverageRecord[] {
    const priority: Record<DiagnosticCategory, number> = { partial: 0, skipped: 1, unsupported: 2, unknown: 3, excluded: 4 };
    return [...(index?.records.values() ?? [])].sort((a, b) => priority[diagnosticCategory(a)] - priority[diagnosticCategory(b)] || a.path.localeCompare(b.path));
}

export function freshnessText(freshness: string): string {
    if (freshness === 'metadata_match') return featureCopy.File_size_and_modification_time_match_the_index_record_This_is_no_e663a08;
    if (freshness === 'metadata_changed') return featureCopy.File_size_or_modification_time_changed_since_indexing_Read_the_cu_0af7927;
    if (freshness === 'not_tracked') return featureCopy.No_indexed_file_metadata_exists_for_this_path_It_may_be_unindexed_8a90d61;
    if (freshness === 'missing') return featureCopy.The_requested_file_is_missing_on_disk_2e056bb;
    if (freshness === 'outside_project') return featureCopy.This_path_is_outside_the_selected_project_21ef9c1;
    return featureCopy.Freshness_is_unavailable_Missing_evidence_is_not_a_clean_result_4f7f52c;
}

export interface LocalDiagnosis {
    project: string;
    requestedPath?: string;
    checkedAt: string;
    reading: CoverageReading;
    pathAnswer?: CoveragePathAnswer;
}

/** A bounded, deterministic draft produced only after a user's local diagnosis action. */
export function localDiagnosticReport(diagnosis: LocalDiagnosis): string {
    const { reading, pathAnswer } = diagnosis;
    const records = diagnosticRecords(reading.index);
    const metadata = reading.answer.metadata;
    const chinese = featureLanguage() === 'zh';
    const lines = [
        (chinese ? '# 本地索引诊断：分享前请检查' : '# Local index diagnosis: review before sharing'), '',
        (chinese ? `项目：${diagnosis.project}` : `Project: ${diagnosis.project}`), (chinese ? `本地检查时间：${diagnosis.checkedAt}` : `Checked locally: ${diagnosis.checkedAt}`),
        (chinese ? `索引代次：${metadata.generation || '未知'}` : `Index generation: ${metadata.generation || 'unavailable'}`),
        (chinese ? `覆盖记录时间：${metadata.recordedAt || '未知'}` : `Coverage recorded at: ${metadata.recordedAt || 'unavailable'}`),
        (chinese ? `记录状态：${metadata.recordingStatus || '未知'}` : `Recording status: ${metadata.recordingStatus || 'unavailable'}`),
        (chinese ? `覆盖记录与索引代次一致：${metadata.generationMatches ? '是' : '未确认'}` : `Coverage generation matches index: ${metadata.generationMatches ? 'yes' : 'not confirmed'}`),
        (chinese ? '依据：现有的 index_status 与 check_index_coverage 记录。未附加源码或后台日志。' : 'Evidence: existing index_status + check_index_coverage. No source text or daemon log is attached.'),
        (chinese ? '此记录尽力提供现有信息，不能代表整个仓库的覆盖比例。' : 'This is a best-effort record, not a repository-wide coverage percentage.'),
        (chinese ? '下方路径和原因可能包含敏感信息。分享前请编辑此草稿。' : 'Paths and reasons below may be sensitive. Edit this draft before sharing it.'), '',
    ];
    if (diagnosis.requestedPath) {
        lines.push((chinese ? `所选路径：${diagnosis.requestedPath}` : `Selected path: ${diagnosis.requestedPath}`));
        lines.push(pathAnswer ? (chinese ? `路径状态：${pathAnswer.status || '未知'}；与当前文件的一致性：${pathAnswer.freshness || '未知'}` : `Path status: ${pathAnswer.status || 'unavailable'}; freshness: ${pathAnswer.freshness || 'unavailable'}`) : (chinese ? '后台未返回所选路径的依据。' : 'The daemon returned no evidence for the selected path.'));
        if (pathAnswer) {
            lines.push(freshnessText(pathAnswer.freshness), (chinese ? `后台建议的下一步：${pathAnswer.recommendedAction || '未知'}` : `Reported next action: ${pathAnswer.recommendedAction || 'unavailable'}`));
            for (const row of pathAnswer.coverage) lines.push((chinese ? `路径依据：${row.path} | ${row.kind} | ${row.detail || '未记录详情'}` : `Path evidence: ${row.path} | ${row.kind} | ${row.detail || 'No detail recorded'}`));
        }
        lines.push('');
    }
    lines.push((chinese ? `已记录路径：${records.length}（含文件与目录，不能作为文件覆盖率的分母）。` : `Recorded paths: ${records.length} (files and directories; not a file-coverage denominator).`));
    lines.push((chinese ? `已保存的忽略文件记录：${metadata.ignoredFilesStored}；报告总数：${metadata.ignoredFilesTotal}。` : `Ignored file records stored: ${metadata.ignoredFilesStored}; total reported: ${metadata.ignoredFilesTotal}.`));
    for (const note of reading.index.truncations) lines.push((chinese ? `清单不完整：${note}` : `Incomplete list: ${note}`));
    if (reading.answer.caveat) lines.push((chinese ? `后台附注：${reading.answer.caveat}` : `Daemon caveat: ${reading.answer.caveat}`));
    if (!records.length) lines.push((chinese ? '未返回缺口记录。未发现或不支持的文件可能没有记录。' : 'No gap records returned. Discovery omissions and unsupported files may be unrecorded.'));
    for (const record of records.slice(0, 200)) {
        lines.push('', `- ${record.path} (${record.kind}): ${DIAGNOSTIC_LABELS[diagnosticCategory(record)]}`,
            (chinese ? `  记录的原因：${record.reason || '未记录原因'}` : `  Recorded reason: ${record.reason || 'No reason recorded'}`),
            (chinese ? `  依据来源：${record.sources.join(', ') || '未提供'}` : `  Evidence source: ${record.sources.join(', ') || 'Not reported'}`),
            (chinese ? `  下一步检查：${diagnosticAction(record)}` : `  Next check: ${diagnosticAction(record)}`));
    }
    if (records.length > 200) lines.push('', (chinese ? `报告仅显示 ${records.length} 条路径中的前 200 条。` : `Report limited to 200 of ${records.length} recorded paths.`));
    return lines.join('\n');
}
