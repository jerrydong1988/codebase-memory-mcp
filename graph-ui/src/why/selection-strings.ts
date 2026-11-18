import { featureCopy } from '../i18n/features/why';
/**
 * The words of the selection context where it reads a Galaxy scope (hand test
 * K13). Every sentence names where the relationships come from and what the
 * scope leaves out; nothing here claims completeness the scope does not have.
 */
const byType = (types: readonly [string, number][]) => types.map(([type, count]) => `${type} ${count.toLocaleString()}`).join(' · ');

export const selectionScopeText = {
    selectSomething: featureCopy.Select_a_file_or_symbol_to_inspect_its_indexed_connections_58f283f,
    readSource: featureCopy.Read_source_evidence_358c641,
    incoming: (count: number, types: readonly [string, number][]) =>
        featureCopy.Incoming_relationships_0_1_eb92367(count.toLocaleString(), types.length ? ` (${byType(types)})` : ''),
    outgoing: (count: number, types: readonly [string, number][]) =>
        featureCopy.Outgoing_relationships_0_1_894527b(count.toLocaleString(), types.length ? ` (${byType(types)})` : ''),
    fromScope: (depth?: number) => featureCopy.From_the_loaded_Galaxy_scope_0_every_indexed_relationship_type_1bac68b(depth ? ` (${depth === 1 ? '1 layer' : `${depth} layers`})` : ''),
    fromSnapshot: featureCopy.From_the_repository_map_snapshot_It_is_capped_and_can_miss_relati_febde7e,
    loading: featureCopy.The_scope_is_still_loading_relationships_may_be_missing_until_it__ebe4952,
    partial: (layer: number, limit: 'nodes' | 'edges') => featureCopy.Layer_0_of_this_scope_stopped_at_the_render_limit_1_8a7fc97(layer, limit)
        + (layer > 1 ? featureCopy.The_direct_relationships_of_the_root_are_complete_deeper_ones_may_5f267ec : featureCopy.The_direct_relationships_of_the_root_are_incomplete_994e074),
    notTraced: (direction: 'inbound' | 'outbound') =>
        featureCopy.message_0_relationships_are_not_traced_in_this_scope_1_only_30ac7b8(direction === 'outbound' ? 'Incoming' : 'Outgoing', direction === 'outbound' ? 'outgoing' : 'incoming'),
    typesOnly: (types: readonly string[]) => featureCopy.Only_these_relationship_types_are_traced_0_57341d6(types.length ? types.join(', ') : 'none'),
};
