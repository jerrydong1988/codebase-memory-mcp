import { featureCopy } from '../i18n/features/traces';
/*
 * Herkunft: die Saetze der Schritte 1 bis 4 stammen aus CodeAtlasIDE,
 * /Users/bernhard/Desktop/CodeAtlasIDE/theia-extensions/codeatlas-views/src/browser/strings.ts
 * (Abschnitt BUG_WIZARD_*). Gleicher Urheber (Bernhard Jackiewicz). Woertlich
 * uebernommen wurde alles, was hier dasselbe bedeutet.
 *
 * Zwei Gruppen sind bewusst anders formuliert, beide unten am Ort begruendet:
 *
 * - Der leere Zustand nennt ein anderes Kommando. Dort importiert eine
 *   Menue-Aktion eine Datei in den eigenen Trace-Speicher; hier gibt es keinen
 *   eigenen Speicher, und Laeufe kommen ueber `ingest_traces` der CLI in die
 *   Engine. Ein abgeschriebener Satz waere eine Anleitung, die nicht
 *   funktioniert.
 * - Die zweite Divergenz-Liste heisst nicht "Observed, not in the index". Warum
 *   nicht, steht im Kopf von bug-paths.ts: dieses Backend gibt eine Beobachtung
 *   nur an einer Kante zurueck, die der Index auch kennt, also waere die
 *   Ueberschrift des Vorbilds hier eine Aussage ueber etwas, das diese Liste
 *   gar nicht sehen koennte. Die Zeile selbst sagt danach je Fall, was der
 *   Index ueber genau diesen Aufruf weiss.
 */

/** Wie die Flaeche heisst und was sie vergleicht. */
export const BUG_WIZARD_TITLE = featureCopy.Hunt_a_bug_12e012a;

/**
 * Wie das [a]tlas-Menue den Weg hierher nennt. Kleingeschrieben wie die anderen
 * Eintraege, und seit dem 2026-08-29 mit seinem Buchstaben (Audit-Befund 12).
 *
 * Aus "hunt a bug" wurde "[b]ug hunt", weil das Kuerzel der Anfang des Wortes
 * sein muss: `[h]unt a bug` haette den Buchstaben h belegt, und h ist in dieser
 * Oberflaeche nichts. Der Buchstabe b ist der, den jemand sucht, der einen Bug
 * jagt.
 */
export const BUG_WIZARD_MENU_LABEL = featureCopy.b_ug_hunt_a7750a9;

export const BUG_WIZARD_SUBLINE =
    featureCopy.Compare_the_path_the_index_expects_into_a_symbol_with_the_path_a__6f042b5;

export const BUG_WIZARD_STEP_TARGET = featureCopy.Choose_the_symbol_a7f16c2;
export const BUG_WIZARD_STEP_STATIC = featureCopy.Expected_path_8ab20c4;
export const BUG_WIZARD_STEP_OBSERVED = featureCopy.Observed_path_f7b0c5d;
export const BUG_WIZARD_STEP_DIVERGENCE = featureCopy.Where_they_differ_f6fd666;

export const BUG_WIZARD_NO_PROJECT = featureCopy.No_indexed_project_so_there_is_no_path_to_walk_adeaa20;
export const BUG_WIZARD_NO_TARGET =
    featureCopy.No_symbol_chosen_yet_Put_the_caret_in_a_function_or_search_for_on_1c68f9c;
export const BUG_WIZARD_CHANGE_TARGET = featureCopy.Change_symbol_dae3b48;
export const BUG_WIZARD_CHANGE_TOOLTIP = featureCopy.Search_the_index_for_the_symbol_this_bug_is_about_d2c044f;
export const BUG_WIZARD_BUSY = featureCopy.Reading_the_index_the_traces_and_the_ranked_walks_4fc1ec8;
export const BUG_WIZARD_FAILED = featureCopy.The_paths_into_this_symbol_could_not_be_read_b5096b3;
export const BUG_WIZARD_CLOSE = featureCopy.esc_close_1d54db9;

/** Said above the expected chains, so nobody reads them as a runtime claim. */
export const BUG_WIZARD_STATIC_NOTE =
    featureCopy.Read_from_the_index_who_calls_this_symbol_and_who_calls_them_Noth_4056378;

/** The label the reference puts on the reading, kept because it is the point. */
export const BUG_WIZARD_STATIC_ORIGIN = featureCopy.from_the_index_8dfb15f;

/** Said when the index records nothing calling the symbol at all. */
export const BUG_WIZARD_STATIC_EMPTY =
    featureCopy.The_index_records_nothing_calling_this_symbol_so_there_is_no_expe_b452ae0;

/** Said when the walk stopped at its bound rather than at an entry point. */
export function bugWizardTruncated(depth: number, chains: number): string {
    return featureCopy.The_walk_stopped_after_0_1_or_2_chains_ff49574(depth, depth === 1 ? 'hop' : 'hops', chains)
        + featureCopy.with_callers_still_to_follow_so_a_chain_shown_here_may_be_a_floor_7951870;
}

/** The marker on a chain head that nothing calls. */
export const BUG_WIZARD_ENTRY_BADGE = featureCopy.entry_point_ad86384;
export const BUG_WIZARD_ENTRY_TOOLTIP =
    featureCopy.The_index_records_nothing_calling_this_symbol_so_the_chain_starts_510333e;

/**
 * The honest empty state, which is the screen most readers meet first.
 *
 * It has to do three things at once: refuse to claim anything about runtime,
 * say what a recording is, and say how to bring one in. A panel that only did
 * the first would be honest and useless.
 */
export const BUG_WIZARD_NO_TRACES =
    featureCopy.No_observed_call_came_back_for_this_symbol_CBM_Lens_does_not_watc_2be716f;

export const BUG_WIZARD_NO_TRACES_HOW =
    featureCopy.Hand_it_a_run_with_the_CLI_against_the_same_HOME_the_server_reads_fac6db0;

/** Das Kommando, mit dem Namen des Projekts darin. */
export function bugWizardIngestCommand(project: string): string {
    return featureCopy.echo_project_0_label_my_run_traces_40a5463(project)
        + featureCopy.path_caller_qualified_name_callee_qualified_name_count_1_51d5bef
        + "]}' | codebase-memory-mcp cli ingest_traces";
}

export const BUG_WIZARD_NO_TRACES_FORMAT =
    'One entry is either {"path": [...]} with 2 to 256 qualified names, adjacent ones being caller '
    + 'and callee, or a bare {"caller": "...", "callee": "..."}. "count" and "label" are optional. '
    + 'Only pairs whose both ends are in the index are stored; up to ten unresolved names come back '
    + 'so a recorder can be fixed rather than silently losing data.';

/**
 * Wo eine Beobachtung wieder lesbar ist, und wo nicht.
 *
 * Der Satz gehoert in den leeren Zustand, weil er erklaert, warum diese Flaeche
 * moeglicherweise nichts zeigt, obwohl jemand einen Lauf eingespielt hat. Ohne
 * ihn wuerde ein Leser die Abwesenheit fuer eine Aussage ueber seinen Lauf
 * halten.
 */
export const BUG_WIZARD_NO_TRACES_WHERE =
    featureCopy.The_backend_hands_an_observation_back_only_where_it_also_records__3963351;

/** Said above the observed chains, so nobody reads them as a reading of the index. */
export const BUG_WIZARD_OBSERVED_NOTE =
    featureCopy.Read_back_from_the_analysis_backend_along_the_calls_the_index_con_062917c;

/** How many times an observed call was seen, and under which run. */
export function bugWizardObservedCount(count: number, label: string): string {
    const times = featureCopy.observed_0_1_156a2f9(count, count === 1 ? 'time' : 'times');
    return label.length === 0 ? times : featureCopy.message_0_run_1_f96edac(times, label);
}

export function bugWizardLastSeen(lastSeen: string): string {
    return lastSeen.length === 0 ? '' : featureCopy.last_seen_0_3aed934(lastSeen);
}

/** Wie viele der gereihten Ablaeufe gelesen wurden, wenn es nicht alle waren. */
export function bugWizardFlowsCapped(read: number): string {
    return featureCopy.Only_the_first_0_ranked_walks_were_read_so_an_observation_on_a_lo_a373ab4(read);
}

export const BUG_WIZARD_STATIC_ONLY_LABEL = featureCopy.Expected_never_observed_ef9a85c;
export const BUG_WIZARD_STATIC_ONLY_NOTE =
    featureCopy.The_index_records_these_calls_on_the_way_in_and_nothing_came_back_8b09bb2;

export const BUG_WIZARD_RUNTIME_ONLY_LABEL = featureCopy.Observed_not_on_the_expected_chains_cdce0e0;
export const BUG_WIZARD_RUNTIME_ONLY_NOTE =
    featureCopy.A_recording_holds_these_calls_and_none_of_them_is_on_a_chain_into_59dd745;

/** Was eine Zeile der zweiten Liste ueber den Index sagt. Drei Faelle, drei Saetze. */
export const BUG_WIZARD_EDGE_IN_INDEX =
    featureCopy.the_index_records_this_call_it_is_simply_not_on_a_way_in_6c50808;
export const BUG_WIZARD_EDGE_NOT_IN_INDEX =
    featureCopy.the_index_records_no_such_call_at_all_3d4354e;
export const BUG_WIZARD_EDGE_UNASKED =
    featureCopy.the_index_was_not_asked_no_qualified_name_came_back_for_one_end_974af62;

export const BUG_WIZARD_NO_DIVERGENCE =
    featureCopy.Every_observed_call_is_on_a_chain_the_index_draws_and_every_expec_02a7d97;

/** The verb between the two ends of an edge, so the direction is on screen. */
export const BUG_WIZARD_EDGE_VERB = featureCopy.calls_51b6cb2;

/** The same edge as one sentence, for the row's tooltip and for a screen reader. */
export function bugWizardEdgeLabel(from: string, to: string): string {
    return `${from} ${BUG_WIZARD_EDGE_VERB} ${to}`;
}

/** Tooltip on a hop, which is a live lookup and not a stored reference. */
export function bugWizardHopTooltip(name: string): string {
    return featureCopy.Open_0_The_symbol_is_looked_up_in_the_index_at_the_moment_you_cli_779bde9(name);
}
