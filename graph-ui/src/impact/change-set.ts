import { featureCopy } from '../i18n/features/impact';
import { callToolJson } from '../provider/rpc-transport';
import type { SelectionImpactTarget } from './selection-impact';

export interface ChangeSetReading {
    project: string;
    base: string;
    mergeBase: string;
    checkedAt: string;
    files: string[];
    totalFiles: number;
    complete: boolean;
    pages: number;
    limitations: string[];
}

export type ChangeSetRequest = (args: Record<string, unknown>, signal?: AbortSignal) => Promise<unknown>;
const request: ChangeSetRequest = (args, signal) => callToolJson('detect_changes', args, { signal });

const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};

export function validChangeRef(value: string): boolean {
    // A local revision, never shell syntax or a Git option. The daemon also validates it.
    return value.length > 0 && value.length <= 200 && /^[A-Za-z0-9_][A-Za-z0-9_./~^@{}+-]*$/.test(value);
}

/** Read file pages separately from graph impact so one cannot consume the other's budget. */
export async function loadChangeSet(project: string, base: string, signal?: AbortSignal,
    read: ChangeSetRequest = request): Promise<ChangeSetReading> {
    if (!project || !validChangeRef(base)) throw new Error(featureCopy.Choose_a_project_and_a_valid_local_Git_revision_11f40ba);
    const files = new Set<string>();
    let cursor: string | undefined;
    const cursors = new Set<string>();
    let mergeBase = '', total = -1, complete = false, pages = 0;
    let budget = 12000;
    const limitations: string[] = [];
    while (pages < 8 && files.size < 4000) {
        const payload = object(await read({ project, since: base, scope: 'files', direction: 'inbound',
            changed_limit: 500, limit: 1, module_limit: 0, max_output_tokens: budget, format: 'json',
            ...(cursor ? { changed_cursor: cursor } : {}) }, signal));
        if (signal?.aborted) throw signal.reason;
        if (payload.base !== base || typeof payload.merge_base !== 'string' || !Array.isArray(payload.changed_files)
            || !Number.isSafeInteger(payload.changed_total) || Number(payload.changed_total) < 0
            || typeof payload.changed_has_more !== 'boolean') {
            throw new Error(featureCopy.The_daemon_returned_an_incomplete_change_set_response_No_empty_or_a8b6e28);
        }
        if (total >= 0 && (total !== payload.changed_total || mergeBase !== payload.merge_base)) {
            throw new Error(featureCopy.The_Git_change_set_moved_while_its_pages_were_loading_Refresh_to__731a069);
        }
        total = Number(payload.changed_total); mergeBase = payload.merge_base;
        const entries = payload.changed_files;
        if (entries.some(file => typeof file !== 'string' || !file || file.startsWith('/') || file.split('/').includes('..'))) {
            throw new Error(featureCopy.The_daemon_returned_an_invalid_repository_relative_changed_path_1b7572c);
        }
        if (entries.length === 0 && payload.changed_has_more && payload.changed_continuation_requires_higher_budget && budget < 24000) {
            budget = 24000; continue;
        }
        pages += 1;
        const previousSize = files.size;
        for (const file of entries as string[]) files.add(file);
        if (!payload.changed_has_more) {
            complete = files.size === total;
            if (!complete) limitations.push('The returned file pages do not account for the reported total.');
            break;
        }
        const next = payload.changed_next_cursor;
        if (typeof next !== 'string' || !next || cursors.has(next) || files.size === previousSize) {
            limitations.push('The daemon could not provide a progressing snapshot cursor for the remaining changed files.');
            break;
        }
        cursors.add(next); cursor = next;
    }
    if (!complete && limitations.length === 0) limitations.push('Changed-file reading reached its limit of 8 pages / 4,000 paths.');
    return { project, base, mergeBase, checkedAt: new Date().toISOString(), files: [...files], totalFiles: total,
        complete, pages, limitations };
}

export interface ChangedArea { path: string; files: string[] }
/** Navigation groups from recorded paths; change volume is not a risk score. */
export function changedAreas(files: readonly string[], preferredFile?: string): ChangedArea[] {
    const areas = new Map<string, string[]>();
    for (const file of files) {
        const parts = file.split('/');
        const area = parts.length > 2 ? parts.slice(0, 2).join('/') : parts.length > 1 ? parts[0] : '(root)';
        const group = areas.get(area) ?? []; group.push(file); areas.set(area, group);
    }
    return [...areas].map(([path, entries]) => ({ path, files: entries.sort((a, b) =>
        Number(b === preferredFile) - Number(a === preferredFile) || a.localeCompare(b)) }))
        .sort((a, b) => Number(b.files.includes(preferredFile ?? '')) - Number(a.files.includes(preferredFile ?? ''))
            || b.files.length - a.files.length || a.path.localeCompare(b.path));
}

export interface ChangeSymbolSource {
    queryRows(project: string, query: string): Promise<Record<string, string>[]>;
}
export async function loadFileImpactSymbols(client: ChangeSymbolSource, project: string, filePath: string): Promise<SelectionImpactTarget[]> {
    const results = await Promise.all(['Function', 'Method'].map(label => client.queryRows(project,
        `MATCH (n:${label}) WHERE n.file_path = ${JSON.stringify(filePath)} RETURN n.name, n.qualified_name, n.file_path, n.start_line LIMIT 200`)));
    const unique = new Map<string, SelectionImpactTarget>();
    for (const row of results.flat()) {
        const qualifiedName = row['n.qualified_name'];
        if (!qualifiedName || row['n.file_path'] !== filePath) continue;
        unique.set(qualifiedName, { name: row['n.name'], qualifiedName, filePath,
            ...(Number(row['n.start_line']) > 0 ? { line: Number(row['n.start_line']) } : {}) });
    }
    return [...unique.values()].sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
}

export function localDiffCommand(base: string, filePath: string): string {
    if (!validChangeRef(base)) return '';
    const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
    return `git diff ${quote(base)} -- ${quote(filePath)}`;
}
