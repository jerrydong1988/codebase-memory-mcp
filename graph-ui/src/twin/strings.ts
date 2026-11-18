import { featureCopy } from '../i18n/features/twin';
/*
 * Herkunft: portiert am 2026-08-28 aus CodeAtlasIDE,
 * /Users/bernhard/Desktop/CodeAtlasIDE/theia-extensions/codeatlas-views/src/browser/strings.ts
 * Gleicher Urheber (Bernhard Jackiewicz).
 *
 * Die Quelldatei ist 2639 Zeilen lang und traegt den Wortlaut ALLER Flaechen des
 * Referenzprojekts. Hier stehen die Exporte, die der Semantic Twin benutzt, und
 * die stehen WOERTLICH da, samt ihrer Begruendungen: der Unterschied zwischen
 * "keine Aufrufer" und "niemand hat nachgesehen" wird in diesem Produkt
 * ausschliesslich vom Wortlaut getragen, und eine gekuerzte Fassung waere eine
 * andere Aussage.
 *
 * Uebernommen ist genau das, was die portierten Module und das Panel dieses
 * Projekts lesen: die Ueberschriften und Subjekte der Sektionen, ihre
 * Leer-Saetze, die Block-Augenbrauen, die Marker der Wissenszustaende, die
 * Absenz-Saetze in beiden Vokabularen, die Prosa der Erzaehl-Tiefe, die
 * Beleg-Sprache, die dichten Provenienz-Bausteine, die Regler-Beschriftungen,
 * die Runtime-Sektion, der Verstehens-Streifen und die Wegweiser-Saetze.
 *
 * Weggelassen wurde der Wortlaut der Flaechen, die es hier nicht gibt: Atlas
 * Chat, die optionale KI-Verfeinerung samt Daten-Policy und Sende-Vorschau, die
 * Review-Checkliste als Panel, der Call Navigator, die Workspace Map, die
 * Impact-Ansicht, Onboarding und Touren, die Bug-Wizard-Diagramme, die
 * Konzept-Erklaerungen und die "Why are you here?"-Karten. Das ist keine
 * Auswahl nach Geschmack: zu jeder dieser Zeichenketten gehoert ein Panel, und
 * ein Satz ueber ein Panel, das dieses Projekt nicht hat, waere hier eine
 * Behauptung ueber eine Flaeche, die niemand sehen kann.
 *
 * Aenderungen an dem, was uebernommen wurde: eine, und sie ist begruendet.
 *
 * `CALLERS_EMPTY` weicht seit dem 2026-08-29 vom Referenz-Wortlaut ab. Das
 * unabhaengige Audit dieses Zyklus hat eine Fixture mit dynamischem Versand
 * ueber eine Registry gebaut und darin belegt, dass der Referenzsatz
 * ("Nothing in the indexed workspace calls this symbol.") falsch ist: die
 * beiden nur ueber die Registry erreichbaren Handler WERDEN im indizierten
 * Arbeitsbereich aufgerufen, nur eben nicht ueber eine CALLS-Kante, die der
 * Index fuehrt. Der Satz behauptete damit etwas ueber den Arbeitsbereich,
 * waehrend seine drei Nachbarn (STEPS_EMPTY, ERRORS_EMPTY, STATE_EMPTY) die
 * Luecke ausdruecklich dem Index zuschreiben. Eine wortgleiche Portierung
 * eines belegt falschen Satzes waere Portierungstreue gegen die
 * Ehrlichkeitsregel, und die Regel gewinnt. Der neue Wortlaut steht bei der
 * Konstante, mit derselben Begruendung.
 *
 * Sonst keine Aenderungen ausser den Importpfaden (Facet aus der ebenfalls
 * portierten presentation-profile.ts, CodeAtlasSymbolKind und KnowledgeState
 * aus src/core/).
 */

/**
 * Every sentence CodeAtlas says in a view, in one file.
 *
 * Three reasons this is not scattered across the widgets.
 *
 * The copy is the product. This IDE's claim is that it tells the truth about
 * what it knows, and the difference between "no callers" and "nobody looked"
 * is carried entirely by wording. Wording that lives next to the JSX gets
 * rewritten by whoever is fixing a layout bug; wording that lives here gets
 * read as a whole and stays consistent.
 *
 * The copy is reviewable. A reader can open this file and audit every claim
 * the product makes without reading a line of React.
 *
 * The copy is translatable later. Nothing here is assembled from fragments
 * mid-sentence: the parameterised strings are functions, so a translation can
 * reorder the parameters instead of being forced into English word order.
 */

import type { CodeAtlasSymbolKind } from '../core/focus-protocol';
import type { KnowledgeState } from '../core/semantic-ir';
import { Facet } from './presentation-profile';

/** `n thing` or `n things`, so a generated sentence never reads as machine output. */
export function countOf(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

// ---------------------------------------------------------------------------
// Empty states, one per surface. Never a blank panel.
// ---------------------------------------------------------------------------

export const TWIN_EMPTY_MESSAGE = featureCopy.Place_the_cursor_inside_a_function_method_or_class_b3e5769;
export const TWIN_EMPTY_HINT = featureCopy.CBM_Lens_follows_the_caret_and_explains_whatever_it_lands_in_166b8ca;

// ---------------------------------------------------------------------------
// Twin identity and provenance
// ---------------------------------------------------------------------------

/**
 * Shown instead of every fact section when the file is genuinely not in the
 * index. This sentence exists to make sure a reader never sees an empty
 * "Called by" list and concludes the symbol has no callers.
 */
export const TWIN_FILE_NOT_INDEXED = featureCopy.This_file_is_not_indexed_yet_c581180;

/** Says what would change the sentence above. */
export const TWIN_FILE_NOT_INDEXED_HINT =
    featureCopy.CBM_Lens_is_still_reading_this_workspace_Facts_about_this_symbol__9324fed;

/** Shown while the IR for a symbol is being built. */
export const TWIN_LOADING = featureCopy.Reading_what_the_index_knows_about_this_symbol_147d858;

/** Shown when the IR call itself failed, which is a different failure from an empty fact. */
export const TWIN_LOAD_FAILED = featureCopy.CBM_Lens_could_not_reach_the_analysis_backend_for_this_symbol_4236f4f;

/**
 * What the flow switch in the twin head says, in both states.
 *
 * Until W8b it said `[-]` and `[+]`. The reader tested this surface on
 * 2026-08-29 and did not understand the signs; the sentence that explained them
 * lived in a native tooltip, which is exactly the thing that cycle took out of
 * this product. A word costs four characters more and answers the question
 * before it is asked.
 */
export function twinFoldLabel(open: boolean): string {
    return open ? featureCopy.collapse_flow_dcd1409 : featureCopy.open_flow_c809a6e;
}

/**
 * The mark at the bottom edge of the twin, when its content is longer than its
 * place.
 *
 * The user's screenshot of 2026-08-29 showed the line "Order exact 1 citation"
 * ending half behind the GALAXY header, with nothing saying there was more. The
 * third readability rule of W9 asks a box that cuts a line in half to SAY so;
 * the twin was the one scrolling box in the right column that did not. It reads
 * like the legend's mark, because a second wording for the same fact would be a
 * second idiom.
 */
export const TWIN_MORE_BELOW = featureCopy.more_below_7b3bc26;
export const TWIN_MORE_ABOVE = featureCopy.more_above_52e4fee;

// ---------------------------------------------------------------------------
// Section headings and the subjects their absence sentences are about
// ---------------------------------------------------------------------------

export const SECTION_PURPOSE = featureCopy.Purpose_a0fb821;
export const SECTION_STEPS = featureCopy.Steps_cdde4f2;
export const SECTION_CALLERS = featureCopy.Called_by_8cbfefc;
export const SECTION_STATE = featureCopy.State_and_config_4450245;
export const SECTION_ERRORS = featureCopy.Error_paths_51e1f7a;
export const SECTION_TESTS = featureCopy.Tests_39fdec1;
export const SECTION_RISKS = featureCopy.Risks_92ddd0d;

/**
 * Two sections that exist as headings without facts under them.
 *
 * They are rendered only when the reader has asked for the lens, and they say
 * plainly that this panel does not answer it and which surface does. A lens that
 * silently renders nothing would read as "there is nothing to see", which is a
 * claim about the code rather than about the panel.
 */
export const SECTION_RUNTIME = featureCopy.Runtime_behaviour_6543db5;
export const SECTION_CHANGES = featureCopy.Recent_changes_1bfd232;

/**
 * What a symbol does to the world outside its own process.
 *
 * A heading before it is facts, like the two above, and for the same reason: at
 * 0.9.0 the engine records no route, no outbound call and no write, so the
 * section says that rather than rendering an empty list that would read as "this
 * symbol touches nothing".
 */
export const SECTION_EFFECTS = featureCopy.Effects_8f25a85;

/**
 * What the file around this symbol pulls in.
 *
 * A section about the file rather than about the symbol, and the only one in the
 * panel that is. It is here because a reader meeting a function for the first
 * time reads its imports before its body, and because the honest half of that
 * list is the part CodeAtlas can add: which of those imports this particular
 * symbol demonstrably touches, and which it does not.
 */
export const SECTION_IMPORTS = featureCopy.Pulls_in_4e2d6af;

export const SUBJECT_PURPOSE = featureCopy.The_purpose_of_this_symbol_da113b7;
export const SUBJECT_STEPS = featureCopy.What_this_symbol_does_step_by_step_8f6855c;
export const SUBJECT_CALLERS = featureCopy.The_list_of_callers_de62402;
export const SUBJECT_STATE = featureCopy.The_configuration_this_symbol_reads_61aa034;
export const SUBJECT_ERRORS = featureCopy.The_errors_this_symbol_can_raise_a2fda6a;
export const SUBJECT_TESTS = featureCopy.The_tests_covering_this_symbol_313286d;
export const SUBJECT_RISKS = featureCopy.What_is_risky_about_this_symbol_8edeeea;
export const SUBJECT_RUNTIME = featureCopy.What_this_symbol_does_while_it_runs_c8993aa;
export const SUBJECT_CHANGES = featureCopy.What_changed_in_this_symbol_recently_dc46362;
export const SUBJECT_EFFECTS = featureCopy.What_this_symbol_does_outside_its_own_process_6ae3775;
export const SUBJECT_IMPORTS = featureCopy.What_the_file_around_this_symbol_pulls_in_5b07350;

/**
 * Two sections carry their own provenance sentence instead of the generic one.
 *
 * The generic `inferred` sentence names indexed callers, because that is where
 * every inference the provider makes comes from. These two are inferred by
 * CodeAtlas itself rather than by the provider, and telling a reader that a
 * generated summary was "derived from indexed callers" would be a wrong answer
 * to a question they were right to ask.
 */
export const PURPOSE_INFERRED_NOTE =
    featureCopy.This_sentence_is_generated_from_the_calls_environment_values_and__d6d23f5;

export const RISKS_INFERRED_NOTE =
    featureCopy.These_are_rules_applied_to_what_the_index_recorded_not_findings_f_bd572f4;

// ---------------------------------------------------------------------------
// Section bodies
// ---------------------------------------------------------------------------

export const STEPS_EMPTY = featureCopy.This_symbol_calls_nothing_that_the_index_resolved_5830eea;

/**
 * What the caller section says when the index resolved no caller.
 *
 * The sentence names the INDEX as the source of the gap and not the workspace,
 * and that is the whole difference between it and the wording it replaced. The
 * reference project says "Nothing in the indexed workspace calls this symbol.",
 * which is a claim about the code: it is false for every symbol reached through
 * a registry, a dispatch table or any other indirection the engine does not
 * record as a CALLS edge, and the audit of 2026-08-29 demonstrated exactly that
 * on a prepared fixture. "No caller of this symbol appears in what the index
 * resolved" is true in both cases, and it leaves the reader with the right next
 * question, which is what the index can see, not whether the code is dead.
 *
 * It now reads like its three neighbours, and that is the point: an absence
 * sentence in this panel says what was looked at, never what is there.
 */
export const CALLERS_EMPTY = featureCopy.No_caller_of_this_symbol_appears_in_what_the_index_resolved_2359d55;
export const ENV_READS_LABEL = featureCopy.Reads_from_the_environment_86959c8;
export const TYPE_REFS_LABEL = featureCopy.Uses_types_f5145f5;
export const WRITES_LABEL = featureCopy.Writes_9b1ff2c;
export const STATE_EMPTY = featureCopy.This_symbol_reads_no_environment_values_and_names_no_types_40e9ea1;
export const ERRORS_EMPTY = featureCopy.This_symbol_raises_no_error_type_that_the_index_recorded_8ac0b60;

// ---------------------------------------------------------------------------
// The three semantic blocks
// ---------------------------------------------------------------------------

/**
 * The eyebrow above the three blocks the technical depths group facts into.
 *
 * One word each, in capitals, because they are read at a glance and never read
 * as a sentence: a reader scanning the panel is looking for the shape of the
 * symbol, which is what it holds, how it fails and what it touches. The section
 * heading underneath keeps saying what the rows actually are, so the eyebrow
 * adds a grouping without replacing a description.
 */
export const BLOCK_LABEL_DATA = 'DATA';
export const BLOCK_LABEL_ERRORS = 'ERRORS';
export const BLOCK_LABEL_EFFECTS = 'EFFECTS';

/**
 * What the panel says about where an error ends up.
 *
 * The obvious thing to render beside a raised type is "handled at X", and it is
 * the single most tempting invention in this whole panel: a reader wants it, the
 * shape of the answer is obvious, and a plausible one could be assembled from
 * the caller list. The 0.9.0 engine records no handler relation at all, so any
 * such line would be CodeAtlas guessing which caller catches what, and being
 * wrong about it in exactly the situation where a reader would rely on it most.
 *
 * So the block says what is true: the index can see where an error is raised and
 * cannot see where it is caught. The sentence names the limitation as the
 * index's rather than the code's, because "handling not found" would read as a
 * finding about the code and this is not one.
 */
export const ERRORS_HANDLING_NOT_VISIBLE =
    featureCopy.Where_these_are_handled_is_not_visible_to_the_index_it_records_wh_636ccc6;

/**
 * What the effects block says, given that the index carries no effect relations.
 *
 * Deliberately three named kinds rather than a vague "no effects": a reader has
 * to be able to tell that routes, outbound calls and writes are the three things
 * this block would hold, so that its emptiness is legible as a gap in the index
 * rather than as a claim that this symbol is pure.
 *
 */
export const EFFECTS_NOT_IN_INDEX =
    featureCopy.No_evidence_for_routes_outbound_calls_or_writes_is_available_in_t_f3a8962;

/** Group headings inside the effects block, used once the relations exist. */
export const EFFECTS_ROUTES_LABEL = featureCopy.Exposes_routes_e6feac2;
export const EFFECTS_HTTP_LABEL = featureCopy.Calls_out_875a467;
export const EFFECTS_WRITES_LABEL = featureCopy.Writes_9b1ff2c;

/** Badge on a step whose target is constructed rather than called. */
export const BADGE_CONSTRUCTION = featureCopy.new_c2a6b03;
export const BADGE_CONSTRUCTION_TOOLTIP = featureCopy.This_step_constructs_a_class_rather_than_calling_a_function_c3ef19d;

/** Badge on a caller the index flagged as test code. */
export const BADGE_TEST = featureCopy.test_a94a8fe;
export const BADGE_TEST_TOOLTIP = featureCopy.The_index_flagged_this_caller_as_test_code_d042f0c;

/** How the tests section counts what it found. */
export function testCallerCount(count: number): string {
    return count === 1 ? featureCopy.message_1_test_caller_5af7b4d : featureCopy.message_0_test_callers_766de3a(count);
}

/**
 * The tests section's empty case.
 *
 * Never "not tested": the engine records no test relation for TypeScript, so
 * this is a search through callers that found none, and the sentence says so.
 */
export const TESTS_EMPTY_INFERRED =
    featureCopy.No_test_callers_found_inferred_from_callers_not_from_a_test_relat_4d52db4;

// ---------------------------------------------------------------------------
// Evidence affordance
// ---------------------------------------------------------------------------

export const EVIDENCE_BUTTON_LABEL = featureCopy.Evidence_7ea014d;
export const EVIDENCE_BUTTON_TOOLTIP = featureCopy.Show_what_this_claim_is_based_on_e6241cd;
export const EVIDENCE_POPOVER_TITLE = featureCopy.Evidence_7ea014d;
export const EVIDENCE_CLOSE_LABEL = featureCopy.Close_bbfa773;
export const EVIDENCE_EMPTY = featureCopy.No_citation_was_recorded_for_this_claim_6240755;
export const EVIDENCE_NO_LOCATION = featureCopy.no_recorded_location_2d2ee66;

/** Attribution line under one citation: which provider said it and from which index build. */
export function evidenceAttribution(providerId: string, generation: number): string {
    return featureCopy.message_0_index_generation_1_44bdd3c(providerId, generation);
}

// ---------------------------------------------------------------------------
// Knowledge state markers
// ---------------------------------------------------------------------------

/** Short word shown next to a section heading whose fact is not a direct reading. */
export function stateMarkerLabel(state: KnowledgeState): string {
    switch (state) {
        case 'inferred': return featureCopy.inferred_5d50449;
        case 'ambiguous': return featureCopy.ambiguous_f476109;
        case 'unsupported': return featureCopy.not_recorded_9925ee3;
        case 'notIndexed': return featureCopy.not_indexed_bdf75e5;
        case 'unknown': return featureCopy.no_answer_bfca15c;
        case 'known': return '';
    }
}

/**
 * One sentence saying why a fact is empty or untrusted.
 *
 * This is a deliberate second copy of the backend's `explainAbsence`. The
 * backend needs the sentences to explain evidence it serves to any client; the
 * twin needs them for a tooltip it renders thousands of times while the caret
 * moves, and shipping a round trip per tooltip to avoid duplicating six strings
 * would be the wrong trade. Keep the two in step: a change to one of these
 * sentences belongs in `evidence-service.ts` as well, and the sentences are
 * kept identical so a diff of the two files is the check.
 */
export function absenceSentence(state: KnowledgeState, subject: string): string {
    switch (state) {
        case 'notIndexed':
            return featureCopy.message_0_is_unknown_because_this_file_is_not_in_the_index_yet_0e5044a(subject);
        case 'unsupported':
            return featureCopy.message_0_is_unknown_because_the_analyzer_does_not_record_this_for_this_l_ef7a896(subject);
        case 'inferred':
            return featureCopy.message_0_is_derived_from_indexed_callers_not_read_directly_230f49f(subject);
        case 'unknown':
            return featureCopy.message_0_is_unknown_because_no_analysis_backend_answered_c0e07db(subject);
        case 'ambiguous':
        case 'known':
            return '';
    }
}

// ---------------------------------------------------------------------------
// Terminology: the same seven sections, named twice
// ---------------------------------------------------------------------------

/**
 * Section headings in the two terminologies.
 *
 * Not a translation of one another. The technical set names the relation the
 * index recorded, which is what a reviewer wants; the plain set names the
 * question a reader arrived with, which is what someone new to the code wants.
 * Both are true about the same rows, and neither is a simplification of the
 * other: "Called by" and "Who uses it" are the same fact addressed to different
 * people.
 */
export const SECTION_LABELS_TECHNICAL: Readonly<Record<string, string>> = {
    purpose: SECTION_PURPOSE,
    steps: SECTION_STEPS,
    callers: SECTION_CALLERS,
    state: SECTION_STATE,
    imports: SECTION_IMPORTS,
    errors: SECTION_ERRORS,
    effects: SECTION_EFFECTS,
    tests: SECTION_TESTS,
    risks: SECTION_RISKS,
    runtime: SECTION_RUNTIME,
    changes: SECTION_CHANGES
};

export const SECTION_LABELS_PLAIN: Readonly<Record<string, string>> = {
    purpose: featureCopy.What_this_is_for_a5dd173,
    steps: featureCopy.What_it_does_in_order_6cd8aba,
    callers: featureCopy.Who_uses_it_54f8de5,
    state: 'What it reads',
    imports: featureCopy.What_the_file_brings_in_a7f0d2b,
    errors: featureCopy.How_it_can_fail_2247480,
    effects: featureCopy.What_it_touches_outside_70ab821,
    tests: featureCopy.What_checks_it_5f3add5,
    risks: featureCopy.What_to_watch_out_for_c776dd5,
    runtime: featureCopy.What_happens_when_it_runs_8f28a66,
    changes: featureCopy.What_changed_recently_a4b3e58
};

/**
 * One glyph per section, in both terminologies.
 *
 * Icons rather than words alone because the panel is scanned before it is read,
 * and a reader who has met the panel twice finds the failure modes by the shape
 * beside the heading rather than by reading five headings. They are codicons,
 * which every Theia theme ships and restyles, so nothing here pins a colour or
 * an asset.
 *
 * An icon is never the only carrier of meaning: the heading beside it says the
 * same thing in words, which is what makes it safe to add one at all.
 *
 * (Portierungsnotiz: die Werte sind unveraendert uebernommen, damit ein Diff der
 * beiden Dateien ein Diff bleibt. Diese Oberflaeche liefert keine Codicon-Schrift
 * aus und zeichnet deshalb keine Glyphe; das Panel schreibt den Namen als
 * `data-icon` an die Ueberschrift, und die Ueberschrift daneben sagt weiterhin
 * in Worten dasselbe.)
 */
export const SECTION_ICONS: Readonly<Record<string, string>> = {
    purpose: 'codicon-info',
    steps: 'codicon-list-ordered',
    callers: 'codicon-references',
    state: 'codicon-database',
    imports: 'codicon-package',
    errors: 'codicon-warning',
    effects: 'codicon-globe',
    tests: 'codicon-beaker',
    risks: 'codicon-alert',
    runtime: 'codicon-pulse',
    changes: 'codicon-git-commit'
};

// ---------------------------------------------------------------------------
// The two lenses this panel names but does not answer itself
// ---------------------------------------------------------------------------

/**
 * What the runtime lens says when no recording has been imported for this symbol.
 *
 * Until 2026-08-29 this sentence said that CodeAtlas "does not watch code while
 * it runs yet" and sent the reader to a menu entry for importing recordings. Both
 * halves were wrong here: this product DOES show observed calls, on the BUG hunt
 * hops and in the flow, and the menu entry it named does not exist in this
 * surface. A sentence that sends a reader to a menu item they will not find is
 * worse than one that says nothing, because they will look for it.
 *
 * So the sentence says where the observed calls are and how they get in. The way
 * in is the command line, because this surface writes nothing (see the help
 * page, section "What it cannot do").
 */
export const RUNTIME_NOT_IN_TWIN =
    featureCopy.This_server_hands_observed_calls_to_trace_and_flow_answers_not_to_0acbd5a;

/**
 * What the changes lens says.
 *
 * Until 2026-08-29 this claimed that CodeAtlas "does not read version history
 * yet", which the impact panel had been disproving since W4d: it reads exactly
 * that, out of detect_changes, for the worktree and against a reference. The twin
 * is what does not carry it, and that is what the sentence now says, with the
 * surface that does carry it named.
 */
export const CHANGES_NOT_IN_TWIN =
    featureCopy.The_twin_carries_no_version_history_so_this_section_stays_empty_W_e36a2b0;

/** Why these two sections wear a marker even though nothing is missing from the index. */
export const LENS_ANSWERED_ELSEWHERE_NOTE =
    featureCopy.Nothing_is_missing_from_the_index_here_the_twin_does_not_answer_t_dc1fa61;

// ---------------------------------------------------------------------------
// The narrative depth: counts and consequences, in words, with no identifiers
// ---------------------------------------------------------------------------

/**
 * A symbol kind in ordinary English.
 *
 * The narrative depth is read by someone who has not decided yet whether they
 * care about the difference between an interface and a type alias, so it does
 * not spend their attention on one.
 */
export function plainKind(kind: CodeAtlasSymbolKind): string {
    switch (kind) {
        case 'function': return featureCopy.function_c218e39;
        case 'method': return featureCopy.method_bfbaf8b;
        case 'class': return featureCopy.class_8d767bf;
        case 'interface': return featureCopy.contract_other_code_has_to_satisfy_ee6365d;
        case 'module': return featureCopy.file_971c419;
        case 'variable': return featureCopy.value_f32b67c;
        case 'type': return featureCopy.shape_5080fd6;
        case 'route': return featureCopy.endpoint_e13fe41;
        case 'unknown': return featureCopy.piece_of_code_38e8e4d;
    }
}

export function proseLead(name: string, kind: CodeAtlasSymbolKind): string {
    return featureCopy.message_0_is_a_1_5731a64(name, plainKind(kind));
}

export function proseCalls(name: string, callees: readonly string[]): string {
    return featureCopy.message_0_hands_work_to_1_55e76bd(name, countOf(callees.length, 'other piece of code', 'other pieces of code'))
        + `${joinNames(callees)}.`;
}

export function proseReads(name: string, values: readonly string[]): string {
    return featureCopy.message_0_reads_1_from_the_environment_it_runs_in_fa5d553(name, countOf(values.length, 'value', 'values'))
        + `${joinNames(values)}.`;
}

export function proseThrows(name: string, errors: readonly string[]): string {
    return featureCopy.message_0_can_stop_with_1_1294006(name, countOf(errors.length, 'kind of error', 'kinds of error'))
        + `${joinNames(errors)}.`;
}

/** A short English list that never hides its last member. */
export function joinNames(names: readonly string[]): string {
    if (names.length <= 1) {
        return names[0] ?? '';
    }
    if (names.length === 2) {
        return featureCopy.message_0_and_1_f4c667a(names[0], names[1]);
    }
    return featureCopy.message_0_and_1_b05b4ab(names.slice(0, -1).join(', '), names[names.length - 1]);
}

/** Lead-in to the clickable names. The only identifiers the narrative depth shows. */
export const PROSE_CHIPS_LEAD = featureCopy.The_parts_it_leans_on_in_the_order_they_come_up_638072f;

export function proseMoreParts(hidden: number): string {
    return featureCopy.message_0_not_listed_here_the_deeper_settings_show_all_of_them_e95575b(countOf(hidden, 'further part is', 'further parts are'));
}

/** Said out loud, because the sentence above it was assembled rather than written. */
export const PROSE_GENERATED_NOTE =
    featureCopy.Nobody_wrote_that_description_CBM_Lens_put_it_together_from_what__f953432;

export const PROSE_TESTS_NONE =
    featureCopy.Nothing_that_looks_like_a_test_calls_this_so_no_automatic_check_w_bcc5852;

export function proseTestsSome(count: number): string {
    return featureCopy.message_0_this_so_a_change_here_would_be_noticed_edeefba(countOf(count, 'test calls', 'tests call'));
}

/** Plain subjects for the plain absence sentences below. */
export const PLAIN_SUBJECT_TESTS = featureCopy.Whether_anything_tests_this_19ad4b4;
export const PLAIN_SUBJECT_ERRORS = featureCopy.How_this_can_fail_1ea2aec;

/**
 * The absence sentences again, without the vocabulary.
 *
 * Same six cases as {@link absenceSentence} and deliberately not the same
 * wording: "the analyzer does not record this for this language" is precise and
 * means nothing to a reader who does not know there is an analyzer.
 */
export function plainAbsence(state: KnowledgeState, subject: string): string {
    switch (state) {
        case 'notIndexed':
            return featureCopy.message_0_is_unknown_CBM_Lens_has_not_read_this_file_yet_7b79d40(subject);
        case 'unsupported':
            return featureCopy.message_0_is_unknown_CBM_Lens_cannot_see_this_for_this_language_eefee01(subject);
        case 'inferred':
            return featureCopy.message_0_was_worked_out_from_what_calls_it_not_read_from_the_code_itself_03ccbd9(subject);
        case 'unknown':
            return featureCopy.message_0_is_unknown_nothing_answered_when_CBM_Lens_asked_4d259db(subject);
        case 'ambiguous':
        case 'known':
            return '';
    }
}

// ---------------------------------------------------------------------------
// The guided depth
// ---------------------------------------------------------------------------

export const GUIDED_FACTS_LEAD = featureCopy.Start_with_these_7ca5ba6;

// ---------------------------------------------------------------------------
// The dense depth: what a reviewer wants appended to every row
// ---------------------------------------------------------------------------

/**
 * How sure the resolver was. Two decimals because a provider that scores at all
 * reports two, and rounding a 0.55 to "medium" would hide the only interesting
 * part.
 */
export function confidenceLabel(value: number): string {
    return featureCopy.confidence_0_487a615(value.toFixed(2));
}

export const CONFIDENCE_SCORED_TOOLTIP =
    featureCopy.How_sure_the_resolver_was_that_this_is_the_right_target_as_the_pr_edd3ef9;

/**
 * The two things a row can say when no figure was recorded.
 *
 * An absent score is not a missing field to be hidden: it is the difference
 * between a relation the index read off the graph and one somebody derived. The
 * 0.9.0 engine scores nothing and reads its call, caller and raise relations
 * directly, so the honest label on those rows is that there is nothing to
 * score, and the honest label on a derived one is that nobody scored it. A row
 * that showed a blank where a reviewer expects a number would leave them
 * guessing which of the two they were looking at.
 */
export const CONFIDENCE_EXACT = featureCopy.exact_b55e22f;
export const CONFIDENCE_EXACT_TOOLTIP =
    featureCopy.Read_directly_from_the_index_There_is_no_score_because_nothing_wa_00721e4;

export const CONFIDENCE_UNSCORED = featureCopy.unscored_271cf58;
export const CONFIDENCE_UNSCORED_TOOLTIP =
    featureCopy.This_claim_is_not_a_direct_reading_and_the_provider_recorded_no_s_3f47879;

/** Which heuristic resolved the row, named the way the provider named it. */
export function strategyLabel(strategy: string): string {
    return featureCopy.via_0_98579a4(strategy);
}

export function citationCount(count: number): string {
    return count === 1 ? featureCopy.message_1_citation_3de97b2 : featureCopy.message_0_citations_613a4ae(count);
}

/** Count beside a section heading, so a long list is readable while collapsed. */
export function rowCountLabel(count: number): string {
    return count === 1 ? featureCopy.message_1_entry_7af47b9 : featureCopy.message_0_entries_1ad8555(count);
}

// ---------------------------------------------------------------------------
// The presentation toolbar
// ---------------------------------------------------------------------------

/**
 * The slider asks who is reading, not how much to say.
 *
 * Until W13 it said "Detail level", and the label was the honest name of what
 * the control did: it made the same answer longer or shorter. That was the
 * weaker question. The same recorded facts do not need to be longer for a
 * senior than for a junior; they need to be *chosen differently*, because the
 * two arrived with different questions. So the label names the reader, the
 * value beside it names which reader is selected, and each level opens by
 * stating the question it answers.
 */
export const DEPTH_SLIDER_LABEL = featureCopy.Who_is_reading_67e9f31;
export const DEPTH_SLIDER_TOOLTIP =
    featureCopy.The_same_recorded_facts_chosen_for_one_reader_Five_readers_ask_fi_f40d71f;

/**
 * The five readers, indexed by level, in the words the reader chose.
 *
 * Lower case on purpose: these are names of people, not names of settings, and
 * "Vibe Coder" reads like a product tier where "vibe coder" reads like someone
 * sitting down with the code.
 */
export const DEPTH_LABELS: readonly string[] = [
    featureCopy.vibe_coder_3f5940c,
    featureCopy.junior_9009337,
    featureCopy.medior_af74aa4,
    featureCopy.senior_2c0b43f,
    featureCopy.architect_e58c93c,
];

/**
 * The question each level answers, said out loud at the top of the body.
 *
 * Not decoration and not a heading: it is the whole claim of the slider made
 * checkable. A reader who moves the slider and cannot tell what changed can
 * read the first line and see which question is now being answered, and a
 * level whose body does not answer its own question is a bug anyone can spot.
 */
export const LEVEL_QUESTIONS: readonly string[] = [
    featureCopy.What_happens_here_and_why_does_it_matter_to_you_626d72b,
    featureCopy.In_what_order_does_it_happen_and_why_a598f10,
    featureCopy.What_is_actually_written_here_e93dd67,
    featureCopy.What_does_this_cost_you_e33419c,
    featureCopy.What_does_this_sit_on_and_where_does_our_knowledge_end_dca396e,
];

// ---------------------------------------------------------------------------
// Level 1, junior: the order, and the words it is told in
// ---------------------------------------------------------------------------

/**
 * The connectives between the steps.
 *
 * They say order and nothing else, because order is the one thing the index
 * really records: the call sites arrive in the sequence the body reaches them.
 * A connective that said "because" or "so that" would be a claim about intent,
 * which is exactly the invention this panel exists to avoid, and it would be
 * invisible as an invention because it reads like grammar.
 */
export const STEP_CONNECTIVES: readonly string[] = [featureCopy.First_916a78d, featureCopy.Then_b7d9320, featureCopy.After_that_0793a1a, featureCopy.Next_bc98198];

/** The last one, when there is more than one step. */
export const STEP_CONNECTIVE_LAST = featureCopy.And_last_bccdba7;

export function juniorStep(connective: string, name: string): string {
    return featureCopy.message_0_it_hands_work_to_1_7132027(connective, name);
}

/** Where that step lands, when the index knows where. */
export function juniorStepAt(location: string): string {
    return ` (${location})`;
}

export const JUNIOR_ORDER_LEAD =
    featureCopy.These_are_the_calls_in_the_order_the_body_reaches_them_The_order__9d4380d;

export const JUNIOR_NO_STEPS =
    featureCopy.The_index_resolves_no_outgoing_calls_from_this_symbol_so_it_recor_009c332;

/** The heading over the words explained on first sight. */
export const JUNIOR_TERMS_LEAD = featureCopy.Words_used_above_once_each_cf07987;

/**
 * The glossary, keyed by the word.
 *
 * Only the words this level actually puts on screen are shown, and each is
 * shown once. A glossary that lists every term whether or not it appeared
 * would be a page of vocabulary in front of the answer.
 */
export const TERM_EXPLANATIONS: Readonly<Record<string, string>> = {
    'call site':
        featureCopy.a_place_in_this_code_where_it_hands_work_to_another_piece_of_code_ee557b0,
    caller:
        featureCopy.a_piece_of_code_that_hands_work_to_this_one_If_you_change_what_th_9f6ee52,
    raise:
        featureCopy.stopping_with_an_error_instead_of_returning_a_result_The_index_re_14309f3,
    'environment read':
        featureCopy.a_value_this_code_takes_from_outside_itself_such_as_a_setting_or__31b06c8,
    'test caller':
        featureCopy.a_caller_that_lives_in_test_code_It_is_how_CBM_Lens_answers_is_th_9aaf50e,
    'entry point':
        featureCopy.a_place_the_outside_world_can_start_this_program_a_route_a_comman_d1bda60,
};

// ---------------------------------------------------------------------------
// Level 3, senior: what it costs
// ---------------------------------------------------------------------------

export const COST_TITLE_FAILS = featureCopy.How_it_can_fail_2247480;
export const COST_TITLE_UNTESTED = featureCopy.What_is_unchecked_3d8d740;
export const COST_TITLE_DEPENDS = featureCopy.Who_depends_on_it_29da9c6;
export const COST_TITLE_MOVES = featureCopy.What_moves_with_a_change_d082d8c;

export const COST_LEAD_FAILS =
    featureCopy.The_error_types_recorded_as_leaving_this_symbol_Where_they_are_ca_3686a24;
export const COST_LEAD_UNTESTED =
    featureCopy.What_would_notice_if_this_broke_This_engine_records_no_test_relat_0c2dd0b;
export const COST_LEAD_DEPENDS =
    featureCopy.Everything_the_index_records_as_calling_this_Change_what_it_expec_e8550d7;
export const COST_LEAD_MOVES =
    featureCopy.What_a_change_here_reaches_on_the_way_out_the_calls_it_makes_the__970393d;

export const COST_EMPTY_FAILS =
    featureCopy.No_error_path_was_recorded_here_so_a_change_cannot_break_one_you__58fd292;
export const COST_EMPTY_UNTESTED =
    featureCopy.Nothing_that_looks_like_a_test_calls_this_A_change_here_would_be__5d38a25;
export const COST_EMPTY_DEPENDS =
    featureCopy.Nothing_in_the_indexed_workspace_calls_this_Either_it_is_reached__17dae97;
export const COST_EMPTY_MOVES =
    featureCopy.This_reaches_nothing_outside_itself_that_the_index_recorded_no_ca_0a034c7;

/** How the senior level names an item's cost in one word beside it. */
export function costWeight(count: number): string {
    return featureCopy.message_0_to_check_25d476e(countOf(count, 'place', 'places'));
}

// ---------------------------------------------------------------------------
// Level 4, architect: the ground, the carriers, the debts, and the limits
// ---------------------------------------------------------------------------

export const GROUND_TITLE_SITS_ON = featureCopy.What_it_sits_on_b5cbb66;
export const GROUND_TITLE_CARRIED = featureCopy.What_carries_it_0b0c3a8;
export const GROUND_TITLE_DEBTS = featureCopy.What_it_owes_76d0230;
export const GROUND_TITLE_LIMITS = featureCopy.Where_this_index_stops_040cfc5;

export const GROUND_LEAD_SITS_ON =
    featureCopy.The_modules_underneath_this_symbol_one_line_each_with_how_many_ca_560156c;
export const GROUND_LEAD_CARRIED =
    featureCopy.What_holds_this_up_the_callers_and_whether_the_outside_world_can__4a84c7e;
export const GROUND_LEAD_DEBTS =
    featureCopy.What_is_owed_against_this_symbol_from_the_rules_CBM_Lens_applies__a1fedef;
export const GROUND_LEAD_LIMITS =
    featureCopy.What_is_not_on_this_page_and_why_This_is_part_of_the_answer_and_n_4edfcb0;

export const GROUND_EMPTY_SITS_ON =
    featureCopy.This_sits_on_nothing_the_index_could_resolve_no_call_from_here_re_a95799b;
export const GROUND_EMPTY_CARRIED =
    featureCopy.Nothing_carries_this_no_recorded_caller_and_nothing_marking_it_as_33fc892;
export const GROUND_EMPTY_DEBTS =
    featureCopy.No_rule_fired_against_this_symbol_That_is_not_a_clean_bill_the_ru_aa2e414;

/** How many call sites reach into one module. */
export function groundReach(count: number): string {
    return `${countOf(count, 'call site', 'call sites')}`;
}

/** The architect's word for a symbol the outside world can start. */
export const GROUND_ENTRY_POINT =
    featureCopy.The_outside_world_can_start_here_this_symbol_is_recorded_as_an_en_a7744bf;
export const GROUND_EXPORTED =
    featureCopy.Exported_from_its_module_so_code_outside_the_index_can_call_it_wi_bf27324;
export const GROUND_NOT_EXPORTED =
    featureCopy.Not_exported_so_everything_that_can_call_it_is_inside_this_module_81ab4c0;

/** The debts that come from the structural flags rather than from a rule. */
export const DEBT_RECURSIVE = featureCopy.Calls_itself_Depth_is_bounded_by_whatever_the_caller_passes_in_no_ddc6bed;
export const DEBT_UNGUARDED_RECURSION =
    featureCopy.Recursive_with_no_base_case_the_analyzer_could_see_If_that_readin_5b82264;
export const DEBT_SCAN_IN_LOOP =
    featureCopy.A_linear_scan_runs_inside_a_loop_which_is_the_shape_a_quadratic_h_3730d19;
export const DEBT_ALLOC_IN_LOOP = featureCopy.Allocates_inside_a_loop_so_the_cost_grows_with_the_iteration_coun_43c1358;

export function debtLoopDepth(depth: number): string {
    return featureCopy.Loops_nested_0_deep_inside_this_symbol_alone_29e5c87(depth);
}

export function debtBranches(count: number): string {
    return featureCopy.message_0_independent_branches_through_the_body_so_that_many_paths_have_t_7f81fe1(count);
}

/** How the limits block words one family the index could not answer. */
export function limitOfFamily(subject: string, sentence: string): string {
    return `${subject}: ${sentence}`;
}

export function limitGeneration(generation: number): string {
    return featureCopy.Everything_above_was_read_from_index_generation_0_An_edit_after_t_2fa77ec(generation)
        + featureCopy.and_this_page_cannot_tell_you_whether_there_was_one_d725200;
}

export const LIMIT_NO_TEST_RELATION =
    featureCopy.This_engine_records_no_test_relation_for_TypeScript_at_all_so_wha_f69ae3b;
export const LIMIT_NO_HANDLER_SITES =
    featureCopy.Raised_error_types_are_recorded_the_places_they_are_caught_are_no_63c3550;
export const LIMIT_NO_ROUTES =
    featureCopy.Routes_for_TypeScript_are_read_out_of_the_source_text_by_CBM_Lens_5fc6263;
export const LIMIT_CALLS_DEDUPLICATED =
    featureCopy.Two_calls_to_the_same_target_inside_one_body_are_recorded_once_wi_b040fd9;

// ---------------------------------------------------------------------------
// The local model, when it is on: it rewords, it does not add
// ---------------------------------------------------------------------------

/** The button that asks the model to say the same thing to this reader. */
export const VOICE_LABEL = featureCopy.Say_it_for_this_reader_4434d60;
export const VOICE_TITLE =
    featureCopy.Hand_the_sentences_above_to_the_local_model_and_let_it_word_them__da7c1eb;
export const VOICE_RUNNING = featureCopy.The_local_model_is_rewording_the_sentences_above_d0f6be9;
export const VOICE_RESTORE_LABEL = featureCopy.Back_to_the_built_text_53c1b4f;
export const VOICE_RESTORE_TITLE =
    featureCopy.Drop_the_reworded_sentences_and_show_the_ones_CBM_Lens_assembled__4b37bf5;

/** The marker beside a sentence the model worded. Same idiom as the state markers. */
export const VOICE_MARKER = '[~]';
export const VOICE_MARKER_NOTE =
    featureCopy.Worded_by_the_local_model_from_the_sentence_CBM_Lens_built_The_fa_8ba352b;
export const VOICE_APPLIED =
    featureCopy.The_sentences_above_were_reworded_by_the_local_model_Every_name_n_7dcecd4;

export function voiceRefused(reason: string): string {
    return featureCopy.The_rewrite_was_thrown_away_and_the_built_text_is_what_you_see_Re_3c6221a(reason);
}

export const VOICE_UNAVAILABLE =
    featureCopy.The_local_model_is_off_so_these_sentences_are_the_ones_CBM_Lens_a_547cd82;

export const FACET_LABELS: Readonly<Record<Facet, string>> = {
    [Facet.Logic]: featureCopy.Logic_3d52a6d,
    [Facet.Calls]: featureCopy.Calls_0a19b7e,
    [Facet.Data]: featureCopy.Data_e5e429b,
    [Facet.Errors]: featureCopy.Errors_805e86a,
    [Facet.Tests]: featureCopy.Tests_39fdec1,
    [Facet.Runtime]: featureCopy.Runtime_c4740e4,
    [Facet.Changes]: featureCopy.Changes_8aa57de
};

export function facetTooltip(label: string, on: boolean): string {
    return on ? featureCopy.Hide_0_5a7401f(label) : featureCopy.Show_0_13d0c01(label);
}

// ---------------------------------------------------------------------------
// The mini understanding panel
// ---------------------------------------------------------------------------

export const MINI_TITLE = featureCopy.Left_to_understand_ad2001d;

/**
 * What follows the figure in the strip's header.
 *
 * Split out from {@link miniProgress} so the renderer can give the figure an
 * element of its own without the two drifting apart: a driver that compares the
 * strip with the checklist panel reads a number rather than parsing a sentence,
 * and the sentence a reader sees is still assembled in one place.
 */
export const MINI_PERCENT_SUFFIX = featureCopy.confirmed_717bce2;

export function miniProgress(percent: number): string {
    return `${percent}${MINI_PERCENT_SUFFIX}`;
}

/**
 * What the percentage above is counting, and what would move it.
 *
 * The figure is confirmations only. A reader who has followed every line and
 * confirmed nothing still sees zero, and the sentence says why so the zero is
 * not read as a judgement about how much work they have done.
 */
export const MINI_PROGRESS_NOTE =
    featureCopy.That_figure_counts_what_you_have_confirmed_not_what_you_have_look_48a90a8;

export function miniReadCalls(count: number): string {
    return featureCopy.Read_the_0_this_calls_2769b35(countOf(count, 'function', 'functions'));
}

export function miniErrorPath(types: string[]): string {
    return types.length === 1
        ? featureCopy.Check_the_error_path_0_77d7a5e(types[0])
        : featureCopy.Check_the_error_paths_0_83427d4(types.join(', '));
}

export function miniCallers(count: number): string {
    return featureCopy.See_the_0_5354f13(countOf(count, 'caller', 'callers'));
}

export function miniConfig(names: string[]): string {
    return names.length === 1
        ? featureCopy.Confirm_0_is_set_ab7b430(names[0])
        : featureCopy.Confirm_0_set_a9a8e6d(countOf(names.length, 'configuration value is', 'configuration values are'));
}

export function miniShape(names: string[]): string {
    return names.length === 1
        ? featureCopy.Know_the_shape_of_0_a0e8f19(names[0])
        : featureCopy.Know_the_shapes_of_the_0_this_names_411b2d0(countOf(names.length, 'type', 'types'));
}

export function miniConstructions(count: number): string {
    return featureCopy.Read_the_0_this_constructs_21a9297(countOf(count, 'class', 'classes'));
}

export function miniTests(count: number): string {
    return count === 1
        ? featureCopy.Re_read_the_1_test_that_covers_this_cc479d9
        : featureCopy.Re_read_the_0_tests_that_cover_this_49cbbfc(count);
}

/** Same finding as TESTS_EMPTY_INFERRED, shortened to fit a checklist line. */
export const MINI_TESTS_NONE = featureCopy.No_test_callers_found_decide_if_this_needs_a_test_d1d9e7f;

/**
 * What the strip promises when a reader hovers a line.
 *
 * The strip led with a percentage for four cycles and the lines under it were
 * read as a list of complaints. They are not: each one starts a short guided
 * walk through the places that answer it, which is the difference between a
 * panel that grades a reader and a panel that takes them somewhere.
 */
export const MINI_ITEM_TOOLTIP = featureCopy.Walk_the_places_that_answer_this_one_stop_at_a_time_ddbdf01;

// ---------------------------------------------------------------------------
// The guided hop
// ---------------------------------------------------------------------------

/**
 * A short walk through the two or three places that answer one open question.
 *
 * The wording carries one rule the mechanism cannot. A stop says why the place
 * it opened matters, and that sentence is written from what the checklist item
 * already claims, never from anything about the code CodeAtlas has not recorded.
 * The reader is being taken somewhere and told why that somewhere is on the
 * list; they are not being told what they will find when they get there.
 */
export function hopProgress(stop: number, total: number): string {
    return featureCopy.Stop_0_of_1_16d296d(stop, total);
}

export const HOP_NEXT_LABEL = featureCopy.Next_bc98198;
export const HOP_DONE_LABEL = featureCopy.Done_e9b450d;
export const HOP_CLOSE_TOOLTIP = featureCopy.End_the_walk_Everything_you_have_already_been_taken_to_stays_mark_e101a98;

/**
 * Why each stop of a walk is worth the trip, one sentence per checklist family.
 *
 * Deliberately about the obligation rather than about the target: "you cannot
 * say what this does without knowing what it delegates to" is true of every
 * callee and needs nothing the index has not recorded, where "this validates the
 * user" would be a claim about a function CodeAtlas has not read.
 */
export const HOP_WHY: Readonly<Record<string, string>> = {
    'core-logic': featureCopy.What_this_symbol_does_is_mostly_what_it_delegates_to_This_is_one__4e62102,
    'error-handling': featureCopy.This_is_where_the_failure_comes_from_Reading_it_is_how_you_find_o_9fc4b63,
    callers: featureCopy.Someone_depends_on_this_What_they_expect_is_the_constraint_on_any_3ee6b01,
    config: featureCopy.This_value_comes_from_the_environment_so_it_is_set_outside_the_co_2f2e04e,
    inputs: featureCopy.This_is_a_shape_the_symbol_assumes_it_was_handed_Knowing_it_is_ho_8f1de75,
    implementations: featureCopy.This_class_is_constructed_here_rather_than_called_so_reading_it_i_7c0aee6,
    tests: featureCopy.A_test_is_the_shortest_available_description_of_what_this_is_supp_9aaf91e
};

/** Fallback for a category nobody has written a sentence for yet. */
export const HOP_WHY_FALLBACK = featureCopy.This_is_one_of_the_places_the_checklist_points_at_for_this_questi_2d10709;

export function hopWhy(category: string): string {
    return HOP_WHY[category] ?? HOP_WHY_FALLBACK;
}

// The runtime facet of the twin, once a recording has been imported ----------

/** The section's own sentence when the store was read and holds nothing for this symbol. */
export const RUNTIME_SECTION_EMPTY =
    featureCopy.A_recording_has_been_imported_and_none_of_it_passes_through_this__0442d43;

/** Heading text over the observed rows, with the total. */
export function runtimeObservedCount(calls: number, total: number): string {
    return featureCopy.message_0_observed_1_2_3_in_all_9ddf11f(calls, calls === 1 ? 'call' : 'calls', total, total === 1 ? 'time' : 'times');
}

/** One observed row's count, beside the callee's name. */
export function runtimeRowCount(count: number): string {
    return `${count}x`;
}

/** The marker on an observed call the index does not record. */
export const RUNTIME_UNEXPECTED_BADGE = featureCopy.not_in_the_index_0fde82b;
export const RUNTIME_UNEXPECTED_TOOLTIP =
    featureCopy.The_recording_holds_this_call_and_the_analyzer_records_no_such_ca_83178c2;

/** Why the runtime section wears its marker: nothing is missing from the index here. */
export const RUNTIME_SECTION_NOTE =
    featureCopy.Read_from_an_imported_recording_not_from_the_index_CBM_Lens_did_n_85e53b3;

// The runtime badge in the evidence popover ---------------------------------

/** Shown on a citation that came from a recording rather than from the index. */
export const EVIDENCE_RUNTIME_BADGE = featureCopy.runtime_f2e18ff;
export const EVIDENCE_RUNTIME_TOOLTIP =
    featureCopy.This_citation_comes_from_an_imported_recording_not_from_the_analy_dc59346;

/** How many times the recording saw it, said under the badge. */
export function evidenceObservations(count: number): string {
    return featureCopy.observed_0_1_156a2f9(count, count === 1 ? 'time' : 'times');
}
