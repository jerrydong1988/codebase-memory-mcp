import { featureCopy } from '../i18n/features/app';
/**
 * Die Saetze, mit denen der Explorer und der Reader ueber Coverage sprechen.
 *
 * An einer Stelle, weil dieselbe Aussage an drei Orten auftaucht: als Tooltip
 * an der Baumzeile, als Legende im Explorer-Fuss und als Erklaerung ueber dem
 * Editor. Drei Formulierungen fuer denselben Befund waeren drei Gelegenheiten,
 * eine davon zu schaerfen, bis sie mehr behauptet als der Server gesagt hat.
 *
 * Zwei Regeln gelten fuer jeden Satz hier:
 *
 * 1. **Kein Grund wird erfunden.** Nennt der Server keinen, endet der Satz
 *    ohne Grund, statt einen plausiblen anzuhaengen.
 * 2. **Abwesenheit wird als Abwesenheit benannt.** "nicht indiziert" heisst
 *    nicht "leer" und nicht "kaputt", sondern dass diese Oberflaeche ueber den
 *    Inhalt nichts weiss.
 */

import type { CoverageState } from './tree-model';

/**
 * Der ehrliche Satz ueber die Grenze des Baums.
 *
 * Er steht im Explorer-Fuss, weil genau dort die Frage entsteht: der Baum sieht
 * aus wie ein Dateisystem, ist aber die Vereinigung dessen, was die Discovery
 * des Indexers gesehen hat. Eine Datei, die sie nie erreicht hat, steht in
 * keiner der drei Quellen und kann darum auch hier nicht stehen.
 */
export const COVERAGE_SOURCE_NOTE =
    featureCopy.files_as_the_index_discovery_saw_them_files_it_never_met_are_invi_31eb082;

/** Das kurze Wort einer Stufe, so wie es in der Legende steht. */
export const COVERAGE_LABELS: Record<CoverageState, string> = {
    indexed: featureCopy.indexed_243dd40,
    partial: featureCopy.partially_parsed_66ca620,
    skipped: featureCopy.skipped_413a932,
    'not-indexed': featureCopy.not_indexed_bdf75e5,
    ignored: featureCopy.ignored_0121bc0,
};

/**
 * Das Zeichen, das eine Datei-Zeile traegt.
 *
 * Ordner tragen stattdessen einen Punkt, denn ihr Marker ist eine Aussage ueber
 * ihren Inhalt und nicht ueber sie selbst.
 */
export const COVERAGE_MARKS: Record<CoverageState, string> = {
    indexed: '',
    partial: '!',
    skipped: 'x',
    'not-indexed': '-',
    ignored: '-',
};

/** Der Punkt, den ein Ordner traegt, wenn unter ihm etwas fehlt. */
export const COVERAGE_FOLDER_MARK = '●';

/** Was die Legende zu einer Stufe sagt. */
export const COVERAGE_DESCRIPTIONS: Record<CoverageState, string> = {
    indexed: featureCopy.in_the_graph_no_recorded_issue_9361b61,
    partial: featureCopy.indexed_but_constructs_in_the_listed_line_ranges_may_be_missing_14646c2,
    skipped: featureCopy.the_indexer_gave_up_on_it_with_its_own_reason_4ea478d,
    'not-indexed': featureCopy.excluded_by_design_gitignore_cbmignore_with_the_rule_as_the_reaso_8ec434a,
    ignored: featureCopy.the_coverage_store_lists_it_as_ignored_4e88b89,
};

/**
 * Der Tooltip einer Zeile.
 *
 * Der Grund wird angehaengt, wenn der Server einen genannt hat, und sonst
 * nicht. Der Wortlaut fuer `partial` nennt Zeilenbereiche statt einer Zahl von
 * Symbolen: der Server meldet Bereiche und keine Zahl, und "n symbols may be
 * missing" waere eine Zahl, die niemand gezaehlt hat.
 */
export function coverageTooltip(state: CoverageState, reason = ''): string {
    const trimmed = reason.trim();
    if (state === 'indexed') {
        return featureCopy.indexed_the_graph_carries_this_file_and_no_source_recorded_an_iss_f89cf90;
    }
    if (state === 'partial') {
        return trimmed.length > 0
            ? featureCopy.partially_parsed_constructs_inside_lines_0_may_be_missing_from_th_a30c32c(trimmed)
            : featureCopy.partially_parsed_constructs_inside_the_flagged_ranges_may_be_miss_2e5aad1;
    }
    if (state === 'skipped') {
        return trimmed.length > 0
            ? featureCopy.skipped_by_the_indexer_0_Nothing_of_it_is_in_the_graph_013bfe4(trimmed)
            : featureCopy.skipped_by_the_indexer_which_named_no_reason_Nothing_of_it_is_in__ffe3ff2;
    }
    if (state === 'ignored') {
        return trimmed.length > 0
            ? featureCopy.ignored_by_the_coverage_store_0_41808af(trimmed)
            : featureCopy.ignored_by_the_coverage_store_which_named_no_reason_43a8e5d;
    }
    return trimmed.length > 0
        ? featureCopy.not_indexed_by_design_0_Change_the_ignore_rules_and_re_index_to_i_97f781d(trimmed)
        : featureCopy.not_indexed_by_design_and_the_server_named_no_rule_Nothing_of_it__9c1ac7d;
}

/** Der Tooltip eines Ordners: was seine schlechteste Stufe bedeutet. */
export function folderTooltip(worst: CoverageState): string {
    if (worst === 'indexed') {
        return featureCopy.every_file_below_it_is_in_the_graph_without_a_recorded_issue_86e1343;
    }
    return featureCopy.worst_stage_below_this_folder_0_1_1f7caf1(COVERAGE_LABELS[worst], COVERAGE_DESCRIPTIONS[worst]);
}

/**
 * Was der Reader statt eines Fehlers sagt, wenn eine Datei keinen Inhalt hat.
 *
 * Kein "failed to load": nichts ist schiefgegangen. Der Server liefert Inhalt
 * ausschliesslich ueber `get_code_snippet` auf einem indizierten Symbol
 * (src/reader/file-source.ts), also hat eine Datei ohne Modul-Knoten hier
 * keinen Inhalt, bis Ask 1 erfuellt ist. Das ist eine Aussage ueber die
 * heutige Server-Flaeche und nicht ueber die Datei.
 */
export function readerUnavailableNote(path: string, state: CoverageState, reason = ''): string {
    const trimmed = reason.trim();
    const why =
        state === 'skipped'
            ? trimmed.length > 0
                ? featureCopy.the_indexer_skipped_it_0_d455ffb(trimmed)
                : featureCopy.the_indexer_skipped_it_and_named_no_reason_7aa55d4
            : state === 'ignored'
                ? trimmed.length > 0
                    ? featureCopy.the_coverage_store_lists_it_as_ignored_0_c71d98c(trimmed)
                    : featureCopy.the_coverage_store_lists_it_as_ignored_4e88b89
                : trimmed.length > 0
                    ? featureCopy.it_is_excluded_by_design_0_d3ff56c(trimmed)
                    : featureCopy.it_is_excluded_by_design_and_the_server_named_no_rule_86d6cf7;
    return (
        featureCopy.message_0_has_no_content_here_1_so_the_index_holds_no_module_node_for_it_a4bb27d(path, why)
        + featureCopy.This_server_delivers_file_content_only_through_get_code_snippet_o_5332809
        + featureCopy.so_there_is_nothing_to_read_until_a_file_endpoint_exists_Upstream_794e5de
        + featureCopy.The_file_itself_is_on_disk_this_surface_simply_cannot_show_it_9116be3
    );
}

/** Die Notiz ueber dem Editor, wenn nur Teile der Datei im Graphen stehen. */
export function partialFileNote(path: string, reason = ''): string {
    const trimmed = reason.trim();
    return trimmed.length > 0
        ? featureCopy.message_0_is_only_partially_parsed_constructs_inside_lines_1_may_be_missi_b3b1e5f(path, trimmed)
          + featureCopy.The_text_below_is_the_file_the_graph_around_it_is_incomplete_266f80e
        : featureCopy.message_0_is_only_partially_parsed_constructs_inside_the_flagged_ranges_m_0297a3f(path)
          + featureCopy.The_text_below_is_the_file_the_graph_around_it_is_incomplete_266f80e;
}

/**
 * Die Frische-Notiz der Statusleiste.
 *
 * Sie steht nur da, wenn sie etwas zu sagen hat: `metadata_match` zusammen mit
 * `no_recorded_issue` heisst, dass die Datei seit dem Index unveraendert ist
 * und keine Quelle etwas ueber sie gemeldet hat. Diesen Fall auch anzuzeigen
 * hiesse, eine gruene Ampel zu bauen, die immer leuchtet.
 */
export function freshnessNoteNeeded(status: string, freshness: string): boolean {
    return !(freshness === 'metadata_match' && status === 'no_recorded_issue');
}

/** Was in der Statusleiste steht, wenn eine Frische-Notiz noetig ist. */
export function freshnessNote(status: string, freshness: string, action: string): string {
    const parts = [freshness.length > 0 ? freshness : featureCopy.unknown_50d8b4a];
    if (status.length > 0) {
        parts.push(status);
    }
    if (action.length > 0) {
        parts.push(action);
    }
    return parts.join(' / ');
}
