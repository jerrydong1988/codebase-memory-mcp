import { featureCopy } from '../i18n/features/impact';
/*
 * Herkunft: portiert am 2026-08-28 aus CodeAtlasIDE,
 * /Users/bernhard/Desktop/CodeAtlasIDE/theia-extensions/codeatlas-views/src/browser/strings.ts
 * (die Abschnitte MAP_SIGNAL_*, RISK_LABELS, IMPACT_*). Gleicher Urheber
 * (Bernhard Jackiewicz). Die Saetze sind woertlich uebernommen, weil sie die
 * Aussage sind: eine umformulierte Begruendung waere eine andere Begruendung.
 *
 * Warum eine eigene Datei statt eines Anbaus an src/twin/strings.ts: die dortige
 * Datei ist der Wortschatz des Twins und wird von jedem Twin-Test gelesen. Der
 * Wortschatz der Aenderungsansicht gehoert zur Aenderungsansicht, und zwei
 * Flaechen, die sich eine Zeichenkettendatei teilen, aendern sich gegenseitig,
 * sobald eine von beiden umformuliert wird.
 *
 * Weggelassen: alles, was eine Flaeche betrifft, die es hier nicht gibt (der
 * Review-Modus, das Staleness-Banner, die Diagramm-Legende). Aenderungen an dem,
 * was uebernommen wurde: keine.
 */

/** `3 files` oder `1 file`. Die eine Pluralregel dieser Datei. */
export function countOf(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

// Signale, wortgleich mit der Karte des Referenzprojekts ----------------------

export const MAP_SIGNAL_UNGUARDED_RECURSION = featureCopy.recursion_with_no_visible_base_case_344de15;
export const MAP_SIGNAL_ALLOCATION_IN_LOOP = featureCopy.allocates_inside_a_loop_b5b34b8;
export const MAP_SIGNAL_SCAN_IN_LOOP = featureCopy.scans_a_list_inside_a_loop_ed1e3ed;

export function mapSignalNesting(depth: number): string {
    return depth === 1 ? featureCopy.one_loop_8db6b6e : featureCopy.loops_nested_0_deep_d9114bb(depth);
}

export function mapSignalThinking(score: number): string {
    return featureCopy.cognitive_complexity_0_ac682d7(score);
}

export function mapSignalBranches(score: number): string {
    return featureCopy.message_0_to_follow_5dab125(countOf(score, 'branch', 'branches'));
}

export function mapSignalFanIn(count: number): string {
    return featureCopy.reached_by_0_680c225(countOf(count, 'symbol', 'symbols'));
}

// Das Risikowort und was daneben steht ---------------------------------------

/** The risk word, and the sentence that says what kind of claim it is. */
export const RISK_LABELS: Readonly<Record<'low' | 'medium' | 'high', string>> = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
};

export const IMPACT_BADGE_TOOLTIP =
    featureCopy.A_rule_applied_to_what_the_index_recorded_not_a_prediction_The_se_d1c82bb;

/** What a risk chip says when the symbol is reached from outside the program. */
export const IMPACT_SIGNAL_ENTRY_POINT = featureCopy.reachable_from_outside_the_program_d82a53a;

/** What a risk chip says when nothing about the symbol reached a threshold. */
export const IMPACT_SIGNAL_NONE = featureCopy.nothing_measured_on_this_symbol_reached_a_threshold_09a2057;

export function impactRiskTooltip(level: 'low' | 'medium' | 'high', reasons: string[]): string {
    const because = reasons.length === 0 ? IMPACT_SIGNAL_NONE : reasons.join('; ');
    return `${RISK_LABELS[level]}: ${because}.`;
}

/** How a route was tied to the change. Two different strengths of claim. */
export const IMPACT_ENDPOINT_VIA_HANDLER = featureCopy.The_registration_names_a_handler_this_change_reaches_f4772f5;
export const IMPACT_ENDPOINT_VIA_FILE =
    featureCopy.The_registration_is_written_in_a_file_this_change_reaches_CBM_Len_7634f33;

// Die Erzaehlung, ein Satz je Lesung -----------------------------------------

export function impactChangedSentence(files: number, symbols: number): string {
    if (files === 0) {
        return featureCopy.Nothing_in_the_working_tree_differs_from_the_baseline_d86f7ae;
    }
    const where = files === 1 ? featureCopy.it_6c5522c : featureCopy.them_98910a6;
    if (symbols === 0) {
        return featureCopy.message_0_from_the_baseline_ee2a264(countOf(files, 'file differs', 'files differ'))
            + featureCopy.and_the_index_holds_no_symbol_in_0_34eb8b6(where);
    }
    return featureCopy.message_0_from_the_baseline_ee2a264(countOf(files, 'file differs', 'files differ'))
        + featureCopy.and_the_index_places_0_inside_1_194f9a4(countOf(symbols, 'symbol', 'symbols'), where);
}

/**
 * Wie viele Deklarationen die Analyse wirklich angefasst hat.
 *
 * Steht nur da, wenn die Zahl von der Laenge der Liste abweicht, und dann ist
 * sie die wichtigste Zahl der Seite: die Liste zeigt, was der Index in den
 * geaenderten Dateien fuehrt, und der Server sagt, auf wie viele davon er den
 * Diff eingeschraenkt hat. Ohne diesen Satz laese sich die Liste als "so viel
 * hat sich geaendert", und das steht dort nicht.
 */
export function impactSeedSentence(seeds: number, listed: number): string {
    return featureCopy.The_analysis_scoped_the_diff_to_0_0291c0f(countOf(seeds, 'declaration', 'declarations'))
        + featureCopy.and_the_list_below_is_the_0_the_index_places_inside_those_files_6559328(countOf(listed, 'symbol', 'symbols'));
}

export function impactDownstreamSentence(count: number, distance: number): string {
    if (count === 0) {
        return featureCopy.Nothing_in_the_indexed_workspace_calls_those_symbols_so_the_chang_dd6f70e;
    }
    return featureCopy.Walking_the_calls_inwards_reaches_0_5f605c4(countOf(count, 'further symbol', 'further symbols'))
        + featureCopy.within_0_b17a146(countOf(distance, 'step', 'steps'));
}

export function impactEndpointSentence(paths: string[]): string {
    if (paths.length === 0) {
        return featureCopy.No_HTTP_endpoint_CBM_Lens_recovered_is_registered_in_a_file_this__b4b74a0;
    }
    return featureCopy.message_0_registered_in_a_file_7dee438(countOf(paths.length, 'endpoint is', 'endpoints are'))
        + featureCopy.this_change_reaches_0_6542cc8(paths.join(', '));
}

export function impactTestsSentence(covering: number, missing: number): string {
    if (covering === 0 && missing === 0) {
        return featureCopy.No_affected_symbol_could_be_checked_for_test_callers_b4e5db4;
    }
    if (missing === 0) {
        return featureCopy.Every_affected_symbol_that_was_checked_has_a_test_caller_071c21a
            + featureCopy.message_0_in_total_so_a_change_here_would_be_noticed_692c2ac(countOf(covering, 'test caller', 'test callers'));
    }
    return featureCopy.No_test_caller_was_found_for_0_dd43a20(countOf(missing, 'affected symbol', 'affected symbols'))
        + featureCopy.so_a_change_to_0_would_go_unnoticed_by_any_automatic_check_907c84c(missing === 1 ? 'it' : 'them');
}

/**
 * Said whenever a level was decided partly on absence.
 *
 * The rules cannot raise a level on a reading nobody took, so a project the
 * analysis does not measure produces a page of quiet rows. This is the sentence
 * that keeps a quiet page from reading like a clean one.
 */
export function impactUnmeasuredSentence(count: number): string {
    return featureCopy.Complexity_readings_were_unavailable_for_0_4d9347d(countOf(count, 'symbol', 'symbols'))
        + featureCopy.so_the_level_rests_on_what_the_analysis_could_not_measure_as_well_616398c;
}

export function impactTestLookupCapped(cap: number): string {
    return featureCopy.Test_callers_were_looked_up_for_the_first_0_affected_symbols_only_012161d(cap);
}

export const IMPACT_WALK_TRUNCATED =
    featureCopy.The_caller_walk_stopped_at_its_bound_so_the_list_of_what_calls_th_61f5e74;

/** Evidence rows: what each claim rests on, in the reader's words. */
export const IMPACT_EVIDENCE_TITLE = featureCopy.What_this_rests_on_f94e1ee;

export const IMPACT_EVIDENCE_SOURCES: Readonly<Record<'detect_changes' | 'architecture' | 'facts', string>> = {
    detect_changes: featureCopy.the_change_set_the_analysis_reported_plus_the_calls_into_it_21f2aae,
    architecture: featureCopy.the_whole_project_summary_including_the_routes_CBM_Lens_recovered_f2812d9,
    facts: featureCopy.the_per_symbol_readings_complexity_and_callers_flagged_as_test_co_a85ae84,
};

export function impactEvidenceValue(
    source: 'detect_changes' | 'architecture' | 'facts',
    value: string,
): string {
    return `${IMPACT_EVIDENCE_SOURCES[source]} (${value})`;
}

// Was diese Oberflaeche zusaetzlich sagen muss -------------------------------
//
// Alles ab hier hat im Referenzprojekt keine Entsprechung, weil es dort keinen
// Browser gibt, der einen Ref selbst pruefen muesste, und keine Badge-Zeile, die
// ihre Regeln aufzaehlt. Beides steht hier, weil W4b beides verlangt.

/** Die Ueberschrift der Flaeche. */
export const IMPACT_TITLE = featureCopy.What_would_this_change_reach_eab704d;
export const IMPACT_RISK_UNRESOLVED = featureCopy.RISK_UNRESOLVED_5f31d35;
export const IMPACT_NO_ELEVATED_SIGNAL = featureCopy.NO_ELEVATED_SIGNAL_9e7e986;
export const IMPACT_UNRESOLVED_TOOLTIP =
    featureCopy.Some_risk_inputs_are_missing_No_elevated_rule_fired_this_does_not_b4c3d26;
export function impactUnresolvedInputs(unmeasured: number, total: number): string {
    return featureCopy.Risk_inputs_are_missing_for_0_of_1_symbols_97efe83(unmeasured, total)
        + featureCopy.No_elevated_signal_is_not_evidence_of_safety_Open_an_affected_fil_0ab6da8;
}

/**
 * Wie das [a]tlas-Menue den Weg hierher nennt, mit seinem Buchstaben
 * (Audit-Befund 12 vom 2026-08-29).
 *
 * "[c]hange scope" und nicht "[s]cope a change": s waere der Buchstabe der
 * Suche, und c ist der von change, also von dem Wort, das der Leser im Kopf
 * hat, wenn er wissen will, was seine Aenderung erreicht.
 */
export const IMPACT_MENU_LABEL = featureCopy.c_hange_scope_19c8e2b;

/** Der Satz darunter: was gelesen wird und was das Wort am Ende bedeutet. */
export const IMPACT_SUBLINE =
    featureCopy.Read_from_the_change_set_the_analysis_reports_the_calls_into_it_a_4cc173b;

export const IMPACT_MODE_LABEL = featureCopy.Compare_against_e4d2506;
export const IMPACT_MODE_WORKING_TREE = featureCopy.Working_tree_b1e99b6;
export const IMPACT_MODE_WORKING_TREE_TOOLTIP =
    featureCopy.Compare_the_working_tree_against_the_last_commit_which_is_what_th_24fc49e;
export const IMPACT_MODE_SINCE_REF = featureCopy.Since_ref_5d45cca;
export const IMPACT_MODE_SINCE_REF_TOOLTIP = featureCopy.Compare_the_working_tree_against_a_named_point_in_history_bba6b5d;

export const IMPACT_REF_LABEL = featureCopy.Baseline_e6ab798;
export const IMPACT_REF_PLACEHOLDER = featureCopy.branch_tag_or_commit_834637c;
export const IMPACT_REF_GO = featureCopy.Go_2e0b45f;
export const IMPACT_REF_GO_TOOLTIP = featureCopy.Compare_the_working_tree_against_this_point_in_history_a347312;

/**
 * Was zu einem abgelehnten Ref gesagt wird.
 *
 * Der Satz nennt die Regel, gegen die verstossen wurde, und sagt ausdruecklich,
 * dass niemand gefragt wurde. Ohne den zweiten Teil koennte ein Leser die
 * Ablehnung fuer eine Antwort der Engine halten, und dann waere "dieser Ref
 * existiert nicht" und "dieser Ref ist kein Ref" dasselbe Wort fuer zwei sehr
 * verschiedene Lagen.
 */
export function impactRefRejected(ref: string, rule: string): string {
    return featureCopy.message_0_is_not_a_usable_git_ref_1_Nothing_was_asked_of_the_analysis_bac_62674fd(ref, rule);
}

export const IMPACT_LOADING = featureCopy.Reading_the_change_set_the_summary_and_the_per_symbol_readings_bce723c;
export const IMPACT_LOAD_FAILED = featureCopy.The_change_set_could_not_be_read_4a1408b;

export const IMPACT_EMPTY_MESSAGE = featureCopy.No_project_so_there_is_no_change_set_to_read_fd0b67b;

/**
 * Die Ueberschriften der vier Listen.
 *
 * Die erste heisst NICHT "changed symbols". Sie zaehlt, was der Index in den
 * geaenderten Dateien fuehrt, und wie viele davon die Analyse als geaendert
 * behandelt hat, sagt der Satz mit der Seed-Zahl darueber. Eine Ueberschrift,
 * die "geaendert" behauptet, waere die eine Zeile dieser Flaeche, die mehr sagt
 * als ihre Lesung hergibt.
 */
export const IMPACT_DIRECT_TITLE = featureCopy.Symbols_in_the_changed_files_cc6a7ed;
export const IMPACT_DOWNSTREAM_TITLE = featureCopy.What_calls_them_7b89a56;
export const IMPACT_ENDPOINTS_TITLE = featureCopy.Endpoints_reached_42265d7;
export const IMPACT_TESTS_TITLE = featureCopy.Tests_39fdec1;

export const IMPACT_DIRECT_EMPTY =
    featureCopy.The_index_places_no_symbol_inside_the_changed_files_37bbb8f;
export const IMPACT_DOWNSTREAM_EMPTY =
    featureCopy.Nothing_in_the_indexed_workspace_calls_the_changed_symbols_659d618;
export const IMPACT_ENDPOINTS_EMPTY =
    featureCopy.No_route_CBM_Lens_recovered_is_registered_in_a_file_this_change_r_fe09964;
export const IMPACT_TESTS_EMPTY = featureCopy.No_affected_symbol_could_be_checked_for_test_callers_b4e5db4;

/**
 * Wie viele Dateien der Routen-Scan geoeffnet hat, und was das begrenzt.
 *
 * `cap` ist die Decke NUR dann, wenn eine gegriffen hat; sonst undefined. Die
 * Unterscheidung ist der ganze Inhalt des Satzes: "die ersten 10" und "alle 10"
 * sind zwei verschiedene Aussagen ueber dieselbe Zahl.
 */
export function impactRouteScanNote(scanned: number, cap: number | undefined, truncatedFiles: number): string {
    const head = cap === undefined
        ? featureCopy.Routes_were_read_off_the_text_of_0_ab4432d(countOf(scanned, 'indexed source file', 'indexed source files'))
        : featureCopy.Routes_were_read_from_the_first_0_indexed_source_files_only_d3accb8(cap);
    return truncatedFiles === 0
        ? head
        : featureCopy.message_0_1_arrived_incomplete_so_a_registration_past_the_cut_is_not_on_t_c13e324(head, countOf(truncatedFiles, 'file', 'files'));
}

/** Die Zeile ueber der Badge-Begruendung. */
export const IMPACT_BADGE_WHY_TITLE = featureCopy.Which_rules_fired_5a8a19a;

/** Was dort steht, wenn keine Regel griff. */
export const IMPACT_BADGE_WHY_NONE = featureCopy.No_rule_reached_a_threshold_so_the_level_is_the_floor_and_not_a_f_732d86a;

/** Eine Regel des Gesamturteils als Satz. */
export function impactEndpointRule(count: number): string {
    return featureCopy.message_0_registered_in_a_file_this_change_reaches_64a710f(countOf(count, 'endpoint is', 'endpoints are'));
}

export function impactUntestedRule(count: number): string {
    return featureCopy.No_test_caller_was_found_for_0_47c0c68(countOf(count, 'affected symbol', 'affected symbols'));
}

/** Eine Regel eines einzelnen Symbols als Satz. */
export function impactSymbolRule(name: string, level: 'low' | 'medium' | 'high', reasons: string[]): string {
    return featureCopy.message_0_is_1_2_dc5f5cb(name, RISK_LABELS[level], reasons.join('; '));
}

// Review zu K42: der Knopf Refresh der Dateiwirkung in Explore sagt, dass er laeuft, dann wann er lief ---
// (die gemeinsamen Saetze "Up to date at …" und "Refresh failed at …" stehen in ui/refresh/strings.ts).

export const FILE_IMPACT_REFRESH = { idle: featureCopy.Refresh_56e3bad, busy: featureCopy.Refreshing_9614117, done: (time: string) => featureCopy.Impact_refreshed_at_0_7a16ba1(time) };
