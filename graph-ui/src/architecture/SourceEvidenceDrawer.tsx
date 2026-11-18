import { featureCopy } from '../i18n/features/architecture';
import { useEffect, useRef, useState } from 'react';
import type { RpcIntelligenceClient } from '../provider/rpc-client';
import type { CodeSnippetResult } from '../provider/rpc-schemas';
import type { GraphData } from '../galaxy/types';
import { COLUMNS, fileNodeForPath, moduleForFile } from '../provider/cypher';
import './source-evidence.css';

export interface SourceEvidenceTarget { filePath: string; line?: number; name?: string; kind?: 'callsite' | 'declaration' | 'file' }
const PAGE_LINES = 160;
/* Hand test K13: a disabled "Next lines" at the last page read like a fault. The page says where the file ends. */
const END_OF_FILE = ' · end of file';
const endOfFileTitle = (line: number) => `Line ${line} is the last line of this file.`;
const validLine = (value: number | undefined): value is number => value !== undefined && Number.isSafeInteger(value) && value > 0;

export function fileQualifiedName(graph: GraphData | undefined, path: string): string | undefined {
    // File nodes may carry 0..0 and only return the first source fragment.
    // Module nodes own the whole-file range used by the source paging API.
    return graph?.nodes.find(node => node.file_path === path && node.label === 'Module' && node.qualified_name)?.qualified_name
        ?? graph?.nodes.find(node => node.file_path === path && node.label === 'File' && node.qualified_name)?.qualified_name;
}

/** Source stays next to its referring map/analysis. No external resources are loaded. */
export default function SourceEvidenceDrawer({ project, target, graph, client, onClose, onExplore }: {
    project: string; target: SourceEvidenceTarget; graph?: GraphData;
    client: Pick<RpcIntelligenceClient, 'getCodeSnippet' | 'queryRows'>; onClose: () => void;
    onExplore: (target: SourceEvidenceTarget) => void;
}) {
    const qualifiedName = fileQualifiedName(graph, target.filePath);
    const requestedLine = validLine(target.line) ? target.line : undefined;
    const initialStart = Math.max(1, (requestedLine ?? 1) - 8);
    const targetKey = JSON.stringify([project, target.filePath, requestedLine, qualifiedName]);
    const [pageWindow, setPageWindow] = useState<{ key: string; start: number }>();
    const start = pageWindow?.key === targetKey ? pageWindow.start : initialStart;
    const [refresh, setRefresh] = useState(0);
    const readKey = JSON.stringify([targetKey, start, refresh]);
    const activeKey = useRef(readKey); activeKey.current = readKey;
    const [reading, setReading] = useState<{ key: string; source?: CodeSnippetResult; error?: string }>();
    // A new target can render before its effect. Never relabel old file contents.
    const current = reading?.key === readKey ? reading : undefined;
    const [copiedKey, setCopiedKey] = useState('');
    const [copyError, setCopyError] = useState<{ key: string; message: string }>();
    const closeRef = useRef<HTMLButtonElement>(null);
    const selectedRef = useRef<HTMLSpanElement>(null);
    const sourceRef = useRef<HTMLPreElement>(null);
    const restoreFocus = useRef(true);
    useEffect(() => {
        const previous = document.activeElement;
        closeRef.current?.focus();
        return () => {
            if (restoreFocus.current && previous instanceof HTMLElement && previous.isConnected
                && !previous.closest('[hidden], [inert]')) previous.focus({ preventScroll: true });
        };
    }, []);
    useEffect(() => {
        let alive = true;
        const fail = (error: unknown) => {
            if (alive) setReading({ key: readKey, error: error instanceof Error ? error.message : String(error) });
        };
        if (!project || !target.filePath || /[\x00-\x1f\x7f]/.test(target.filePath)) {
            fail('Select a project and a valid repository file to inspect source evidence.');
            return;
        }
        void (async () => {
            let resolvedName = qualifiedName;
            if (!resolvedName) {
                // Evidence can originate in Explore or a bounded impact result,
                // before the user has ever loaded the architecture snapshot.
                const modules = await client.queryRows(project, moduleForFile(target.filePath));
                if (!alive) return;
                resolvedName = modules[0]?.[COLUMNS.moduleForFile[0]] || undefined;
                if (!resolvedName) {
                    const files = await client.queryRows(project, fileNodeForPath(target.filePath));
                    if (!alive) return;
                    resolvedName = files[0]?.[COLUMNS.fileNode[0]] || undefined;
                }
            }
            if (!resolvedName) throw new Error(featureCopy.No_indexed_Module_or_File_declaration_was_found_for_this_project__dca9ba4);
            const source = await client.getCodeSnippet(project, resolvedName, { startLine: start, maxLines: PAGE_LINES });
            if (!alive) return;
            if (source.qualified_name && source.qualified_name !== resolvedName) throw new Error(featureCopy.The_source_reply_identifies_a_different_indexed_file_Refresh_the__3ddd529);
            const returnedPath = source.file_path?.replace(/\\/g, '/');
            if (returnedPath && returnedPath !== target.filePath && !returnedPath.endsWith(`/${target.filePath}`))
                throw new Error(featureCopy.The_source_reply_identifies_a_different_file_path_a45a118);
            if (!validLine(source.start_line) || !validLine(source.end_line) || source.end_line < source.start_line)
                throw new Error(featureCopy.The_source_reply_has_no_usable_line_range_No_source_location_can__abb450c);
            if (source.source_mode && source.source_mode !== 'full') throw new Error(featureCopy.The_daemon_returned_an_outline_instead_of_source_Open_Explore_to__b9932e7);
            if (source.source.trim() === '(source not available)') throw new Error(featureCopy.The_daemon_could_not_read_the_current_local_source_1c62ef4);
            setReading({ key: readKey, source });
        })().catch(fail);
        return () => { alive = false; };
    }, [project, qualifiedName, start, client, readKey]);
    const source = current?.source;
    const lines = source ? source.source.split('\n') : [];
    // A complete Module range may include its empty EOF line. A clipped page
    // instead ends in a separator after its last reported line. The explicit
    // source range distinguishes these cases; never accept other count gaps.
    const reportedLines = source && validLine(source.start_line) && validLine(source.end_line)
        ? source.end_line - source.start_line + 1 : undefined;
    if (lines.at(-1) === '' && lines.length - 1 === reportedLines) lines.pop();
    const firstLine = source?.start_line;
    const lastLine = validLine(firstLine) ? firstLine + lines.length - 1 : undefined;
    const rangeMatches = source && lastLine === source.end_line;
    const more = source?.source_truncated === true || source?.source_clipped === true;
    const next = source?.next_start_line;
    const canNext = Boolean(more && validLine(next) && validLine(lastLine) && next === lastLine + 1 && rangeMatches);
    const atEnd = Boolean(source && !more && rangeMatches && validLine(lastLine));
    // The Module range counts the empty segment after the final line break; the file's last line is the one before it.
    const endSegment = atEnd && lines.length > 1 && lines.at(-1) === '';
    const lastFileLine = endSegment ? lastLine! - 1 : lastLine;
    // Review of K13: range text, drawn lines and title all stop at that line, not at the empty segment after it.
    const shownLines = endSegment ? lines.slice(0, -1) : lines;
    const locationVisible = requestedLine !== undefined && validLine(firstLine) && validLine(lastLine)
        && requestedLine >= firstLine && requestedLine <= lastLine && rangeMatches;
    useEffect(() => {
        const panel = sourceRef.current, selected = selectedRef.current;
        if (!panel) return;
        panel.scrollTop = 0;
        if (selected) {
            // Scroll only this code pane; preserve the referring map's viewport.
            panel.scrollTop = Math.max(0, selected.getBoundingClientRect().top - panel.getBoundingClientRect().top - panel.clientHeight / 2);
        }
    }, [source]);
    const moveTo = (line: number) => setPageWindow({ key: targetKey, start: line });
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(`${target.filePath}:${requestedLine ?? firstLine ?? 1}`);
            if (activeKey.current === readKey) { setCopiedKey(readKey); setCopyError(undefined); }
        } catch {
            if (activeKey.current === readKey) setCopyError({ key: readKey, message: featureCopy.Copy_unavailable_Select_the_location_above_to_copy_it_manually_edd098a });
        }
    };
    return <aside className="source-evidence-drawer" role="dialog" aria-modal="false" aria-label={featureCopy.Source_evidence_149bdd9} onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    }}>
        <header><div><span>{featureCopy.Source_evidence_149bdd9}</span><h2>{target.name ?? target.filePath.split('/').at(-1)}</h2></div>
            <button ref={closeRef} onClick={onClose} aria-label={featureCopy.Close_source_evidence_0bff750}>{featureCopy.Close_bbfa773}</button></header>
        <p className="source-evidence-location">{target.filePath}{requestedLine ? `:${requestedLine}` : ''}</p>
        <p className="source-evidence-note">{target.kind === 'callsite' ? featureCopy.Indexed_call_site_77d7b3c : target.kind === 'declaration' ? featureCopy.Indexed_declaration_9e45411 : featureCopy.Requested_source_location_932bf6f}.
            {' '}{featureCopy.Current_local_source_may_have_changed_since_indexing_The_map_stay_a02bdef}</p>
        <div className="source-evidence-actions"><button onClick={() => void copy()}>{copiedKey === readKey ? featureCopy.Copied_location_b303212 : featureCopy.Copy_location_a0f402b}</button>
            <button onClick={() => setRefresh(value => value + 1)}>{featureCopy.Refresh_source_1dcdb2f}</button>
            <button onClick={() => { restoreFocus.current = false; onExplore(target); }}>{featureCopy.Open_in_Explore_6199c77}</button></div>
        {copyError?.key === readKey && <p role="status">{copyError.message}</p>}
        {current?.error ? <p role="alert">{current.error}</p> : !source ? <p role="status">{featureCopy.Reading_local_source_c597264}</p> : <>
            {!rangeMatches && <p role="alert">{featureCopy.Source_text_does_not_match_the_reported_line_range_Line_numbers_a_a55a57a}</p>}
            {requestedLine && !locationVisible && rangeMatches && <p role="status" className="source-evidence-notice">{featureCopy.Requested_line_c459a1f}{requestedLine}{featureCopy.is_outside_this_returned_window_b9daf75}{start === initialStart ? featureCopy.The_index_or_requested_source_window_may_be_stale_a4f9238 : <button onClick={() => moveTo(initialStart)}>{featureCopy.Return_to_requested_location_b80dcf7}</button>}</p>}
            <pre ref={sourceRef} tabIndex={0} aria-label={featureCopy.Source_lines_b076c76} className="source-evidence-lines"><code>{shownLines.map((line, index) => {
                const number = (firstLine ?? 1) + index;
                const selected = rangeMatches && number === requestedLine;
                return <span key={number} data-selected={selected} ref={selected ? selectedRef : undefined}>
                    <span className="source-evidence-line-number" aria-hidden="true">{rangeMatches ? number : ''}</span>{line || ' '}<br /></span>;
            })}</code></pre>
            {lines.length === 0 && <p role="status">{featureCopy.No_source_text_was_returned_33ff235}</p>}
            {more && !canNext && <p role="status">{featureCopy.The_source_is_truncated_but_no_valid_next_page_was_supplied_Refre_747821f}</p>}
            <nav aria-label={featureCopy.Source_pages_834e570}><button disabled={!rangeMatches || !firstLine || firstLine <= 1} onClick={() => moveTo(Math.max(1, firstLine! - PAGE_LINES))}>{featureCopy.Previous_lines_a194d81}</button>
                <span>{rangeMatches ? featureCopy.Lines_0_to_1_b63a80c(firstLine, lastFileLine) : featureCopy.Unverified_line_range_18f19ef}{source.original_end_line ? featureCopy.reported_end_0_30bd69c(source.original_end_line) : ''}{atEnd ? END_OF_FILE : ''}</span>
                <button disabled={!canNext} title={atEnd ? endOfFileTitle(lastFileLine!) : undefined} onClick={() => moveTo(next!)}>{featureCopy.Next_lines_9a7d279}</button></nav>
        </>}
    </aside>;
}
