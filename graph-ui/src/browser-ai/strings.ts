import { featureCopy } from '../i18n/features/browser-ai';
import type { DroppedReason } from './explanation-response';
import { galaxyNodeNameText, type BranchNameWords } from '../galaxy/galaxy-strings';

export const browserAiText = {
    title: featureCopy.Browser_AI_de42f5d,
    subtitle: featureCopy.Optional_explanations_generated_on_this_device_3620951,
    close: featureCopy.Close_browser_AI_de3e15a,
    model: featureCopy.Model_68c2cc7,
    download: featureCopy.Download_enable_a16d928,
    prepare: featureCopy.Enable_from_cache_download_05af36d,
    preparing: featureCopy.Preparing_the_browser_model_de54d1c,
    ready: featureCopy.Ready_on_this_device_a532da7,
    generating: featureCopy.Writing_a_short_explanation_13b8eed,
    off: featureCopy.Off_e3de5ab,
    cancel: featureCopy.Cancel_77dfd21,
    disable: featureCopy.Disable_9a7d4e0,
    remove: featureCopy.Remove_downloaded_model_95df19c,
    removing: featureCopy.Removing_the_model_cache_d522252,
    explain: featureCopy.Explain_source_98d9195,
    failed: featureCopy.Browser_AI_could_not_complete_this_step_95bf13c,
    optIn: featureCopy.Enabling_downloads_about_566_MB_from_Hugging_Face_if_the_files_ar_8f9d2e0,
    device: featureCopy.Requires_WebGPU_with_shader_f16_and_enough_free_GPU_memory_Runtim_42f93ad,
    privacy: featureCopy.Source_is_processed_on_this_device_It_is_not_sent_to_Hugging_Face_32f5883,
    storage: featureCopy.Downloads_use_a_dedicated_browser_cache_Disable_stops_the_worker__fc18852,
    excerpt: featureCopy.Source_to_explain_30ea370,
    truncated: featureCopy.Only_the_first_6_000_characters_of_this_excerpt_will_be_used_1e1c838,
    noSource: featureCopy.Open_a_file_or_focus_a_function_in_Explore_then_return_here_be1a70d,
    output: featureCopy.Unverified_explanation_1da9fd5,
    outputNote: featureCopy.Generated_text_can_be_wrong_Check_it_against_the_source_and_index_5d9fe0e,
    provenance: featureCopy.Model_details_0b10896,
    revision: featureCopy.Pinned_revision_1523905,
    format: featureCopy.q4f16_160_output_tokens_maximum_848975d,
    progress: (loaded: number, total: number) => featureCopy.message_0_1_MB_b232633((loaded / 1_000_000).toFixed(1), (total / 1_000_000).toFixed(1)),
    location: (path: string, line: number) => `${path}:${line}`,
};

/** Words for graph facts in the prompt (always English) and for the listed
 * relationship answer, which follows the language of the question. Numbers are
 * written as the language writes them: 5,548 and 5.548 (C1). */
const en = (value: number) => value.toLocaleString('en-US');
const de = (value: number) => value.toLocaleString('de-DE');
/** Node kinds of the index in German: the noun, its plural and its gender (W8, W9). */
const GERMAN_KINDS: Readonly<Record<string, readonly [string, string, 'f' | 'm' | 'n']>> = {
    project: [featureCopy.Projekt_20bda6d, featureCopy.Projekte_3930f79, 'n'], package: [featureCopy.Paket_3c97ce0, featureCopy.Pakete_42c7e50, 'n'], folder: [featureCopy.Ordner_adfefd7, featureCopy.Ordner_adfefd7, 'm'], file: [featureCopy.Datei_e9e7baf, featureCopy.Dateien_a41c619, 'f'],
    module: [featureCopy.Modul_7182982, featureCopy.Module_b8ff028, 'n'], class: [featureCopy.Klasse_f495100, featureCopy.Klassen_23bd55b, 'f'], function: [featureCopy.Funktion_4ab9dd6, featureCopy.Funktionen_c5f23a4, 'f'], method: [featureCopy.Methode_5dcc6d5, featureCopy.Methoden_70e2e96, 'f'],
    interface: [featureCopy.Schnittstelle_122825e, featureCopy.Schnittstellen_38b9db2, 'f'], enum: [featureCopy.Aufz_hlung_9f91967, featureCopy.Aufz_hlungen_de0f794, 'f'], type: ['Typ', 'Typen', 'm'], variable: [featureCopy.Variable_19de69c, featureCopy.Variablen_0a886d5, 'f'],
    route: [featureCopy.Route_4999528, featureCopy.Routen_698aa77, 'f'], resource: [featureCopy.Ressource_23ef58b, featureCopy.Ressourcen_a92570c, 'f'], section: [featureCopy.Abschnitt_6908553, featureCopy.Abschnitte_1608b9f, 'm'], field: [featureCopy.Feld_daa3590, featureCopy.Felder_1092713, 'n'],
    struct: [featureCopy.Struktur_8ad8733, featureCopy.Strukturen_e7438ce, 'f'], trait: [featureCopy.Trait_b36366d, featureCopy.Traits_d1a6160, 'm'], macro: [featureCopy.Makro_3a6ebeb, featureCopy.Makros_61e432e, 'n'], constant: [featureCopy.Konstante_562622f, featureCopy.Konstanten_6387736, 'f'],
    namespace: [featureCopy.Namensraum_9a8f594, featureCopy.Namensr_ume_dca97f3, 'm'], property: [featureCopy.Eigenschaft_b9c8028, featureCopy.Eigenschaften_2e237aa, 'f'], decorator: [featureCopy.Dekorator_d1e192d, featureCopy.Dekoratoren_e5915b6, 'm'],
    test: [featureCopy.Test_640ab2b, featureCopy.Tests_39fdec1, 'm'], channel: [featureCopy.Kanal_5ccfb11, featureCopy.Kan_le_52de722, 'm'], node: [featureCopy.Knoten_b9dc9c3, featureCopy.Knoten_b9dc9c3, 'm'], symbol: [featureCopy.Symbol_3f84ef5, featureCopy.Symbole_1030a11, 'n'],
    branch: ['Branch-Knoten', 'Branch-Knoten', 'm'],
};
/** The Branch node in the words of the answer: "django-demo · detached HEAD" (round 4, N1). A German
 * answer keeps the words of the Galaxy label, so the node it names can be found in the picture. */
const englishNodeNames: BranchNameWords = galaxyNodeNameText;
const germanNodeNames: BranchNameWords = {
    detached: galaxyNodeNameText.detached,
    workingTree: galaxyNodeNameText.workingTree,
    branch: (name: string) => featureCopy.Branch_0_fc7966b(name),
    inProject: (project: string, what: string) => `${project} · ${what}`,
};
const englishRelationshipWords = {
    more: (count: number) => featureCopy.message_0_more_61f571c(en(count)),
    hops: (depth: number) => depth === 0 ? featureCopy.the_selection_only_67ebd07 : depth === 1 ? featureCopy.message_1_hop_73ce478 : featureCopy.message_0_hops_8fc4586(depth),
    both: featureCopy.in_both_directions_093fb86, inbound: featureCopy.incoming_only_4c6b9d6, outbound: featureCopy.outgoing_only_a5a379d,
    allTypes: featureCopy.all_relationship_types_c3fd5c2,
    onlyTypes: (types: readonly string[]) => types.length ? featureCopy.only_0_7a4d78f(types.join(', ')) : featureCopy.no_relationship_types_5214616,
    size: (nodes: number, edges: number) => featureCopy.message_0_1_and_2_3_8697cfa(en(nodes), nodes === 1 ? 'symbol' : 'symbols', en(edges), edges === 1 ? 'relationship' : 'relationships'),
    /** The scope finished loading; it is not the whole graph (W4). */
    complete: featureCopy.fully_loaded_d4cca97,
    loading: featureCopy.still_loading_so_this_is_a_partial_preview_a082be4,
    partial: (error?: string) => featureCopy.incomplete_0_aae98ea(error ? `: ${error}` : ''),
    /** A layer stopped at the render limit: the layers inside it are whole, it and those further out are not (C1). As the
     * Galaxy tooltip says it, loading stops after the request that passes the limit (5,548 of 5,000), and the scene draws up
     * to the limit. The limit gets a sentence of its own, so nodes never stand beside the symbols of the scope size (W1). */
    renderLimited: (layer: number, limit: number, kind: 'nodes' | 'edges') => featureCopy.partial_Layer_0_stopped_loading_after_the_request_that_took_it_pa_b93c9c7(layer)
        + featureCopy.the_render_limit_of_0_1_the_scene_draws_at_most_2_3_d381ee0(en(limit), kind, en(limit), kind)
        + (layer > 1 ? featureCopy.so_counts_and_names_further_out_can_be_incomplete_f8fc016 : featureCopy.so_counts_and_names_can_be_incomplete_the_direct_relationships_in_f945702),
    exhausted: featureCopy.nothing_further_beyond_this_depth_ba12d9a,
    /** A node kind as the answer's language writes it: "Class", "Klasse" (W8). */
    kindName: (kind: string) => kind,
    /** How a Branch node is named (round 4, N1). */
    nodeNames: englishNodeNames,
    scope: (shape: string, size: string, state: string) => featureCopy.Scope_0_1_2_3c696e9(shape, size, state),
    /** Each number with its unit: "Incoming: 23 relationships from 12 symbols", never "23 from 12", which reads like a score (W2). */
    incoming: (total: number, symbols?: number) => featureCopy.Incoming_0_1_561cb93(en(total), total === 1 ? 'relationship' : 'relationships')
        + `${symbols === undefined ? '' : featureCopy.from_0_1_2c703d9(en(symbols), symbols === 1 ? 'symbol' : 'symbols')}.`,
    outgoing: (total: number, symbols?: number) => featureCopy.Outgoing_0_1_3ea2c5b(en(total), total === 1 ? 'relationship' : 'relationships')
        + `${symbols === undefined ? '' : featureCopy.to_0_1_a17b4dc(en(symbols), symbols === 1 ? 'symbol' : 'symbols')}.`,
    noIncoming: featureCopy.Incoming_no_relationships_in_this_scope_9b034fe,
    noOutgoing: featureCopy.Outgoing_no_relationships_in_this_scope_fa4d7a2,
    incomingNotLoaded: featureCopy.Incoming_not_loaded_the_scope_does_not_follow_incoming_edges_53260e8,
    outgoingNotLoaded: featureCopy.Outgoing_not_loaded_the_scope_does_not_follow_outgoing_edges_4c13907,
    cut: (side: 'incoming' | 'outgoing') => featureCopy.message_0_relationships_left_out_of_this_snapshot_30a5efa(side === 'incoming' ? 'Incoming' : 'Outgoing'),
    truncated: featureCopy.the_snapshot_left_part_of_its_relationships_out_so_counts_and_nam_ba46a9e,
    moreTypes: (count: number) => featureCopy.message_0_more_relationship_1_89566af(en(count), count === 1 ? 'type' : 'types'),
    internal: (summary: string) => featureCopy.Between_the_selected_symbols_0_f029e4f(summary),
    beyond: (summary: string) => featureCopy.Further_out_in_the_scope_0_8ef0b9b(summary),
    selected: (what: string) => featureCopy.Selected_0_0f9855b(what),
    documentation: (text: string) => featureCopy.Documentation_0_7542b61(text),
    notInScope: (label: string, kind: string) => featureCopy.Selected_0_1_its_symbols_are_not_in_the_loaded_scope_911c03a(label, kind),
    selectedGroup: (kind: string, label: string, count: number, listed: string, omitted: number) =>
        featureCopy.Selected_0_1_with_2_symbols_3_4_47e4c93(kind, label, en(count), listed, omitted > 0 ? `; +${en(omitted)} more` : ''),
    /** The heading of a listed answer counts what it lists, the CALLS edges; every other relationship
     * of that side is counted apart, so 23 relationships never head a list of 11 callers (W3). */
    callers: (name: string, count: number) => featureCopy.message_0_1_CALLS_of_2_in_the_loaded_graph_657b03d(en(count), count === 1 ? 'caller' : 'callers', name),
    callees: (name: string, count: number) => featureCopy.message_0_calls_1_2_CALLS_in_the_loaded_graph_d6de3f0(name, en(count), count === 1 ? 'symbol' : 'symbols'),
    all: (side: 'incoming' | 'outgoing', total: number, symbols?: number) => featureCopy.All_0_1_2_665d447(side, en(total), total === 1 ? 'relationship' : 'relationships')
        + `${symbols === undefined ? '' : ` ${side === 'incoming' ? featureCopy.from_0b1e95c : featureCopy.to_4374aae} ${en(symbols)} ${symbols === 1 ? featureCopy.symbol_810a25d : featureCopy.symbols_46a22d7}`}.`,
    /** Why a side cannot be listed; the reason follows. */
    unlisted: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.The_callers_of_0_cannot_be_listed_from_this_scope_3280482(name)
        : featureCopy.What_0_calls_cannot_be_listed_from_this_scope_ba4f2b6(name),
    nothing: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.message_0_has_no_callers_and_no_other_incoming_relationships_in_this_scop_a3e819a(name)
        : featureCopy.message_0_calls_nothing_and_has_no_other_outgoing_relationships_in_this_s_ef76ca2(name),
    cutListed: (side: 'incoming' | 'outgoing') => featureCopy.The_snapshot_left_the_0_relationships_out_0cd8e75(side),
    /** One edge type of a listed answer with the number of its symbols: "TESTS (11)". */
    typeCount: (type: string, count: number) => `${type} (${en(count)})`,
    /** What an incoming DEFINES edge from a file, module or class says about the selection. */
    definer: (kind: string, count: number, name: string) => {
        const noun = kind.toLowerCase();
        return count === 1 ? featureCopy.the_0_that_defines_1_8e3372d(noun, name) : featureCopy.the_0_that_define_1_fb3f0f2(/(?:s|x|ch|sh)$/.test(noun) ? `${noun}es` : `${noun}s`, name);
    },
    noCalls: (name: string, side: 'incoming' | 'outgoing') => side === 'incoming'
        ? featureCopy.No_CALLS_edge_reaches_0_in_this_scope_e0216e6(name) : featureCopy.message_0_has_no_outgoing_CALLS_edge_in_this_scope_0781fe3(name),
    otherRelationships: (side: 'incoming' | 'outgoing') => featureCopy.Other_0_relationships_1d345fa(side),
    /** The Galaxy controls as the UI labels them: the direction select and Expand +1 (W8). */
    notLoaded: (side: 'incoming' | 'outgoing'): string => side === 'incoming'
        ? featureCopy.The_current_scope_does_not_follow_incoming_relationships_Choose_I_956ee27
        : featureCopy.The_current_scope_does_not_follow_outgoing_relationships_Choose_O_50d0333,
    notExpanded: featureCopy.The_current_scope_shows_the_selection_only_Click_Expand_1_in_Gala_d9f5e00,
    stillLoading: featureCopy.The_scope_is_still_loading_this_list_can_grow_792b345,
    listedFromGraph: featureCopy.Listed_from_the_indexed_graph_not_generated_by_the_model_32ddcbc,
    didYouMean: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.Did_you_mean_callers_of_0_75f131b(name) : featureCopy.Did_you_mean_what_0_calls_02dc0fc(name),
    didYouMeanBoth: (name: string) => featureCopy.Did_you_mean_callers_of_0_and_what_it_calls_de30a74(name),
    /** A choice, not an order: the buttons "Show the list" and "Ask the model" follow (W9). */
    uncertain: featureCopy.The_question_was_not_recognized_for_certain_You_can_show_the_list_9769a9a,
    uncertainName: (typed: string, name: string) => featureCopy.message_0_does_not_match_the_name_of_the_selection_1_You_can_show_the_lis_0a6ca03(typed, name),
    showList: featureCopy.Show_the_list_f085402,
    /** Offered under a listed answer or a suggestion, which the model did not write. */
    askModel: featureCopy.Ask_the_model_e8cc7c7,
};
export type RelationshipWords = typeof englishRelationshipWords;

export const relationshipWords: { en: RelationshipWords; de: RelationshipWords } = {
    en: englishRelationshipWords,
    de: {
        more: (count: number) => featureCopy.message_0_weitere_13459e5(de(count)),
        hops: (depth: number) => depth === 0 ? featureCopy.nur_die_Auswahl_dc8137b : depth === 1 ? featureCopy.message_1_Schritt_8990eb7 : featureCopy.message_0_Schritte_e078c07(depth),
        both: featureCopy.in_beide_Richtungen_26b4740, inbound: featureCopy.nur_eingehend_093ddf3, outbound: featureCopy.nur_ausgehend_93d4e54,
        allTypes: featureCopy.alle_Beziehungstypen_a36cad5,
        onlyTypes: (types: readonly string[]) => types.length ? featureCopy.nur_0_cf287b9(types.join(', ')) : featureCopy.keine_Beziehungstypen_348b94e,
        size: (nodes: number, edges: number) => featureCopy.message_0_1_und_2_3_dad1bba(de(nodes), nodes === 1 ? 'Symbol' : 'Symbole', de(edges), edges === 1 ? 'Beziehung' : 'Beziehungen'),
        complete: featureCopy.vollst_ndig_geladen_50fe2b9,
        loading: featureCopy.l_dt_noch_das_ist_eine_Vorschau_e3662e2,
        partial: (error?: string) => featureCopy.unvollst_ndig_0_d6c367f(error ? `: ${error}` : ''),
        renderLimited: (layer: number, limit: number, kind: 'nodes' | 'edges') => {
            const unit = kind === 'nodes' ? featureCopy.Knoten_b9dc9c3 : featureCopy.Kanten_83716ac;
            return featureCopy.unvollst_ndig_Ebene_0_h_rte_nach_der_Anfrage_auf_zu_laden_die_sie_30e5303(layer, de(limit), unit)
                + featureCopy.die_Szene_zeichnet_h_chstens_0_1_3b6c7cb(de(limit), unit)
                + (layer > 1 ? featureCopy.daher_k_nnen_Anzahlen_und_Namen_weiter_au_en_fehlen_2df4d3b : featureCopy.daher_k_nnen_Anzahlen_und_Namen_fehlen_auch_bei_den_direkten_Bezi_76c45a4);
        },
        exhausted: featureCopy.dahinter_folgt_nichts_mehr_5c842e0,
        kindName: (kind: string) => GERMAN_KINDS[kind.toLowerCase()]?.[0] ?? kind,
        nodeNames: germanNodeNames,
        scope: (shape: string, size: string, state: string) => featureCopy.Ausschnitt_0_1_2_6aa9120(shape, size, state),
        incoming: (total: number, symbols?: number) => featureCopy.Eingehend_0_1_a31705e(de(total), total === 1 ? 'Beziehung' : 'Beziehungen')
            + `${symbols === undefined ? '' : featureCopy.von_0_1_420a7d2(de(symbols), symbols === 1 ? 'Symbol' : 'Symbolen')}.`,
        outgoing: (total: number, symbols?: number) => featureCopy.Ausgehend_0_1_538dbf8(de(total), total === 1 ? 'Beziehung' : 'Beziehungen')
            + `${symbols === undefined ? '' : featureCopy.zu_0_1_f321aa2(de(symbols), symbols === 1 ? 'Symbol' : 'Symbolen')}.`,
        noIncoming: featureCopy.Eingehend_keine_Beziehungen_in_diesem_Ausschnitt_6f3037a,
        noOutgoing: featureCopy.Ausgehend_keine_Beziehungen_in_diesem_Ausschnitt_cd7d3d7,
        incomingNotLoaded: featureCopy.Eingehend_nicht_geladen_der_Ausschnitt_folgt_keinen_eingehenden_K_4b84534,
        outgoingNotLoaded: featureCopy.Ausgehend_nicht_geladen_der_Ausschnitt_folgt_keinen_ausgehenden_K_65827d9,
        cut: (side: 'incoming' | 'outgoing') => featureCopy.message_0_Beziehungen_in_diesem_Schnappschuss_ausgelassen_b6a7bd4(side === 'incoming' ? 'Eingehend' : 'Ausgehend'),
        truncated: featureCopy.der_Schnappschuss_hat_einen_Teil_der_Beziehungen_ausgelassen_Anza_2fd4522,
        moreTypes: (count: number) => featureCopy.message_0_weitere_1_8f65cff(de(count), count === 1 ? 'Beziehungstyp' : 'Beziehungstypen'),
        internal: (summary: string) => featureCopy.Zwischen_den_ausgew_hlten_Symbolen_0_de68b6b(summary),
        beyond: (summary: string) => featureCopy.Weiter_au_en_im_Ausschnitt_0_740d7f5(summary),
        selected: (what: string) => featureCopy.Ausgew_hlt_0_982401b(what),
        documentation: (text: string) => featureCopy.Dokumentation_0_bb98922(text),
        notInScope: (label: string, kind: string) => featureCopy.Ausgew_hlt_0_1_die_Symbole_der_Auswahl_sind_nicht_im_geladenen_Au_774df72(label, kind),
        selectedGroup: (kind: string, label: string, count: number, listed: string, omitted: number) =>
            featureCopy.Ausgew_hlt_0_1_mit_2_Symbolen_3_4_8ff38dd(kind, label, de(count), listed, omitted > 0 ? `; +${de(omitted)} weitere` : ''),
        callers: (name: string, count: number) => featureCopy.message_0_Aufrufer_CALLS_von_1_im_geladenen_Graphen_4837daa(de(count), name),
        callees: (name: string, count: number) => featureCopy.message_0_ruft_im_geladenen_Graphen_1_2_auf_CALLS_7bdc92d(name, de(count), count === 1 ? 'Symbol' : 'Symbole'),
        all: (side: 'incoming' | 'outgoing', total: number, symbols?: number) => featureCopy.Alle_0_1_2_1893b9f(side === 'incoming' ? 'eingehenden' : 'ausgehenden', de(total), total === 1 ? 'Beziehung' : 'Beziehungen')
            + `${symbols === undefined ? '' : ` ${side === 'incoming' ? featureCopy.von_445584e : featureCopy.zu_e3abab1} ${de(symbols)} ${symbols === 1 ? featureCopy.Symbol_3f84ef5 : featureCopy.Symbolen_20f421b}`}.`,
        unlisted: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.Die_Aufrufer_von_0_lassen_sich_aus_diesem_Ausschnitt_nicht_auflis_a81ab1e(name)
            : featureCopy.Was_0_aufruft_l_sst_sich_aus_diesem_Ausschnitt_nicht_auflisten_87dc2af(name),
        nothing: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.message_0_hat_in_diesem_Ausschnitt_keine_Aufrufer_und_keine_anderen_einge_9d92166(name)
            : featureCopy.message_0_ruft_in_diesem_Ausschnitt_nichts_auf_und_hat_keine_anderen_ausg_a3706d7(name),
        cutListed: (side: 'incoming' | 'outgoing') => featureCopy.Der_Schnappschuss_hat_die_0_Beziehungen_ausgelassen_ee338dc(side === 'incoming' ? 'eingehenden' : 'ausgehenden'),
        typeCount: (type: string, count: number) => `${type} (${de(count)})`,
        /** Article and relative pronoun follow the gender of the kind: "der Ordner, der", "die Schnittstelle, die" (W9). */
        definer: (kind: string, count: number, name: string) => {
            const known = GERMAN_KINDS[kind.toLowerCase()];
            const [noun, plural, gender] = known ?? [featureCopy.Symbol_0_2b4c7bb(kind), featureCopy.Symbole_0_925b744(kind), 'n'];
            const article = gender === 'f' ? featureCopy.die_8f59501 : gender === 'm' ? featureCopy.der_7d44c33 : featureCopy.das_bebabb6;
            return count === 1 ? featureCopy.message_0_1_2_3_definiert_70ee7fe(article, noun, article, name) : featureCopy.die_0_die_1_definieren_98efb60(plural, name);
        },
        noCalls: (name: string, side: 'incoming' | 'outgoing') => side === 'incoming'
            ? featureCopy.Keine_CALLS_Kante_f_hrt_in_diesem_Ausschnitt_zu_0_2962f66(name) : featureCopy.message_0_hat_in_diesem_Ausschnitt_keine_ausgehende_CALLS_Kante_24e41b7(name),
        /** "Andere": the types other than CALLS, also where no CALLS edge exists (W3). */
        otherRelationships: (side: 'incoming' | 'outgoing') => featureCopy.Andere_0_Beziehungen_ff4002d(side === 'incoming' ? 'eingehende' : 'ausgehende'),
        notLoaded: (side: 'incoming' | 'outgoing') => side === 'incoming'
            ? featureCopy.Der_aktuelle_Ausschnitt_folgt_keinen_eingehenden_Beziehungen_W_hl_5f3a449
            : featureCopy.Der_aktuelle_Ausschnitt_folgt_keinen_ausgehenden_Beziehungen_W_hl_41b2735,
        notExpanded: featureCopy.Der_aktuelle_Ausschnitt_zeigt_nur_die_Auswahl_Klicke_in_Galaxy_au_fc08701,
        stillLoading: featureCopy.Der_Ausschnitt_l_dt_noch_die_Liste_kann_wachsen_e2c70a4,
        listedFromGraph: featureCopy.Aus_dem_indizierten_Graphen_gelistet_nicht_vom_Modell_erzeugt_e99b22f,
        didYouMean: (side: 'incoming' | 'outgoing', name: string) => side === 'incoming' ? featureCopy.Meintest_du_Aufrufer_von_0_d95b456(name) : featureCopy.Meintest_du_von_0_aufgerufene_Symbole_9f24481(name),
        didYouMeanBoth: (name: string) => featureCopy.Meintest_du_Aufrufer_von_0_und_was_1_aufruft_7ae8c24(name, name),
        uncertain: featureCopy.Die_Frage_wurde_nicht_sicher_erkannt_Du_kannst_dir_die_Liste_aus__87f1270,
        uncertainName: (typed: string, name: string) => featureCopy.message_0_entspricht_nicht_dem_Namen_der_Auswahl_1_Du_kannst_dir_die_List_9178ac3(typed, name),
        showList: featureCopy.Liste_anzeigen_e90c121,
        askModel: featureCopy.Modell_fragen_35a6d46,
    },
};

/** Notes of the local chat dock about how an answer was produced or bounded. */
const tokens = (value: number) => value.toLocaleString('en-US');
const code = (text: string) => `\`${text.replace(/`/g, "'")}\``;
export const browserChatText = {
    shortened: featureCopy.Token_limit_reached_the_answer_was_cut_short_a7cf041,
    /** What the expanded token-limit note says, with the limits the answer ran into. */
    limitReached: (input: number, output: number) => featureCopy.This_answer_used_all_0_output_tokens_it_was_allowed_The_input_lim_e9a428c(tokens(output), tokens(input)),
    /** `cap` is what automatic explanations write at most; below it they stop at the reader's own limit,
     * which is no design choice to keep them short (W6). */
    limitAutomatic: (automaticInput: number, automatic: number, input: number, output: number, cap: number) => featureCopy.Automatic_explanations_stop_after_0_output_tokens_3c16132(tokens(automatic))
        + featureCopy.message_0_and_read_at_most_1_input_tokens_of_source_and_facts_c1d06b6(automatic < cap ? ', your output limit,' : ' so they stay short,', tokens(automaticInput))
        + featureCopy.A_question_in_the_chat_may_read_up_to_0_input_tokens_and_answer_w_a6a900c(tokens(input), tokens(output), output > automatic ? ' Ask in the chat for a longer answer.' : ''),
    automaticRoom: (cap: number) => featureCopy.Raise_the_output_limit_in_the_agent_configuration_and_automatic_e_33e1efa(tokens(cap)),
    outputRoom: (output: number, max: number) => output < max ? featureCopy.You_can_raise_the_output_limit_up_to_0_tokens_in_the_agent_config_b4bd9c9(tokens(max))
        : featureCopy.The_output_limit_is_at_its_maximum_of_0_tokens_f49c395(tokens(max)),
    /** At the maximum a larger model writes no longer answer: every model stops at the same limit (W6). */
    narrower: (sameForLarger: boolean) => featureCopy.message_0_Ask_about_one_part_of_the_code_or_ask_for_the_rest_of_the_answe_1c05b8a(sameForLarger ? 'Larger models have the same limit. ' : ''),
    changeOutputLimit: featureCopy.Change_the_output_limit_e8bef38,
    largerModels: (sameLimit: boolean) => featureCopy.A_larger_model_may_stay_closer_to_the_question_0_693235e(sameLimit ? ', but its output limit is the same' : '')
        + featureCopy.Each_is_a_one_time_download_and_needs_more_memory_than_its_downlo_12878f2,
    modelDownload: (name: string, size: string) => featureCopy.message_0_1_download_e8181d7(name, size),
    newConversation: featureCopy.New_conversation_7f031b1,
    /** The model's state in the agent configuration (K10). */
    cached: featureCopy.Cached_b169be9,
    loadCached: featureCopy.Load_model_cached_no_download_4d3dab0,
    autoLoad: featureCopy.Load_the_chosen_model_on_start_when_it_is_cached_41710c3,
    autoLoadNote: featureCopy.Only_from_this_browser_s_cache_nothing_is_downloaded_on_start_A_p_27dc63e,
    resumeFailed: featureCopy.The_cached_model_could_not_be_loaded_without_a_download_Load_it_i_b5a68b7,
    /** Under an answer that names what its source and graph facts do not contain (K12). */
    /** Six names and the rest counted; with many unknown names the answer is most likely invented (W7). */
    unsupportedNames: (names: readonly string[]) => {
        const listed = `${names.slice(0, 6).join(', ')}${names.length > 6 ? featureCopy.message_0_more_981ba01((names.length - 6).toLocaleString('en-US')) : ''}`;
        return names.length >= 8 ? featureCopy.message_0_names_in_this_answer_are_not_in_the_source_or_graph_facts_it_wa_b235303(names.length.toLocaleString('en-US'), listed)
            : featureCopy.Not_in_the_source_or_graph_facts_this_answer_was_given_0_Check_th_32f251d(listed);
    },
    /** Who wrote which part of a grounded automatic explanation (K7). */
    factsAndSentence: featureCopy.Facts_listed_from_the_indexed_graph_the_last_sentence_is_generate_c0b5699,
    factsOnly: featureCopy.Listed_from_the_indexed_graph_not_generated_by_the_model_32ddcbc,
    /** What the left out sentence claimed or named, and what it was checked against (W5). */
    sentenceDropped: (reason?: DroppedReason) => featureCopy.Listed_from_the_indexed_graph_The_model_s_sentence_0_and_was_left_3c03eab(!reason ? 'was not supported by the source or the facts'
        : reason.kind === 'claim' ? `claimed something the source does not show (here: "${reason.text}")`
            : `named something that is in neither the source nor the facts (here: ${code(reason.text)})`),
    explanationDropped: (reason?: DroppedReason) => featureCopy.The_model_s_explanation_0_b111e4a(!reason ? 'was not supported by the source'
        : `${reason.kind === 'claim' ? 'claimed' : 'named'} something the source does not show (here: ${reason.kind === 'claim' ? `"${reason.text}"` : code(reason.text)})`)
        + featureCopy.and_was_left_out_Ask_a_question_about_the_code_instead_bee12cc,
    /** The same for facts read from an open workflow file (K12). */
    fileFactsAndSentence: featureCopy.Facts_read_from_the_file_the_text_after_them_is_generated_by_the__2e42a0b,
    fileFactsOnly: featureCopy.Read_from_the_file_not_generated_by_the_model_65dcd88,
    fileSentenceDropped: (reason?: DroppedReason) => featureCopy.Read_from_the_file_The_model_s_text_0_d418e43(!reason ? 'was not supported by the file'
        : `${reason.kind === 'claim' ? 'claimed' : 'named'} something the file does not show (here: ${reason.kind === 'claim' ? `"${reason.text}"` : code(reason.text)})`)
        + featureCopy.and_was_left_out_a4bef6f,
    writingSentence: featureCopy.Reading_the_source_the_model_is_adding_one_sentence_24ffed3,
    readingFacts: featureCopy.Listing_the_facts_d9e9973,
    /** Above the first question about another file or selection (K17); topicText has it in both languages (W8). */
    topicBreak: (label: string) => featureCopy.New_topic_0_Earlier_messages_are_not_sent_with_these_questions_4852503(label),
    capacity: (nodes: number, edges: number, model: string, shown: number) =>
        featureCopy.message_0_nodes_1_edges_too_large_for_the_local_2_model_showing_3_ef04ade(nodes, edges, model, shown),
    historyTrimmed: (count: number) => featureCopy.message_0_earlier_1_left_out_to_fit_the_input_limit_a900999(count, count === 1 ? 'message was' : 'messages were'),
    waitingForScope: featureCopy.Waiting_for_the_complete_scope_before_explaining_e10881e,
    partialScope: featureCopy.This_scope_did_not_load_completely_so_it_is_not_explained_automat_1147595,
    tokenLimits: (model: string) => featureCopy.Token_limits_for_0_e1150f9(model),
    inputLimit: featureCopy.Input_context_e775330,
    outputLimit: featureCopy.Output_answer_cb99209,
    limitRange: (min: number, max: number) => featureCopy.message_0_to_1_tokens_eee0f63(min.toLocaleString('en-US'), max.toLocaleString('en-US')),
    limitsNote: (input: number, output: number) => featureCopy.Stored_in_this_browser_for_each_model_Automatic_explanations_use__918d821(input.toLocaleString('en-US'), output.toLocaleString('en-US')),
};

/** The divider above the first question about another file or selection, in the language of that question (K17, W8). */
export const topicText = {
    en: { topicBreak: browserChatText.topicBreak },
    de: { topicBreak: (label: string) => featureCopy.Neues_Thema_0_Fr_here_Nachrichten_werden_bei_diesen_Fragen_nicht__f0fa723(label) },
};

/** Who wrote which part of the answer to a general question about a selection, in its language (C5). */
export const groundedText = {
    en: { factsAndSentence: browserChatText.factsAndSentence, factsOnly: browserChatText.factsOnly, sentenceDropped: browserChatText.sentenceDropped,
        writingSentence: browserChatText.writingSentence },
    de: {
        factsAndSentence: featureCopy.Fakten_aus_dem_indizierten_Graphen_gelistet_der_letzte_Satz_ist_v_a61e8ad,
        factsOnly: featureCopy.Aus_dem_indizierten_Graphen_gelistet_nicht_vom_Modell_erzeugt_e99b22f,
        sentenceDropped: (reason?: DroppedReason) => featureCopy.Aus_dem_indizierten_Graphen_gelistet_Der_Satz_des_Modells_0_4e8164c(!reason ? 'wurde weggelassen, weil Quelltext und Fakten ihn nicht stützen'
            : reason.kind === 'claim' ? `behauptete etwas, das der Quelltext nicht zeigt (hier: „${reason.text}“), und wurde weggelassen`
                : `nannte etwas, das weder im Quelltext noch in den Fakten steht (hier: ${code(reason.text)}), und wurde weggelassen`),
        writingSentence: featureCopy.Der_Quelltext_wird_gelesen_das_Modell_f_gt_einen_Satz_hinzu_cd6c637,
    },
};

/** The reply to a prompt that asks nothing ("test", "hallo"): questions it could ask (C6). */
export const noQuestionText = {
    en: {
        heading: (typed: string) => featureCopy.No_question_was_recognized_in_0_You_can_ask_for_example_83a26f5(typed),
        note: featureCopy.Answered_without_the_model_a2dad3b,
        whatDoes: (name: string) => featureCopy.What_does_0_do_85ef960(name),
        whoCalls: (name: string) => featureCopy.Who_calls_0_9047fa7(name),
        whatCalls: (name: string) => featureCopy.What_does_0_call_fc38934(name),
        inDetail: (name: string) => featureCopy.Explain_0_in_detail_85bd65f(name),
        /** For a class: what it is, who uses it and what it inherits from; for a file or folder: what it contains (W9). */
        whatIs: (name: string) => featureCopy.What_is_0_2d64d05(name),
        whoUses: (name: string) => featureCopy.Who_uses_0_3b045be(name),
        whatInherits: (name: string) => featureCopy.What_does_0_inherit_from_99e5f07(name),
        whatContains: (name: string) => featureCopy.What_does_0_contain_c2e43d4(name),
        markedDoes: featureCopy.What_does_the_marked_code_do_cf5d0de,
        markedInDetail: featureCopy.Explain_the_marked_code_line_by_line_b13bfc5,
    },
    de: {
        heading: (typed: string) => featureCopy.In_0_wurde_keine_Frage_erkannt_Du_kannst_zum_Beispiel_fragen_9419514(typed),
        note: featureCopy.Ohne_das_Modell_beantwortet_e484ec8,
        whatDoes: (name: string) => featureCopy.Was_macht_0_0acf63c(name),
        whoCalls: (name: string) => featureCopy.Wer_ruft_0_auf_561300e(name),
        whatCalls: (name: string) => featureCopy.Was_ruft_0_auf_e8c4395(name),
        inDetail: (name: string) => featureCopy.Erkl_r_0_ausf_hrlich_e1db5db(name),
        whatIs: (name: string) => featureCopy.Was_ist_0_732db10(name),
        whoUses: (name: string) => featureCopy.Wer_verwendet_0_15e07fe(name),
        whatInherits: (name: string) => featureCopy.Wovon_erbt_0_fbd90d7(name),
        whatContains: (name: string) => featureCopy.Was_enth_lt_0_a04df3d(name),
        markedDoes: featureCopy.Was_macht_der_markierte_Code_a8bb263,
        markedInDetail: featureCopy.Erkl_r_den_markierten_Code_Zeile_f_r_Zeile_e541ea5,
    },
};

/** The chat's own reply when a question has no code or graph context (K11), in the language of the question. */
export const browserChatContextText = {
    en: {
        nothingSelected: featureCopy.Nothing_is_selected_for_me_to_explain_Select_a_node_in_Galaxy_or__4d2b05b,
        noFileOpen: featureCopy.No_file_is_open_in_Explore_Open_a_file_or_mark_code_in_it_then_as_90616aa,
        sourceUnavailable: (path: string) => featureCopy.The_source_of_0_is_not_available_Open_the_file_again_or_choose_an_a6c9cdd(path.replace(/`/g, "'")),
        notAsked: featureCopy.Answered_without_the_model_without_code_or_graph_facts_it_could_o_e5dbdaa,
    },
    de: {
        nothingSelected: featureCopy.Es_ist_nichts_ausgew_hlt_das_ich_erkl_ren_k_nnte_W_hle_einen_Knot_41fd6c7,
        noFileOpen: featureCopy.In_Explore_ist_keine_Datei_ge_ffnet_ffne_eine_Datei_oder_markiere_fec0d85,
        sourceUnavailable: (path: string) => featureCopy.Der_Quelltext_von_0_ist_nicht_verf_gbar_ffne_die_Datei_noch_einma_a08d1bc(path.replace(/`/g, "'")),
        notAsked: featureCopy.Ohne_das_Modell_beantwortet_ohne_Code_oder_Graph_Fakten_k_nnte_es_e8a99f2,
    },
};

/** The notes of an ⓘ Source block in plain words (W10). The prompt reads them in English; an
 * answer shows them in its language. */
const evidenceNotes = {
    staticGraph: { en: featureCopy.The_relationships_here_come_from_reading_the_code_they_do_not_sho_02708cf,
        de: featureCopy.Die_Beziehungen_hier_wurden_aus_dem_Code_gelesen_sie_zeigen_nicht_f6348bc },
};
export const staticGraphNote = evidenceNotes.staticGraph.en;
/** A known note in the language of the answer; any other note as it is. */
export const evidenceNote = (note: string, language: 'en' | 'de'): string => Object.values(evidenceNotes).find(item => item.en === note)?.[language] ?? note;

const count = (value: number) => value.toLocaleString('en-US');
const plural = (value: number, one: string, many: string) => `${count(value)} ${value === 1 ? one : many}`;
/** Architecture selections as sentences: for the prompt and for the explanation card. */
export const architectureWords = {
    kinds: { area: featureCopy.source_area_7895856, file: featureCopy.file_971c419, symbol: featureCopy.symbol_810a25d, route: featureCopy.route_fc166eb },
    more: (value: number) => featureCopy.message_0_more_61f571c(count(value)),
    selected: (kind: string, name: string, detail?: string) => featureCopy.Selected_0_1_2_45c5790(kind, name, detail ? ` (${detail})` : ''),
    selectedSymbol: (symbol: string) => featureCopy.Selected_symbol_0_b8f69b6(symbol),
    openedArea: (path: string) => featureCopy.Opened_source_area_0_bd2dfcc(path),
    openedFile: (path: string) => featureCopy.Opened_file_0_5a0eb3f(path),
    openedHotspots: (path: string) => featureCopy.Opened_hotspot_area_0_edc16ac(path),
    scopePart: (name: string, kind: string, files?: number, lines?: number) =>
        `${name} (${kind}${files !== undefined ? `, ${plural(files, 'file', 'files')}` : ''}${lines !== undefined ? `, ${plural(lines, 'indexed line', 'indexed lines')}` : ''})`,
    /** The parts a view shows of an opened area or file: the ones inside it, largest first, and the ones outside it. */
    parts: (items: readonly string[], total: number, scope: 'area' | 'file' = 'area', outside: readonly string[] = [], outsideTotal = outside.length) => {
        const more = (listed: readonly string[], all: number) => all > listed.length ? featureCopy.message_0_more_981ba01(count(all - listed.length)) : '';
        if (!outsideTotal) return featureCopy.Parts_shown_0_largest_first_1_2_b232bfa(count(total), items.join(', '), total > items.length ? `; ${count(total - items.length)} more` : '');
        const inside = total ? featureCopy.message_0_inside_the_1_largest_first_2_3_fe71732(count(total), scope, items.join(', '), more(items, total)) : '';
        return featureCopy.Parts_shown_0_1_2_outside_it_3_4_6e22435(count(total + outsideTotal), inside, count(outsideTotal), outside.join(', '), more(outside, outsideTotal));
    },
    outside: (name: string) => featureCopy.message_0_outside_fa8a634(name),
    partConnections: (described: readonly string[], omitted: number) => featureCopy.Connections_of_its_parts_0_1_2a9c07a(described.join('; '), omitted ? `; ${plural(omitted, 'more connection', 'more connections')} not listed` : ''),
    measured: (lines: number, measured: number, files: number, languages: readonly string[]) =>
        featureCopy.message_0_in_1_of_2_3_d1bd8a3(plural(lines, 'indexed line', 'indexed lines'), plural(measured, 'measured file', 'measured files'), count(files), languages.length ? `; files by language: ${languages.join(', ')}` : ''),
    fanIn: (value: number) => featureCopy.fan_in_0_e18af60(count(value)),
    complexity: (value: number) => featureCopy.complexity_0_5d93b31(count(value)),
    hotspots: (total: number, ranked: readonly string[]) => `${plural(total, 'hotspot finding', 'hotspot findings')}: ${ranked.join(', ')}.`,
    members: (listed: string) => featureCopy.Indexed_members_include_0_2a03e3f(listed),
    to: (name: string) => featureCopy.to_0_e684878(name),
    from: (name: string) => featureCopy.from_0_d012ee2(name),
    connections: (described: readonly string[], omitted: number) => featureCopy.Connections_0_1_ab679b2(described.join('; '), omitted ? `; ${plural(omitted, 'more connection', 'more connections')} not listed` : ''),
    view: (view: string, nodes: number, edges: number) => featureCopy.The_0_view_shows_1_and_2_b338a8d(view, plural(nodes, 'part', 'parts'), plural(edges, 'connection', 'connections')),
    connection: (source: string, target: string, type: string, total?: number) => featureCopy.Selected_connection_0_1_2_3_df2fed1(source, target, type, total !== undefined ? ` ×${count(total)}` : ''),
    example: (from: string, type: string, to: string, where?: string) => `${from} ${type} ${to}${where ? ` (${where})` : ''}`,
    examples: (items: readonly string[]) => featureCopy.For_example_0_2f8afdd(items.join('; ')),
    operation: (symbol: string) => featureCopy.Starting_operation_0_efe35fa(symbol),
    call: (caller: string, callee: string, where?: string) => featureCopy.Selected_call_0_calls_1_2_2a0de9e(caller, callee, where ? ` at ${where}` : ''),
    callAt: (line: number, args: readonly string[], callee?: string) => featureCopy.line_0_1_2_ac0f27c(line, callee ? ` calls ${callee}` : '', args.length ? ` with ${args.join(', ')}` : ''),
    directCalls: (total: number, calls: readonly string[]) => featureCopy.message_0_with_call_site_evidence_1_c34ed92(plural(total, 'direct call', 'direct calls'), calls.length ? `: ${calls.join('; ')}` : ''),
    path: (names: readonly string[]) => featureCopy.Call_chain_0_0a2d48a(names.join(' → ')),
    component: (name: string, members?: number, files?: number) => featureCopy.Component_0_1_2_b40b8ac(name, members !== undefined ? `, ${plural(members, 'member', 'members')}` : '', files !== undefined ? ` in ${plural(files, 'file', 'files')}` : ''),
    part: (kind: 'component' | 'group', name: string, members?: number, files?: number, components?: number, role?: string) =>
        featureCopy.Selected_0_1_2_3_4_5_f3ba72e(kind, name, components !== undefined ? `, ${plural(components, 'component', 'components')}` : '', members !== undefined ? `, ${plural(members, 'member', 'members')}` : '', files !== undefined ? ` in ${plural(files, 'file', 'files')}` : '', role === 'test' ? ', tests' : ''),
    representatives: (listed: string) => featureCopy.Representative_symbols_0_8b39e8a(listed),
    incoming: (items: readonly string[], total: number) => featureCopy.Incoming_from_0_1_94c342c(items.join(', '), total > items.length ? `; ${count(total - items.length)} more` : ''),
    outgoing: (items: readonly string[], total: number) => featureCopy.Outgoing_to_0_1_b1250d2(items.join(', '), total > items.length ? `; ${count(total - items.length)} more` : ''),
};

const counted = (value: number, one: string, many: string) => `${value.toLocaleString('en-US')} ${value === 1 ? one : many}`;
const gezaehlt = (value: number, one: string, many: string) => `${value.toLocaleString('de-DE')} ${value === 1 ? one : many}`;
/** A GitHub Actions workflow as facts counted from its keys: for the prompt and the explanation card (K12). */
export const workflowWords = {
    heading: featureCopy.Facts_read_from_the_file_counted_not_guessed_8dd2e51,
    name: (name: string) => featureCopy.Workflow_name_0_633552a(name),
    triggers: (items: readonly string[]) => `${items.length === 1 ? featureCopy.Trigger_d3f06a5 : featureCopy.Triggers_047708b}: ${items.join(', ')}.`,
    trigger: (event: string, types: readonly string[]) => `${event}${types.length ? featureCopy.types_0_953198b(types.join(', ')) : ''}`,
    jobs: (total: number, items: readonly string[]) => `${counted(total, 'job', 'jobs')}: ${items.join('; ')}${total > items.length ? featureCopy.message_0_more_f54c56f((total - items.length).toLocaleString('en-US')) : ''}.`,
    job: (id: string, name: string | undefined, runsOn: string | undefined, steps: number) =>
        `${id} (${[name ? `"${name}"` : '', runsOn ? `runs on ${runsOn}` : '', counted(steps, 'step', 'steps')].filter(Boolean).join(', ')})`,
    uses: (items: readonly string[]) => featureCopy.Actions_used_0_c443ddd(items.join(', ')),
};
export type WorkflowWords = typeof workflowWords;
/** The same facts for an outline asked for in German (C7). */
export const germanWorkflowWords: WorkflowWords = {
    heading: featureCopy.Aus_der_Datei_gelesene_Fakten_gez_hlt_nicht_geraten_d1a4297,
    name: (name: string) => featureCopy.Name_des_Workflows_0_6916836(name),
    triggers: (items: readonly string[]) => featureCopy.Ausl_ser_0_20228ee(items.join(', ')),
    trigger: (event: string, types: readonly string[]) => `${event}${types.length ? featureCopy.Typen_0_ca188ee(types.join(', ')) : ''}`,
    jobs: (total: number, items: readonly string[]) => `${gezaehlt(total, 'Job', 'Jobs')}: ${items.join('; ')}${total > items.length ? featureCopy.message_0_weitere_4b38a8b((total - items.length).toLocaleString('de-DE')) : ''}.`,
    job: (id: string, name: string | undefined, runsOn: string | undefined, steps: number) =>
        `${id} (${[name ? `"${name}"` : '', runsOn ? `läuft auf ${runsOn}` : '', gezaehlt(steps, 'Schritt', 'Schritte')].filter(Boolean).join(', ')})`,
    uses: (items: readonly string[]) => featureCopy.Verwendete_Actions_0_ac7f9fe(items.join(', ')),
};

/** The outline of a configuration file, answered from the file instead of the model (C7). */
const englishOutlineWords = {
    heading: (name: string, kind: string, lines: number) => featureCopy.message_0_1_2_Read_from_the_file_176f8c8(name, kind, counted(lines, 'line', 'lines')),
    kinds: { yaml: featureCopy.YAML_configuration_d804805, json: featureCopy.JSON_data_5f7ea21, toml: featureCopy.TOML_configuration_84f6c09, workflow: featureCopy.GitHub_Actions_workflow_3f00898 },
    list: (total: number) => featureCopy.list_of_0_eac400b(total.toLocaleString('en-US')),
    keys: (total: number) => counted(total, 'key', 'keys'),
    empty: featureCopy.empty_ad87109,
    text: featureCopy.text_block_3982c3f,
    more: (total: number) => featureCopy.message_0_more_61f571c(total.toLocaleString('en-US')),
    cut: featureCopy.The_rest_of_the_file_is_left_out_here_a703646,
    note: featureCopy.Read_from_the_file_not_generated_by_the_model_65dcd88,
};
export const fileOutlineWords: { en: typeof englishOutlineWords; de: typeof englishOutlineWords } = {
    en: englishOutlineWords,
    de: {
        heading: (name: string, kind: string, lines: number) => featureCopy.message_0_1_2_Aus_der_Datei_gelesen_e8d175d(name, kind, gezaehlt(lines, 'Zeile', 'Zeilen')),
        kinds: { yaml: 'YAML-Konfiguration', json: 'JSON-Daten', toml: 'TOML-Konfiguration', workflow: 'GitHub-Actions-Workflow' },
        list: (total: number) => featureCopy.Liste_mit_0_603581f(gezaehlt(total, 'Eintrag', 'Einträgen')),
        keys: (total: number) => gezaehlt(total, 'Schlüssel', 'Schlüssel'),
        empty: featureCopy.leer_40a26db,
        text: featureCopy.Textblock_65d4e79,
        more: (total: number) => featureCopy.message_0_weitere_13459e5(total.toLocaleString('de-DE')),
        cut: featureCopy.Der_Rest_der_Datei_ist_hier_ausgelassen_5abf2ae,
        note: featureCopy.Aus_der_Datei_gelesen_nicht_vom_Modell_erzeugt_7b0a40c,
    },
};

const listed = (items: readonly string[], total: number) => `${items.join(', ')}${total > items.length ? featureCopy.message_0_more_981ba01((total - items.length).toLocaleString('en-US')) : ''}`;
/** A configuration or text file as facts read from its text: for the prompt and the explanation card (K12). */
export const fileWords = {
    kind: (kind: string, lines?: number) => `File kind: ${kind}${lines === undefined ? '' : `; ${counted(lines, 'line', 'lines')}`}.`,
    selected: (start: number, end: number) => start === end ? featureCopy.Selected_line_0_of_the_file_3e5f0dd(start) : featureCopy.Selected_lines_0_1_of_the_file_ef1901f(start, end),
    topKeys: (total: number, items: readonly string[]) => featureCopy.Top_level_keys_0_1_6f2a616(total.toLocaleString('en-US'), listed(items, total)),
    keys: (total: number, items: readonly string[]) => featureCopy.Keys_0_1_b46e999(total.toLocaleString('en-US'), listed(items, total)),
    /** What a key holds: "(2 keys: `web`, `db`)", "(list of 2)", "(text)". */
    children: (total: number, items: readonly string[]) => total ? `${counted(total, 'key', 'keys')}: ${listed(items, total)}` : featureCopy.no_keys_f5bd8a3,
    keyCount: (total: number) => counted(total, 'key', 'keys'),
    list: (total: number) => featureCopy.list_of_0_eac400b(total.toLocaleString('en-US')),
    /** The keys the items of a list have: "item keys: `repo`, `rev`, `hooks`". */
    itemKeys: (total: number, items: readonly string[]) => featureCopy.item_keys_0_d3ba589(listed(items, total)),
    value: { text: featureCopy.text_372ea08, number: featureCopy.number_53b0a1b, boolean: featureCopy.true_or_false_10a3b67, empty: featureCopy.null_2be88ca },
    items: (total: number) => featureCopy.A_list_of_0_1dd1710(counted(total, 'item', 'items')),
    invalidJson: featureCopy.The_text_is_not_valid_JSON_so_no_keys_are_counted_24538a1,
    tables: (total: number, items: readonly string[]) => featureCopy.Tables_0_1_99c25c5(total.toLocaleString('en-US'), listed(items, total)),
    sections: (total: number, items: readonly string[]) => featureCopy.Sections_0_1_0e8d3e9(total.toLocaleString('en-US'), listed(items, total)),
    title: (title: string) => featureCopy.Title_0_15893bb(title),
    codeBlocks: (total: number) => `${counted(total, 'code block', 'code blocks')}.`,
    patterns: (total: number, items: readonly string[]) => `${counted(total, 'pattern', 'patterns')}: ${listed(items, total)}.`,
    root: (name: string) => featureCopy.Root_element_0_e825921(name),
};

/** Third hand test round (B1 to B7): the chat's own words for an answer handed to the model,
 * a topic the reader comes back to, a follow-up without context, facts read from code and the
 * purpose of well-known files. New strings only; the ones above keep their own wording. */
const englishRound3Text = {
    /** Under the question of a turn asked of the model from an answer the chat gave itself (B1). */
    askedModel: featureCopy.Asked_the_local_model_6bcfc54,
    /** Under every answer the model wrote freely (B1). */
    modelNote: featureCopy.Generated_by_the_local_model_it_can_be_wrong_f766e5b,
    askAgain: featureCopy.Ask_again_3f094ed,
    /** Above the first question about a file or selection that has earlier turns (B4). */
    backTo: (label: string) => featureCopy.Back_to_0_Earlier_messages_about_it_are_sent_again_2f3ca20(label),
    /** A follow-up ("und was noch?") right after a change of topic (B4). */
    followUp: (typed: string, label: string) => featureCopy.message_0_refers_to_earlier_messages_Those_were_about_another_topic_and_a_1264e59(typed, label),
    /** Above the lines read from the selected code (B2). */
    inSource: featureCopy.In_the_source_f1c2aa6,
    moreMembers: (total: number) => featureCopy.message_0_more_1_6852263(total.toLocaleString('en-US'), total === 1 ? 'attribute or method' : 'attributes and methods'),
    moreLines: (total: number) => `+${counted(total, 'more line', 'more lines')}`,
    /** An open code file or marked code as facts read from it, for a short general question (B3). */
    codeKind: (language: string) => language ? featureCopy.message_0_source_file_d427a95(language) : featureCopy.source_file_81b00b2,
    marked: (start: number, end: number, name: string, kind: string) => featureCopy.message_0_of_1_2_212f7d9(start === end ? `Marked line ${start}` : `Marked lines ${start}-${end}`, name, kind),
    moduleDocstring: (text: string) => featureCopy.Module_docstring_0_fe1ec20(text),
    definitions: (total: number, items: readonly string[], where: 'file' | 'marked') =>
        `${where === 'file' ? featureCopy.Top_level_definitions_dcf8410 : featureCopy.Definitions_in_the_marked_code_c23958e} (${total.toLocaleString('en-US')}): ${items.join(', ')}${total > items.length ? featureCopy.message_0_more_981ba01((total - items.length).toLocaleString('en-US')) : ''}.`,
    /** Who wrote which part of an answer about a file (K12), in the language of the question. */
    fileNotes: { factsAndSentence: browserChatText.fileFactsAndSentence, factsOnly: browserChatText.fileFactsOnly, sentenceDropped: browserChatText.fileSentenceDropped },
    /** The first line of a file outline; the note under it says where it was read (B7). */
    outlineHeading: (name: string, kind: string, lines: number) => `${name}: ${kind}, ${counted(lines, 'line', 'lines')}.`,
    iniKind: featureCopy.INI_configuration_8a01ecd,
    /** What a well-known file is for, by its name and structure, before its outline (B7). */
    purposes: {
        preCommit: featureCopy.pre_commit_configuration_hooks_that_run_before_each_commit_26dbdb1,
        workflow: featureCopy.GitHub_runs_the_jobs_of_this_workflow_when_one_of_its_triggers_oc_afa6aaf,
        npmPackage: featureCopy.npm_package_manifest_the_name_scripts_and_dependencies_of_a_JavaS_2021769,
        pyproject: featureCopy.Python_project_configuration_how_the_package_is_built_its_metadat_9d82529,
        tox: featureCopy.tox_configuration_the_test_environments_tox_creates_and_the_comma_e7a72fe,
        setupCfg: featureCopy.setuptools_configuration_package_metadata_and_options_often_also__6553643,
        compose: featureCopy.Docker_Compose_file_the_services_that_Docker_Compose_starts_toget_cdcdc45,
        readTheDocs: featureCopy.Read_the_Docs_configuration_how_readthedocs_org_builds_the_docume_e5123a5,
        editorConfig: featureCopy.EditorConfig_indentation_line_endings_and_similar_editor_settings_bfa69b5,
        tsconfig: featureCopy.TypeScript_compiler_configuration_which_files_are_compiled_and_wi_173419a,
        flake8: featureCopy.flake8_configuration_the_rules_of_the_Python_linter_flake8_8d1e73f,
        pytest: featureCopy.pytest_configuration_the_options_pytest_runs_the_tests_with_2bcdc91,
        coverage: featureCopy.coverage_py_configuration_which_code_test_coverage_measures_and_h_ad22658,
    },
};
export const chatRound3Text: { en: typeof englishRound3Text; de: typeof englishRound3Text } = {
    en: englishRound3Text,
    de: {
        askedModel: featureCopy.An_das_lokale_Modell_gestellt_00136aa,
        modelNote: featureCopy.Vom_lokalen_Modell_erzeugt_kann_falsch_sein_3e02c30,
        askAgain: featureCopy.Erneut_fragen_eed9603,
        backTo: (label: string) => featureCopy.Zur_ck_zu_0_Die_fr_heren_Nachrichten_dazu_werden_wieder_mitgeschi_ea14bd3(label),
        followUp: (typed: string, label: string) => featureCopy.message_0_bezieht_sich_auf_fr_here_Nachrichten_Die_betrafen_ein_anderes_T_b08b620(typed, label),
        inSource: featureCopy.Im_Quelltext_fcde1ce,
        moreMembers: (total: number) => `+${total.toLocaleString('de-DE')} ${total === 1 ? featureCopy.weiteres_Attribut_oder_weitere_Methode_196f389 : featureCopy.weitere_Attribute_und_Methoden_b55059e}`,
        moreLines: (total: number) => `+${gezaehlt(total, 'weitere Zeile', 'weitere Zeilen')}`,
        codeKind: (language: string) => language ? featureCopy.message_0_Quelltext_547d7b8(language) : featureCopy.Quelltext_67bf65f,
        marked: (start: number, end: number, name: string, kind: string) => featureCopy.message_0_von_1_2_99e6299(start === end ? `Markierte Zeile ${start}` : `Markierte Zeilen ${start} bis ${end}`, name, kind),
        moduleDocstring: (text: string) => featureCopy.Docstring_des_Moduls_0_20a3fd9(text),
        definitions: (total: number, items: readonly string[], where: 'file' | 'marked') =>
            `${where === 'file' ? featureCopy.Definitionen_auf_oberster_Ebene_771c010 : featureCopy.Definitionen_im_markierten_Code_6a9d3a6} (${total.toLocaleString('de-DE')}): ${items.join(', ')}${total > items.length ? featureCopy.message_0_weitere_9c8ed76((total - items.length).toLocaleString('de-DE')) : ''}.`,
        fileNotes: {
            factsAndSentence: featureCopy.Fakten_aus_der_Datei_gelesen_der_Text_danach_ist_vom_Modell_erzeu_e1eb329,
            factsOnly: featureCopy.Aus_der_Datei_gelesen_nicht_vom_Modell_erzeugt_7b0a40c,
            sentenceDropped: (reason?: DroppedReason) => featureCopy.Aus_der_Datei_gelesen_Der_Text_des_Modells_0_d1b9687(!reason ? 'wurde weggelassen, weil die Datei ihn nicht stützt'
                : reason.kind === 'claim' ? `behauptete etwas, das die Datei nicht zeigt (hier: „${reason.text}“), und wurde weggelassen`
                    : `nannte etwas, das die Datei nicht zeigt (hier: ${code(reason.text)}), und wurde weggelassen`),
        },
        outlineHeading: (name: string, kind: string, lines: number) => `${name}: ${kind}, ${gezaehlt(lines, 'Zeile', 'Zeilen')}.`,
        iniKind: 'INI-Konfiguration',
        purposes: {
            preCommit: featureCopy.pre_commit_Konfiguration_Hooks_die_vor_jedem_Commit_laufen_8a509a1,
            workflow: featureCopy.GitHub_f_hrt_die_Jobs_dieses_Workflows_aus_wenn_einer_seiner_Ausl_af8f33a,
            npmPackage: featureCopy.npm_Paketmanifest_Name_Skripte_und_Abh_ngigkeiten_eines_JavaScrip_225ff96,
            pyproject: featureCopy.Python_Projektkonfiguration_wie_das_Paket_gebaut_wird_seine_Metad_7663808,
            tox: featureCopy.tox_Konfiguration_die_Testumgebungen_die_tox_anlegt_und_die_Befeh_408ccc4,
            setupCfg: featureCopy.setuptools_Konfiguration_Paketmetadaten_und_Optionen_oft_auch_Ein_b53149f,
            compose: featureCopy.Docker_Compose_Datei_die_Services_die_Docker_Compose_zusammen_sta_5a5ce5e,
            readTheDocs: featureCopy.Read_the_Docs_Konfiguration_wie_readthedocs_org_die_Dokumentation_ca586d0,
            editorConfig: featureCopy.EditorConfig_Einr_ckung_Zeilenenden_und_hnliche_Editor_Einstellun_332f2a4,
            tsconfig: featureCopy.TypeScript_Compilerkonfiguration_welche_Dateien_mit_welchen_Optio_05fc70c,
            flake8: featureCopy.flake8_Konfiguration_die_Regeln_des_Python_Linters_flake8_7c77534,
            pytest: featureCopy.pytest_Konfiguration_die_Optionen_mit_denen_pytest_die_Tests_ausf_071e22e,
            coverage: featureCopy.coverage_py_Konfiguration_welcher_Code_bei_der_Testabdeckung_geme_bf7f6fb,
        },
    },
};

type ViewDirection = 'both' | 'inbound' | 'outbound';
/** The listed answer to a question about the current Galaxy view (H1), and the note for a model
 * answer that only restated its question (H2), in the language of the question. */
const englishViewText = {
    center: (name: string, kind: string, roots: number) => featureCopy.message_0_1_is_in_the_middle_2_18900e3(name, kind, roots > 1 ? ` with ${en(roots)} symbols` : ''),
    reach: (hops: string, direction: string, both: boolean) => featureCopy.the_scope_reaches_0_1_2_214ca2d(hops, both ? ' ' : ', ', direction),
    selectionOnly: featureCopy.the_scope_shows_the_selection_only_9e4f742,
    /** The heading of a side; the hierarchy draws incoming on the left and outgoing on the right. */
    side: (side: 'incoming' | 'outgoing', hierarchy: boolean): string => side === 'incoming' ? hierarchy ? featureCopy.Left_incoming_92672cd : featureCopy.Incoming_c65f3fc : hierarchy ? featureCopy.Right_outgoing_908d3e2 : featureCopy.Outgoing_78c8228,
    /** How the hierarchy is read, as its hint says it: from two layers on each column is one layer further,
     * and nodes reached through both directions stand in the dashed band below. */
    readHierarchy: (direction: ViewDirection, columns: boolean) => direction === 'both'
        ? featureCopy.How_to_read_the_hierarchy_incoming_relationships_stand_on_the_lef_d7d1cbd(columns ? ', each column one layer further in the same direction' : '')
            + (columns ? featureCopy.Nodes_reached_through_both_directions_such_as_a_callee_of_a_calle_5b6d402 : '')
        : featureCopy.How_to_read_the_hierarchy_the_scope_follows_0_relationships_only__565fb34(direction === 'inbound' ? 'incoming' : 'outgoing', direction === 'inbound' ? 'left' : 'right', columns ? ', each column one layer further' : ''),
    readGalaxy: featureCopy.The_galaxy_view_shows_this_scope_as_a_cloud_hierarchy_at_the_top__e93b301,
    size: (size: string, types: string, state: string) => `${size}, ${types}; ${state}.`,
    noAnswer: (echoed: string) => featureCopy.The_model_gave_no_answer_it_only_restated_the_question_0_f0bbadc(echoed),
    factsFollow: featureCopy.This_is_what_the_indexed_graph_lists_for_the_selection_3a92cfa,
    rephrase: featureCopy.Ask_the_question_in_other_words_or_ask_again_63415e1,
};
export const viewText: { en: typeof englishViewText; de: typeof englishViewText } = {
    en: englishViewText,
    de: {
        center: (name: string, kind: string, roots: number) => featureCopy.message_0_1_steht_2_in_der_Mitte_4278d7a(name, kind, roots > 1 ? ` mit ${de(roots)} Symbolen` : ''),
        reach: (hops: string, direction: string, both: boolean) => featureCopy.der_Ausschnitt_geht_0_1_2_3b84368(hops, both ? ' ' : ', ', direction),
        selectionOnly: featureCopy.der_Ausschnitt_zeigt_nur_die_Auswahl_a84d08d,
        side: (side: 'incoming' | 'outgoing', hierarchy: boolean) => side === 'incoming' ? hierarchy ? featureCopy.Links_eingehend_a4f1f93 : featureCopy.Eingehend_28b912a : hierarchy ? featureCopy.Rechts_ausgehend_f9a0449 : featureCopy.Ausgehend_9a5aa00,
        readHierarchy: (direction: ViewDirection, columns: boolean) => direction === 'both'
            ? featureCopy.So_liest_du_die_Hierarchie_eingehende_Beziehungen_stehen_links_au_7bff3b5(columns ? ', jede Spalte eine Ebene weiter in derselben Richtung' : '')
                + (columns ? featureCopy.Was_ber_beide_Richtungen_erreicht_wird_etwa_etwas_das_ein_Aufrufe_c843628 : '')
            : featureCopy.So_liest_du_die_Hierarchie_der_Ausschnitt_folgt_nur_0_Beziehungen_3afd100(direction === 'inbound' ? 'eingehenden' : 'ausgehenden', direction === 'inbound' ? 'links' : 'rechts', columns ? ', jede Spalte eine Ebene weiter' : ''),
        readGalaxy: featureCopy.Die_Galaxy_Ansicht_zeigt_diesen_Ausschnitt_als_Wolke_hierarchy_ob_8694979,
        size: (size: string, types: string, state: string) => `${size}, ${types}; ${state}.`,
        noAnswer: (echoed: string) => featureCopy.Das_Modell_hat_keine_Antwort_gegeben_es_hat_nur_die_Frage_wiederh_ec720ee(echoed),
        factsFollow: featureCopy.Das_listet_der_indizierte_Graph_zur_Auswahl_f6ae346,
        rephrase: featureCopy.Stell_die_Frage_mit_anderen_Worten_oder_frag_erneut_1e75389,
    },
};
