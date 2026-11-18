import { featureCopy } from '../i18n/features/architecture';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ArchitectureOverviewDto } from '../core/intelligence-provider';
import { graphNodeName } from '../galaxy/node-names';
import type { GraphData, GraphNode } from '../galaxy/types';
import { areaConnections, areaOf, repositoryMap, type MapEvidence } from './repository-map';
import { entryCandidates, entryRole, entryRoutes, sourceCandidates, type SourceReader, type SourceQuote } from './repository-guide';
import { useRepositoryGuide } from './useRepositoryGuide';

export interface RepositoryMapProps {
    graph?: GraphData;
    overview: ArchitectureOverviewDto;
    filter: string;
    onNavigate: (path: string, line?: number, name?: string) => void;
    onSelect?: (node: GraphNode) => void;
    selection?: GraphNode;
    selectionPanel?: ReactNode;
    graphNote?: string;
    readSource?: SourceReader;
}

function Nodes({ nodes, onSelect, onNavigate }: Pick<RepositoryMapProps, 'onSelect' | 'onNavigate'> & { nodes: GraphNode[] }) {
    const [limit, setLimit] = useState(24);
    return <><ul className="repo-map-nodes">{nodes.slice(0, limit).map(node => <li key={node.id}>
        <button onClick={() => onSelect ? onSelect(node) : onNavigate(node.file_path!, node.start_line, node.name)}>
            {/* Round 4 (N1): a Branch node reads "django-demo · detached HEAD", not "DETACHED". */}
            <strong>{graphNodeName(node)}</strong><span>{node.label} · {node.file_path}{node.start_line ? `:${node.start_line}` : ''}</span>
        </button>
    </li>)}</ul>{nodes.length > limit && <button className="atlas-arch-action" onClick={() => setLimit(limit + 24)}>{featureCopy.More_symbols_6b82c23}{limit}{featureCopy.of_607f2de}{nodes.length})</button>}</>;
}

export function RelationshipEvidence({ edges, onSelect, onNavigate }: Pick<RepositoryMapProps, 'onSelect' | 'onNavigate'> & { edges: MapEvidence[] }) {
    const [limit, setLimit] = useState(12);
    return <div className="repo-map-evidence" aria-label={featureCopy.Relationship_evidence_94956ae}>
        <p className="repo-map-note">{featureCopy.Static_index_edges_can_include_heuristic_name_resolution_Open_the_82eee18}</p>
        {edges.slice(0, limit).map((edge, index) => <div className="repo-map-edge" key={`${edge.source.id}:${edge.type}:${edge.target.id}:${index}`}>
            <Nodes nodes={[edge.source]} onSelect={onSelect} onNavigate={onNavigate} />
            <span className="repo-map-relation">{edge.type} →{edge.id !== undefined && <small>{featureCopy.Edge_106e80c}{edge.id}</small>}
                {edge.line !== undefined && edge.source.file_path && <button onClick={() => onNavigate(edge.source.file_path!, edge.line, edge.source.name)}>{featureCopy.Site_43c833e}{edge.line}</button>}
                {edge.unverifiedLine !== undefined && <small title={featureCopy.The_reported_line_could_not_be_verified_against_the_source_declar_d72d96a}>{featureCopy.Site_unverified_78d9b44}<br />{featureCopy.Reported_9f9a0d7}{edge.unverifiedLine}</small>}
                <details className="repo-map-resolution"><summary>{featureCopy.Resolution_516aae5}</summary><small>{edge.strategy ? featureCopy.Index_method_0_c2e107c(edge.strategy) : featureCopy.Resolution_method_not_recorded_26e878d}</small>
                    {edge.confidence !== undefined && <small>{featureCopy.Index_confidence_812be35}{edge.confidence}. This is a resolver score, not a defect probability.</small>}</details></span>
            <Nodes nodes={[edge.target]} onSelect={onSelect} onNavigate={onNavigate} />
        </div>)}
        <p>{Math.min(limit, edges.length)}{featureCopy.of_607f2de}{edges.length}{featureCopy.retained_edges_b28e076}</p>
        {limit < edges.length && <button className="atlas-arch-action" onClick={() => setLimit(limit + 24)}>{featureCopy.More_evidence_cbd8ff3}</button>}
    </div>;
}

function Quote({ quote, onNavigate }: { quote: SourceQuote; onNavigate: RepositoryMapProps['onNavigate'] }) {
    return <div className="repo-map-quote"><span className="repo-map-eyebrow">{quote.kind === 'readme' ? featureCopy.Project_README_04cf0ea : featureCopy.Source_documentation_ef288ba}{featureCopy.author_description_4d4626e}</span>
        <blockquote>{quote.text}</blockquote><button onClick={() => onNavigate(quote.path, quote.line)}>{featureCopy.Source_f59a85c}{quote.path}:{quote.line}</button></div>;
}

export default function RepositoryMapView({ graph, overview, filter, onNavigate, onSelect, selection, selectionPanel, graphNote, readSource }: RepositoryMapProps) {
    const map = useMemo(() => graph ? repositoryMap(graph) : undefined, [graph]);
    const [areaPath, setAreaPath] = useState<string>();
    const [file, setFile] = useState<string>();
    const [showAll, setShowAll] = useState(false);
    const [direction, setDirection] = useState<'incoming' | 'outgoing'>('outgoing');
    const [evidence, setEvidence] = useState<{ title: string; edges: MapEvidence[] }>();
    const [entryId, setEntryId] = useState<number>();
    const selectionRef = useRef<HTMLElement>(null);
    const evidenceRef = useRef<HTMLElement>(null);
    useEffect(() => { selectionRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' }); }, [selection?.id]);
    useEffect(() => { if (evidence) { evidenceRef.current?.scrollIntoView?.({ block: 'nearest' }); evidenceRef.current?.focus({ preventScroll: true }); } }, [evidence]);
    const area = map?.areas.find(row => row.path === areaPath);
    const openArea = (path?: string) => { setAreaPath(path); setFile(undefined); setEvidence(undefined); setShowAll(false); };
    const query = filter.trim().toLowerCase();
    const entries = useMemo(() => entryCandidates(graph?.nodes ?? []), [graph]);
    const entry = entries.find(node => node.id === entryId) ?? entries[0];
    const routes = useMemo(() => entry && map ? entryRoutes(entry, map.evidence) : [], [entry, map]);
    const primaryAreas = useMemo(() => [...(map?.areas ?? [])].sort((a, b) => {
        const support = (path: string) => /(^|\/)(tests?|tools|scripts|docs|pkg|\.github|test-infrastructure)(\/|$)/.test(path);
        return Number(support(a.path)) - Number(support(b.path));
    }), [map]);
    const summaryEntries = overview.entryPoints.filter(entry => entry.filePath);
    const readme = overview.files.find(path => /^readme\.(md|rst|txt)$/i.test(path));
    const sourcePaths = useMemo(() => [...new Set([...(readme ? [readme] : []), ...(area ? sourceCandidates(area) : []),
        ...primaryAreas.slice(0, 12).flatMap(sourceCandidates)])], [readme, area, primaryAreas]);
    const guide = useRepositoryGuide(sourcePaths, readSource);
    const quoteFor = (files: string[]) => sourcePaths.filter(path => files.includes(path)).map(path => guide.quotes[path]).find(Boolean);
    const areas = primaryAreas.filter(row => !query || row.path.toLowerCase().includes(query)
        || row.nodes.some(node => node.name.toLowerCase().includes(query)) || quoteFor(row.files)?.text.toLowerCase().includes(query));
    const scopedNodes = area?.nodes.filter(node => node.file_path === file && !['File', 'Module'].includes(node.label)) ?? [];
    const connections = area ? areaConnections(area, direction) : [];
    const layers = area ? overview.layers.filter(layer => layer.group && (area.path === layer.group || area.path.endsWith(`/${layer.group}`))) : [];
    return <div className="repo-map" data-testid="repository-map">
        <div className="repo-map-intro">
            <div><p>{featureCopy.Repository_map_source_responsibilities_and_indexed_connections_982ab0e}</p></div>
            <details><summary>{featureCopy.Evidence_legend_5be87e6}</summary><p>{featureCopy.CALLS_indexed_invocations_IMPORTS_static_imports_USAGE_references_9349d64}</p></details>
        </div>
        {!map && graphNote && <p role="status" className="repo-map-note">{graphNote}</p>}
        {!map ? <p role="status">{featureCopy.Repository_graph_not_available_yet_The_summary_tabs_remain_availa_d211cf1}</p> : <>
            <details className="repo-map-snapshot"><summary>{map.fileCount.toLocaleString()}{featureCopy.indexed_files_f028f8f}{map.evidence.length.toLocaleString()}{featureCopy.retained_edges_snapshot_and_limits_ddcd09d}</summary>
                {graphNote && <p className="repo-map-note">{graphNote}</p>}
                <p className="repo-map-note">{featureCopy.Bounded_index_snapshot_missing_edges_do_not_prove_independence_d17428f}{map.unresolvedEdges > 0 && ` ${map.unresolvedEdges} edges have an endpoint outside these source areas.`}</p>
            </details>
            <nav className="repo-map-breadcrumb" aria-label={featureCopy.Repository_map_location_bb34ed8}>
                <button onClick={() => openArea()}>{featureCopy.Repository_3123868}</button>
                {area && <><span>›</span><button onClick={() => { setFile(undefined); setEvidence(undefined); }}>{area.path}</button></>}
                {file && <><span>›</span><span>{file.split('/').at(-1)}</span></>}
            </nav>
            {selection && <section className="repo-map-selection" ref={selectionRef}><div className="repo-map-selection-heading"><div><span className="repo-map-eyebrow">{featureCopy.Selected_symbol_4835fe6}{areaOf(selection.file_path ?? '')}</span><h2>{selection.name}</h2></div>
                <button className="atlas-arch-action" onClick={() => onNavigate(selection.file_path!, selection.start_line, selection.name)}>{featureCopy.Open_source_8f1a08a}{selection.file_path}:{selection.start_line ?? '?'}</button></div>
                {selection.documentation && <details><summary>{featureCopy.Indexed_documentation_cf79ea2}</summary><p>{selection.documentation}</p></details>}
                {selectionPanel}
            </section>}
            {!area ? <>
                <div className="repo-map-onboarding">
                <section className="repo-map-purpose"><h3>{featureCopy.What_this_repository_does_1953143}</h3>
                    {readme && guide.quotes[readme] ? <Quote quote={guide.quotes[readme]} onNavigate={onNavigate} />
                        : <p>{readSource && !guide.finished ? featureCopy.Reading_the_project_introduction_acffd0d : featureCopy.No_project_introduction_was_available_in_the_inspected_source_Exp_c21ebd4}</p>}
                    {readme && <button className="atlas-arch-action" onClick={() => onNavigate(readme)}>{featureCopy.Read_project_README_29690c0}</button>}
                </section>
                <section className="repo-map-start"><h3>{featureCopy.Where_to_start_98aa05f}</h3><p>{featureCopy.Index_entry_candidates_with_roles_inferred_from_file_type_and_loc_77a97f6}</p>
                    {entries.length ? <div className="repo-map-entry-grid">{entries.slice(0, 4).map(node => <button key={node.id} aria-pressed={node.id === entry?.id} onClick={() => { setEntryId(node.id); setEvidence(undefined); }}>
                        <span className="repo-map-eyebrow">{entryRole(node)}{featureCopy.entry_candidate_7812cee}</span><strong>{node.name}</strong><span>{node.file_path}:{node.start_line ?? '?'}</span></button>)}</div>
                        : summaryEntries.length ? <ul className="repo-map-nodes">{summaryEntries.slice(0, 4).map(entry => <li key={`${entry.filePath}:${entry.name}`}><button onClick={() => onNavigate(entry.filePath!, entry.line, entry.name)}><strong>{entry.name}</strong><span>{entry.filePath}</span></button></li>)}</ul>
                            : <p>{featureCopy.No_entry_point_was_identified_Start_with_a_connected_area_below_a_1441455}</p>}
                    {entry && <details className="repo-map-flow" open={entryId !== undefined}><summary>{featureCopy.Follow_static_call_paths_from_0f5ece4}{entry.name} · {routes.length}{featureCopy.paths_across_files_b2bde90}</summary><div className="repo-map-section-title"><h3>{featureCopy.Static_paths_from_f0c2121}{entry.name}</h3><button onClick={() => onNavigate(entry.file_path!, entry.start_line, entry.name)}>{featureCopy.Read_entry_source_d3699fe}</button></div>
                        <p>{featureCopy.Each_step_is_a_recorded_CALLS_edge_This_shows_possible_reachabili_a2be7bb}</p>
                        {routes.length ? routes.map((route, index) => <div key={index} className="repo-map-route"><div className="repo-map-route-steps">{[route.edges[0].source, ...route.edges.map(edge => edge.target)].map((node, step) => <span key={node.id}>
                            {step > 0 && <span aria-label={featureCopy.calls_51b6cb2} className="repo-map-route-arrow">→</span>}<button onClick={() => onNavigate(node.file_path!, node.start_line, node.name)}><small>{areaOf(node.file_path!)}</small><strong>{node.name}</strong></button></span>)}</div>
                            <button className="atlas-arch-action" onClick={() => setEvidence({ title: featureCopy.Static_call_path_from_0_2bf029a(entry.name), edges: route.edges })}>{featureCopy.Inspect_c881078}{route.edges.length}{featureCopy.call_edges_c566638}</button></div>)
                            : <p>{featureCopy.No_call_path_across_files_was_found_within_5_calls_and_500_symbol_d92ead0}</p>}
                        {evidence && <section ref={evidenceRef} tabIndex={-1} className="repo-map-focused-evidence"><div className="repo-map-section-title"><h3>{evidence.title}</h3><button onClick={() => setEvidence(undefined)}>{featureCopy.Close_evidence_c2fd160}</button></div><RelationshipEvidence edges={evidence.edges} onSelect={onSelect} onNavigate={onNavigate} /></section>}
                    </details>}
                </section>
                </div>
                <section><h3>{featureCopy.Components_and_responsibilities_ef7f6d8}</h3><p className="repo-map-note">{featureCopy.Boundaries_follow_source_locations_and_are_inferred_Descriptions__f51b79a}</p>
                    <div className="repo-map-areas">{areas.slice(0, showAll ? undefined : 12).map(row => { const quote = quoteFor(row.files); return <article key={row.path} className="repo-map-component">
                        <button className="repo-map-area" onClick={() => openArea(row.path)}><span className="repo-map-eyebrow">{featureCopy.Source_area_inferred_boundary_5d4bd04}</span><strong>{row.path}</strong>
                            <span>{row.files.length}{featureCopy.files_4ba9c34}{row.entryPoints.length}{featureCopy.entry_candidates_edbed25}{row.interfaces.length}{featureCopy.exported_symbols_2829303}</span>
                            <span>{featureCopy.Used_by_2f0359f}{new Set(row.incoming.map(edge => areaOf(edge.source.file_path!))).size}{featureCopy.areas_Depends_on_2e8bfc9}{new Set(row.outgoing.map(edge => areaOf(edge.target.file_path!))).size}{featureCopy.areas_afd5d9d}</span></button>
                        {quote ? <Quote quote={quote} onNavigate={onNavigate} /> : <p className="repo-map-no-description">{readSource && !guide.finished ? featureCopy.Checking_source_documentation_c9a145c : featureCopy.No_responsibility_description_in_the_inspected_file_headers_Inspe_ba3fa70}</p>}
                        <button className="repo-map-component-action" onClick={() => openArea(row.path)}>{featureCopy.Explore_connections_6e02ce1}</button>
                    </article>; })}</div>
                    {!areas.length && <p>{featureCopy.No_source_areas_match_Clear_the_filter_or_inspect_index_diagnosti_d02480b}</p>}
                    {areas.length > 12 && !showAll && <button className="atlas-arch-action" onClick={() => setShowAll(true)}>{featureCopy.All_255db94}{areas.length}{featureCopy.areas_including_tests_and_tools_ecdddaf}</button>}
                </section>
            </> : <>
                <section className="repo-map-area-heading"><h2>{area.path}</h2><p>{area.files.length}{featureCopy.files_4ba9c34}{area.nodes.length}{featureCopy.indexed_nodes_22ac2f7}</p>
                    {quoteFor(area.files) && <Quote quote={quoteFor(area.files)!} onNavigate={onNavigate} />}
                    {layers.map(layer => <p key={layer.layer}>{featureCopy.Inferred_role_486f4bf}{layer.layer}. {layer.reason || featureCopy.No_further_reason_supplied_by_the_index_59b3ac1}</p>)}
                    {!file && <><h3>{featureCopy.Entry_points_and_interfaces_93af702}</h3><Nodes nodes={[...area.entryPoints, ...area.interfaces.filter(node => !area.entryPoints.includes(node))].slice(0, 8)} onSelect={onSelect} onNavigate={onNavigate} />
                        {!area.entryPoints.length && !area.interfaces.length && <p>{featureCopy.No_entry_or_export_classification_was_supplied_Inspect_a_file_bel_27c0b71}</p>}</>}
                </section>
                {evidence && <section ref={evidenceRef} tabIndex={-1} key={evidence.title} className="repo-map-focused-evidence"><div className="repo-map-section-title"><h3>{evidence.title}</h3><button onClick={() => setEvidence(undefined)}>{featureCopy.Close_evidence_c2fd160}</button></div><RelationshipEvidence edges={evidence.edges} onSelect={onSelect} onNavigate={onNavigate} /></section>}
                {!file ? <div className="repo-map-columns"><section><h3>{featureCopy.How_this_area_connects_a1bb8ce}</h3>
                    <div className="repo-map-directions"><button aria-pressed={direction === 'outgoing'} onClick={() => { setDirection('outgoing'); setEvidence(undefined); }}>{featureCopy.Depends_on_86d844d}</button><button aria-pressed={direction === 'incoming'} onClick={() => { setDirection('incoming'); setEvidence(undefined); }}>{featureCopy.Used_by_ec7ffa5}</button></div>
                    <p className="repo-map-note">{featureCopy.Cross_area_edges_grouped_by_relation_kind_Counts_are_retained_gra_0af8cbf}</p>
                    <ul className="repo-map-connections">{connections.map(row => <li key={`${row.area}:${row.type}`}>
                        <button onClick={() => openArea(row.area)}>{row.area}</button><span>{row.type}</span><button onClick={() => setEvidence({ title: `${area.path} ${direction === 'incoming' ? '←' : '→'} ${row.area}`, edges: row.evidence })}>{row.evidence.length}{featureCopy.edges_inspect_c6d88be}</button>
                    </li>)}</ul>{!connections.length && <p>{featureCopy.No_cross_area_edges_found_in_this_snapshot_This_is_not_evidence_o_4982bfe}</p>}
                </section><section><h3>{featureCopy.Files_6ce6c51}</h3><div className="repo-map-files">{area.files.map(path => <button key={path} onClick={() => { setFile(path); setEvidence(undefined); }}>{path}</button>)}</div></section></div>
                    : <section><h3>{featureCopy.Symbols_in_a6c9ca2}{file}</h3><button className="atlas-arch-action" onClick={() => onNavigate(file)}>{featureCopy.Read_file_a3d7629}</button><Nodes nodes={scopedNodes} onSelect={onSelect} onNavigate={onNavigate} />
                        <button className="atlas-arch-action" onClick={() => setEvidence({ title: file, edges: map.evidence.filter(edge => edge.source.file_path === file || edge.target.file_path === file) })}>{featureCopy.Inspect_file_relationships_e9b686b}</button>
                    </section>}
            </>}
        </>}
    </div>;
}
