import { featureCopy } from '../i18n/features/agents';
/**
 * Die Saetze des Instruments.
 *
 * Sie stehen hier und nicht im Katalog (src/i18n/messages.ts), aus demselben
 * Grund wie die Saetze der Galaxie und der Aenderungsansicht: der Katalog fuehrt
 * den Rahmen des Produkts, den jede Flaeche gleich benennt, und ein Fachgebiet
 * fuehrt seine eigenen Woerter neben sich. Was hier steht, sagt nur diese eine
 * Ebene.
 *
 * Eine Regel gilt fuer jeden Satz darin: **er sagt, was gezaehlt wurde, und
 * behauptet nichts darueber hinaus.** Kein Fortschritt, keine Prozentzahl, kein
 * "arbeitet an", kein "denkt nach". Ein Agent, der eine Datei geoeffnet hat, hat
 * eine Datei geoeffnet.
 */

import type { WorkKind } from './agent-event';

/** Was ein Buchstabe der Arbeit bedeutet, in einem Satz. */
export const WORK_KIND_TEXT: Readonly<Record<WorkKind, string>> = {
    read: featureCopy.read_a_file_fc69e72,
    write: featureCopy.changed_a_file_1343fac,
    search: featureCopy.searched_200a4ee,
    test: featureCopy.ran_a_test_command_c5b1a36,
    other: featureCopy.ran_a_command_the_tool_name_does_not_classify_c7eb45d,
};

/** Das kurze Wort, das in der Zeile steht. */
export const WORK_KIND_WORD: Readonly<Record<WorkKind, string>> = {
    read: featureCopy.reading_227f38d,
    write: featureCopy.writing_1935d7b,
    search: featureCopy.searching_de94f82,
    test: featureCopy.testing_dc724af,
    other: featureCopy.command_1925f79,
};

export const agentStrings = {
    title: featureCopy.LIVE_AGENTS_07a996f,
    panelLabel: featureCopy.live_agents_on_the_graph_327541d,

    /* ------------------------------------------------------------ der Kopf */

    agentCount: (count: number): string =>
        (count === 1 ? featureCopy.message_1_actor_2b0dfc7 : featureCopy.message_0_actors_8889040(count)),
    perMinute: (count: number): string =>
        (count === 1 ? featureCopy.message_1_event_in_the_last_minute_14d6327 : featureCopy.message_0_events_in_the_last_minute_4ad3c33(count)),
    orderIntact: featureCopy.order_intact_ee40aac,
    orderMissed: (count: number): string =>
        (count === 1 ? featureCopy.message_1_event_missed_2ee32ef : featureCopy.message_0_events_missed_16c5250(count)),
    orderTitle:
        featureCopy.every_run_numbers_its_events_A_number_that_never_arrived_is_count_ff4f8b0,
    joinedAt: (run: string, seq: number): string => featureCopy.joined_run_0_at_number_1_efd1677(run, seq),

    /* ------------------------------------------------------ die drei Lagen */

    foldTitle: (open: boolean): string =>
        (open ? featureCopy.fold_the_instrument_down_to_one_line_a41874f : featureCopy.unfold_the_instrument_64ddab5),
    fold: (open: boolean): string => (open ? featureCopy.fold_c5b2b01 : featureCopy.unfold_1e0eecb),
    expand: (expanded: boolean): string => (expanded ? featureCopy.compact_4f44e2c : featureCopy.expand_0bf04e4),
    expandTitle: (expanded: boolean): string =>
        (expanded
            ? featureCopy.back_to_the_compact_instrument_so_it_explains_the_graph_instead_o_b11f168
            : featureCopy.one_card_per_actor_the_path_it_walked_and_the_events_behind_every_9a29c98),
    collapsedLine: (count: number): string =>
        (count === 0
            ? featureCopy.no_actor_on_the_graph_86ff10f
            : count === 1 ? featureCopy.message_1_actor_on_the_graph_b822e9d : featureCopy.message_0_actors_on_the_graph_1202e61(count)),

    /* ------------------------------------------------------- die Quelle */

    sourceOff: featureCopy.live_mode_is_off_and_nothing_is_asked_f244a20,
    sourceOffDetail:
        featureCopy.not_one_request_goes_to_the_daemon_while_this_is_off_Turn_it_on_i_e318681,
    sourceConnecting: featureCopy.connecting_to_the_daemon_78f2ee1,
    sourceNone: featureCopy.live_mode_is_on_and_no_daemon_is_answering_ec4fb5d,
    sourceNoneDetail:
        featureCopy.check_that_the_local_daemon_is_running_It_stores_tool_events_in_S_e46c310,
    sourceConnected: (file: string): string => featureCopy.reading_0_d3a1d97(file),
    sourceReplay: (file: string): string => featureCopy.replaying_0_d8d3f26(file),
    replayNote:
        featureCopy.these_events_were_recorded_earlier_Their_spacing_is_the_recorded__43d44cc,
    unreadableLines: (count: number): string =>
        (count === 1
            ? featureCopy.message_1_line_of_the_file_was_not_readable_JSON_and_was_skipped_61b525b
            : featureCopy.message_0_lines_of_the_file_were_not_readable_JSON_and_were_skipped_50953df(count)),

    /* --------------------------------------------------------- die Zeilen */

    kindTitle: (kind: WorkKind, letter: string): string => `${letter}: ${WORK_KIND_TEXT[kind]}`,
    placeRange: (name: string, from: number, to: number): string => featureCopy.message_0_lines_1_to_2_1c7cf2b(name, from, to),
    placeFile: (name: string): string => name,
    placeUncertain: (name: string): string => featureCopy.message_0_no_line_range_in_the_index_bfc5b69(name),
    placeUncertainTitle:
        featureCopy.the_graph_knows_this_node_but_carries_no_end_line_for_it_so_this__7fb35e8,
    placeNone: featureCopy.not_placeable_on_the_graph_008aa78,
    placeNoneTitle: (why: string): string => featureCopy.message_0_The_raw_event_stands_below_d9dc2c3(why),
    ago: (seconds: number): string =>
        (seconds < 60
            ? `${Math.max(0, Math.round(seconds))}s`
            : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`),
    hereFor: (spell: string): string => featureCopy.here_for_0_9b8d2c8(spell),
    lastSeen: (spell: string): string => featureCopy.last_event_0_ago_211008f(spell),
    stripTitle: (seconds: number, count: number): string =>
        featureCopy.message_0_events_in_the_last_1_seconds_one_bar_per_second_counted_from_th_02bc485(count, seconds)
        + featureCopy.themselves_44dd75e,
    testedTitle: (name: string): string =>
        featureCopy.the_command_names_0_which_the_index_knows_The_dashed_line_goes_th_5e29662(name),
    testedUnknown: featureCopy.the_command_names_no_file_this_index_knows_so_there_is_no_line_to_09d7645,

    /* ------------------------------------------------- die Selbstauskunft */

    intentPrefix: featureCopy.agent_says_4634528,
    intentTitle:
        featureCopy.reported_by_the_agent_not_measured_This_line_exists_because_the_e_89ce2f2,

    /* --------------------------------------------------- was nicht passt */

    unmappedTitle: (count: number): string =>
        (count === 1
            ? featureCopy.message_1_event_is_not_placeable_on_the_graph_b22d1d5
            : featureCopy.message_0_events_are_not_placeable_on_the_graph_491f47c(count)),
    unmappedIntro:
        featureCopy.they_stay_here_instead_of_disappearing_an_event_that_falls_out_of_9dd6b0d,
    unmappedRow: (tool: string, path: string, why: string): string =>
        `${tool} ${path.length > 0 ? path : featureCopy.no_path_482e80c}: ${why}`,

    /* ---------------------------------------------------- die Umschalter */

    filterLabel: featureCopy.show_9fb2905,
    filterYou: featureCopy.you_8af56de,
    filterAgent: featureCopy.agents_e7052ae,
    filterBoth: featureCopy.both_fc39b18,
    filterTitle: (option: string): string =>
        (option === 'you'
            ? featureCopy.only_your_own_navigation_c1d5e79
            : option === 'agent' ? featureCopy.only_the_agents_a365b52 : featureCopy.your_navigation_and_the_agents_7f8e9ec),
    youName: featureCopy.you_8af56de,
    youPlace: featureCopy.the_symbol_you_opened_72099ab,

    follow: featureCopy.follow_f7ac253,
    followTitle: (on: boolean): string =>
        (on
            ? featureCopy.stop_following_the_camera_stays_where_you_put_it_3a5a36c
            : featureCopy.the_camera_flies_to_the_actor_that_moved_last_4e717c7),
    trails: featureCopy.trails_3156da0,
    trailsTitle: (on: boolean): string =>
        (on
            ? featureCopy.hide_the_path_row_of_each_actor_f13e01f
            : featureCopy.show_the_path_row_the_symbols_each_actor_touched_newest_first_da5cefa),
    /*
     * Bis W11b hiess dieser Schalter "cinema". Der Nutzer hat ihn am 2026-08-30
     * benutzt und woertlich gesagt: "bin jetzt im cinema mode, sollte fullscreen
     * heissen." Er heisst jetzt so, und zwar an jeder Stelle: Schalter,
     * Beschriftung, Kommandozeile, Naht und gespeicherte Wahl.
     */
    fullscreen: featureCopy.fullscreen_5994507,
    fullscreenTitle: (on: boolean): string =>
        (on
            ? featureCopy.leave_the_full_window_and_put_the_graph_back_into_its_panel_Escap_624db6b
            : featureCopy.the_graph_fills_the_window_bigger_bodies_the_instrument_as_a_colu_263fda0),
    fullscreenScope:
        featureCopy.fullscreen_is_the_frame_and_not_a_tour_the_camera_goes_where_you__e0b5b67,
    windowLabel: featureCopy.window_320ad26,
    windowOption: (ms: number): string =>
        (ms === 0 ? featureCopy.all_kept_ae3052f : ms < 60000 ? `${ms / 1000}s` : `${ms / 60000}m`),
    windowTitle: featureCopy.how_far_back_the_path_row_the_trail_on_the_graph_and_the_timeline_7bba5f7,
    pathEmpty: featureCopy.no_path_yet_no_event_of_this_actor_named_a_file_1e8e5c7,

    /* ------------------------------------------------- die Spur am Graphen */

    trailLegendTitle: featureCopy.agent_trail_ccc050e,
    trailLegendDetail:
        featureCopy.the_dashed_line_behind_an_agent_is_the_path_it_walked_the_last_sy_4cf00d8,

    /* -------------------------------------------------------- der Deckel */

    capLine: (drawn: number, total: number): string =>
        featureCopy.message_0_of_1_bodies_drawn_the_layer_stops_at_2_5e0c044(drawn, total, drawn),
    capTitle:
        featureCopy.the_cap_is_a_promise_about_computing_time_not_about_the_truth_eve_f41b7b7,

    /* -------------------------------------------------------- die Ruhe */

    idleTitle: (seconds: number): string =>
        featureCopy.no_event_for_0_s_this_body_stands_still_and_stays_pale_until_the__7c1e338(Math.round(seconds))
        + featureCopy.one_Nothing_here_is_animated_while_nothing_happens_6c78468,

    /* --------------------------------------------------------- der Puls */

    pulseTitle: (events: number, periodMs: number): string =>
        (events === 0
            ? featureCopy.no_event_in_the_last_minute_so_this_body_does_not_breathe_2a57a8f
            : featureCopy.message_0_events_in_the_last_minute_one_breath_every_1_s_8b9a900(events, (periodMs / 1000).toFixed(1))
                + featureCopy.The_pulse_is_the_count_not_decoration_6dc64f8),

    /* ------------------------------------------------------ die Wiedergabe */

    followLine: (name: string, kind: string, place: string, lines: readonly number[]): string =>
        `${name} ${kind} ${place.length > 0 ? place : featureCopy.nothing_this_index_knows_664fe03}`
        + (lines.length === 2 ? featureCopy.lines_0_to_1_f71365a(lines[0], lines[1]) : ''),
    followLineTitle:
        featureCopy.the_event_the_camera_just_followed_Actor_kind_of_work_symbol_and__f4313c6,

    /* ------------------------------------------------------ der Zeitstrahl */

    timelineLabel: featureCopy.timeline_16c0044,
    timelineLive: 'LIVE',
    timelinePaused: 'PAUSED',
    timelineReplay: 'REPLAY',
    timelineLiveTitle: featureCopy.the_window_ends_now_and_moves_with_it_ca0ecaf,
    timelinePauseTitle:
        featureCopy.hold_the_window_where_it_is_Events_keep_arriving_and_are_all_ther_28f995c,
    timelineResume: featureCopy.resume_a2b41bb,
    timelinePause: featureCopy.pause_ef8d299,
    timelineReplayNote: (spell: string): string =>
        featureCopy.showing_the_state_of_0_ago_not_now_51a190f(spell),
    timelineReplayTitle:
        featureCopy.a_click_on_the_timeline_shows_the_state_at_that_moment_Everything_83d13e2,
    timelineBackToLive: featureCopy.back_to_live_6a91bb5,
    timelineTrackTitle: (name: string, count: number): string =>
        featureCopy.message_0_1_in_this_window_one_tick_each_ffec68c(name, count === 1 ? '1 event' : `${count} events`),
    timelineEmpty: featureCopy.no_event_of_this_actor_in_this_window_638bd6e,
    timelineNarrow: (width: number): string =>
        featureCopy.the_graph_area_is_0_px_wide_the_timeline_needs_600_to_keep_one_ti_a9723cc(width)
        + featureCopy.next_edee940,

    /* ---------------------------------------------------------- der Ticker */

    tickerLabel: featureCopy.events_82d50d9,
    tickerLine: (name: string, kind: string, place: string, lines: readonly number[]): string =>
        `${name} ${kind} ${place.length > 0 ? place : featureCopy.nothing_this_index_knows_664fe03}`
        + (lines.length === 2 ? featureCopy.lines_0_to_1_f71365a(lines[0], lines[1]) : ''),
    tickerTitle:
        featureCopy.the_last_events_in_plain_words_One_line_per_event_and_every_part__d6e6c38,

    /* ---------------------------------------------------------- die Ebene */

    layerOff: featureCopy.the_agent_layer_is_off_in_the_settings_so_nothing_is_drawn_on_the_fb85884,
} as const;

/**
 * Das Etikett des Menuepunkts.
 *
 * Es traegt den ZUSTAND und nicht die Wirkung, wie `[l]ocal llm off` daneben:
 * "off" heisst "es ist aus" und nicht "hier ausschalten". Dieselbe Lesart wie
 * bei [a]tlas, dessen `data-state` ebenfalls die Lage faerbt.
 *
 * Der Buchstabe steht in Klammern am Anfang, weil AtlasChrome ihn dort
 * heraustrennt (splitMenuLabel) und ein Terminal keine Unterstreichung hat.
 */
export function agentsMenuLabel(on: boolean): string {
    return on ? featureCopy.g_live_agents_on_2d21845 : featureCopy.g_live_agents_off_9c0e3c9;
}
