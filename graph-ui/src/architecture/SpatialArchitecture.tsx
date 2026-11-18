import { presentationLabel } from '../i18n/presentation';
import { featureCopy } from '../i18n/features/architecture';
import { Component, Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PlaceChange, SpatialPlace } from './architecture-history';
import { useLiftedPlace, useOnIdentityChange } from './lifted-place';
import type { ArchitectureOverviewDto } from '../core/intelligence-provider';
import type { GraphData, GraphNode } from '../galaxy/types';
import { graphNodeEvidence, useSelectionEvidence, type SelectionEvidenceListener } from '../galaxy/selection-evidence';
import { ArchitectureScene } from './ArchitectureScene';
import { buildSemanticGraph, semanticEntryPoints, type SemanticNode, type SemanticView } from './semantic-graph';
import { loadRouteGraph, type RouteGraphSnapshot } from './route-graph-source';
import { areaLevels } from './repository-map';
import { architectureText as text } from './strings';
import { collectSourceMetrics, measureSourceNode } from './source-metrics';
import SourceMetricsDetails from './SourceMetricsDetails';
import type { CoverageIndex } from '../app/tree-model';
import { buildHotspotGraph, collectHotspots, hotspotsForNode, hotspotSignals, hotspotIdentity } from './hotspot-map';
import { hotspotAreas } from './hotspot-areas';
import { useViewPreferences } from '../settings/view-preferences';
import { RefreshControl, useRefreshFeedback } from '../ui/refresh/refresh-feedback';
import './spatial-architecture.css';

interface Props {
    project: string; generation?: string; graph: GraphData; overview: ArchitectureOverviewDto;
    view: SemanticView; filter: string; active: boolean; graphNote?: string;
    onSelect?: (node: GraphNode) => void; onClearSelection?: () => void; selectionPanel?: ReactNode;
    onSelectionEvidence?: SelectionEvidenceListener;
    onView: (view: SemanticView) => void;
    /** Routes view: narrows the endpoints, for example to the routes of one group. */
    onFilter?: (filter: string) => void;
    onNavigate: (path: string, line?: number, name?: string) => void;
    coverage?: CoverageIndex;
    /** The opened area or file, the hotspot area and Plan or 3D, lifted to the workspace for Back and Forward (K27). */
    place?: SpatialPlace;
    onPlace?: PlaceChange<SpatialPlace>;
    navigation?: ReactNode;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() {
        return this.state.failed ? <div className="spatial-unavailable" role="status">{featureCopy.message_3D_rendering_is_unavailable_Explore_the_same_nodes_and_relationsh_19cad2b}</div> : this.props.children;
    }
}

const viewNotes: Record<SemanticView, string> = {
    overview: featureCopy.Find_the_main_parts_Select_an_area_to_inspect_its_connections_the_1db02bb,
    dependencies: featureCopy.Follow_directed_dependencies_Select_a_connection_to_see_the_index_69b4575,
    entryPoints: featureCopy.Choose_a_starting_point_and_follow_its_static_call_graph_Depth_me_6024ac9,
    routes: featureCopy.Explore_HTTP_and_asynchronous_connections_to_indexed_endpoints_Re_d0d8cf4,
    hotspots: featureCopy.Inspect_ranked_symbols_and_their_connections_Gravity_wells_grow_w_86fb4d2,
};
const relationKinds = ['CALLS', 'IMPORTS', 'USAGE', 'INHERITS', 'IMPLEMENTS', 'DATA_FLOWS'];

export default function SpatialArchitecture({ project, generation, graph, overview, view, filter, active, graphNote, onSelect, onClearSelection, onSelectionEvidence, selectionPanel, onNavigate, onView, onFilter, coverage, place: liftedPlace, onPlace, navigation }: Props) {
    const [place, changePlace] = useLiftedPlace<SpatialPlace>(liftedPlace, onPlace, () => ({ planar: false }));
    const { planar } = place;
    // The place keeps the opened area or file and the hotspot area for Back and Forward (K27), but only the view
    // that opened them shows them: Entry points and Endpoints draw the same map without an area, and neither the
    // scene nor the selection evidence for the chat may name one there.
    const opensScope = view === 'overview' || view === 'dependencies';
    const areaPath = opensScope ? place.areaPath : undefined;
    const filePath = opensScope ? place.filePath : undefined;
    const hotspotArea = view === 'hotspots' ? place.hotspotArea : undefined;
    const [entryChoice, setEntryChoice] = useState<{ node: GraphNode; generation?: string }>();
    const [depth, setDepth] = useState(2);
    const [relations, setRelations] = useState<string[]>([]);
    const { preferences, setPreferences } = useViewPreferences(project);
    const { brickHeight: heightMetric, brickColor: colorMetric, fileVisibility, hotspotGravity: showHotspots } = preferences;
    const [inventoryLimit, setInventoryLimit] = useState(24);
    const [resetKey, setResetKey] = useState(0);
    const [selection, setSelection] = useState<{ scope: string; node?: string; edge?: string }>();
    const [routeReading, setRouteReading] = useState<{ key: string; base?: string; snapshot?: RouteGraphSnapshot; error?: string; refreshing?: boolean }>();
    const [routeRevision, setRouteRevision] = useState(0);
    const [memberLimit, setMemberLimit] = useState(5);
    const [includeTestRoutes, setIncludeTestRoutes] = useState(false);
    // A reindex clears the hotspot area; a view that mounts again keeps the place it is handed.
    useOnIdentityChange(`${project}:${generation ?? ''}`, () => { if (place.hotspotArea) changePlace({ hotspotArea: undefined }, true); });
    const routeBase = `${project}:${generation ?? ''}`;
    const routeKey = `${routeBase}:${routeRevision}`;
    useEffect(() => {
        if (view !== 'routes' || !active) return;
        const controller = new AbortController();
        // A refresh of the same index keeps the connections on screen until the new ones arrive (hand test 2026-10-04, A3).
        const kept = (current?: typeof routeReading) => current?.base === routeBase && current.snapshot ? { snapshot: current.snapshot } : {};
        setRouteReading(current => ({ key: routeKey, base: routeBase, ...kept(current), refreshing: true }));
        void loadRouteGraph(project, { signal: controller.signal }).then(snapshot => {
            if (!controller.signal.aborted) setRouteReading({ key: routeKey, base: routeBase, snapshot });
        }).catch((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            if (!controller.signal.aborted) setRouteReading(current => ({ key: routeKey, base: routeBase, ...kept(current), error: message }));
        });
        return () => controller.abort();
    }, [project, routeKey, routeBase, view, active]);
    const routeRefresh = useRefreshFeedback({ key: routeKey, settled: routeReading?.key === routeKey && !routeReading.refreshing,
        value: routeReading?.key === routeKey ? routeReading.snapshot : undefined, error: routeReading?.key === routeKey ? routeReading.error : undefined });
    const entries = useMemo(() => semanticEntryPoints(graph, overview.entryPoints.flatMap(entry => entry.qualifiedName ? [entry.qualifiedName] : [])), [graph, overview.entryPoints]);
    const currentEntry = entries.find(node => entryChoice?.node.qualified_name
        ? node.qualified_name === entryChoice.node.qualified_name && node.file_path === entryChoice.node.file_path
        : entryChoice?.generation === generation && node.id === entryChoice?.node.id && node.file_path === entryChoice.node.file_path) ?? entries[0];
    // A refresh of the same index shows the earlier connections until its own arrive.
    const routeSnapshot = routeReading?.base === routeBase ? routeReading.snapshot : undefined;
    // Which routes are test code is decided by their registration, handler and caller evidence.
    const routesChecking = view === 'routes' && !routeSnapshot && !(routeReading?.key === routeKey && routeReading.error);
    const knownFiles = useMemo(() => [...new Set([...overview.files, ...[...(coverage?.records.values() ?? [])].filter(record => record.kind === 'file').map(record => record.path)])], [overview.files, coverage]);
    const catalog = useMemo(() => collectSourceMetrics(graph, knownFiles), [graph, knownFiles]);
    const hotspotCatalog = useMemo(() => collectHotspots(overview.hotspots, graph), [overview.hotspots, graph]);
    const visibleFiles = useMemo(() => fileVisibility === 'all' || !['overview', 'dependencies'].includes(view) ? undefined : new Set([...catalog.files.values()]
        .filter(file => fileVisibility === 'connected' ? file.connection === 'connected' : file.connection !== 'connected').map(file => file.path)), [catalog, fileVisibility, view]);
    const inventoryFiles = useMemo(() => [...catalog.files.values()].filter(file => !visibleFiles || visibleFiles.has(file.path))
        .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0), [catalog, visibleFiles]);
    const areas = useMemo(() => hotspotAreas(hotspotCatalog, graph), [hotspotCatalog, graph]);
    const focusedHotspots = useMemo(() => hotspotArea ? collectHotspots(hotspotCatalog.byArea.get(hotspotArea)?.findings ?? [], graph) : hotspotCatalog, [hotspotArea, hotspotCatalog, graph]);
    const model = useMemo(() => view === 'hotspots' ? buildHotspotGraph(graph, focusedHotspots, filter) : buildSemanticGraph(graph, {
        view, areaPath, filePath, entryId: currentEntry?.id, entryQualifiedNames: overview.entryPoints.flatMap(entry => entry.qualifiedName ? [entry.qualifiedName] : []), depth, filter, relations,
        routes: overview.routes, routeSnapshot, knownFiles: [...catalog.files.keys()], visibleFiles, groupRoutes: true, hideTestRoutes: !includeTestRoutes,
    }), [graph, view, areaPath, filePath, currentEntry?.id, depth, filter, relations, overview.routes, overview.entryPoints, routeSnapshot, catalog, visibleFiles, focusedHotspots, includeTestRoutes]);
    const hasSourceBricks = model.nodes.some(node => node.kind === 'area' || node.kind === 'file');
    const scope = `${project}:${generation ?? ''}:${model.scopeKey}:${view}:${filter}:${hotspotArea ?? ''}`;
    const selectedNode = selection?.scope === scope ? model.nodes.find(node => node.id === selection.node) : undefined;
    const selectedEdge = selection?.scope === scope ? model.edges.find(edge => edge.id === selection.edge) : undefined;
    const selectedMeasure = selectedNode ? measureSourceNode(selectedNode, catalog) : undefined;
    // Inside an opened area or file the inspector speaks about that scope, not the repository.
    const openedScope = filePath || areaPath ? filePath
        ? { eyebrow: text.openedFile, title: filePath.split('/').at(-1) ?? filePath, path: filePath, measure: measureSourceNode({ id: `file:${filePath}`, kind: 'file', label: filePath, detail: '', position: [0, 0, 0], count: 0, members: [], filePath }, catalog) }
        : { eyebrow: text.openedArea, title: areaPath!, path: areaPath!, measure: catalog.areas.get(areaPath!) } : undefined;
    const selectedHotspots = selectedNode ? hotspotsForNode(selectedNode, hotspotCatalog) : undefined;
    const nodesById = useMemo(() => new Map(model.nodes.map(node => [node.id, node])), [model.nodes]);
    const edges = selectedNode ? model.edges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id) : model.edges;
    const nodeEvidence = (node: SemanticNode) => ({ id: node.id, kind: node.kind, label: node.label, detail: node.detail,
        filePath: node.filePath, areaPath: node.areaPath, count: node.count, memberCount: node.members.length,
        members: node.members.slice(0, 24).map(graphNodeEvidence), omittedMembers: Math.max(0, node.members.length - 24) });
    const edgeEvidence = (edge: typeof model.edges[number]) => ({ id: edge.id, source: nodesById.get(edge.source)?.label ?? edge.source,
        target: nodesById.get(edge.target)?.label ?? edge.target, type: edge.type, count: edge.count,
        evidence: edge.evidence.slice(0, 24).map(item => ({ ...item, source: graphNodeEvidence(item.source), target: graphNodeEvidence(item.target) })),
        omittedEvidence: Math.max(0, edge.evidence.length - 24) });
    // Inside an opened area, file or hotspot area with nothing selected, the chat explains that scope (K7):
    // its measure, the parts shown, its hotspot findings and the connections between the parts.
    const openedEvidence = () => {
        const scopeNode = (kind: 'area' | 'file', path: string): SemanticNode => ({ id: `${kind}:${path}`, kind, label: path, detail: '', position: [0, 0, 0], count: 0, members: [],
            ...kind === 'area' ? { areaPath: path } : { filePath: path } });
        // Largest first, areas before files: the first parts named are the ones that make up the area.
        const parts = model.nodes.filter(node => (node.kind === 'area' || node.kind === 'file') && !node.external)
            .map(node => ({ node, measure: measureSourceNode(node, catalog) }))
            .sort((a, b) => a.node.kind !== b.node.kind ? a.node.kind === 'area' ? -1 : 1 : (b.measure?.lines ?? -1) - (a.measure?.lines ?? -1) || (a.node.label < b.node.label ? -1 : 1));
        const links = [...model.edges].sort((a, b) => b.count - a.count);
        const outside = model.nodes.filter(node => node.external);
        return {
            selected: { areaPath, filePath, hotspotArea, measurement: openedScope?.measure,
                hotspots: hotspotArea ? hotspotCatalog.byArea.get(hotspotArea) : filePath ? hotspotsForNode(scopeNode('file', filePath), hotspotCatalog) : areaPath ? hotspotsForNode(scopeNode('area', areaPath), hotspotCatalog) : undefined,
                parts: hotspotArea ? [] : parts.slice(0, 24).map(({ node, measure }) => ({ kind: node.kind, label: node.label, files: measure?.files, lines: measure?.lines })),
                partCount: hotspotArea ? 0 : parts.length, outside: hotspotArea ? [] : outside.slice(0, 24).map(node => node.label), outsideCount: hotspotArea ? 0 : outside.length },
            relationships: hotspotArea ? undefined : { count: links.length, items: links.slice(0, 24).map(edge => ({ source: nodesById.get(edge.source)?.label ?? edge.source,
                target: nodesById.get(edge.target)?.label ?? edge.target, type: edge.type, count: edge.count })), omitted: Math.max(0, links.length - 24) },
        };
    };
    const opened = !selectedNode && !selectedEdge && (areaPath || filePath || hotspotArea) ? openedEvidence() : undefined;
    useSelectionEvidence(onSelectionEvidence, selectedNode || selectedEdge || areaPath || filePath || hotspotArea ? {
        project, generation, view: `architecture-${view}`, source: 'indexed repository graph and architecture summary',
        label: selectedNode?.label ?? (selectedEdge ? `${nodesById.get(selectedEdge.source)?.label} → ${nodesById.get(selectedEdge.target)?.label}` : filePath ?? areaPath ?? hotspotArea ?? model.title),
        selected: selectedEdge ? edgeEvidence(selectedEdge) : selectedNode ? { ...nodeEvidence(selectedNode), measurement: selectedMeasure, hotspots: selectedHotspots } : opened?.selected,
        relationships: selectedNode ? { count: edges.length, items: edges.slice(0, 24).map(edgeEvidence), omitted: Math.max(0, edges.length - 24) } : opened?.relationships,
        scope: { view, areaPath, filePath, hotspotArea, visibleNodes: model.nodes.length, visibleEdges: model.edges.length },
        limitations: { omittedNodes: model.omittedNodes, omittedEdges: model.omittedEdges, warnings: model.warnings,
            graphNote, interpretation: 'Source areas group source locations. Hotspots measure static references, not runtime frequency. Relationships do not prove execution.' },
    } : undefined, active);
    const selectNode = (id: string) => {
        setSelection({ scope, node: id }); setMemberLimit(5);
        const node = nodesById.get(id);
        if (node?.graphNode) onSelect?.(node.graphNode);
    };
    const openGroup = (node: SemanticNode) => {
        if (node.kind === 'area') changePlace({ areaPath: node.areaPath, filePath: undefined });
        else if (node.kind === 'file') changePlace({ filePath: node.filePath });
        if (view === 'routes' || view === 'hotspots') onView('overview');
        setSelection(undefined);
    };
    const clearScope = () => { changePlace({ hotspotArea: undefined, areaPath: undefined, filePath: undefined }); setSelection(undefined); setResetKey(value => value + 1); onClearSelection?.(); };
    const openSource = (node: GraphNode) => node.file_path && onNavigate(node.file_path, node.start_line, node.name);
    const inspectMember = (node: GraphNode) => {
        const current = graph.nodes.find(candidate => candidate.qualified_name && candidate.qualified_name === node.qualified_name && candidate.file_path === node.file_path);
        if (current) onSelect?.(current);
        openSource(node);
    };
    return <section className="spatial-architecture" data-testid="spatial-architecture" aria-label={featureCopy.Spatial_architecture_explorer_0ff20ac}>
        <div className="spatial-heading"><div><span className="spatial-eyebrow">{featureCopy.Repository_atlas_f4b1dbe}{view === 'entryPoints' ? featureCopy.entry_points_797c6fb : presentationLabel(view)}</span><h2>{model.title}</h2><p>{viewNotes[view]}</p></div>
            <div className="spatial-camera-controls" role="group" aria-label={featureCopy.Map_camera_c70f68c}>
                <button aria-pressed={!planar} onClick={() => changePlace({ planar: false })}>3D</button><button aria-pressed={planar} onClick={() => changePlace({ planar: true })}>{featureCopy.Plan_ae2f98a}</button>
                <button onClick={() => setResetKey(value => value + 1)}>{text.fitMap}</button>
            </div>
        </div>
        <div className="spatial-controls">
            <div className="atlas-arch-context">{navigation}
            {(view === 'overview' || view === 'dependencies') && <nav aria-label={featureCopy.Architecture_location_d70c2a1}><button onClick={clearScope}>{project}</button>
                {areaPath && areaLevels(areaPath).map((level, index, levels) => <Fragment key={level}><span>/</span><button onClick={() => { changePlace({ areaPath: level, filePath: undefined }); setSelection(undefined); }}>{index ? level.slice(levels[index - 1].length + 1) : level}</button></Fragment>)}{filePath && <><span>/</span><span>{filePath.split('/').at(-1)}</span></>}
            </nav>}
            {view === 'hotspots' && (hotspotArea ? <nav aria-label={featureCopy.Hotspot_area_e37c054}><button onClick={clearScope}>{featureCopy.All_hotspots_8379bc4}</button><span>/ {hotspotArea}</span></nav> : <span>{featureCopy.All_hotspots_8379bc4}</span>)}
            {view === 'routes' && <span title={filter || undefined}>{filter || featureCopy.All_endpoints_544af2c}</span>}
            </div>
            {['overview', 'dependencies', 'entryPoints'].includes(view) && <div className="spatial-projection-modes" role="group" aria-label={featureCopy.Overview_mode_d5e58cf}><button aria-pressed={view !== 'entryPoints'} onClick={() => onView('overview')}>{featureCopy.Structure_9482c5d}</button><button aria-pressed={view === 'entryPoints'} onClick={() => onView('entryPoints')}>{featureCopy.Entry_points_18f7352}</button></div>}
            {view === 'entryPoints' && <><label>{featureCopy.Start_fab43af}<select aria-label={featureCopy.Entry_point_82c2f34} value={currentEntry?.id ?? ''} onChange={event => { const node = entries.find(node => node.id === Number(event.target.value)); setEntryChoice(node ? { node, generation } : undefined); setSelection(undefined); }}>
                {!entries.length && <option value="">{featureCopy.No_indexed_entry_points_460a41e}</option>}{entries.map(node => <option key={node.id} value={node.id}>{node.name} · {node.file_path}</option>)}
            </select></label><label>{featureCopy.Call_depth_a9f78f1}<select aria-label={featureCopy.Call_depth_a8a73a8} value={depth} onChange={event => setDepth(Number(event.target.value))}>{[1, 2, 3, 4].map(value => <option key={value}>{value}</option>)}</select></label></>}
            {view === 'routes' && <RefreshControl labels={text.refreshFeedback.routes} feedback={routeRefresh.feedback}
                onRefresh={() => { routeRefresh.begin(); setRouteRevision(value => value + 1); }} />}
            {view === 'routes' && <label className="spatial-gravity-toggle"><input type="checkbox" checked={includeTestRoutes} onChange={event => { setIncludeTestRoutes(event.target.checked); setSelection(undefined); }} />{routesChecking ? text.includeTestRoutesChecking : text.includeTestRoutes(model.hiddenRoutes ?? 0)}</label>}
            {filePath && (view === 'overview' || view === 'dependencies') && <button onClick={() => onNavigate(filePath, 1)}>{featureCopy.Read_this_file_0a53331}</button>}
            {(view === 'overview' || view === 'dependencies') && <div className="spatial-relations" role="group" aria-label={featureCopy.Relationship_types_333d5ea}>
                <button aria-pressed={!relations.length} onClick={() => setRelations([])}>{featureCopy.All_6a72085}</button>{relationKinds.map(type => <button key={type} aria-pressed={relations.includes(type)} onClick={() => setRelations(current => current.includes(type) ? current.filter(item => item !== type) : [...current, type])}>{presentationLabel(type.toLowerCase()).replaceAll('_', ' ')}</button>)}
            </div>}
        </div>
        <div className="spatial-encoding-controls" aria-label={featureCopy.Map_appearance_986ff56}>
            {hasSourceBricks && <label>{featureCopy.Height_ecb96c9}<select aria-label={featureCopy.Brick_height_ed17069} value={heightMetric} onChange={event => setPreferences({ brickHeight: event.target.value as 'lines' | 'uniform' })}><option value="lines">{featureCopy.Source_size_b608b77}</option><option value="uniform">{featureCopy.Uniform_e96b0da}</option></select></label>}
            <label>{featureCopy.Color_4aacd95}<select aria-label={featureCopy.Brick_color_d59a714} value={colorMetric} onChange={event => setPreferences({ brickColor: event.target.value as 'language' | 'kind' })}><option value="language">{featureCopy.Language_89b86ab}</option><option value="kind">{featureCopy.Node_kind_5e4921f}</option></select></label>
            <label className="spatial-gravity-toggle"><input aria-label={featureCopy.Hotspot_gravity_ada18fd} type="checkbox" checked={showHotspots} onChange={event => setPreferences({ hotspotGravity: event.target.checked })} />{featureCopy.Hotspot_gravity_ada18fd}</label>
            {(view === 'overview' || view === 'dependencies') && <label>{featureCopy.Files_6360745}<select aria-label={featureCopy.File_visibility_735510e} value={fileVisibility} onChange={event => { setPreferences({ fileVisibility: event.target.value as typeof fileVisibility }); setSelection(undefined); setInventoryLimit(24); }}><option value="all">{featureCopy.All_known_files_3da86c6}</option><option value="connected">{featureCopy.With_connections_04ac4a2}</option><option value="unconnected">{featureCopy.Without_known_connections_257e91b}</option></select></label>}
            {colorMetric === 'language' && <div className="spatial-language-legend" aria-label={featureCopy.Language_colors_f08d6e9}>{catalog.total.languages.slice(0, 5).map(language => <span key={language.name}><i style={{ background: language.color }} />{language.name}</span>)}{catalog.total.languages.length > 5 && <span>+{catalog.total.languages.length - 5}{featureCopy.types_6f6d58a}</span>}</div>}
        </div>
        <div className="spatial-map-layout">
            <div className="spatial-map"><SceneBoundary key={project}>
                {model.nodes.length ? <ArchitectureScene model={model} selectedId={selectedNode?.id} selectedEdgeId={selectedEdge?.id} onSelect={selectNode}
                    onSelectEdge={id => { setSelection({ scope, edge: id }); setMemberLimit(5); }} onOpen={id => { const node = nodesById.get(id); if (node?.routePrefix) onFilter?.(node.routePrefix); else if (node && (node.kind === 'area' || node.kind === 'file')) openGroup(node); }} onClearSelection={clearScope} active={active} planar={planar} resetKey={resetKey} catalog={catalog} heightMetric={heightMetric} colorMetric={colorMetric} hotspots={hotspotCatalog} showHotspots={showHotspots}
                    adaptiveLabels={view === 'overview' || view === 'dependencies' || view === 'routes'} />
                    : <div className="spatial-unavailable">{filter ? featureCopy.No_matching_graph_evidence_Try_a_broader_filter_83147ca : view === 'hotspots' ? featureCopy.No_ranked_hotspot_measurements_are_available_in_this_snapshot_f3912b2 : view === 'entryPoints' ? featureCopy.No_indexed_entry_points_in_this_snapshot_6535a16 : view === 'routes' ? featureCopy.No_endpoint_evidence_is_available_in_this_snapshot_c6c2ad7 : filePath ? featureCopy.No_indexed_symbols_in_this_file_Use_Read_this_file_to_inspect_its_b493665 : featureCopy.No_source_nodes_are_available_in_this_repository_snapshot_413785b}</div>}
            </SceneBoundary><div className="spatial-map-caption"><span title={model.positionMeaning}>{view === 'hotspots' ? featureCopy.Gravity_incoming_references_54b92fd : view === 'entryPoints' ? featureCopy.Static_call_paths_79f5354 : featureCopy.Source_folders_and_indexed_relationships_bde5435}</span><span>{featureCopy.Drag_to_orbit_scroll_to_zoom_select_to_inspect_aafb630}</span></div></div>
            <aside className="spatial-inspector" aria-label={featureCopy.Architecture_inspector_86e5cf4}>
                {selectedEdge ? <><span className="spatial-eyebrow">{featureCopy.Indexed_connection_06dd248}</span><h3>{nodesById.get(selectedEdge.source)?.label} <span>→</span> {nodesById.get(selectedEdge.target)?.label}</h3>
                    <p>{selectedEdge.type} · {selectedEdge.count}{featureCopy.retained_relationships_69fb138}</p>
                    <div className="spatial-evidence">{selectedEdge.evidence.slice(0, memberLimit).map((evidence, index) => <article key={`${evidence.id}:${index}`}>
                        <button disabled={!evidence.source.file_path} onClick={() => openSource(evidence.source)}>{evidence.source.name}</button><span>→ {evidence.type}</span>
                        <button disabled={!evidence.target.file_path} onClick={() => openSource(evidence.target)}>{evidence.target.name}</button>
                        {evidence.routePath && <code>{evidence.routePath}</code>}<small>{evidence.source.file_path}{evidence.source.start_line ? `:${evidence.source.start_line}` : ''}</small>
                        <small>{evidence.id === undefined ? featureCopy.Index_relationship_fd826be : featureCopy.Edge_0_65f541f(evidence.id)}{evidence.strategy ? ` · ${evidence.strategy}` : ''}{evidence.via ? ` · ${evidence.via}` : ''}</small>
                    </article>)}</div>{selectedEdge.evidence.length > memberLimit && <button onClick={() => setMemberLimit(value => value + 16)}>{featureCopy.More_source_evidence_5ba9bbb}</button>}
                </> : selectedNode ? <><span className="spatial-eyebrow">{selectedNode.kind === 'area' ? featureCopy.Inferred_source_area_3b312df : selectedNode.kind}</span><h3>{selectedNode.label}</h3><p>{selectedNode.detail}</p>
                    {selectedMeasure && <details className="spatial-selection-details"><summary>{selectedMeasure.files.toLocaleString()}{featureCopy.files_4ba9c34}{selectedMeasure.lines?.toLocaleString() ?? featureCopy.Unknown_bc7819b}{featureCopy.indexed_lines_4f754d0}</summary><SourceMetricsDetails measure={selectedMeasure} catalog={catalog} /></details>}
                    {selectedHotspots && <details className="spatial-hotspot-details"><summary>{selectedHotspots.findings.length}{featureCopy.hotspot_findings_peak_fan_in_f46055e}{selectedHotspots.maxFanIn ?? featureCopy.unknown_50d8b4a}</summary><p>{featureCopy.Static_incoming_references_not_runtime_frequency_61cdfe0}</p>{selectedHotspots.findings.slice(0, memberLimit).map(finding => <article key={hotspotIdentity(finding)}><button disabled={!finding.filePath} onClick={() => onNavigate(finding.filePath!, finding.line, finding.name)}>{finding.name}</button><div>{hotspotSignals(finding).map(signal => <span key={signal}>{signal}</span>)}</div></article>)}{selectedHotspots.findings.length > memberLimit && <button onClick={() => setMemberLimit(value => value + 16)}>{featureCopy.More_hotspot_findings_0c0ebed}</button>}</details>}
                    {(selectedNode.kind === 'area' || selectedNode.kind === 'file') && <button className="spatial-primary" onClick={() => openGroup(selectedNode)}>{featureCopy.Open_79d37e2}{selectedNode.kind === 'area' ? featureCopy.area_699e8ae : featureCopy.file_symbols_6d788b6} →</button>}
                    {selectedNode.routePrefix && onFilter && <button className="spatial-primary" onClick={() => onFilter(selectedNode.routePrefix!)}>{text.showRoutes(selectedNode.count)}</button>}
                    {selectedNode.filePath && <button onClick={() => onNavigate(selectedNode.filePath!, selectedNode.line, selectedNode.label)}>{featureCopy.Open_source_6cc3364}</button>}
                    {!!selectedNode.members.length && <details className="spatial-selection-details"><summary>{featureCopy.Source_members_4944ac6}{selectedNode.members.length}</summary><div className="spatial-members">{selectedNode.members.slice(0, memberLimit).map(node => <button key={`${node.qualified_name}:${node.id}`} onClick={() => inspectMember(node)}>{node.name}<small>{node.file_path}{node.start_line ? `:${node.start_line}` : ''}</small></button>)}</div>
                        {selectedNode.members.length > memberLimit && <button onClick={() => setMemberLimit(value => value + 16)}>{featureCopy.More_members_4339cae}</button>}</details>}
                    {selectedNode.graphNode && selectionPanel}
                </> : openedScope ? <><span className="spatial-eyebrow">{openedScope.eyebrow}</span><h3 title={openedScope.path}>{openedScope.title}</h3>
                    {openedScope.measure && <details className="spatial-selection-details"><summary>{text.scopeMeasure(openedScope.measure.files, openedScope.measure.lines)}</summary><SourceMetricsDetails measure={openedScope.measure} catalog={catalog} /></details>}
                    <p>{text.openedScopeHint}</p>
                </> : <><span className="spatial-eyebrow">{view === 'hotspots' ? featureCopy.Review_areas_4218b99 : featureCopy.Repository_3123868}</span><h3>{view === 'hotspots' ? featureCopy.message_0_hotspot_findings_cadf59b(hotspotCatalog.findings.length) : featureCopy.message_0_files_9dc9940(catalog.files.size.toLocaleString())}</h3>
                    {view === 'hotspots' ? <><p>{featureCopy.Grouped_by_source_area_Outside_dependents_are_distinct_files_with_b6b67c2}</p><div className="spatial-area-summary" aria-label={featureCopy.Hotspots_by_source_area_e389c32}>{areas.slice(0, 5).map(area => <button key={area.path} aria-pressed={hotspotArea === area.path} onClick={() => { changePlace({ hotspotArea: area.path }); setSelection(undefined); setResetKey(value => value + 1); }}><strong>{area.path}</strong><small>{area.findings}{featureCopy.findings_d5a09a8}{area.files}{featureCopy.files_052118b}</small><small>{area.dependentFiles}{featureCopy.outside_dependent_files_29c1c28}</small></button>)}</div>{areas.length > 5 && <details className="spatial-selection-details"><summary>{areas.length - 5}{featureCopy.more_areas_489a92c}</summary><div className="spatial-area-summary">{areas.slice(5).map(area => <button key={area.path} onClick={() => { changePlace({ hotspotArea: area.path }); setSelection(undefined); setResetKey(value => value + 1); }}><strong>{area.path}</strong><small>{area.findings}{featureCopy.findings_d5a09a8}{area.dependentFiles}{featureCopy.outside_dependent_files_29c1c28}</small></button>)}</div></details>}</>
                        : <p>{featureCopy.Select_a_part_or_connection_to_inspect_it_Open_an_area_to_explore_4b2b710}</p>}
                </>}
                <details className="spatial-node-list"><summary>{featureCopy.Browse_map_056b925}{model.nodes.length}{featureCopy.parts_953d329}</summary>{model.nodes.map(node => <button key={node.id} aria-pressed={selectedNode?.id === node.id} onClick={() => selectNode(node.id)}><span>{node.label}</span><small>{node.kind} · {node.count}</small></button>)}</details>
            </aside>
        </div>
        <div className="spatial-bottom"><span>{model.nodes.length}{featureCopy.parts_0ba17b5}{model.edges.length}{featureCopy.connections_be1c3da}</span><span>{model.omittedNodes || model.omittedEdges ? featureCopy.Partial_map_open_an_area_to_see_more_bb75b05 : featureCopy.Select_to_inspect_double_click_to_explore_9417ca2}</span></div>
        {view === 'routes' && !routeSnapshot && <p role="status" className="spatial-notice">{routeReading?.key === routeKey && routeReading.error ? featureCopy.Connections_unavailable_0_b22276c(routeReading.error) : featureCopy.Reading_indexed_endpoint_connections_0eca49c}</p>}
        <details className="spatial-map-details"><summary>{featureCopy.Browse_files_connections_and_map_details_86ce221}</summary>
        <details className="spatial-file-inventory"><summary>{featureCopy.File_inventory_65f8f2c}{catalog.files.size.toLocaleString()}{featureCopy.known_files_d40b13c}</summary>
            <p>{featureCopy.Every_returned_file_remains_reachable_here_even_without_connectio_91ef632}</p>
            <div className="spatial-inventory-list">{inventoryFiles.slice(0, inventoryLimit).map(file => <article key={file.path}><button onClick={() => { changePlace({ areaPath: undefined, filePath: file.path }); setSelection(undefined); onView('overview'); }}>{file.path}</button><small>{file.language} · {file.lines === undefined ? featureCopy.size_unknown_fa28589 : featureCopy.message_0_indexed_lines_f050335(file.lines.toLocaleString())} · {file.connection === 'connected' ? featureCopy.connected_c5e2345 : file.connection === 'none' ? featureCopy.no_indexed_connections_ef41a9c : featureCopy.connections_unknown_f80ca40}{coverage?.records.get(file.path) ? ` · ${coverage.records.get(file.path)!.state}` : ''}</small><button aria-label={featureCopy.Read_0_3efe90d(file.path)} onClick={() => onNavigate(file.path, 1)}>{featureCopy.Read_source_11ebd96}</button></article>)}</div>
            <small>{Math.min(inventoryLimit, inventoryFiles.length)} / {inventoryFiles.length}{featureCopy.files_052118b}</small>{inventoryLimit < inventoryFiles.length && <button onClick={() => setInventoryLimit(value => value + 24)}>{featureCopy.More_files_fc5ec42}</button>}
            {(overview.symbolKinds.find(kind => kind.kind === 'File')?.count ?? 0) > overview.files.length && <p className="spatial-notice">{featureCopy.The_file_inventory_query_is_limited_Additional_files_are_availabl_ad81632}</p>}
            {coverage?.truncations.map(note => <p key={note} className="spatial-notice">{note}</p>)}
        </details>
        {!!(model.omittedNodes || model.omittedEdges) && <p className="spatial-notice">{featureCopy.The_map_is_bounded_for_readability_b258e7f}{model.omittedNodes}{featureCopy.nodes_and_cf5b4ad}{model.omittedEdges}{featureCopy.connections_are_outside_this_view_open_an_area_to_inspect_a_small_c00b840}</p>}
        {model.warnings.map(warning => <p className="spatial-notice" key={warning}>{warning}</p>)}
        <details className="spatial-relationship-list"><summary>{featureCopy.Connections_8f3509b}{selectedNode ? featureCopy.for_0_0ae6658(selectedNode.label) : ''} · {edges.length}</summary><div aria-label={featureCopy.Architecture_relationships_f5e6b74}>
            {!edges.length && <p>{featureCopy.No_matching_indexed_connections_in_this_view_1a165d6}</p>}{edges.map(edge => <button key={edge.id} aria-pressed={selectedEdge?.id === edge.id} onClick={() => { setSelection({ scope, edge: edge.id }); setMemberLimit(5); }}>
                <span>{nodesById.get(edge.source)?.label} → {nodesById.get(edge.target)?.label}</span><small>{edge.type} · {edge.count}</small></button>)}
        </div></details>
        <p className="spatial-measure-note">{featureCopy.Height_represents_source_size_color_follows_file_type_Gravity_rep_8783232}{catalog.total.measuredFiles.toLocaleString()} / {catalog.total.files.toLocaleString()}{featureCopy.files_have_line_measurements_2818690}{catalog.partial ? featureCopy.totals_cover_measured_files_only_21ede85 : ''}.</p>
        {graphNote && <details className="spatial-coverage"><summary>{featureCopy.Index_coverage_and_limits_aff16e0}</summary><p>{graphNote}</p></details>}
        </details>
    </section>;
}
