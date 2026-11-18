import { presentation } from '../i18n/presentation';
import { featureCopy } from '../i18n/features/architecture';
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { behaviorJourney } from './behavior-journey-model';
import { projectionLimits, type SystemSceneModel } from './system-architecture-model';
import { architectureText as text } from './strings';
import type { JourneyPlace, PlaceChange } from './architecture-history';
import { useLiftedPlace, useOnIdentityChange } from './lifted-place';
import type { SystemProjection, SystemSymbol } from './system-architecture-source';
import BehaviorSourceEvidence, { type BehaviorSourceSnapshot } from './BehaviorSourceEvidence';
import { useSelectionEvidence, type SelectionEvidenceListener } from '../galaxy/selection-evidence';
import { RefreshControl, type RefreshFeedback } from '../ui/refresh/refresh-feedback';
import { operationChoices } from './operation-choices';
import './behavior-journey.css';

const startText = text.behaviorStart;

const Scene = lazy(() => import('./SystemArchitectureScene'));
export interface BehaviorJourneyProps {
    project: string; generation?: string; data?: SystemProjection; entries: SystemSymbol[];
    targets: (SystemSymbol & { distance: number })[]; entryId?: number; targetId?: number;
    active: boolean; pending: boolean; error?: string; filter: string;
    onRequest: (entry: SystemSymbol | undefined, targetId?: number, detail?: BehaviorRequestDetail) => void;
    /** The start the followed calls began from (K27); empty background returns there. */
    from?: SystemSymbol;
    /**
     * Where the journey stands (path, operation, page of direct calls) and Plan or 3D, lifted to the workspace
     * for Back and Forward (K27). Rendered on its own, the journey keeps them itself.
     */
    place?: JourneyPlace;
    onPlace?: PlaceChange<JourneyPlace>;
    navigation?: ReactNode;
    /** Reports the start shown when none was requested, so a Back or Forward tooltip can name it (K27). */
    onShownStart?: (name: string) => void;
    onClearSelection?: () => void;
    onSelectionEvidence?: SelectionEvidenceListener;
    onRefresh: () => void; onSelectSymbol: (symbol: SystemSymbol) => void;
    /** What the last Refresh did, shown beside its button (hand test 2026-10-04, A3). */
    refresh?: RefreshFeedback;
    /** The automatic start and the ranked suggestions, in their order, offered first in "Start" (hand test 2026-10-04, A4). */
    suggestedEntries?: number[];
    onNavigate: (path: string, line?: number, name?: string) => void;
}

/** What a request carries besides start and destination: where followed calls began, and the destination's name. */
export interface BehaviorRequestDetail { from?: SystemSymbol; targetName?: string }

/** Overlapping windows keep every operation legible and retain actual call adjacency. */
export function journeyPage(scene: SystemSceneModel, step: number, choices = false, pathWindow = 5): SystemSceneModel {
    const size = choices ? 5 : Math.max(2, Math.min(5, pathWindow));
    if (scene.nodes.length <= size) return scene;
    const start = choices ? step * 4 + 1 : Math.min(Math.floor(step / (size - 1)) * (size - 1), Math.max(0, scene.nodes.length - size));
    const window = choices ? [scene.nodes[0], ...scene.nodes.slice(start, start + 4)] : scene.nodes.slice(start, start + size);
    const nodes = choices ? window.map((node, index) => ({ ...node, position: (index === 0 ? [0, 0, 0] : [88, ((window.length - 2) / 2 - index + 1) * 30, 0]) as [number, number, number] })) : window;
    const ids = new Set(nodes.map(node => node.id));
    const lanes = scene.lanes.flatMap(lane => {
        const members = nodes.filter(node => `journey-component:${node.symbol?.component_id}` === lane.id);
        if (!members.length) return [];
        const xs = members.map(node => node.position[0]), ys = members.map(node => node.position[1]);
        return [{ ...lane, position: [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, -2] as [number, number, number],
            width: Math.max(...xs) - Math.min(...xs) + 62, height: Math.max(...ys) - Math.min(...ys) + 32 }];
    });
    return { ...scene, nodes, lanes, edges: scene.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target)), scopeKey: `${scene.scopeKey}:page:${start}` };
}

export default function BehaviorJourney({ project, generation, data, entries, targets, entryId, targetId, active, pending, error, filter,
    onRequest, onRefresh, refresh, suggestedEntries, onSelectSymbol, onNavigate, onClearSelection, onSelectionEvidence, from, place: liftedPlace, onPlace, onShownStart, navigation }: BehaviorJourneyProps) {
    const [place, changePlace] = useLiftedPlace<JourneyPlace>(liftedPlace, onPlace, () => ({}));
    const { path: pathIndex = 0, step = 0, page: branchPage = 0, planar = false } = place;
    const [overview, setOverview] = useState(false);
    const [selection, setSelection] = useState<{ node?: string; edge?: string }>();
    const [resetKey, setResetKey] = useState(0);
    const visual = useRef<HTMLDivElement>(null);
    const [pathWindow, setPathWindow] = useState(5);
    const [sourceEvidence, setSourceEvidence] = useState<BehaviorSourceSnapshot>();
    const lifted = liftedPlace !== undefined;
    const top = { path: 0, step: 0, page: 0 };
    // A lifted journey is handed its position with every start, and Back hands the one it had; on its own it starts over.
    useOnIdentityChange(JSON.stringify([project, generation, entryId, targetId]), () => { setSelection(undefined); if (!lifted) changePlace(top); });
    useOnIdentityChange(filter, () => { setSelection(undefined); changePlace(top); });
    const journey = useMemo(() => data ? behaviorJourney(data, { entryId, targetId, pathIndex, filter }) : undefined,
        [data, entryId, targetId, pathIndex, filter]);
    const path = journey?.path;
    const activeStep = Math.min(step, Math.max(0, (path?.nodes.length ?? 1) - 1));
    const scene = useMemo(() => journey ? journeyPage(journey.scene, path ? activeStep : branchPage, !path, pathWindow) : undefined, [journey, path, activeStep, branchPage, pathWindow]);
    const hasScene = Boolean(scene);
    useEffect(() => {
        const element = visual.current;
        if (!element) return;
        const resize = () => { const width = element.getBoundingClientRect().width; if (width > 0) setPathWindow(width < 800 ? 3 : 5); };
        resize();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(resize); observer.observe(element);
        return () => observer.disconnect();
    }, [pending, hasScene]);
    const allNodes = journey?.scene.nodes ?? [];
    const selectedEdge = journey?.scene.edges.find(edge => edge.id === selection?.edge);
    const selectedNode = overview ? undefined : allNodes.find(node => node.id === selection?.node) ?? (path ? allNodes[activeStep] : allNodes[0]);
    const symbol = overview ? undefined : selectedNode?.symbol ?? journey?.entry;
    const call = selectedEdge?.pathEdge ?? (path && !overview && !selection?.edge ? path.edges[activeStep] : undefined);
    const caller = call ? allNodes.find(node => node.symbol?.id === call.source_id)?.symbol : symbol;
    const callee = call ? allNodes.find(node => node.symbol?.id === call.target_id)?.symbol : undefined;
    const components = new Map([...(data?.components ?? []), ...(data?.overview?.components ?? [])].map(component => [component.id, component]));
    const related = symbol ? journey?.scene.edges.filter(edge => edge.pathEdge?.source_id === symbol.id) ?? [] : [];
    const targetOptions = [...new Map([...targets, ...(journey?.choices ?? []).map(item => ({ ...item, distance: item.distance ?? 1 }))]
        .filter(item => item.id !== (entryId ?? journey?.entry?.id)).map(item => [item.id, item])).values()];
    const entry = journey?.entry ?? entries.find(item => item.id === entryId);
    const availableEntries = useMemo(() => entry && !entries.some(item => item.id === entry.id) ? [entry, ...entries] : entries, [entry, entries]);
    const [startQuery, setStartQuery] = useState('');
    const startChoices = useMemo(() => operationChoices(availableEntries, { suggested: suggestedEntries, query: startQuery, keep: entry?.id }),
        [availableEntries, suggestedEntries, startQuery, entry?.id]);
    const reportShown = useRef(onShownStart);
    reportShown.current = onShownStart;
    const shownStart = entryId === undefined && !pending ? entry?.name : undefined;
    useEffect(() => { if (shownStart !== undefined) reportShown.current?.(shownStart); }, [shownStart]);
    const selectedTarget = targetOptions.find(item => item.id === targetId) ?? path?.nodes.at(-1);
    const limits = data?.status === 'limited' ? projectionLimits(data) : [];
    const sourceKey = caller ? JSON.stringify([project, generation, caller.qualified_name, call?.callsite?.file_path ?? caller.file_path, call?.callsite?.line ?? caller.start_line]) : undefined;
    useSelectionEvidence(onSelectionEvidence, !overview && !pending && journey && symbol ? {
        project, generation, view: 'architecture-behavior', source: 'indexed behavior projection and call-site evidence',
        label: caller && callee ? `${caller.name} → ${callee.name}` : symbol.name,
        selected: { operation: symbol, caller, callee, call, component: components.get(symbol.component_id),
            currentSource: sourceEvidence?.key === sourceKey ? { ...sourceEvidence, provenance: 'Current local source; may differ from the indexed snapshot.' } : undefined },
        relationships: path ? { nodes: path.nodes, edges: path.edges, nodeCount: path.nodes.length, edgeCount: path.edges.length }
            : { count: related.length, calls: related.map(edge => edge.pathEdge) },
        scope: { entry, destination: selectedTarget, pathIndex, step: activeStep, mode: path ? 'connected-call-chain' : 'immediate-calls' },
        limitations: { analysis: data?.limits, warnings: data?.warnings, journey: journey.limits, counts: journey.counts,
            interpretation: 'Static call evidence only. Call-chain depth is not execution order. Branch feasibility, parameter binding, runtime values and data transformation are not established.' },
    } : undefined, active);
    /** Empty background leaves a destination and returns from followed calls to where they began. */
    function clearSelection() {
        const origin = from ?? entry;
        setOverview(true); setSelection(undefined); changePlace(top);
        setResetKey(value => value + 1); onClearSelection?.();
        if (from || targetId !== undefined) onRequest(origin, undefined, {});
    }
    /**
     * Every request is a step of the shared Architecture history (K27). `origin` is where followed calls began:
     * kept for a destination and for further hops, dropped for a start picked in the field.
     */
    function request(next: SystemSymbol | undefined, destination?: number, origin?: SystemSymbol) {
        setOverview(false);
        // Lifted, the request itself is the new place and starts at the top.
        setSelection(undefined); if (!lifted) changePlace({ path: 0, step: 0 });
        const targetName = destination === undefined ? undefined : targetOptions.find(item => item.id === destination)?.name;
        onRequest(next, destination, { ...(origin && origin.id !== next?.id ? { from: origin } : {}), ...(targetName ? { targetName } : {}) });
    }
    function selectNode(id: string) {
        setOverview(false);
        const node = allNodes.find(item => item.id === id);
        setSelection({ node: id });
        if (path && node?.depth !== undefined) changePlace({ step: node.depth });
        if (!path && node) changePlace({ page: Math.max(0, Math.floor((allNodes.indexOf(node) - 1) / 4)) });
        if (node?.symbol) onSelectSymbol(node.symbol);
    }
    function selectEdge(id: string) {
        setOverview(false);
        const edge = journey?.scene.edges.find(item => item.id === id);
        setSelection({ edge: id });
        if (path && edge?.depth) changePlace({ step: edge.depth - 1 });
        if (!path && edge) changePlace({ page: Math.max(0, Math.floor((allNodes.findIndex(node => node.id === edge.target) - 1) / 4)) });
    }
    function selectStep(index: number) {
        setOverview(false);
        const node = allNodes[index];
        if (!node || !path) return;
        changePlace({ step: index }); setSelection({ node: node.id }); if (node.symbol) onSelectSymbol(node.symbol);
    }
    function follow(id: string) {
        const operation = allNodes.find(node => node.id === id)?.symbol;
        if (operation && operation.id !== entryId) request(operation, undefined, from ?? entry);
    }
    return <section className="system-architecture behavior-journey" aria-label={featureCopy.Behavior_70cb647} data-testid="behavior-journey" aria-busy={pending}>
        <header className="behavior-heading"><div><span className="system-eyebrow">{featureCopy.Behavior_source_guided_exploration_57b9028}</span>
            <h2>{targetId !== undefined ? `${entry?.name ?? featureCopy.Operation_430d320} → ${selectedTarget?.name ?? featureCopy.destination_0cf1bc8}` : featureCopy.What_can_0_call_72bff4e(entry?.name ?? presentation.operation)}</h2>
            <p>{path ? featureCopy.Follow_one_recorded_call_chain_across_the_parts_it_touches_d7bfa9a : featureCopy.Choose_a_starting_operation_Explore_its_calls_or_follow_a_path_to_010465f}</p></div>
            <RefreshControl labels={text.refreshFeedback.behavior} feedback={refresh} onRefresh={onRefresh} /></header>
        <div className="behavior-requests">
            {navigation}
            {/*
              * The field names the operation the journey shows, also when the projection chose it. Suggestions come
              * first, then every operation alphabetically; the filter before it narrows both (hand test 2026-10-04, A4).
              */}
            <label className="behavior-start">{startText.label}
                <input type="search" aria-label={startText.filter} placeholder={startText.filterPlaceholder} value={startQuery} onChange={event => setStartQuery(event.target.value)} />
                <select aria-label={startText.field} value={entry?.id ?? ''} onChange={event => request(availableEntries.find(item => item.id === Number(event.target.value)))}>
                    <option value="">{startText.choose}</option>
                    {startChoices.current && <optgroup label={startText.current}><option value={startChoices.current.id}>{startChoices.current.label}</option></optgroup>}
                    {startChoices.suggested.length > 0 && <optgroup label={startText.suggested}>{startChoices.suggested.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>}
                    <optgroup label={startQuery.trim() ? startText.matching(startChoices.matching, startChoices.total) : startText.all(startChoices.total)}>
                        {startChoices.all.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                        {startQuery.trim() && !startChoices.matching && <option disabled value="-1">{startText.none(startQuery.trim())}</option>}
                    </optgroup>
                </select></label>
            <label>{featureCopy.Reach_558434e}<select aria-label={featureCopy.Behavior_destination_c0a7451} value={targetId ?? ''} disabled={!entry || pending} onChange={event => request(entry, event.target.value ? Number(event.target.value) : undefined, from)}>
                <option value="">{featureCopy.Explore_immediate_calls_ef50619}</option>{targetOptions.map(item => <option key={item.id} value={item.id}>{item.name} · {item.file_path ?? ''}</option>)}
            </select></label>
        </div>
        <div className="behavior-navigation">{targetId !== undefined && <button onClick={() => request(entry, undefined, from)}>{featureCopy.Immediate_calls_ea82fcb}</button>}
            <span>{pending ? featureCopy.Updating_this_journey_3d72aa2 : path ? featureCopy.message_0_call_chain_hops_1_components_3140209(path.edges.length, new Set(path.nodes.map(item => item.component_id)).size)
                : text.directCallees(journey?.counts.directChoices ?? 0, journey?.counts.selfCalls ?? false)}</span>
            <span className="behavior-static-badge" title={featureCopy.Graph_relationships_describe_possible_calls_They_do_not_prove_exe_05123cb}>{featureCopy.Static_evidence_c13f485}</span>
        </div>
        {error && <p role="alert">{error} <button onClick={onRefresh}>{featureCopy.Try_again_042c862}</button></p>}
        {pending ? <div className="behavior-loading" role="status">{featureCopy.Preparing_the_selected_operation_cde1373}</div> : !scene || !journey ? <div className="behavior-loading">{featureCopy.Choose_an_operation_to_explore_3a3491a}</div> : <>
            {journey.paths.length > 1 && <div className="behavior-paths" role="group" aria-label={featureCopy.Indexed_paths_7dbde56}>{journey.paths.map((item, index) => <button key={index} aria-pressed={pathIndex === index} onClick={() => { changePlace({ path: index, step: 0 }); setSelection(undefined); }}>{featureCopy.Path_31fbfea}{index + 1}<small>{item.edges.length}{featureCopy.hops_05b1923}{new Set(item.nodes.map(node => node.id)).size < item.nodes.length ? featureCopy.revisits_a_symbol_ed152cd : ''}</small></button>)}</div>}
            <div className="behavior-stage"><div className="behavior-visual" ref={visual}>
                <div className="behavior-visual-toolbar"><span>{path ? featureCopy.CALL_CHAIN_6cd9241 : featureCopy.DIRECT_CALLS_UNORDERED_9957773}</span>
                    <div className="system-view-switch" role="group" aria-label={featureCopy.Behavior_camera_1f9ce2a}><button aria-pressed={!planar} onClick={() => changePlace({ planar: false })}>3D</button><button aria-pressed={planar} onClick={() => changePlace({ planar: true })}>{featureCopy.Plan_ae2f98a}</button></div>
                    <button onClick={() => setResetKey(value => value + 1)}>{featureCopy.Fit_dab564d}</button></div>
                <div className="system-map behavior-map">
                    {scene.nodes.length ? <Suspense fallback={<div className="behavior-loading">{featureCopy.Preparing_the_journey_5e0e2dc}</div>}><Scene model={scene}
                        selectedNode={selectedEdge ? undefined : selectedNode?.id} selectedEdge={selectedEdge?.id}
                        onSelectNode={selectNode} onSelectEdge={selectEdge} onExpandNode={follow} onClearSelection={clearSelection}
                        resetKey={resetKey} planar={planar} active={active} showConnectionLoad={false} presentation="journey" /></Suspense>
                        : limits.length ? <div className="behavior-loading" role="status"><div className="behavior-limited"><strong>{text.behaviorLimited}</strong>{limits.map(limit => <p key={limit}>{limit}</p>)}</div></div>
                        : <div className="behavior-loading">{filter ? featureCopy.No_connected_path_matches_this_filter_fc7aae9 : targetId !== undefined ? featureCopy.No_connected_call_chain_witness_was_returned_for_this_destination_6bdfc0b : featureCopy.No_direct_call_witnesses_were_returned_for_this_operation_acde284}</div>}
                    <div className="system-map-caption"><span>{path ? featureCopy.Showing_operations_0_to_1_of_2_e7f042b((scene.nodes[0]?.depth ?? 0) + 1, (scene.nodes.at(-1)?.depth ?? 0) + 1, path.nodes.length) : featureCopy.Branches_are_possible_calls_not_an_execution_sequence_001357e}</span>
                        <span>{featureCopy.Double_click_an_operation_to_follow_its_calls_7dcfc05}</span></div>
                </div>
                {path && <nav className="behavior-walk" aria-label={featureCopy.Walk_the_call_chain_1a94289}><button disabled={activeStep === 0} onClick={() => selectStep(activeStep - 1)}>{featureCopy.Previous_471492a}</button>
                    <input type="range" aria-label={featureCopy.Call_chain_position_0d64851} min={0} max={path.nodes.length - 1} value={activeStep} onChange={event => selectStep(Number(event.target.value))} />
                    <span>{activeStep + 1} / {path.nodes.length}</span><button disabled={activeStep >= path.nodes.length - 1} onClick={() => selectStep(activeStep + 1)}>{featureCopy.Next_2f04eb1}</button></nav>}
                {!path && journey.scene.nodes.length > 5 && <nav className="behavior-walk" aria-label={featureCopy.Direct_call_pages_f486e4f}><button disabled={branchPage === 0} onClick={() => { changePlace({ page: branchPage - 1 }); setSelection(undefined); }}>{featureCopy.Earlier_calls_ddf639d}</button>
                    <span>{text.callPage(branchPage * 4 + 1, Math.min(branchPage * 4 + 4, journey.scene.nodes.length - 1), journey.scene.nodes.length - 1,
                        journey.counts.omittedNodes, Boolean(filter.trim()) && journey.scene.nodes.length - 1 + journey.counts.omittedNodes < journey.counts.directChoices)}</span>
                    <button disabled={(branchPage + 1) * 4 >= journey.scene.nodes.length - 1} onClick={() => { changePlace({ page: branchPage + 1 }); setSelection(undefined); }}>{featureCopy.More_calls_44ca838}</button></nav>}
            </div><aside className="behavior-inspector" aria-label={featureCopy.Behavior_evidence_inspector_7a51db1}>
                {caller ? <><span className="system-eyebrow">{call ? call.type.replaceAll('_', ' ') : path ? featureCopy.Operation_0_d04497a(activeStep + 1) : featureCopy.Starting_operation_c1b3263}</span>
                    <h3>{caller.name}{callee && <><span className="behavior-call-arrow">↓</span>{callee.name}</>}</h3>
                    <p>{call && callee ? caller.component_id === callee.component_id ? featureCopy.A_call_within_the_same_component_540223b : featureCopy.Crosses_from_0_into_1_2692bf8(components.get(caller.component_id)?.label ?? caller.component_id, components.get(callee.component_id)?.label ?? callee.component_id)
                        : components.get(caller.component_id)?.label ?? caller.file_path}</p>
                    {call?.resolution && <p className="behavior-resolution">{call.resolution.strategy?.replaceAll('_', ' ') ?? featureCopy.Indexed_resolution_de4fa49}{call.resolution.candidates && call.resolution.candidates > 1 ? featureCopy.message_0_candidate_targets_59d5ff2(call.resolution.candidates) : ''}</p>}
                    <div className="behavior-inspector-actions">{symbol && symbol.id !== entryId && <button onClick={() => request(symbol, undefined, from ?? entry)}>{featureCopy.Follow_calls_from_here_32c7f22}</button>}
                        {symbol?.file_path && <button onClick={() => onNavigate(symbol.file_path!, symbol.start_line, symbol.name)}>{featureCopy.Open_definition_787fad5}</button>}</div>
                    <div className="behavior-contract" aria-label={featureCopy.Indexed_call_contract_dfefec1}>
                        {call?.arguments && <section><h4>{featureCopy.Passed_expressions_6e89a27}</h4>{call.arguments.length ? <ol>{call.arguments.map((argument, index) => <li key={`${argument.i}:${index}`}><code>{argument.e}</code>
                            {argument.v !== undefined && <small>{featureCopy.Resolved_string_3d53a91}<code>{JSON.stringify(argument.v)}</code></small>}</li>)}</ol> : <p>{featureCopy.No_argument_expressions_were_captured_32847c2}</p>}
                            <small>{featureCopy.Indexed_expressions_d3c743d}{call.argument_limit ? featureCopy.up_to_0_5475b67(call.argument_limit) : ''}. Parameter binding is not established.</small></section>}
                        {(callee ?? symbol)?.signature && <section><h4>{callee ? featureCopy.Called_declaration_2b5c05e : featureCopy.Declaration_d6f3772}</h4><code className="behavior-signature">{(callee ?? symbol)!.signature}</code></section>}
                        {(callee ?? symbol)?.parameters && <section><h4>{featureCopy.Declared_parameters_553e150}</h4><ul>{(callee ?? symbol)!.parameters!.names.map((name, index) => <li key={`${index}:${name}`}><code>{name}{(callee ?? symbol)!.parameters!.types[index] ? `: ${(callee ?? symbol)!.parameters!.types[index]}` : ''}</code></li>)}</ul>
                            <small>{(callee ?? symbol)!.parameters!.count}{featureCopy.reported_parameters_3c07d21}</small></section>}
                        {(callee ?? symbol)?.return_type && <section><h4>{featureCopy.Declared_return_type_e802b5e}</h4><code>{(callee ?? symbol)!.return_type}</code></section>}
                    </div>
                    <BehaviorSourceEvidence project={project} generation={generation} symbol={caller} call={call} active={active} onNavigate={onNavigate} onSourceEvidence={setSourceEvidence} />
                    {callee && <div className="behavior-next-operation"><span>{featureCopy.Continues_into_fe39aed}</span><button onClick={() => { const node = allNodes.find(node => node.symbol?.id === callee.id && (node.depth ?? 0) > activeStep) ?? allNodes.find(node => node.symbol?.id === callee.id); if (node) selectNode(node.id); }}>{callee.name} →</button></div>}
                    {!path && related.length > 0 && <div className="behavior-immediate-list"><h4>{featureCopy.Calls_from_this_operation_fc3eeb8}</h4>{related.map(edge => <button key={edge.id} onClick={() => selectEdge(edge.id)}>
                        {allNodes.find(node => node.id === edge.target)?.symbol?.name ?? edge.target}<small>{edge.pathEdge?.callsite ? featureCopy.line_0_6c8409e(edge.pathEdge.callsite.line) : edge.type.toLowerCase().replaceAll('_', ' ')}</small></button>)}</div>}
                </> : <p>{featureCopy.Select_an_operation_or_a_call_to_inspect_its_evidence_ad87752}</p>}
            </aside></div>
            {path && <details className="behavior-limits"><summary>{featureCopy.Call_chain_fab4f56}{path.nodes.length}{featureCopy.operations_a1ea7f6}</summary><ol className="behavior-operation-strip" aria-label={featureCopy.All_operations_in_this_call_chain_a2dbe78}>{path.nodes.map((item, index) => <li key={`${index}:${item.id}`}>
                <button aria-label={featureCopy.Select_step_0_1_56c3fe1(index + 1, item.name)} aria-pressed={!overview && activeStep === index} onClick={() => selectStep(index)}><span>{index + 1}</span><strong>{item.name}</strong><small>{item.file_path}</small></button></li>)}</ol></details>}
            <details className="behavior-limits"><summary>{featureCopy.Evidence_and_limits_9dfb0e5}{journey.limits.sampled ? featureCopy.partial_analysis_222c1fa : ''}</summary>
                <p>{featureCopy.Each_arrow_is_a_recorded_invocation_Component_lanes_provide_orien_d2adc0f}</p>
                <p>{journey.counts.omittedChoices}{featureCopy.choices_f4adfdf}{journey.counts.omittedNodes}{featureCopy.nodes_and_cf5b4ad}{journey.counts.omittedEdges}{featureCopy.edges_omitted_by_display_limits_1bc7c1f}{journey.counts.invalidPaths}{featureCopy.disconnected_or_unsupported_paths_excluded_fe47500}</p>
                {(data?.behavior?.totals.omitted_targets ?? 0) > 0 && <p>{data!.behavior!.totals.omitted_targets}{featureCopy.reachable_destinations_are_outside_the_returned_catalog_4097893}</p>}
                {journey.limits.hit.length > 0 && <p>{journey.limits.hit.join(' · ')}</p>}
                {data?.warnings.map((warning, index) => <p key={index}>{warning}</p>)}
            </details>
        </>}
    </section>;
}
