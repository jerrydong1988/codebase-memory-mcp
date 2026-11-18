import { featureCopy } from '../i18n/features/galaxy';
import type { ExpandOutlook } from './graph-scope';

/**
 * The words of the Galaxy path view, beside the view like the other domain
 * copy (agents/agent-strings.ts, architecture/strings.ts).
 *
 * One rule for every sentence here: a path is counted in hops over the
 * relationships that are loaded in this scope, nothing more. It is not a
 * runtime trace and it does not claim that nothing else connects the two.
 */
export const galaxyPathText = {
    pathTo: featureCopy.Path_to_0a36210,
    pathToTitle: featureCopy.Highlight_the_shortest_path_from_the_root_to_a_node_in_this_scope_59b717e,
    pathSearch: featureCopy.Find_a_path_target_500244e,
    pathSearchPlaceholder: featureCopy.Node_in_this_scope_99737cb,
    pathNoMatch: featureCopy.No_matching_node_in_the_loaded_scope_dc2ef6d,
    pathMore: (count: number) => featureCopy.message_0_more_type_to_narrow_47c1b1b(count.toLocaleString()),
    callOrder: featureCopy.Call_order_d5fb05c,
    /** The short labels of a narrow toolbar (review of K3). */
    pathToNarrow: featureCopy.Path_7b446d6,
    callOrderNarrow: featureCopy.Calls_0a19b7e,
    callOrderTitle: featureCopy.Step_through_the_outgoing_calls_of_the_root_in_source_line_order_0cc81b9,
    callOrderUnavailable: featureCopy.The_root_has_no_outgoing_calls_in_the_loaded_scope_e0b17d8,
    panel: featureCopy.Path_steps_ddc8b24,
    pathHeading: (target: string, hops: number) => featureCopy.Path_to_0_1_5c573bb(target, hops === 1 ? '1 hop' : `${hops} hops`),
    callsHeading: (root: string, calls: number) => featureCopy.Calls_of_0_1_0b99672(root, calls === 1 ? '1 call' : `${calls} calls`),
    noPath: (target: string) => featureCopy.No_path_to_0_over_the_loaded_relationships_in_this_trace_directio_3bdbcaf(target),
    isRoot: (target: string) => featureCopy.message_0_is_the_root_of_this_scope_2675aff(target),
    hop: (hop: number) => featureCopy.hop_0_6e9d796(hop),
    line: (line: number) => featureCopy.line_0_6c8409e(line),
    lineUnknown: featureCopy.no_line_ec9226a,
    /** The hop as the reader follows it, with the indexed direction kept. */
    step: (from: string, type: string, to: string, forward: boolean) =>
        (forward ? `${from} --${type}--> ${to}` : `${from} <--${type}-- ${to}`),
    previous: featureCopy.Previous_50f9428,
    next: featureCopy.Next_bc98198,
    clear: featureCopy.Clear_719ea39,
    clearTitle: featureCopy.Return_to_the_whole_scope_Esc_832d7f4,
    position: (index: number, total: number) => featureCopy.message_0_of_1_7388d66(index, total),
};

/** Back, Forward and the recent roots of the scoped Galaxy (K2). */
export const galaxyHistoryText = {
    back: featureCopy.Back_b52b36b,
    forward: featureCopy.Forward_ba4e722,
    backGlyph: '←',
    forwardGlyph: '→',
    /** The visible words while the row has room (K2: "← Back" and "Forward →"); the glyphs alone in its compact levels. */
    backWide: featureCopy.Back_c32ae9f,
    forwardWide: featureCopy.Forward_8aca70b,
    backTo: (label: string) => featureCopy.Back_to_0_Alt_Left_ae5bb6b(label),
    forwardTo: (label: string) => featureCopy.Forward_to_0_Alt_Right_426efd4(label),
    noBack: featureCopy.Nothing_to_go_back_to_yet_4c6941e,
    noForward: featureCopy.Nothing_to_go_forward_to_787e0e0,
    recent: featureCopy.Recent_76eec76,
    recentGlyph: '▾',
    recentTitle: featureCopy.Jump_straight_to_a_recently_visited_root_with_its_last_depth_dire_9b6fab7,
    recentList: featureCopy.Recently_visited_roots_a88bc7a,
    /** The accessible name of the Back, Forward and Recent group. */
    group: featureCopy.History_90ccd64,
    allGraph: featureCopy.All_graph_8ce0f9e,
    allGraphNarrow: featureCopy.All_6a72085,
    allGraphTitle: featureCopy.Leave_the_scope_and_show_the_whole_graph_Esc_e628b4c,
    layers: (depth: number) => (depth === 1 ? featureCopy.message_1_layer_c817c34 : featureCopy.message_0_layers_b9cd7b4(depth)),
    direction: { inbound: featureCopy.incoming_2ff8dd8, outbound: featureCopy.outgoing_708a91a } as Record<'inbound' | 'outbound', string>,
    noTypes: featureCopy.no_edge_types_807bf4b,
    hierarchy: featureCopy.hierarchy_ff59e8b,
    callOrder: featureCopy.call_order_ad015a7,
    pathTo: (name: string) => featureCopy.path_to_0_620e0d4(name),
};

const count = (value: number, one: string, many: string) => `${value.toLocaleString()} ${value === 1 ? one : many}`;

/**
 * Who carries a name in the hierarchy of a scope: everyone, the root and its
 * direct neighbours, or (`none`) only the root and a side of its direct
 * neighbours that fits the budget.
 */
export type HierarchyNames = 'all' | 'neighbours' | 'none';
/** With `names: 'none'`: whether the root still carries its name (not with hundreds of roots) and how many direct neighbours on each side do. */
export interface HierarchyNamedSides { root: boolean; incoming: number; outgoing: number }

type TraceDirectionWord = 'both' | 'inbound' | 'outbound';
/* With the direct neighbours unnamed the root alone has too many: fewer layers would not help, a narrower trace would. */
const narrower = (direction: TraceDirectionWord) => (direction === 'both' ? featureCopy.trace_one_direction_or_fewer_edge_types_9690ca0 : featureCopy.trace_fewer_edge_types_bee54af);
const namedFew = (sides: HierarchyNamedSides) => ['the root',
    sides.incoming > 0 ? `its ${count(sides.incoming, 'incoming neighbour', 'incoming neighbours')}` : '',
    sides.outgoing > 0 ? `its ${count(sides.outgoing, 'outgoing neighbour', 'outgoing neighbours')}` : ''].filter(Boolean).join(' and ');

/**
 * The hierarchy of a Galaxy scope (hand test K5): what the columns mean, per
 * trace direction and depth. Second review: from two layers on, a column only
 * holds chains that run one way to the root, the rest stands in a band below,
 * and every line says its type and direction. Names above the budget: see
 * `HierarchyNames`; the advice names what brings them back.
 */
export const galaxyHierarchyText = {
    hint: (direction: TraceDirectionWord, view: { mixed: number; names: HierarchyNames; budget: number; neighbours: number; sides: HierarchyNamedSides }) => [
        direction === 'inbound'
            ? 'hierarchy: what reaches the root, one column per layer to the left'
            : direction === 'outbound'
                ? 'hierarchy: what the root reaches, one column per layer to the right'
                : 'hierarchy: incoming relationships on the left, the root in the middle, outgoing on the right; each column is one layer further in the same direction',
        view.mixed > 0 ? `${count(view.mixed, 'node', 'nodes')} reached through both directions, such as a callee of a caller, stand in the band below` : '',
        view.names === 'all' ? 'the type and direction of each relationship at its line'
            : view.names === 'neighbours'
                ? `above ${view.budget.toLocaleString()} nodes only the root and its direct neighbours carry names, so remove layers or trace fewer edge types to see all names`
                : !view.sides.root ? `names and edge types show for up to ${view.budget.toLocaleString()} nodes, so ${narrower(direction)} to see them`
                    : `names and edge types show for up to ${view.budget.toLocaleString()} nodes, and the root has ${count(view.neighbours, 'direct neighbour', 'direct neighbours')}, `
                        + `so only ${namedFew(view.sides)} ${view.sides.incoming + view.sides.outgoing > 0 ? 'carry names' : 'carries a name'}; ${narrower(direction)} to see the rest`,
    ].filter(Boolean).join('; '),
    /** The heading of the band in the picture. */
    bandTitle: (mixed: number) => featureCopy.Mixed_directions_0_a7e24f7(count(mixed, 'node', 'nodes')),
    bandDetail: featureCopy.reached_through_both_incoming_and_outgoing_relationships_such_as__04c9259,
    /** The note in the picture when names are missing, and how to get them. */
    namesNote: (direction: TraceDirectionWord, nodes: number, names: Exclude<HierarchyNames, 'all'>, neighbours: number, budget: number, sides: HierarchyNamedSides) => (names === 'neighbours'
        ? featureCopy.message_0_names_for_the_root_and_its_1_only_up_to_2_names_Remove_layers_o_ef4727f(count(nodes, 'node', 'nodes'), count(neighbours, 'direct neighbour', 'direct neighbours'), budget.toLocaleString())
        : !sides.root ? featureCopy.message_0_no_names_above_1_nodes_2_to_see_them_98bebd7(count(nodes, 'node', 'nodes'), budget.toLocaleString(), narrower(direction).replace(/^t/, 'T'))
            : featureCopy.message_0_1_of_them_direct_neighbours_of_the_root_names_for_2_only_up_to__2f024df(count(nodes, 'node', 'nodes'), neighbours.toLocaleString(), namedFew(sides), budget.toLocaleString())
                + featureCopy.message_0_to_see_the_rest_893cce9(narrower(direction).replace(/^t/, 'T'))),
};

/** Loading, cancelling and the render limit of a scope layer (hand test K8). */
export const galaxyLayerText = {
    checking: featureCopy.Checking_index_a4cbca2,
    loading: (layer: number) => featureCopy.Loading_layer_0_abd7ce5(layer),
    // A comma, not the dot of the finished counts: tools that wait for "N nodes · M edges" must not take this for done.
    loadingProgress: (layer: number, nodes: number, edges: number) =>
        featureCopy.Loading_layer_0_1_2_so_far_1035ab2(layer, count(nodes, 'node', 'nodes'), count(edges, 'edge', 'edges')),
    /** The tooltip of a running load: which request it is on, page by page (review of K8). */
    loadingRequest: (request: number) => featureCopy.Request_0_to_the_index_cancels_31ab1d2(request.toLocaleString()),
    arranging: featureCopy.Arranging_nodes_e48db28,
    counts: (nodes: number, edges: number) => `${count(nodes, 'node', 'nodes')} · ${count(edges, 'edge', 'edges')}`,
    endOfTrace: featureCopy.end_of_trace_d91cbc0,
    // "Partial" leads, so a narrow toolbar that cuts the end never cuts the warning.
    partial: (counts: string) => featureCopy.Partial_0_ba1b8d2(counts),
    partialPreview: featureCopy.Partial_preview_08266de,
    previewLoading: (layer: number) => featureCopy.Partial_preview_while_layer_0_loads_65595bb(layer),
    // G3: a layer stops after the request that passes the limit, so it can hold more than the limit (5,548 of 5,000); the scene draws up to the limit.
    partialTitle: (layer: number, limit: number, kind: 'nodes' | 'edges') =>
        featureCopy.Layer_0_stopped_loading_after_the_request_that_took_it_past_the_r_01285d3(layer, limit.toLocaleString(), kind)
        + featureCopy.the_scene_draws_at_most_0_1_Raise_the_limit_under_Limits_or_trace_e3fa456(limit.toLocaleString(), kind),
    removeLayer: featureCopy.Remove_the_outermost_layer_14215c1,
    cancelLoading: (layer: number) => featureCopy.Cancel_loading_layer_0_and_return_to_1_72bf63f(layer, layer - 1 === 1 ? '1 layer' : `${layer - 1} layers`),
    /* Measured, not promised: a hub at the edge can bring far more than the last layer did (JSONBAgg layer 3: about 400 expected, over 9,000 loaded). */
    /* With `calls` the index has counted the calls at the edge nodes (review of K8): a floor, where the growth alone missed the hubs. */
    /*
     * Hand test 2026-10-04 (G3): every sentence true on its own. The warning
     * names the limit and the number behind it (`expandPastLimit` in
     * graph-scope.ts); the growth estimate stands only where it is the larger
     * number, so "about 402 nodes" no longer sits next to a warning it
     * contradicts. Loading stops after the request that passes a limit, not
     * at the limit (JSONBAgg layer 3 ended at 5,548 nodes), and where no limit
     * applies (the Explore mini-Galaxy) the hint claims none.
     */
    expandHint: (outlook: ExpandOutlook, past: { limit: 'nodes' | 'edges'; by: 'calls' | 'growth' } | undefined) => {
        const { layer, frontier, estimate, calls, loaded, limits } = outlook;
        const unit = (kind: 'nodes' | 'edges', value: number) => count(value, kind === 'nodes' ? 'node' : 'edge', kind);
        const evidence = calls === undefined
            ? featureCopy.Growing_like_the_last_layer_it_adds_about_0_nodes_and_a_hub_can_a_6739f69(estimate.toLocaleString())
            : featureCopy.The_index_lists_0_at_them_that_1_not_loaded_yet_3e559e7(count(calls, 'call', 'calls'), calls === 1 ? 'is' : 'are')
                + (calls >= estimate ? featureCopy.and_each_can_bring_a_new_node_17f6678 : featureCopy.growing_like_the_last_layer_it_adds_about_0_nodes_230b1ac(estimate.toLocaleString()));
        const kind = past?.limit;
        return [
            past && limits && kind ? `Likely past the render limit of ${unit(kind, limits[kind])}.` : '',
            `Load layer ${layer}: ${count(frontier, 'node', 'nodes')} to expand.`,
            `${evidence}${kind ? `; ${unit(kind, loaded[kind])} ${loaded[kind] === 1 ? 'is' : 'are'} loaded now` : ''}.`,
            limits ? `Loading stops after the first request to the index that takes it past ${unit('nodes', limits.nodes)} or ${unit('edges', limits.edges)}, `
                + `so the layer can end above the limit; it is then marked partial, and the scene draws at most ${unit('nodes', limits.nodes)} and ${unit('edges', limits.edges)}.` : '',
        ].filter(Boolean).join(' ');
    },
    expandPartial: featureCopy.This_layer_stopped_loading_after_it_passed_the_render_limit_so_th_e9b1b90,
    expandEnd: featureCopy.End_of_trace_no_relationship_leads_further_423b036,
    /** Review of K31: Expand +1 is blocked while a layer loads, and says why. */
    expandLoading: (layer: number) => featureCopy.Layer_0_is_loading_cancels_it_f0af92e(layer),
};

/** Compact toolbar words, so the scoped toolbar keeps to one row at 1600 px. */
export const galaxyToolbarText = {
    groups: (count: number) => featureCopy.message_0_groups_6d118bf(count.toLocaleString()),
    groupsTitle: (count: number) => featureCopy.message_0_connection_groups_Groups_reflect_connections_in_this_trace_not__d08c57d(count.toLocaleString()),
    limits: featureCopy.Limits_61a0ae3,
    limitsTitle: featureCopy.Rendered_node_and_edge_limits_d5f9c42,
    more: featureCopy.More_4bab2d8,
    moreGlyph: '⋯',
    moreTitle: featureCopy.More_open_the_source_rendered_node_and_edge_limits_connection_gro_cfc954f,
    openSource: featureCopy.Open_source_6cc3364,
    openRootTitle: (name: string, path: string, line?: number) => featureCopy.Open_the_source_of_0_in_Explore_1_2_b414aa5(name, path, line ? `:${line}` : ''),
    /** The root button's accessible name: its action, with the visible name in it. */
    openRootLabel: (name: string) => featureCopy.Open_the_source_of_0_e8522fb(name),
    traceTitle: featureCopy.Trace_direction_incoming_outgoing_or_both_77f53a5,
    expand: featureCopy.Expand_1_661785a,
    expandNarrow: '+1',
    outsideLimits: (nodes: number, edges: number) => featureCopy.message_0_nodes_1_edges_outside_render_limits_544500c(nodes.toLocaleString(), edges.toLocaleString()),
};

/**
 * The names of Branch nodes (hand test 2026-10-04, round 4, N1). The index
 * puts one Branch node above the top level folders and files: the checkout it
 * read. Its own name is the branch, "DETACHED" for a detached HEAD or
 * "working-tree" where no branch is known, and on its own that read like a
 * folder of that name. The shown name says what it is; the real one stays in
 * the tooltip and the detail line (node-names.ts).
 */
export interface BranchNameWords {
    detached: string;
    workingTree: string;
    branch: (name: string) => string;
    /** The project in front: "django-demo · detached HEAD". */
    inProject: (project: string, what: string) => string;
}

export const galaxyNodeNameText: BranchNameWords & {
    indexName: (name: string, qualifiedName?: string) => string;
    branchTitle: (shown: string, name: string, qualifiedName?: string) => string;
} = {
    detached: featureCopy.detached_HEAD_ac1ce32,
    workingTree: featureCopy.working_tree_4eafbf4,
    branch: (name: string) => featureCopy.branch_0_f383e5d(name),
    inProject: (project: string, what: string) => `${project} · ${what}`,
    /** The detail line of the hover card. */
    indexName: (name: string, qualifiedName?: string) => featureCopy.Name_in_the_index_0_1_98ff16f(name, qualifiedName ? ` (${qualifiedName})` : ''),
    /** The tooltip wherever the shown name stands. */
    branchTitle: (shown: string, name: string, qualifiedName?: string) =>
        featureCopy.message_0_the_checkout_the_index_read_above_its_top_level_folders_and_fil_7207fb8(shown, name, qualifiedName ? ` (${qualifiedName})` : ''),
};

/** What a click on a node in the hover card will do. */
export const galaxyCardText = {
    nothingToOpen: featureCopy.no_file_in_the_index_nothing_to_open_94c8190,
    openFile: featureCopy.click_to_open_the_file_and_follow_the_twin_efb371d,
};

/**
 * The hierarchy without anything to show, and its ring (hand test
 * 2026-10-04, round 4, N2). The ring follows the symbol open in Explore's
 * reader, so the note about it stands only beside that reader; in the Galaxy
 * tab the root of a scope stands in the middle of its hierarchy.
 */
export const galaxyHierarchyNoteText = {
    /** The hierarchy chip beside Explore while there is no walk and no open symbol. */
    unavailable: featureCopy.hierarchy_open_a_symbol_or_choose_where_to_start_then_this_shows__cb6c62d,
    /** The hierarchy chip in the Galaxy tab before a node is selected. */
    unavailableWorkspace: featureCopy.hierarchy_select_a_node_first_then_this_shows_what_reaches_it_and_7de696f,
    /** Beside Explore, when no node of the walk is the symbol open there. */
    noFocus: featureCopy.None_of_these_nodes_is_open_in_Explore_the_ring_marks_the_symbol__b4c9e0f,
};
