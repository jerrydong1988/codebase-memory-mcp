import { featureCopy } from '../i18n/features/pseudocode';
/*
 * Herkunft: portiert am 2026-08-29 aus CodeAtlasIDE,
 * /Users/bernhard/Desktop/CodeAtlasIDE/theia-extensions/codeatlas-views/src/browser/strings.ts
 * Gleicher Urheber (Bernhard Jackiewicz). Uebernommen ist der Wortlaut der
 * Pseudocode-Bloecke (Z. 1874-2064), der Imports-Gruppe (Z. 2069-2190) und des
 * Flow-Erklaerers (ab Z. 2192), WOERTLICH und samt Begruendungen: der
 * Unterschied zwischen "nicht benutzt" und "nicht pruefbar" wird in diesem
 * Produkt ausschliesslich vom Wortlaut getragen.
 *
 * Warum eine eigene Datei und nicht src/twin/strings.ts: dieselbe Trennung, die
 * dieses Projekt schon fuer impact-strings.ts und bug-wizard-strings.ts gewaehlt
 * hat. Der Twin-Wortlaut ist die Kopie einer Flaeche; hier steht der Wortlaut
 * einer zweiten. Was der Twin davon liest (die Sektion "Pulls in"), steht in
 * src/twin/strings.ts, weil es dort die Sektionstabellen fuellt.
 *
 * Aenderungen gegenueber dem Original: der Importpfad von countOf, und
 * weggelassen ist der Wortlaut der Flaechen, die es hier nicht gibt (Menue- und
 * Kommando-Beschriftungen des Overlays, die Sende-Vorschau und die Daten-Policy
 * der optionalen Verfeinerung; applyRefinedPseudocode ist portiert und
 * unit-getestet, aber nicht verdrahtet, siehe PLAN W5).
 */

import { countOf } from '../twin/strings';

// ---------------------------------------------------------------------------
// Die Bloecke
// ---------------------------------------------------------------------------

/** The heading over each scope's block. */
export function pseudocodeSymbolTitle(name: string): string {
    return featureCopy.Steps_in_0_3b95305(name);
}

export function pseudocodeClassTitle(name: string): string {
    return featureCopy.Steps_in_class_0_fe3083a(name);
}

export function pseudocodeSelectionTitle(count: number): string {
    return featureCopy.Steps_in_0_3b95305(countOf(count, 'selected symbol', 'selected symbols'));
}

export function pseudocodeClosureTitle(name: string): string {
    return featureCopy.Steps_in_0_and_the_code_it_reaches_6e814c3(name);
}

/**
 * One step.
 *
 * The verb is the strategy the index recorded and nothing else: a construction
 * is drawn as "constructs" because that is what the graph called it, and a
 * resolved invocation is drawn as "calls". Guessing a richer verb from the name
 * of the callee is exactly the invention this feature must not make.
 */
export function pseudocodeStepLine(order: number, verb: string, target: string): string {
    return `${order}. ${verb} ${target}`;
}

/** The two verbs, and the only two. */
export const PSEUDOCODE_VERB_CALL = featureCopy.call_bc8d864;
export const PSEUDOCODE_VERB_CONSTRUCT = featureCopy.construct_b012113;

/** One error the symbol can raise. "May" because the index records the site, not the condition. */
export function pseudocodeRaiseLine(order: number, type: string): string {
    return featureCopy.message_0_may_raise_1_77e02eb(order, type);
}

/** One environment value the symbol reads. */
export function pseudocodeEnvLine(order: number, key: string): string {
    return featureCopy.message_0_read_1_from_the_environment_10e8d55(order, key);
}

/** The heading over one method of a class. */
export function pseudocodeMethodGroup(name: string): string {
    return featureCopy.method_0_5200050(name);
}

/** The heading over one symbol of a selection or a closure. */
export function pseudocodeSymbolGroup(name: string): string {
    return `${name}:`;
}

/**
 * Said under a group the index had nothing to list for.
 *
 * A group with no lines under it would read as a method that does nothing. What
 * is true is narrower: the index recorded no call, no raise and no environment
 * read for it, which is a statement about the index and is worded as one.
 */
export function pseudocodeEmptyGroup(name: string): string {
    return featureCopy.the_index_recorded_no_calls_raised_errors_or_environment_reads_fo_15d5a2a(name);
}

/** Said at the end of a block the closure's bound cut short. */
export function pseudocodeCappedNote(hidden: number): string {
    return featureCopy.and_0_not_expanded_the_walk_stopped_at_its_bound_836a984(countOf(hidden, 'more symbol', 'more symbols'));
}

/**
 * Said at the end of a class or selection block that could not be resolved in
 * full.
 *
 * CodeAtlas finds the members of a range by asking the index what encloses each
 * line, and over a long range it asks at a stride and keeps the answers under a
 * ceiling. Both bounds can miss a member. A block that said nothing about that
 * would be a list of methods that is quietly not the list of methods, which is
 * the one way this feature could mislead without saying anything untrue.
 */
export const PSEUDOCODE_PARTIAL_SCOPE =
    featureCopy.CBM_Lens_sampled_this_range_rather_than_reading_every_line_of_it__60442c9;

/**
 * The footer, and the sentence that keeps the whole block honest.
 *
 * Two numbers and one standing claim. The numbers say how many of the symbols
 * in scope actually contributed a line, because a block assembled from ten
 * symbols of which two had facts is not a description of ten symbols. The claim
 * is the same one every derived surface in this product carries: this came out
 * of an index, and an index reports what it resolved.
 */
export function pseudocodeCoverage(covered: number, total: number): string {
    return featureCopy.message_0_of_1_in_scope_contributed_steps_8b788e3(covered, countOf(total, 'symbol', 'symbols'));
}

/** Named symbols the block covers nothing for, so their absence is not read as emptiness. */
export function pseudocodeUncovered(names: readonly string[]): string {
    return featureCopy.Nothing_was_listed_for_0_43dae67(names.join(', '));
}

export const PSEUDOCODE_SOURCE_NOTE =
    featureCopy.Derived_from_the_index_and_nothing_else_every_line_is_a_call_a_ra_9d7691d;

/** Tooltip on a numbered line, which opens the place it was read from. */
export const PSEUDOCODE_LINE_TOOLTIP = featureCopy.Open_the_line_this_came_from_40cef57;

// ---------------------------------------------------------------------------
// W8c: der Fund zuerst, das Ziel an jeder Zeile, und das Meta hinter dem
// Fragezeichen
//
// Nutzerfrage vom 2026-08-29 zum Screenshot mit orderService.ts: "ist der
// Pseudocode AI generated oder mechanisch, und ist er hilfreich?" Die Herkunft
// ist mechanisch (nur refine.ts kennt das Modell, und der Leser stoesst es an).
// Das Urteil zur Nuetzlichkeit war der Anlass: neben einer 18-Zeilen-Funktion
// standen zwei Zeilen, "1. call validateId" und "2. call query", und der Code
// daneben zeigte mehr. Der Block fuehrt seitdem mit dem, was der Leser im Code
// NICHT sieht, und die Schrittliste traegt, wohin jeder Schritt geht.
//
// Was hier ausdruecklich NICHT steht, ist eine Zahl, ab der eine Funktion
// "kurz genug" waere, um die Schrittliste wegzulassen. Eine solche Schwelle
// waere geraten, und geraten heisst in diesem Produkt: erfunden. Geordnet wird
// nach Beitrag, nicht nach Laenge.
// ---------------------------------------------------------------------------

/**
 * Der eine Satz ueber dem Block: was hier der Fund ist.
 *
 * Vier Faelle, und die Reihenfolge ist die ihrer Staerke. Ein Import, den der
 * Index diesem Symbol nicht zuordnen kann, ist die staerkste Aussage, die
 * dieser Block ueber eine Datei macht, die der Leser nicht kennt; was hinter
 * den Aufrufen liegt, ist die zweitstaerkste; und wenn beides nichts hergibt,
 * sagt der Satz das, statt zu verschwinden. Ein Kopf, der nur bei einem Fund
 * dasteht, waere ein Kopf, dessen Fehlen selbst eine Behauptung ist.
 */
export function pseudocodeLeadUnused(symbol: string, unused: number, total: number): string {
    return featureCopy.You_cannot_see_this_in_the_code_0_of_the_1_this_file_0162b56(unused, countOf(total, 'name', 'names'))
        + featureCopy.pulls_in_0_not_used_by_1_as_far_as_the_index_shows_2a5b974(unused === 1 ? 'is' : 'are', symbol);
}

export function pseudocodeLeadUnchecked(symbol: string, unknown: number): string {
    return featureCopy.You_cannot_see_this_in_the_code_every_name_this_file_pulls_in_is__45754d4
        + featureCopy.message_0_except_1_CBM_Lens_cannot_check_either_way_771efac(symbol, countOf(unknown, 'one', 'ones'));
}

export function pseudocodeLeadBehind(steps: number): string {
    return featureCopy.You_cannot_see_this_in_the_code_the_index_records_raised_errors_f_8157311
        + featureCopy.reads_behind_0_below_ee6b34b(countOf(steps, 'step', 'steps'));
}

export function pseudocodeLeadNone(symbol: string, total: number): string {
    if (total === 0) {
        return featureCopy.Nothing_stands_above_the_steps_this_time_CBM_Lens_found_no_import_736d0e0;
    }
    return featureCopy.Nothing_stands_above_the_steps_this_time_every_name_this_file_pul_80fd21c
        + featureCopy.to_0_and_it_records_nothing_behind_the_steps_below_6ca0b69(symbol);
}

/**
 * Gesagt, solange die Import-Antwort noch unterwegs ist.
 *
 * Sie kommt auf einem eigenen Weg und spaeter als die IR (siehe
 * imports-source.ts). Ein Kopf, der in dieser Zeit "kein Fund" sagte, wuerde
 * eine Abwesenheit behaupten, die bloss eine Verzoegerung ist.
 */
export const PSEUDOCODE_LEAD_PENDING =
    featureCopy.What_this_file_pulls_in_has_not_arrived_yet_so_what_stands_above__c964d57;

/** Die Ueberschrift ueber der Schrittliste, die sagt, was an ihr neu ist. */
export const PSEUDOCODE_STEPS_HEADING = featureCopy.Steps_and_where_each_one_goes_bf52a18;

/** Tooltip am Ziel einer Zeile. Der Text der Zeile fuehrt woandershin, siehe PseudocodeLine. */
export const PSEUDOCODE_TARGET_TOOLTIP = featureCopy.Open_where_this_step_leads_the_symbol_it_calls_d43abfd;

/**
 * Gesagt an einer Zeile, deren Ziel der Index nicht kennt.
 *
 * Eine stumme Zeile waere an dieser Stelle die schlechteste Antwort: sie sieht
 * aus wie eine Zeile, deren Ziel niemand gebraucht hat, und ist in Wahrheit
 * eine, deren Aufruf der Index nicht aufloesen konnte.
 */
export const PSEUDOCODE_TARGET_UNKNOWN = featureCopy.the_index_records_no_place_for_this_name_8f1f220;

/** Was hinter einem Aufruf liegt, in den Worten der Relation, die es sagt. */
export function insightRaises(types: string): string {
    return featureCopy.may_raise_0_f03a331(types);
}

export function insightCalls(count: number): string {
    return featureCopy.makes_0_of_its_own_593207a(countOf(count, 'call', 'calls'));
}

export function insightReadsEnv(key: string): string {
    return featureCopy.reads_0_from_the_environment_d6d0700(key);
}

export function insightMore(count: number): string {
    return featureCopy.and_0_more_dcec5e1(count);
}

/**
 * Was neben den Schritten steht, kommt woher, und was sein Fehlen NICHT heisst.
 *
 * Der zweite Halbsatz ist der wichtigere. Eine Notiz, die nur erscheint, wenn
 * es etwas zu melden gibt, laedt dazu ein, ihr Fehlen als "da ist nichts" zu
 * lesen. Was fehlt, ist eine aufgezeichnete Beziehung, und das ist etwas
 * anderes als ein Aufruf, hinter dem nichts passiert.
 */
export const PSEUDOCODE_BEHIND_NOTE =
    featureCopy.What_stands_beside_a_step_comes_from_the_relations_the_index_reco_e1a2832;

/**
 * Der EINE Satz, der unter dem Block stehenbleibt.
 *
 * Dieselbe Entscheidung wie in W8b unter dem Diagramm, und aus demselben
 * Befund: unter dem Block standen zwei Absaetze ueber den Block selbst, und der
 * laengere davon wiederholte in 244 Zeichen, was diese acht Worte sagen. Was
 * verschwindet, ist die Wiederholung und nicht die Aussage:
 * {@link pseudocodeCoverage}, {@link pseudocodeUncovered} und
 * {@link PSEUDOCODE_SOURCE_NOTE} stehen unveraendert hinter dem Fragezeichen
 * daneben, also in dem Idiom, das dieses Produkt fuer Herkunft schon hat.
 */
export const PSEUDOCODE_HONESTY_SHORT = featureCopy.Only_what_the_index_reported_in_the_order_it_reported_it_2718503;

/** Was das Fragezeichen unter dem Block sagt, wenn man es beruehrt. */
export const PSEUDOCODE_PROVENANCE_TOOLTIP = featureCopy.Where_this_block_comes_from_2912ddd;

// ---------------------------------------------------------------------------
// Die Imports-Gruppe
//
// Drei Antworten statt zwei: `used` ist ein Befund, `unused` ist ein Befund
// ueber eine Abwesenheit, und `unknown` ist ein Eingestaendnis. Der dritte Wert
// ist der Grund, warum es die Gruppe ueberhaupt geben darf.
// ---------------------------------------------------------------------------

/** The heading over the group, in the pseudocode block. */
export const IMPORTS_GROUP_HEADING = featureCopy.What_this_file_pulls_in_a7f0285;

/**
 * Die Ueberschrift der Gruppe seit W8c: sie nennt den Fund, statt ihn zu
 * verstecken.
 *
 * Bis dahin hiess sie nur {@link IMPORTS_GROUP_HEADING}, also wie eine
 * Nebensache, und darunter stand der wertvollste Satz des ganzen Blocks ("nicht
 * benutzt in dieser Datei, soweit der Index es zeigt"). Sie behaelt die Worte
 * "pulls in", weil sie weiterhin die Liste der Importe ueberschreibt, und sie
 * stellt den Fund davor.
 *
 * Die Grenze steht MIT im Kopf, nicht erst in der Zeile darunter: ein Fund ohne
 * seine Grenze waere eine Behauptung, und wer eine Ueberschrift liest, liest die
 * Zeile darunter noch nicht.
 */
export function importsFindingHeading(unused: number, unknown: number, total: number): string {
    if (total === 0) {
        return IMPORTS_GROUP_HEADING;
    }
    if (unused > 0) {
        return featureCopy.message_0_1_not_used_anywhere_in_this_file_1e20f38(IMPORTS_GROUP_HEADING, countOf(unused, 'name', 'names'))
            + featureCopy.as_far_as_the_index_shows_fee2149;
    }
    if (unknown > 0) {
        return featureCopy.message_0_1_CBM_Lens_cannot_check_0eaf7fa(IMPORTS_GROUP_HEADING, countOf(unknown, 'name', 'names'))
            + featureCopy.against_this_file_582158c;
    }
    return featureCopy.message_0_every_name_here_is_linked_to_a_symbol_in_this_file_1973119(IMPORTS_GROUP_HEADING);
}

/** Said on an entry a fact from this file names. */
export function importsUsedLine(name: string, module: string): string {
    return featureCopy.uses_0_from_1_247bc86(name, module);
}

/**
 * Said on an entry no fact of the complete file reading names.
 *
 * The whole sentence is deliberately about the index rather than about the
 * code. A name one declaration never mentions may still be used two lines below
 * by its neighbour, which is why this line is reached only after every callable
 * declaration was read and every relevant family answered.
 */
export function importsUnusedLine(name: string, module: string): string {
    return featureCopy.message_0_from_1_imported_here_not_used_anywhere_in_this_file_as_far_as_t_06ce2e5(name, module);
}

/** Said on an entry that could not be checked at all. */
export function importsUnknownLine(name: string, module: string): string {
    return featureCopy.message_0_from_1_CBM_Lens_cannot_tell_whether_this_file_uses_it_dc30f27(name, module);
}

/** Said on `import * as db from ...` and its equivalents in the other languages. */
export function importsNamespaceLine(binding: string, module: string): string {
    return featureCopy.message_0_from_1_the_whole_module_under_one_name_b8e5db4(binding, module);
}

/** Said on `import './setup'`, which binds nothing. */
export function importsSideEffectLine(module: string): string {
    return featureCopy.message_0_pulled_in_for_what_it_does_when_the_file_loads_77ee873(module);
}

/** Said on an entry recovered from an import edge alone, with no statement behind it. */
export function importsIndexOnlyLine(path: string): string {
    return featureCopy.message_0_the_index_records_the_dependency_without_naming_what_was_import_d86b773(path);
}

/** Why an entry says what it says. One sentence, on the entry itself. */
export const IMPORTS_NOTE_USED =
    featureCopy.The_index_records_a_symbol_in_this_file_reaching_this_name_so_the_03b2b22;

export const IMPORTS_NOTE_UNUSED =
    featureCopy.The_index_answered_every_checked_symbol_in_this_file_and_none_of__713f81c;

export const IMPORTS_NOTE_UNKNOWN =
    featureCopy.CBM_Lens_does_not_have_a_complete_answered_reading_for_every_call_4e6e826;

export const IMPORTS_NOTE_NAMESPACE =
    featureCopy.A_namespace_import_binds_every_export_of_the_module_under_one_nam_38eed2e;

export const IMPORTS_NOTE_SIDE_EFFECT =
    featureCopy.This_statement_binds_no_name_so_there_is_nothing_for_the_index_to_997f3dc;

export const IMPORTS_NOTE_INDEX_ONLY =
    featureCopy.This_came_from_the_dependency_the_index_recorded_rather_than_from_134363a;

/** Said at the end of a group the display cap cut short. */
export function importsCappedNote(hidden: number, shown: number): string {
    return featureCopy.and_0_not_listed_this_group_shows_the_first_1_c09010e(countOf(hidden, 'more import', 'more imports'), shown);
}

/** Said when the file's own text could not be read at all. */
export const IMPORTS_SOURCE_UNREAD =
    featureCopy.CBM_Lens_could_not_read_this_file_s_text_so_what_follows_is_the_d_4cd8d4c;

/** Said when the file pulls in nothing at all. */
export const IMPORTS_EMPTY =
    featureCopy.The_index_records_no_dependency_for_this_file_and_CBM_Lens_found__227c996;

/**
 * The standing sentence under the group, in both surfaces.
 *
 * It has to carry the split, because the group is the one place in the product
 * where two readings of different strength sit in one list: the dependency
 * comes from the analysis, the statement and the name come from the file, and
 * the judgement about use comes from every callable declaration the file read.
 */
export const IMPORTS_SOURCE_NOTE =
    featureCopy.The_dependency_comes_from_the_index_the_statement_its_line_and_th_cd82205;

/** The three markers. Short enough to sit beside a name, and never the only carrier of meaning. */
export const IMPORT_MARK_USED = featureCopy.used_here_1359ff2;
export const IMPORT_MARK_UNUSED = featureCopy.not_used_here_6201319;
export const IMPORT_MARK_UNKNOWN = featureCopy.not_checkable_5faf582;

/** Tooltip on an entry that points at its statement. */
export const IMPORTS_LINE_TOOLTIP = featureCopy.Open_the_import_statement_this_came_from_38b50e1;

/** The twin section's own sentences. */
export const IMPORTS_SECTION_EMPTY = IMPORTS_EMPTY;

export const IMPORTS_SECTION_NOTE = IMPORTS_SOURCE_NOTE;

/** How the group's own tally reads, under the entries. */
export function importsTally(used: number, unused: number, unknown: number): string {
    return featureCopy.message_0_used_in_this_file_1_not_used_in_it_2_that_CBM_Lens_cannot_check_7b0ee3d(used, unused, unknown);
}

// ---------------------------------------------------------------------------
// Der Flow-Erklaerer
// ---------------------------------------------------------------------------

export const EXPLAINER_LABEL = featureCopy.Explain_flow_1372cba;

export const EXPLAINER_TOOLTIP =
    featureCopy.Draw_the_code_this_symbol_reaches_as_a_sequence_beside_the_steps__96a0d4d;

/** Beschriftung des Kopfes, je nach Zustand. Der Kopf ist ein Knopf, kein Etikett. */
export function explainerHeadTooltip(open: boolean): string {
    return open ? featureCopy.Close_the_flow_of_this_symbol_f154ad3 : EXPLAINER_TOOLTIP;
}

/**
 * Die Kopfzeile des Erklaerers.
 *
 * Wortgleich mit `explainerTitle` des Referenzprojekts. Der Name des Symbols
 * und nicht der der Datei: der Walk beginnt an einem Symbol.
 */
export function explainerTitle(name: string): string {
    return featureCopy.Flow_from_0_9919952(name);
}

/** Die Ueberschrift ueber der Schritt-Liste. */
export const EXPLAINER_STEPS_TITLE = featureCopy.Steps_cdde4f2;

/*
 * Der Schliess-Knopf und der Escape-Hinweis stehen seit W8 nicht mehr hier.
 *
 * Der Erklaerer ist ein Reiter des Erklaeren-Bereichs geworden, und der Bereich
 * hat genau einen Knopf zum Zuklappen und genau einen Escape-Hinweis. Zwei
 * Knoepfe uebereinander, von denen einer die Flaeche und einer den Reiter
 * zumacht, waeren die Sorte Verdopplung, die dieser Zyklus abgeschafft hat.
 */

export const EXPLAINER_PREV_LABEL = featureCopy.Previous_50f9428;
export const EXPLAINER_NEXT_LABEL = featureCopy.Next_bc98198;
export const EXPLAINER_PREV_TOOLTIP = featureCopy.Go_back_one_step_39a6c16;
export const EXPLAINER_NEXT_TOOLTIP =
    featureCopy.Go_on_one_step_the_editor_follows_and_the_diagram_lights_up_d435561;

/**
 * Die Position im Stepper. Immer beide Zahlen: "3" allein sagt nichts.
 *
 * "n of m" und nicht "n / m", wortgleich mit dem Referenz-Explainer: der
 * Schraegstrich liest sich wie ein Bruch, und ein Standort ist kein Anteil.
 */
export function explainerPosition(step: number, total: number): string {
    return featureCopy.message_0_of_1_7388d66(step, total);
}

/** Vor dem ersten Schritt. Kein "0 / 8", das waere ein Schritt, den es nicht gibt. */
export function explainerNotStarted(total: number): string {
    return `${countOf(total, 'step', 'steps')}`;
}

/**
 * Gesagt, wenn ein Schritt im Kasten nichts anleuchtet.
 *
 * Ein erhobener Fehlertyp und eine Umgebungslesung haben in einer Folge von
 * Aufrufen keine eigene Lebenslinie. Der Editor folgt trotzdem; der Kasten sagt
 * warum er still bleibt, statt irgendeinen Pfeil zu faerben.
 */
export const EXPLAINER_NO_DIAGRAM_HIT =
    featureCopy.This_step_is_not_an_arrow_in_the_picture_the_index_recorded_it_as_c82c00d;

/** Ueber dem Kasten: was die Spalten sind. */
export const EXPLAINER_PARTICIPANTS_LABEL = featureCopy.files_a1f13b3;

/** Ueber der Pfeilliste. */
export const EXPLAINER_ARROWS_LABEL = featureCopy.calls_51b6cb2;

/** Gesagt, wenn der Walk gar keinen Halt hergab. */
export const EXPLAINER_NO_STEPS =
    featureCopy.The_index_recorded_no_calls_out_of_this_symbol_so_there_is_no_flo_63f2d64;

/**
 * Der erste der zwei Ehrlichkeits-Absaetze, wortgleich aus dem
 * Referenz-Explainer (EXPLAINER_SOURCE_NOTE).
 *
 * Er traegt die eine Behauptung, an der die ganze Flaeche haengt: das Bild
 * links und die Liste rechts sind zwei Lesungen desselben Walks. Der zweite
 * Absatz ist {@link PSEUDOCODE_SOURCE_NOTE}, der schon ueber dem Block steht.
 *
 * Seit W8b steht er nicht mehr als Absatz unter dem Bild, sondern hinter dem
 * Fragezeichen daneben. Warum, steht an {@link EXPLAINER_HONESTY_SHORT}.
 */
export const EXPLAINER_SOURCE_NOTE =
    featureCopy.The_diagram_and_the_list_are_two_readings_of_one_walk_one_lifelin_e18323f;

/**
 * Der EINE Satz, der unter dem Bild stehenbleibt.
 *
 * ## Was hier gekuerzt wurde, und was ausdruecklich nicht
 *
 * Unter dem Diagramm standen bis W8b vier Absaetze mit zusammen 954 Zeichen.
 * Drei davon (EXPLAINER_SOURCE_NOTE mit 172, PSEUDOCODE_SOURCE_NOTE mit 265,
 * EXPLAINER_GENERATED_NOTE mit 174) sagen in drei Anlaeufen DIESELBE Sache:
 * dieses Bild zeigt genau das Gemeldete und kann unvollstaendig sein. Der
 * vierte (explainerCappedNote, 343) war der einzige mit Zahlen und stand am
 * Ende, wo ihn nach drei Absaetzen niemand mehr liest.
 *
 * Gekuerzt wird die WIEDERHOLUNG und nicht die Aussage. Nichts davon ist
 * verschwunden:
 *
 *  - die drei Herkunftssaetze stehen hinter dem Fragezeichen neben dem Bild,
 *    also in dem Idiom, das dieses Produkt fuer Herkunft schon hat (der
 *    Beleg-Knopf am Twin),
 *  - die Zahlen des Walks stehen als Beschriftung am RAND des Bildes, dort wo
 *    die Grenze gilt,
 *  - und dieser eine Satz bleibt darunter stehen.
 *
 * Eine Ehrlichkeit, die als Textwand erscheint, wird ueberlesen wie ein
 * Cookie-Banner und erreicht damit das Gegenteil ihres Zwecks. Das ist der
 * ganze Grund dieser Aenderung, und es ist kein Zurueckdrehen einer
 * Ehrlichkeitsregel: der Leser bekommt dieselben Saetze, nur nicht alle drei
 * gleichzeitig ins Gesicht.
 */
export const EXPLAINER_HONESTY_SHORT =
    featureCopy.Neither_the_picture_nor_the_list_shows_a_call_the_index_did_not_r_03b6ba2;

/**
 * Steht statt {@link EXPLAINER_HONESTY_SHORT}, wenn der Walk unaufgeloeste
 * Aufrufe wirklich melden konnte.
 *
 * "at least" ist keine Bescheidenheitsformel, sondern die Wahrheit ueber die
 * Messung: gezaehlt werden die Symbole, die der Index GENANNT und nicht
 * aufgeloest hat. Ein Aufruf, den er ganz ohne qualifizierten Namen meldet,
 * faellt schon im Walk heraus (src/provider/closure.ts) und ist hier nicht mehr
 * zaehlbar. Eine glatte Zahl waere an dieser Stelle die genauere Formulierung
 * einer ungenaueren Messung.
 */
export function explainerUnresolvedNote(count: number): string {
    return featureCopy.At_least_0_the_index_did_not_resolve_3684fab(countOf(count, 'call', 'calls'))
        + featureCopy.message_0_missing_from_the_picture_and_from_the_list_7ee7d74(count === 1 ? 'is' : 'are');
}

/**
 * Der ZWEITE Satz unter dem Bild: was jenseits des Kastens liegt.
 *
 * Woertlich der letzte Satz von {@link explainerCappedNote}, und nur er. Die
 * beiden Zahlen davor stehen seit W8b als Beschriftung am Rand des Bildes
 * ({@link explainerWalkBound}), also dort, wo die Grenze gilt; was der Satz
 * darueber hinaus sagt, sagt kein anderer: dass der Kasten eine Ebene tief ist
 * und die naechste nicht mehr zeigt. Gekuerzt ist damit die Wiederholung der
 * Zahlen und nicht die Aussage.
 *
 * Er ist ausserdem der Grund, aus dem der Block ZWEI Absaetze behaelt statt
 * einem: der Beweislauf von W5c misst seit seiner eigenen Abnahme, dass unter
 * dem Bild zwei ehrliche Absaetze stehen, und ein Zyklus, der eine
 * Ehrlichkeitszusage eines frueheren aufloest, muesste dafuer einen besseren
 * Grund haben als "kuerzer". Der Contract von W8b nennt als Grenze 400 Zeichen
 * und hoechstens zwei Absaetze; beide Saetze zusammen sind 142.
 */
export const EXPLAINER_BEYOND_BOX =
    featureCopy.What_those_calls_reach_in_turn_is_one_hop_further_than_this_box_d_4b22a46;

/** Was das Fragezeichen neben dem Bild sagt, wenn man es beruehrt. */
export const EXPLAINER_PROVENANCE_TOOLTIP = featureCopy.Where_this_picture_comes_from_b66c4d1;

/**
 * Die Beschriftung am Rand des Bildes: wie weit der Walk ging und wie viel er
 * behalten durfte.
 *
 * Kurz, weil sie IM Bild steht und nicht darunter. Der lange Satz dazu
 * ({@link explainerCappedNote}) ist damit nicht weg, er ist nur nicht mehr der
 * vierte Absatz einer Textwand: er steht hinter dem Fragezeichen daneben.
 */
export function explainerWalkBound(depth: number, cap: number): string {
    return featureCopy.walk_0_at_most_1_156cbab(countOf(depth, 'hop', 'hops'), countOf(cap, 'symbol', 'symbols'));
}

/**
 * Gesagt, weil das Bild zusammengesetzt und nicht gezeichnet wurde.
 *
 * Dieselbe Ehrlichkeit wie die Generated-Note ueber der erzeugten Prosa
 * (PROSE_GENERATED_NOTE): eine Abbildung, die aussieht, als haette jemand sie
 * entworfen, muss sagen, dass sie aus einem Index gerechnet ist.
 */
export const EXPLAINER_GENERATED_NOTE =
    featureCopy.Nobody_drew_this_picture_CBM_Lens_laid_it_out_from_what_the_index_ce77968;

/** Die Notiz im Bild, wenn eine Kante in eine schon besuchte Kette zurueckfuehrt. */
export function explainerCycleNote(count: number): string {
    return featureCopy.message_0_a_chain_the_walk_had_already_been_through_05fa985(countOf(count, 'arrow closes', 'arrows close'))
        + featureCopy.those_are_drawn_dashed_and_not_followed_further_626a885;
}

/**
 * Die Notiz im Bild, wenn eine Grenze Pfeile weggelassen hat.
 *
 * Die Deckel kommen als Zahlen herein und stehen nicht hier: sie gehoeren
 * flow-model.ts, und diese Datei nennt sie nur. Eine eigene Kopie waere eine
 * Zahl, die eines Tages eine andere Grenze beschreibt als die, die gegriffen
 * hat.
 */
export function explainerOmittedNote(
    count: number,
    participantCap: number,
    interactionCap: number,
): string {
    return featureCopy.message_0_not_drawn_the_picture_keeps_at_most_4fe831e(countOf(count, 'call is', 'calls are'))
        + featureCopy.message_0_lifelines_and_1_arrows_e60f991(participantCap, interactionCap);
}

/** Gesagt, wenn die Closure gar keinen Aufruf hergab. */
export const EXPLAINER_EMPTY =
    featureCopy.The_index_records_no_call_out_of_this_symbol_so_there_is_no_seque_40abcaa;

/** Gesagt, wenn der Walk an einer Grenze aufgehoert hat. */
export function explainerCappedNote(depth: number, cap: number): string {
    return featureCopy.The_picture_shows_the_calls_this_symbol_makes_itself_the_walk_wen_7dc5940(countOf(depth, 'hop', 'hops'), countOf(cap, 'symbol', 'symbols'));
}

/** Beschriftung des Umschalters auf die Pseudocode-Ansicht. */
export const PSEUDOCODE_TAB_LABEL = featureCopy.pseudocode_88f7148;
export const PSEUDOCODE_TAB_TOOLTIP =
    featureCopy.Show_the_facts_the_index_recorded_for_this_symbol_as_a_numbered_b_75ed691;

/** Beschriftung des Umschalters zurueck auf den Twin-Koerper. */
export const TWIN_TAB_LABEL = featureCopy.facts_f6d1842;
export const TWIN_TAB_TOOLTIP = featureCopy.Back_to_the_panel_3cdd34f;

/** Steht statt des Kastens, solange der Walk noch laeuft. */
export const FLOW_LOADING = featureCopy.Reading_what_this_symbol_reaches_c5eaa0d;

/**
 * Steht statt des Kastens, wenn der Walk nichts hergab.
 *
 * Ein Satz ueber diesen Versuch und nicht ueber den Code: ein Symbol, das der
 * Index nicht kennt, und ein Backend, das nicht antwortet, sind beides Gruende,
 * hier nichts zu zeigen, und keiner davon heisst "dieses Symbol ruft nichts".
 */
export const FLOW_UNAVAILABLE =
    featureCopy.CBM_Lens_has_no_walk_for_this_symbol_right_now_Place_the_caret_in_8b524d3;
