import { featureCopy } from '../i18n/features/why';
import { useMemo } from 'react';
import type { GraphData, GraphNode } from '../galaxy/types';
import type { AgentsState } from '../agents/agent-store';
import { selectionContext } from './selection-context';
import { selectionScopeText } from './selection-strings';
import { graphNodeName } from '../galaxy/node-names';
import { RelationshipEvidence } from '../architecture/RepositoryMap';
import type { MapEvidence } from '../architecture/repository-map';
import type { ScopePartial, TraceDirection } from '../galaxy/graph-scope';
import './selection-context.css';

/** The scope that Galaxy has loaded around the selection (hand test K13). */
export interface SelectionScope {
    graph: GraphData;
    complete: boolean;
    direction: TraceDirection;
    edgeTypes?: readonly string[];
    partial?: ScopePartial;
    depth?: number;
}

export default function SelectionContextPanel({ graph, selected, path, agents, onNavigate, onImpact, scope }: {
    graph?: GraphData; selected?: GraphNode; path: string; agents?: AgentsState;
    onNavigate: (path: string, line?: number, name?: string) => void; onImpact?: () => void;
    /**
     * In Galaxy: the loaded scope. Its relationships replace the repository
     * snapshot, which is capped (20,000 nodes by file path) and missed, for
     * JSONBAgg, all 23 incoming relationships from the tests behind the cap.
     */
    scope?: SelectionScope;
}) {
    const inScope = Boolean(scope && selected && scope.graph.nodes.some(node => selected.qualified_name
        ? node.qualified_name === selected.qualified_name && (node.file_path ?? '') === path : node.id === selected.id));
    const source = inScope ? scope!.graph : graph;
    const context = useMemo(() => selectionContext(source, selected, path, agents, { allRelations: inScope }), [source, selected, path, agents, inScope]);
    const callers = context.incoming.filter(edge => edge.type === 'CALLS');
    const callerFiles = new Set(callers.map(edge => edge.source.file_path).filter(Boolean));
    return <section className="selection-context" aria-label={featureCopy.Selection_context_b9bcc62} data-testid="selection-context">
        <h3>{featureCopy.Selection_context_b9bcc62}</h3>
        {/* Round 4 (N1): a selected node without a file, such as a Branch node, keeps its connections and its shown name. */}
        {!path && !selected ? <p>{selectionScopeText.selectSomething}</p> : <>
            <p className="selection-context-subject">{selected ? graphNodeName(selected) : path}</p>
            <h4>{featureCopy.Graph_evidence_b8055ad}</h4>
            {!source ? <p>{featureCopy.The_repository_graph_is_not_available_Relevance_cannot_be_establi_e369102}</p> : <>
                {scope && <p className="selection-context-source" data-source={inScope ? 'scope' : 'snapshot'}>{inScope ? selectionScopeText.fromScope(scope.depth) : selectionScopeText.fromSnapshot}</p>}
                {inScope && !scope!.complete && <p role="status">{selectionScopeText.loading}</p>}
                {inScope && scope!.partial && <p role="status">{selectionScopeText.partial(scope!.partial.layer, scope!.partial.limit)}</p>}
                {inScope && scope!.direction !== 'both' && <p>{selectionScopeText.notTraced(scope!.direction)}</p>}
                {inScope && scope!.edgeTypes && <p>{selectionScopeText.typesOnly(scope!.edgeTypes)}</p>}
                {context.selected?.status === 'entry' && <p>{featureCopy.The_index_classifies_this_declaration_as_an_entry_candidate_Open__6af3386}</p>}
                {callers.length > 0 && <p>{callers.length}{featureCopy.indexed_caller_edges_from_c60e31e}{callerFiles.size}{featureCopy.files_reach_this_selection_Check_these_callers_when_changing_its__0229d48}</p>}
                {context.entryPath.length > 0 && <details><summary>{featureCopy.Reachable_from_3eaa3c1}{context.entryPath[0].source.name}{featureCopy.inspect_4565860}{context.entryPath.length}{featureCopy.calls_ea3ddb5}</summary>
                    <p>{featureCopy.This_selection_is_reachable_from_an_indexed_entry_candidate_This__2c42cee}</p>
                    <RelationshipEvidence edges={context.entryPath} onNavigate={onNavigate} />
                </details>}
                {!context.incoming.length && !context.outgoing.length && <p>{/\.(md|rst|txt)$/i.test(path)
                    ? featureCopy.This_documentation_file_has_no_code_dependencies_in_the_loaded_gr_109562b
                    : featureCopy.No_supported_dependency_edge_for_this_selection_is_present_in_the_1431bef}</p>}
                {/* RelationshipEvidence prints the type as text, so a scope type outside the map relations reads the same. */}
                {context.incoming.length > 0 && <details><summary>{selectionScopeText.incoming(context.incoming.length, context.incomingByType)}</summary>
                    <RelationshipEvidence edges={context.incoming as MapEvidence[]} onNavigate={onNavigate} /></details>}
                {context.outgoing.length > 0 && <details><summary>{selectionScopeText.outgoing(context.outgoing.length, context.outgoingByType)}</summary>
                    <RelationshipEvidence edges={context.outgoing as MapEvidence[]} onNavigate={onNavigate} /></details>}
                {context.pathSearchLimited && !context.entryPath.length && <p>{featureCopy.No_entry_path_found_within_4_calls_500_visited_symbols_Longer_pat_dfe4ff8}</p>}
            </>}
            {agents && <details><summary>{featureCopy.Observed_agent_activity_89f9177}{context.activity.length}{featureCopy.retained_events_for_this_file_05180ca}</summary>
            {context.activity.length === 0 ? <p>{featureCopy.No_observed_tool_event_for_this_file_is_available_in_the_loaded_a_ce8ffd3}</p>
                : <ul>{context.activity.map(({ agent, event }) => <li key={`${agent}:${event.run}:${event.seq}:${event.phase}`}>
                    <details><summary>{agent} · {event.tool} · {event.phase} · <time dateTime={new Date(event.ts).toISOString()}>{new Date(event.ts).toLocaleTimeString()}</time></summary>
                        <p>{featureCopy.Observed_tool_event_for_this_file_A_tool_name_does_not_reveal_int_a7ddf6d}</p>
                        <pre>{JSON.stringify(event, null, 2)}</pre>
                        <button onClick={() => onNavigate(path, event.lines?.[0])}>{featureCopy.Open_event_location_8fc4eac}</button>
                    </details>
                </li>)}</ul>}
            </details>}
            <div className="selection-context-actions">{path && <button onClick={() => onNavigate(path, context.selected?.start_line, context.selected?.name)}>{selectionScopeText.readSource}</button>}
                {onImpact && <button onClick={onImpact}>{featureCopy.Assess_change_impact_f1e0404}</button>}</div>
        </>}
    </section>;
}
