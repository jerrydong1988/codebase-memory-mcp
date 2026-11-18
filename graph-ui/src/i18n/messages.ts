import { presentation } from './presentation';
import { featureCopy } from './features/i18n';
/**
 * Der typisierte Katalog der sichtbaren Chrome-Strings.
 *
 * Die Mechanik ist die des PR-Frontends: EIN Objekt,
 * `as const`, nach Bereichen geordnet, und alles, was eine Zahl oder einen Namen
 * einsetzen muss, ist eine Funktion statt einer Zeichenkette mit Platzhaltern.
 * Eine Funktion kann der Uebersetzer nicht falsch zusammensetzen, und der
 * Aufrufer bekommt die Stelligkeit vom Typ gesagt.
 *
 * ## Was hier steht und was ausdruecklich nicht
 *
 * Hier stehen die Saetze des RAHMENS: Kopfzeile, Menue, Tabs, Statusleiste,
 * Explorer, Kommandozeile, Reader-Notizen, Suchfenster, Why-Karten, Tour-Karte
 * und die Rahmen von Einstiegsdialog, BUG-Assistent, Impact-Ansicht,
 * Sidecar-Karte und Chat.
 *
 * Hier stehen NICHT die Fachtexte der portierten Module. `src/twin/strings.ts`,
 * `src/pseudocode/pseudocode-strings.ts`, `src/impact/impact-strings.ts`,
 * `src/traces/bug-wizard-strings.ts`, `src/chat/chat-strings.ts`,
 * `src/llm/strings.ts`, `src/app/coverage-strings.ts` und `src/why/why-model.ts`
 * bleiben die Quelle ihrer eigenen Saetze. Das ist kein Versaeumnis, sondern der
 * Standard, aus dem dieses Muster kommt: ein Fachtext gehoert neben die Regel,
 * die ihn begruendet, und ein zweiter Ort fuer denselben Satz waere ein zweiter
 * Ort, an dem ihn jemand schaerft.
 *
 * This is the reference English catalog. The app and workspace messages also
 * have a typed Simplified Chinese catalog in chrome.ts.
 *
 * ## Der eine Satz, der hier nicht englisch war
 *
 * `llm.readFrom` lautete "gelesen aus ...", als einziger Eintrag des Katalogs.
 * W6a hat ihn hierher verschoben und ausdruecklich nicht umgeschrieben, weil
 * jener Zyklus Saetze verschob; aufgefallen ist er, weil der Katalog ihn neben
 * seine Nachbarn stellte, und genau dafuer ist ein Katalog da. Das unabhaengige
 * Audit hat ihn als Befund 14 aufgeschrieben, und seit dem 2026-08-29 heisst er
 * "read from ...". Der Katalog ist jetzt in einer Sprache, was die Voraussetzung
 * dafuer ist, dass ein zweiter Baum daneben eine Uebersetzung waere und nicht
 * eine zweite Mischung.
 */

/** Ein Menuepunkt: sein Buchstaben-Kuerzel und der Rest des Wortes. */
export interface MenuItemMessage {
    readonly key: string;
    readonly rest: string;
}

/*
 * Drei Saetze stehen an mehr als einer Stelle im Baum, und sie stehen darum
 * genau einmal hier. Sie zweimal auszuschreiben waere zweimal die Gelegenheit,
 * einen davon zu schaerfen, bis die beiden verschieden sind.
 */
const NO_PROJECT = featureCopy.no_project_88a1f32;
const CLOSE = featureCopy.close_da38860;
const TOUR_FAILED_TEXT = featureCopy.the_walk_could_not_be_prepared_ae4583d;

export const messages = {
    browserChat: {
        menuLabel: featureCopy.l_ocal_chat_f223aba,
        menuTitle: featureCopy.Open_local_browser_chat_11f626b,
        subtitle: featureCopy.Graph_display_and_local_browser_models_a22100a,
        title: featureCopy.Browser_models_72a781c,
        detail: featureCopy.Choose_or_download_an_optional_model_in_chat_settings_Answers_run_d332f53,
        open: featureCopy.Open_local_chat_181766d,
    },
    /** Die Kopfzeile und die Flaechen, die zu keinem Panel gehoeren. */
    app: {
        brand: 'CBM LENS',
        releaseLabel: featureCopy.Beta_f03b60f,
        /** Steht in der Tab-Leiste und im Breadcrumb, wenn nichts offen ist. */
        noFileOpen: featureCopy.no_file_open_fd69c61,
        /** Der Name, den eine Oberflaeche ohne Projekt traegt. */
        noProject: NO_PROJECT,
        closeTab: (name: string): string => featureCopy.close_0_159040f(name),
    },

    /**
     * Die Menuezeile und die Titel ihrer Punkte.
     *
     * Seit dem 2026-08-29 steht hier NUR noch, wofuer es eine Verdrahtung gibt.
     * Bis dahin trug die Zeile die fuenf Punkte des Terminal-Vorbilds
     * (`[f]ile [e]dit [v]iew [t]erminal` neben `[a]tlas`) und haengte den
     * unverdrahteten einen `title` an, der sagte, dass sie nichts tun. Das war
     * die Form des Vorbilds ohne dessen Inhalt: vier Woerter, die eine Bedienung
     * anbieten, die es in einer Lese-Oberflaeche nicht gibt und nicht geben
     * soll. Ein Tooltip macht aus einer Attrappe keine Auskunft; er macht sie zu
     * einer Attrappe mit Fussnote.
     *
     * Was bleibt, hat etwas dahinter: `[a]tlas` schaltet die Galaxie und traegt
     * die vier Aktionen der Atlas-Zeile, `[?]help` schlaegt die Hilfe auf. Die
     * Regel dazu wird strukturell geprueft und nicht per Liste gepflegt: jeder
     * Eintrag hier muss seinen Buchstaben in WIRED_MENU_SHORTCUTS haben
     * (src/app/shortcuts.ts, Test src/app/shortcuts.test.ts).
     */
    menu: {
        ariaLabel: featureCopy.main_menu_5368d87,
        items: [
            { key: 'a', rest: 'tlas' },
            { key: '?', rest: 'help' },
        ] as readonly MenuItemMessage[],
        /**
         * Was die Klammer um den Buchstaben bedeutet, in der Zeile selbst.
         *
         * Seit dem 2026-08-29 tragen die Buchstaben Alt/Option (siehe
         * src/app/keyboard.ts), und ein `[a]` ohne diese Angabe waere ein
         * Versprechen auf eine Taste, die etwas anderes tut. Die Angabe steht in
         * der Zeile und nicht nur in der Hilfe, weil sie dort gebraucht wird, wo
         * die Klammern stehen.
         */
        legend: featureCopy.alt_letter_8068453,
        atlasHide: featureCopy.atlas_hide_the_galaxy_panel_alt_a_40e144e,
        atlasShow: featureCopy.atlas_show_the_galaxy_panel_alt_a_01ff03b,
        settings: featureCopy.atlas_which_model_answers_and_everything_that_costs_computing_tim_ed64556,
        agentsOn:
            featureCopy.atlas_live_mode_is_on_The_bridge_is_being_read_and_the_actors_are_65cafd1,
        agentsOff:
            featureCopy.atlas_live_mode_is_off_and_not_one_request_goes_to_the_bridge_Tur_87a1583,
        why: featureCopy.atlas_put_the_question_again_and_pick_a_way_in_alt_w_c1d4ccf,
        bug: featureCopy.atlas_compare_the_expected_path_into_a_symbol_with_the_observed_o_e70884c,
        impact: featureCopy.atlas_what_a_change_would_reach_and_what_covers_it_alt_c_899da17,
        helpOpen: featureCopy.help_what_this_reads_what_it_cannot_do_and_every_key_it_listens_t_d221785,
        helpClose: featureCopy.help_close_this_page_20c0b27,
        projects: featureCopy.atlas_what_this_server_has_indexed_index_more_and_what_the_server_59b4915,
    },

    /**
     * Die Hilfeseite, ganz.
     *
     * Sie steht im Katalog und nicht in der Komponente, weil sie der laengste
     * zusammenhaengende Text der Oberflaeche ist: verteilt auf JSX waere sie der
     * eine Ort, an dem niemand mehr sieht, was das Produkt ueber sich selbst
     * behauptet. Hier steht es an einem Stueck und ist an einem Stueck lesbar.
     *
     * Zwei Dinge sind ausdruecklich so gebaut und nicht anders:
     *
     * 1. **Die Grenzen stehen vor den Faehigkeiten.** Wer die Hilfe aufschlaegt,
     *    soll zuerst erfahren, was hier nicht geht, samt Grund. Ein Produkt, das
     *    seine Grenzen ans Ende stellt, laesst den Leser sie selbst finden, und
     *    das ist die teuerste Art, sie zu erfahren.
     * 2. **Kein Netz-Link, nirgends.** Die Oberflaeche ist per Vorgabe
     *    abgeschottet (PLAN Abschnitt 3); ein Verweis ins Web waere im
     *    Normalbetrieb ein toter Knopf. Die Verweise sind darum Pfade in diesem
     *    Repository.
     */
    help: {
        title: featureCopy.CBM_LENS_HELP_d41f116,
        subtitle: featureCopy.a_reading_surface_over_an_indexed_repository_1369736,
        close: featureCopy.esc_close_1d54db9,
        closeLabel: CLOSE,

        whatTitle: featureCopy.What_this_is_ca413b8,
        what: [
            featureCopy.CBM_Lens_reads_a_repository_that_the_analysis_server_has_indexed__8f40375,
            featureCopy.Everything_on_this_screen_comes_from_that_index_or_from_a_file_th_cbdaf43,
        ],

        limitsTitle: featureCopy.What_it_cannot_do_470bedc,
        limits: [
            featureCopy.The_reader_is_read_only_you_cannot_edit_a_file_here_and_what_you__5f83769,
            featureCopy.It_cannot_run_code_and_there_is_no_terminal_no_build_no_test_run__267a4b1,
            featureCopy.It_reaches_no_cloud_The_only_model_it_can_use_is_a_sidecar_on_thi_20548e9,
        ],
        limitsWhy:
            featureCopy.That_is_the_shape_of_the_product_and_not_a_missing_release_this_s_9caf1ff,

        panelsTitle: featureCopy.The_panels_and_what_each_one_answers_a0c7c16,
        panels: [
            { name: featureCopy.explorer_and_reader_5dc7efe, answers: featureCopy.what_is_in_this_project_and_what_does_this_file_say_05a2695 },
            { name: featureCopy.twin_be60598, answers: featureCopy.what_does_the_symbol_under_the_caret_hold_call_raise_and_touch_a20dd46 },
            { name: featureCopy.flow_d8f7e9c, answers: featureCopy.in_what_order_does_this_symbol_call_what_it_calls_f83ba02 },
            { name: featureCopy.w_hy_am_I_here_21d85a4, answers: featureCopy.where_do_I_start_and_what_is_the_walk_from_there_936b23e },
            { name: featureCopy.b_ug_hunt_a7750a9, answers: featureCopy.how_does_the_expected_path_into_a_symbol_differ_from_the_observed_bbf9379 },
            { name: featureCopy.c_hange_scope_19c8e2b, answers: featureCopy.what_would_a_change_here_reach_and_what_covers_it_42063cf },
            { name: '[a]tlas', answers: featureCopy.where_does_this_symbol_sit_among_the_others_6c6e1a9 },
            { name: featureCopy.l_ocal_llm_49f4ba8, answers: featureCopy.is_a_local_model_answering_and_out_of_which_context_18b2e7a },
            {
                name: featureCopy.s_ettings_762b402,
                answers:
                    featureCopy.which_model_in_your_cache_answers_how_to_get_another_one_and_what_ec43047,
            },
            {
                name: featureCopy.p_rojects_6745a82,
                answers:
                    featureCopy.what_this_server_has_indexed_how_to_index_or_remove_a_repository__aeba2c2,
            },
            {
                name: featureCopy.command_line_602667f,
                answers:
                    featureCopy.which_symbol_means_this_the_words_are_matched_against_symbol_name_64914d2,
            },
        ],

        shortcutsTitle: featureCopy.Every_key_this_window_listens_to_b357a47,
        shortcutsNote:
            featureCopy.Menu_shortcuts_work_across_the_workspace_Cmd_Ctrl_K_opens_the_ded_18baaf2,
        typingNote:
            featureCopy.Typing_stays_in_the_field_you_focused_Menu_shortcuts_use_Alt_Opti_19a0f66,
        columnKey: featureCopy.key_a62f222,
        columnWhere: featureCopy.where_it_counts_0927a7d,
        columnDoes: featureCopy.what_it_does_235cc5e,

        /*
         * Der Tastentest.
         *
         * Er steht in der Hilfe und nicht in einem Entwicklermodus, weil er den
         * Nutzer beantwortet, der einen Fehler meldet, den niemand nachstellen
         * kann. Am 2026-08-29 kam "alt plus letter funktioniert nur fuer
         * atlas"; an der laufenden Vorschau loesten alle fuenf Kuerzel aus. Statt
         * an einer Ursache zu raten, zeigt die Seite, was am Geraet des Lesers
         * wirklich ankommt, und was diese Oberflaeche daraus gemacht haette.
         */
        keyProbeTitle: featureCopy.Test_a_key_combination_ad74db2,
        keyProbeIntro:
            featureCopy.Press_a_combination_now_with_this_page_open_and_read_below_what_a_d4c04bd,
        keyProbeIdle: featureCopy.nothing_pressed_yet_a7f56bc,
        keyProbeFields: {
            code: 'physical key (code)',
            key: 'character produced (key)',
            modifiers: featureCopy.modifiers_3dcdbf0,
            defaultPrevented: featureCopy.already_consumed_3f138be,
            consumedBy: featureCopy.consumed_by_88db8fe,
            target: featureCopy.arrived_at_d86927f,
            shortcut: 'recognised as a menu key',
        } as Readonly<Record<string, string>>,
        keyProbeConsumers: {
            nobody: featureCopy.nobody_it_arrived_untouched_7f40ac2,
            'this-window': featureCopy.this_window_its_own_shortcut_handler_took_it_ebc0d65,
            'something-else':
                featureCopy.something_else_before_this_window_saw_it_a_browser_extension_the__c16cbe4,
        } as Readonly<Record<string, string>>,
        keyProbeNoShortcut: featureCopy.no_this_combination_is_not_a_menu_key_ea2b16e,
        keyProbeShortcut: (letter: string): string => featureCopy.yes_the_menu_key_for_0_9d139d8(letter),
        keyProbeNone: '-',
        keyProbeNoModifier: featureCopy.none_71f8e79,
        keyProbeNote:
            featureCopy.What_to_look_for_a_menu_key_needs_alt_option_and_a_code_of_the_fo_ac10d26,

        /** Der Modifikator vor einem Menuekuerzel. Auf Apple-Tastaturen: option. */
        altPrefix: featureCopy.alt_6c08015,
        scopes: {
            mnemonic: featureCopy.anywhere_also_while_you_type_c43b57c,
            bare: featureCopy.outside_text_fields_c8bf12c,
            galaxy: featureCopy.anywhere_112c2a0,
            walk: featureCopy.during_a_walk_840fd95,
        },
        keyNames: {
            Enter: featureCopy.enter_3674951,
            Escape: featureCopy.esc_abb761d,
            ArrowUp: featureCopy.up_7c0a25c,
            ArrowDown: featureCopy.down_77346d0,
            ArrowLeft: featureCopy.left_12c0f1f,
            ArrowRight: featureCopy.right_d27a1f1,
        } as Readonly<Record<string, string>>,
        /**
         * Was eine Taste tut, je Bereich und Taste (`bereich:taste`).
         *
         * Der Schluessel ist zusammengesetzt, weil dieselbe Taste in zwei
         * Bereichen zwei Dinge tut: Enter geht im Walk einen Schritt weiter und
         * oeffnet im Suchfenster den Treffer.
         */
        shortcutDoes: {
            'mnemonic:a': featureCopy.show_or_hide_the_galaxy_c3f1f1a,
            'mnemonic:w': featureCopy.ask_again_where_to_start_and_walk_from_there_bc4fd8b,
            'mnemonic:b': featureCopy.open_the_BUG_hunt_on_the_symbol_in_the_twin_89d13a7,
            'mnemonic:l': featureCopy.turn_the_local_model_on_or_off_8c78e0b,
            'mnemonic:r': featureCopy.put_every_zone_back_to_the_width_and_height_it_starts_with_ebdf46b,
            'mnemonic:s': featureCopy.open_or_close_the_settings_the_model_and_what_the_drawing_costs_12532bc,
            'mnemonic:g': featureCopy.turn_the_live_agent_mode_on_or_off_Off_asks_the_bridge_nothing_at_87a0747,
            'mnemonic:p': featureCopy.add_a_project_index_or_return_to_its_indexing_progress_f836bb1,
            'bare:?': featureCopy.open_or_close_this_page_17580f0,
            'galaxy:Cmd/Ctrl+K': featureCopy.open_Galaxy_and_focus_node_or_cluster_search_9770728,
            'walk:Enter': featureCopy.go_to_the_next_step_of_the_walk_and_finish_it_on_the_last_one_7174503,
            'walk:ArrowLeft': featureCopy.go_back_one_step_a435532,
            'walk:q': featureCopy.leave_the_walk_ebde205,
            'walk:d': featureCopy.draw_the_flow_of_this_step_when_the_step_has_a_symbol_14210b8,
        } as Readonly<Record<string, string>>,

        operationsTitle: featureCopy.Running_it_45f7b22,
        operations: [
            featureCopy.Index_a_project_from_the_p_rojects_panel_alt_p_or_with_the_CLI_of_f3511bd,
            featureCopy.Start_the_local_model_with_llm_start_sh_class_a_It_listens_on_the_8a29272,
            featureCopy.Bring_recorded_runs_in_with_ingest_traces_on_the_command_line_The_66be879,
        ],

        honestyTitle: featureCopy.The_rules_this_surface_holds_itself_to_2203bd7,
        honesty: [
            featureCopy.Every_claim_comes_from_the_index_or_from_the_file_the_server_sent_82ba9b1,
            featureCopy.What_the_index_does_not_record_is_named_as_a_gap_never_filled_in__955afff,
            featureCopy.An_affordance_that_does_nothing_does_not_exist_here_a_button_or_a_4fc1616,
        ],

        referencesTitle: featureCopy.Where_to_read_further_in_this_repository_3ff8625,
        references: [
            { path: 'README.md', about: featureCopy.exploration_local_inference_and_development_setup_53709d2 },
            { path: 'CONFIGURATION.md', about: featureCopy.settings_precedence_and_the_local_configuration_API_66fdd2c },
            { path: 'THIRD_PARTY.md', about: featureCopy.source_provenance_dependencies_and_model_licenses_5f1b1f0 },
            { path: 'docs/adr/0001-modellwahl.md', about: featureCopy.local_inference_choices_and_model_evidence_37ecc21 },
        ],
        referencesNote:
            featureCopy.Paths_in_this_repository_not_links_This_window_is_offline_by_desi_fa85442,
    },

    /** Die Chips der Kopfzeile und der Statusleiste. */
    statusbar: {
        chipProject: 'project',
        chipSymbols: 'sym',
        chipEdges: 'edg',
        chipServer: presentation.server,
        chipPort: 'port',
        chipTree: 'tree',
        chipSource: 'source',
        chipGalaxy: 'galaxy',
        /*
         * Nutzerwunsch vom 2026-08-29: das Ding heisst ueberall gleich.
         *
         * Der Chip hiess "llm", der Menuepunkt "[l]lm on", die Karte
         * "LOCAL_MODEL": drei Namen fuer eine Sache, und der kuerzeste davon
         * sagte nicht, dass sie auf diesem Rechner laeuft. Seit W7c heisst sie
         * an allen drei Stellen "local llm"; der Buchstabe des Kuerzels bleibt
         * `l` (src/llm/strings.ts).
         */
        chipLlm: 'local llm',
        chipCoverage: 'coverage',
        chipExplored: 'explored',
        chipWalk: 'walk',
        /** Der Wert eines Chips, dessen Zahl der Server nicht genannt hat. */
        noCount: featureCopy.no_count_2aa39f9,
        serverContacting: featureCopy.contacting_b4985f2,
        serverReady: featureCopy.ready_75c0533,
        serverUnreachable: featureCopy.unreachable_408e9ed,
        noFileLoaded: featureCopy.no_file_loaded_b681ec1,
        noProjectIndexed: featureCopy.no_project_this_server_has_nothing_indexed_alt_p_opens_the_projec_acd574b,
        noProjectError: (detail: string): string => featureCopy.no_project_0_28654b7(detail),
    },

    /** Der Explorer: seine Ueberschrift und die eine Zeile seiner Ordner-Legende. */
    explorer: {
        title: featureCopy.EXPLORER_c056f61,
        folderLabel: featureCopy.folder_afffdd0,
        folderDescription: featureCopy.the_worst_stage_of_anything_below_it_d1187cc,
    },

    /** Die Notizen um den Editor herum. */
    reader: {
        /** Die Marke vor der Kappungszeile unter dem Editor. */
        incompleteLabel: featureCopy.incomplete_fdee3eb,
        pickFile: featureCopy.pick_a_file_in_the_explorer_af49b80,
        loading: (path: string, tool: string): string => featureCopy.loading_0_over_1_121026d(path, tool),
    },

    /**
     * Die Kommandozeile: Platzhalter und die beiden Hinweise am rechten Rand.
     *
     * Der `title` ist seit dem 2026-08-29 weg. Ein nativer Tooltip legt sich in
     * dieser Oberflaeche ueber den Anfang der Zeile, also ueber genau den Text,
     * den der Leser gerade tippt (Nutzer-Screenshot); er ist ausserdem nicht zu
     * gestalten und kommt zu spaet, um eine Frage zu beantworten, die man beim
     * Hinsehen hat. Was er sagte, steht jetzt in der Hilfe unter "the panels,
     * and what each one answers".
     */
    command: {
        ariaLabel: featureCopy.command_line_602667f,
        /*
         * Der Rueckfall, wenn noch kein Index geladen ist.
         *
         * Steht einer, nennt die Zeile ein echtes Beispiel mit einem Symbol
         * dieses Projekts (src/search/command-examples.ts). Der Nutzer am
         * 2026-08-29: "anstelle von 'type a command or ask the atlas' explizite
         * Beispiele, wie man den Chat nutzt, sonst weiss niemand, wie man es
         * nutzt."
         */
        placeholder: featureCopy.type_a_command_or_ask_CBM_Lens_fe935ee,
        examplesLabel: featureCopy.what_you_can_type_here_2b71046,
        hintIdle: featureCopy.type_2_letters_to_search_by_meaning_bdf3c0e,
        hintOpen: featureCopy.up_down_picks_enter_opens_esc_closes_1acb8ae,
    },

    /** Das Suchfenster ueber der Kommandozeile. */
    search: {
        resultsLabel: featureCopy.search_results_a85392a,
        searching: (query: string): string => featureCopy.searching_for_0_6d1edf1(query),
        failed: featureCopy.the_search_could_not_be_answered_a0cd56c,
        noFile: featureCopy.this_hit_carries_no_file_in_the_index_so_there_is_nothing_to_open_929c816,
        /**
         * Was im Trefferfenster steht, solange erst ein Zeichen getippt ist.
         *
         * Der Hinweis stand bis zum 2026-08-29 nur klein am rechten Rand der
         * Zeile ("type 2 letters to search by meaning"). Wer tippt, sieht aber
         * dorthin, wo die Treffer erscheinen, und dort stand nichts: aus
         * Nutzersicht antwortet die Suche auf den ersten Buchstaben mit
         * Schweigen. Jetzt steht der Satz an der Stelle, an der die Antwort
         * erwartet wird.
         */
        oneMoreLetter: featureCopy.one_more_letter_then_CBM_Lens_searches_by_meaning_8a4c4b1,
        /*
         * Die Sofort-Vorschlaege, und dass sie vorlaeufig sind.
         *
         * Nutzerbefund vom 2026-08-29: die Vorschlaege erscheinen zu langsam.
         * Die Antwort darauf sind Zeilen aus dem, was der Browser schon geladen
         * hat, sichtbar bevor der Index geantwortet hat. Sie muessen als das
         * erkennbar sein, was sie sind, sonst waeren sie eine leise Luege ueber
         * die Vollstaendigkeit der Suche: hier steht nicht "das findet der
         * Index", sondern "das kennt dieses Fenster schon".
         */
        provisionalHeadline: (query: string, shown: number): string =>
            shown === 1
                ? featureCopy.message_1_suggestion_for_0_from_what_is_already_loaded_the_index_is_answe_795d576(query)
                : featureCopy.message_0_suggestions_for_1_from_what_is_already_loaded_the_index_is_answ_6f88263(shown, query),
        provisionalEmpty: (query: string): string =>
            featureCopy.nothing_loaded_answers_0_yet_asking_the_index_b022f22(query),
        /** Die Marke an einer vorlaeufigen Zeile. Kurz, weil sie an jeder steht. */
        provisionalMark: featureCopy.loaded_1310098,
        provisionalMarkTitle:
            featureCopy.from_the_tree_and_the_graph_this_window_already_holds_not_from_an_a518c94,
    },

    /** Die Frage nach dem Warum. Die Karten selbst stehen in why/why-model.ts. */
    why: {
        /** Was in der Fusszeile der Karte steht, wenn kein Projekt geladen ist. */
        noProject: NO_PROJECT,
    },

    /** Die Schrittkarte einer Fuehrung. */
    tour: {
        prev: featureCopy.prev_865ec8b,
        prevUnavailable: featureCopy.this_is_the_first_step_so_there_is_no_previous_step_to_return_to_2c910f3,
        nextPrefix: featureCopy.Enter_c2cb49c,
        next: featureCopy.next_edee940,
        finish: featureCopy.finish_2cce4a9,
        exit: featureCopy.q_exit_44ba143,
        /** Die vierte Aktion der Karte (PLAN Abschnitt 4, Audit-Befund 13). */
        diagram: featureCopy.d_diagram_c6c7a2e,
        diagramTitle: featureCopy.draw_the_flow_of_this_step_what_it_calls_in_order_and_what_each_c_b9afd1b,
        /**
         * Was dort steht, wenn dieser Schritt kein Symbol hat.
         *
         * Der Satz nennt den Grund und nicht die Wirkung: "nothing to draw"
         * klaenge wie ein Befund ueber die Datei, und dies ist eine Auskunft
         * ueber den Schritt.
         */
        diagramUnavailable:
            featureCopy.this_step_points_at_a_file_not_at_a_symbol_so_there_is_no_call_fl_379b66e,
        failed: TOUR_FAILED_TEXT,
        failedNoFile: (name: string): string =>
            featureCopy.message_0_the_index_names_no_file_for_1_6bcb3fc(TOUR_FAILED_TEXT, name),
    },

    /** Der Einstiegsdialog. */
    entry: {
        title: featureCopy.Where_do_you_want_to_start_601748d,
        subline:
            featureCopy.The_walk_starts_at_what_you_pick_here_and_goes_forward_over_the_c_06e5403,
        searchPlaceholder: featureCopy.or_search_for_a_name_8d8a7c2,
        searchLabel: featureCopy.search_for_a_symbol_by_meaning_217e885,
        close: featureCopy.esc_close_1d54db9,
        closeLabel: CLOSE,
        searching: featureCopy.searching_2d422c9,
        notOpenable: featureCopy.the_index_names_this_way_in_but_no_file_for_it_so_there_is_nothin_32745dc,
        startWalkAt: (name: string): string => featureCopy.start_the_walk_at_0_e04a01e(name),
        overviewFailed: (detail: string): string =>
            featureCopy.the_summary_of_ways_in_could_not_be_read_0_a9eec8c(detail),
        noAnswer: (query: string): string => featureCopy.no_symbol_answers_0_0e2bed0(query),
    },

    /** Der Rahmen des BUG-Assistenten. Seine Saetze stehen in bug-wizard-strings.ts. */
    wizard: {
        closeLabel: CLOSE,
        unresolvedHop: (name: string): string =>
            featureCopy.the_index_does_not_resolve_0_so_there_is_nothing_to_open_81c1a5e(name),
    },

    /** Der Rahmen der Aenderungsansicht. Ihre Saetze stehen in impact-strings.ts. */
    impact: {
        close: featureCopy.esc_close_1d54db9,
        closeLabel: CLOSE,
        openRow: (name: string): string => featureCopy.open_0_2edb6e3(name),
        rowNotOpenable: featureCopy.the_index_names_no_file_for_this_row_so_there_is_nothing_to_open_9cd8bd6,
        tileChangedFiles: featureCopy.changed_files_8e465dd,
        tileDirectSymbols: featureCopy.symbols_in_them_33a4000,
        tileEndpoints: featureCopy.endpoints_812c374,
        tileTestsAffected: featureCopy.tests_affected_0ede84e,
        tileUntestedAffected: featureCopy.untested_affected_e28d571,
        /** Ein Abstandsband, ein- und mehrzahlig. */
        stepsOut: (distance: number): string =>
            distance === 1 ? featureCopy.one_step_out_d53fb1a : featureCopy.message_0_steps_out_673abd4(distance),
        noTestCaller: featureCopy.no_test_caller_found_85722c8,
    },

    /** Die Karte des lokalen Modells. Ihre Zustandssaetze stehen in llm/strings.ts. */
    llm: {
        panelLabel: featureCopy.local_model_9a826ee,
        on: featureCopy.on_db3d405,
        off: featureCopy.off_da7a687,
        toggleBlocked: featureCopy.denied_by_the_project_policy_this_switch_has_no_effect_9371833,
        toggleOff: featureCopy.turn_the_local_model_off_f083a54,
        toggleOn: featureCopy.turn_the_local_model_on_96e716d,
        /** Siehe Kopf dieser Datei: bis zum 2026-08-29 der eine deutsche Eintrag. */
        readFrom: (source: string): string => featureCopy.read_from_0_6854ff7(source),
        rowModel: featureCopy.model_1d06a0d,
        rowContext: featureCopy.context_ec2727b,
        rowWeights: featureCopy.weights_5cab97f,
        rowSlots: featureCopy.slots_52547ca,
        sourceModel: 'GET /props (model_path, model_ftype)',
        sourceContext: 'GET /props (n_ctx), GET /v1/models (n_ctx_train)',
        sourceWeights: 'GET /v1/models (meta.size, meta.n_params)',
        sourceSlots: 'GET /props (total_slots), Port aus llm/start.sh',
        contextValue: (tokens: number, trained: number | undefined): string =>
            trained === undefined ? featureCopy.message_0_tokens_d6eba61(tokens) : featureCopy.message_0_of_1_trained_tokens_f578806(tokens, trained),
        weightsValue: (size: string, billions: string | undefined): string =>
            billions === undefined ? size : featureCopy.message_0_for_1_B_parameters_6d8a5d7(size, billions),
        slotsValue: (slots: number, port: number): string => featureCopy.message_0_on_127_0_0_1_1_318cb66(slots, port),
    },

    /**
     * Die Zonen, ihre Griffe und der Erklaeren-Bereich mit seinen Reitern.
     *
     * Der Bereich ist neu in W8 und ersetzt drei Flaechen, die sich bis dahin um
     * denselben Platz stritten (Flow-Erklaerer, Antwort-Panel, Schrittkarte).
     * Zwei Sorten Saetze stehen darum hier, und der Unterschied zwischen ihnen
     * ist der Kern dieses Zyklus:
     *
     *  - `disabled` sagt, warum ein Reiter gerade nichts zu zeigen hat. Er
     *    verschwindet nicht: ein Reiter, der mal da ist und mal nicht, laesst
     *    den Leser suchen, wo vorher etwas war. Er steht gedimmt da und sagt
     *    seinen Grund IM FELD, nicht in einem Tooltip. Ein Tooltip macht aus
     *    einer Attrappe keine Auskunft (dieselbe Regel wie in der Menuezeile).
     *  - `note` ist die eine Zeile, die der eingeklappte Streifen zeigt. Sie
     *    beantwortet die Frage, die W7c fuer den Chat schon beantwortet hatte:
     *    "ist mein Verlauf noch da?". Seit W8 gilt sie fuer jeden Reiter.
     */
    layout: {
        explainLabel: featureCopy.explain_f7c1380,
        explainTabsLabel: featureCopy.what_explains_the_code_in_front_of_you_cbf1852,
        explainEmptyLabel: featureCopy.nothing_to_explain_here_yet_33ae0ca,
        collapse: featureCopy.esc_fold_56ab99c,
        collapseTooltip:
            featureCopy.fold_this_area_away_Nothing_in_it_is_lost_the_chat_keeps_its_hist_921a85c,
        expand: featureCopy.unfold_1e0eecb,
        expandTooltip: featureCopy.unfold_this_area_again_on_the_tab_that_was_open_last_2283de3,
        tab: {
            flow: featureCopy.flow_d8f7e9c,
            walk: featureCopy.walk_df06b14,
            chat: featureCopy.chat_7ecde34,
            bug: featureCopy.bug_hunt_6115e43,
            change: featureCopy.change_impact_4523a37,
        },
        tabTitle: {
            flow: featureCopy.the_recorded_calls_of_the_symbol_in_the_twin_as_a_sequence_and_as_85f83c1,
            walk: featureCopy.the_walk_in_front_of_you_one_step_what_it_is_and_where_it_sits_9bd299d,
            chat: featureCopy.what_was_asked_in_this_session_with_the_cards_each_answer_was_giv_3ba4ddb,
            bug: featureCopy.the_expected_path_into_a_symbol_against_the_observed_one_8a16393,
            change: featureCopy.what_a_change_would_reach_and_what_covers_it_af7fc4c,
        },
        disabled: {
            flow:
                featureCopy.No_symbol_in_the_twin_yet_so_there_is_no_sequence_to_draw_Open_a__fe3cfaa,
            walk:
                featureCopy.No_walk_is_running_Start_one_from_the_atlas_menu_Choose_a_startin_f9ba327,
            chat:
                featureCopy.Nothing_was_asked_in_this_session_yet_Type_a_question_in_the_comm_e4dfdcd,
            bug:
                featureCopy.No_project_is_open_and_this_assistant_reads_a_project_index_Open__6c23085,
            change:
                featureCopy.No_project_is_open_and_this_view_reads_a_project_index_Open_one_a_e9549a9,
        },
        note: {
            flow: (subject: string): string => featureCopy.flow_of_0_b4ba899(subject),
            flowIdle: featureCopy.no_symbol_in_the_twin_d8c6ee1,
            walk: (step: number, steps: number): string => featureCopy.walk_step_0_of_1_e62543e(step, steps),
            walkIdle: featureCopy.no_walk_running_33d9cab,
            chat: (turns: number): string =>
                turns === 1 ? featureCopy.message_1_question_in_this_session_1dfcab7 : featureCopy.message_0_questions_in_this_session_f890da0(turns),
            chatIdle: featureCopy.nothing_asked_yet_7dba095,
            bug: featureCopy.bug_hunt_6115e43,
            change: featureCopy.change_impact_4523a37,
        },
        /**
         * Die vier Griffe.
         *
         * Jeder traegt seinen eigenen Namen, weil vier Trennlinien mit demselben
         * Etikett fuer eine Vorlesehilfe vier gleiche Elemente sind. Dazu die
         * Lage in Worten (`value`), damit ein Vorleseprogramm nicht nur weiss,
         * was es anfasst, sondern auch, wo es steht.
         *
         * Der vierzeilige Tooltip, der bis W10b an allen vier Griffen hing, ist
         * ersatzlos weg. Nutzerauftrag vom 2026-08-29: "diese Meldung nicht
         * anzeigen, das wird klar durch alles andere. Bitte an allen Bordern die
         * Meldung entfernen." Seit W8b traegt jeder Griff eine sichtbare Marke;
         * der Kasten erklaerte damit etwas, das man sieht, und verdeckte dabei
         * Inhalt. Der Grund steht ausfuehrlich im Kopf von src/layout/Splitter.tsx.
         */
        splitter: {
            left: featureCopy.width_of_the_explorer_1d4d44d,
            explain: featureCopy.height_of_the_explain_area_96e8f0a,
            right: featureCopy.width_of_the_understanding_column_06b98a0,
            twin: featureCopy.height_of_the_twin_against_the_graph_720f44c,
            value: (pixels: number): string => `${pixels} pixels`,
        },
        /**
         * Der Weg zurueck.
         *
         * Ein Befehl und ein Menuepunkt, und beide gehen durch dieselbe Funktion:
         * zwei Wege, die dasselbe TUN sollen, aber es getrennt tun, sind zwei
         * Wege, die auseinanderlaufen koennen.
         */
        reset: featureCopy.reset_layout_9fde62c,
        resetMenuLabel: featureCopy.r_eset_layout_58fabe2,
        resetTooltip: featureCopy.atlas_put_every_zone_back_to_the_width_and_height_it_starts_with__88d7555,
        resetCommandHint: featureCopy.press_enter_to_put_every_zone_back_to_its_default_size_5511e0d,
    },

    /** Der Rahmen des Antwort-Panels. Seine Saetze stehen in chat-strings.ts. */
    chat: {
        panelLabel: featureCopy.CBM_Lens_chat_e4ed64b,
        depthGroupLabel: featureCopy.neighbourhood_depth_8f99493,
        /*
         * `clear` bleibt der einzige Knopf, der loescht, und sagt es.
         *
         * Nutzerbefund vom 2026-08-29: das Panel liess sich nur ueber "clear"
         * loswerden, und damit war der Verlauf weg. Wer es nur wegklappen
         * wollte, hat ihn dafuer bezahlt. W7c hat daneben einen zweiten Knopf
         * gestellt, der nur zuklappt; seit W8 ist der Chat ein Reiter, und das
         * Zuklappen gehoert der Zone (messages.layout.collapse). Der
         * Unterschied, um den es dem Nutzer ging, ist damit nicht verschwunden,
         * sondern schaerfer geworden: die Zone klappt zu und behaelt alles,
         * dieser eine Knopf hier loescht, und er steht als einziger im Kopf des
         * Chats.
         */
        clear: featureCopy.clear_168cbb2,
        clearTooltip:
            featureCopy.forget_this_session_every_question_and_every_answer_in_this_panel_3ff70d6,
        readPrefix: featureCopy.read_8c42717,
        openCard: (path: string, line: number | undefined): string =>
            featureCopy.open_0_1_8dabcf5(path, line === undefined ? '' : `:${line}`),
        /** Die Ueberschrift ueber der Kandidatenliste. Ihr Satz steht in chat-strings.ts. */
        candidatesLabel: featureCopy.symbols_this_name_reached_3a16eaa,
    },

    /** Was die Statusleiste ueber das Graph-Panel sagt. */
    galaxy: {
        noLayout: featureCopy.no_layout_92509fd,
        /** The label of a coverage-only selection: a file the graph knows about, not a symbol. */
        coverageSelection: (name: string): string => featureCopy.Coverage_0_03c5f0f(name),
        nodeCount: (nodes: number, hidden: boolean): string =>
            featureCopy.message_0_nodes_1_79f9487(nodes, hidden ? ' (hidden)' : ''),
    },

    /**
     * Das Einstellungen-Panel (W10), ganz.
     *
     * Wie die Hilfe steht sein Text hier und nicht in der Komponente: es ist die
     * zweite lange zusammenhaengende Flaeche dieses Produkts, und verteilt auf
     * JSX waere sie wieder der Ort, an dem niemand mehr sieht, was das Produkt
     * ueber sich behauptet. Drei Dinge sind ausdruecklich so formuliert und
     * nicht anders:
     *
     * 1. **Kein Satz verspricht eine Wirkung.** Was eine Einstellung bringt,
     *    misst das Panel auf DIESER Maschine und schreibt zwei Zahlen daneben.
     *    Die Saetze hier beschreiben, was eine Einstellung TUT (welche Ebene
     *    wegfaellt, welcher Durchgang entfaellt), nicht, was sie einbringt.
     * 2. **Der Ehrlichkeitssatz sagt drei Dinge auf einmal**: dass der Befehl
     *    ins Netz geht, wohin er laedt, und dass diese Anwendung selbst nichts
     *    herunterlaedt. Alle drei zusammen, weil jeder fuer sich die Frage offen
     *    laesst, die der naechste beantwortet.
     * 3. **Der Grund fuer "kein Router" ist eine Messung und keine Vermutung.**
     *    Ein Einzel-Server ignoriert ein fremdes `model`-Feld stillschweigend;
     *    das wurde am 2026-08-29 gemessen, und der Satz sagt es so.
     */
    settings: {
        title: featureCopy.CBM_LENS_SETTINGS_d47a797,
        subtitle: featureCopy.which_model_answers_and_everything_that_costs_computing_time_45dbe8d,
        panelLabel: featureCopy.settings_3cc1d5a,
        close: featureCopy.esc_close_1d54db9,
        closeLabel: CLOSE,
        /** Der Eintrag in der Atlas-Zeile. Der Buchstabe steht in Klammern. */
        menuLabel: featureCopy.s_ettings_762b402,
        /** Was die Kommandozeile am rechten Rand sagt, wenn `settings` dasteht. */
        commandHint: featureCopy.press_enter_to_open_the_settings_05d7543,

        /* ------------------------------------------------- das laufende Modell */

        modelTitle: featureCopy.The_model_that_answers_0d4fb01,
        modelIntro:
            featureCopy.Every_number_in_this_block_comes_from_the_process_that_loaded_the_963943d,
        rowName: featureCopy.name_6ae9995,
        rowQuantization: featureCopy.quantisation_27864a5,
        rowContext: featureCopy.context_ec2727b,
        rowWeights: featureCopy.weights_5cab97f,
        sourceName: 'GET /props (model_path)',
        sourceQuantization: 'GET /props (model_ftype)',
        sourceContext: 'GET /props (n_ctx), GET /v1/models (meta.n_ctx_train)',
        sourceWeights: 'GET /v1/models (meta.size, meta.n_params)',
        sourceNameRouter: 'GET /props?model=<id> (model_path)',
        sourceQuantizationRouter: 'GET /props?model=<id> (model_ftype)',
        sourceContextRouter: 'GET /props?model=<id> (n_ctx), GET /v1/models (meta.n_ctx_train)',
        contextValue: (tokens: number, trained: number | undefined): string =>
            trained === undefined ? featureCopy.message_0_tokens_d6eba61(tokens) : featureCopy.message_0_of_1_trained_tokens_f578806(tokens, trained),
        weightsValue: (size: string, billions: string | undefined): string =>
            billions === undefined ? size : featureCopy.message_0_for_1_B_parameters_6d8a5d7(size, billions),
        /** Wenn der Prozess eine Angabe schuldig bleibt. Kein Platzhalter, ein Satz. */
        valueUnreported: featureCopy.the_process_did_not_report_this_0b1c37c,

        offTitle: featureCopy.The_local_model_is_off_and_this_panel_asks_it_nothing_0a12de1,
        offText:
            featureCopy.Not_one_request_goes_to_the_sidecar_while_the_model_is_off_not_ev_6541188,
        offStillWorks:
            featureCopy.Everything_below_about_drawing_works_either_way_It_has_nothing_to_560bbf9,
        notRunningTitle: featureCopy.The_local_model_is_on_and_nothing_is_listening_ac259c9,
        notRunningText:
            featureCopy.This_page_has_no_backend_and_cannot_start_a_process_so_the_sideca_bbf57bd,
        startingText: featureCopy.A_sidecar_is_loading_its_model_The_numbers_appear_as_soon_as_it_a_a6575c6,
        blockedText:
            featureCopy.The_committed_policy_of_the_indexed_project_denies_the_local_mode_264a280,

        /* ------------------------------------------------- die Modelle im Cache */

        cacheTitle: featureCopy.The_models_in_your_cache_ee7ba71,
        cacheIntro:
            featureCopy.What_the_running_process_lists_in_its_cache_directory_It_is_read__b7224dc,
        cacheEmpty: featureCopy.the_process_lists_no_model_in_its_cache_directory_88d8d97,
        cacheCount: (count: number): string =>
            count === 1 ? featureCopy.message_1_model_in_the_cache_c3f9cf6 : featureCopy.message_0_models_in_the_cache_c7ee694(count),
        modelAnswering: featureCopy.answering_now_ad230d2,
        modelLoaded: featureCopy.loaded_1310098,
        modelUnloaded: featureCopy.in_the_cache_not_loaded_0722a9d,
        selectTitle: (name: string): string =>
            featureCopy.send_the_next_questions_to_0_It_stays_chosen_after_a_reload_25575d4(name),
        selectedTitle: (name: string): string => featureCopy.message_0_is_the_model_the_next_question_goes_to_c8b404e(name),
        refresh: featureCopy.read_the_list_again_c2d8d93,
        refreshTitle:
            featureCopy.ask_the_process_for_its_model_list_once_more_This_is_the_only_req_4d9aa17,

        noRouterTitle: featureCopy.This_sidecar_serves_one_fixed_file_so_there_is_nothing_to_switch_1c82c09,
        noRouterText:
            featureCopy.It_was_started_with_m_and_a_path_A_sidecar_in_that_shape_ignores__cdebb07,
        noRouterHow:
            featureCopy.Start_it_over_your_cache_directory_instead_Then_v1_models_lists_w_ff43101,

        /* ------------------------------------------------- eins dazuholen */

        fetchTitle: featureCopy.Getting_another_model_b16bd3f,
        honesty:
            featureCopy.This_line_goes_out_to_the_network_it_downloads_from_huggingface_c_392627d,
        noProgressBar:
            featureCopy.There_is_no_progress_bar_here_because_this_window_cannot_see_the__dd868a6,
        suggestionsTitle: featureCopy.The_six_this_project_measured_523229c,
        suggestionsIntro:
            featureCopy.Six_files_44_questions_temperature_0_seed_42_one_machine_one_day__b7d7d5a,
        columnModel: featureCopy.model_1d06a0d,
        columnClass: featureCopy.class_8d767bf,
        columnPass: featureCopy.questions_passed_fb71a2a,
        columnCitation: featureCopy.citations_kept_5a430fd,
        columnSpeed: featureCopy.speed_92b6320,
        columnSize: featureCopy.size_89368e1,
        classValue: (label: string): string =>
            label === 'B' ? featureCopy.B_8192_tokens_of_context_43fe4e0 : featureCopy.A_3072_tokens_of_context_206c8f0,
        passValue: (percent: string, questions: number): string => featureCopy.message_0_of_1_7388d66(percent, questions),
        citationValue: (percent: string): string => featureCopy.message_0_of_the_answers_d084dfc(percent),
        unmeasuredValue: (count: number): string =>
            count === 1
                ? featureCopy.message_1_answer_could_not_be_measured_for_citations_9a71018
                : featureCopy.message_0_answers_could_not_be_measured_for_citations_a72f957(count),
        /*
         * Der Fall, den es heute wirklich gibt: verification/w5/eval.json stammt
         * von vor der Aenderung an der Zitatpruefung (W10, AC8) und fuehrt das
         * Feld nicht. Eine Null waere hier die Behauptung, es habe keine
         * ungemessene Antwort gegeben, und genau das weiss niemand.
         */
        unmeasuredMissing: featureCopy.the_recorded_run_does_not_report_unmeasured_answers_51cb468,
        speedValue: (tokens: string): string => featureCopy.message_0_tokens_s_7e21a62(tokens),
        repoTitle: (repo: string): string => featureCopy.on_Hugging_Face_0_ee92531(repo),
        copy: featureCopy.copy_f84e2e2,
        copying: featureCopy.copying_7ffae5b,
        copyTitle: featureCopy.copy_this_line_to_the_clipboard_73a53b4,
        copied: featureCopy.copied_to_the_clipboard_5669463,
        copyFailed: featureCopy.the_clipboard_refused_The_line_stands_above_as_text_and_can_be_se_68837cb,

        freeTitle: featureCopy.Any_other_repository_032c5bb,
        freeIntro:
            featureCopy.The_shape_is_user_repo_with_an_optional_quant_behind_it_Only_the__e263e0b,
        freeLabel: featureCopy.a_Hugging_Face_repository_7727090,
        freePlaceholder: featureCopy.user_repo_or_user_repo_quant_16fa0d1,
        freeEmpty: featureCopy.type_a_repository_for_example_unsloth_Qwen3_5_9B_GGUF_3567bce,
        freeShape:
            featureCopy.that_is_not_the_shape_of_a_repository_id_It_is_user_repo_with_an__6768809,
        freeOk: featureCopy.the_shape_is_right_Whether_it_exists_is_decided_by_huggingface_co_8d06ad7,

        /* ------------------------------------------------- Darstellung und Leistung */

        displayTitle: featureCopy.Drawing_and_what_it_costs_2400b1b,
        displayIntro:
            featureCopy.Everything_that_costs_computing_time_is_in_this_block_and_only_he_33b2c9b,
        displayStored: (key: string): string => featureCopy.kept_in_this_browser_under_0_67b1b19(key),
        liveValue: (fps: string): string => featureCopy.message_0_frames_s_right_now_598cbf3(fps),
        liveIdle:
            featureCopy.the_graph_is_not_drawing_right_now_so_there_is_nothing_to_measure_e10a99b,
        liveScene: (nodes: number, edges: number): string => featureCopy.message_0_nodes_1_edges_93287e3(nodes, edges),

        measureIdle: featureCopy.not_measured_yet_64196e9,
        measureRunning: featureCopy.measuring_one_window_before_and_one_after_ab92262,
        measureNotDrawing:
            featureCopy.nothing_was_drawn_while_this_changed_so_nothing_was_measured_the__b821866,
        measureNoDifference: (before: string, after: string, band: string): string =>
            featureCopy.before_0_frames_s_after_1_frames_s_That_is_inside_the_spread_this_6bdeb6e(before, after)
            + featureCopy.machine_shows_without_any_change_at_all_0_frames_s_so_there_is_no_2e64f3d(band)
            + featureCopy.difference_here_0738aab,
        measureHigher: (before: string, after: string, band: string): string =>
            featureCopy.before_0_frames_s_after_1_frames_s_past_the_2_frames_s_this_b715edf(before, after, band)
            + featureCopy.machine_wobbles_by_on_its_own_245d31f,
        measureLower: (before: string, after: string, band: string): string =>
            featureCopy.before_0_frames_s_after_1_frames_s_past_the_2_frames_s_this_b715edf(before, after, band)
            + featureCopy.machine_wobbles_by_on_its_own_245d31f,
        measureScene: (nodes: number, edges: number, at: string): string =>
            featureCopy.measured_on_0_nodes_and_1_edges_at_2_0b064c0(nodes, edges, at),

        settingProjection: featureCopy.view_8f3a075,
        settingProjectionDetail:
            featureCopy.the_flat_view_is_an_orthographic_camera_looking_down_the_z_axis_I_89b9bfb,
        valueSpatial: '3D',
        valueFlat: '2D',
        settingHalos: featureCopy.landmark_halos_3133511,
        settingHalosDetail:
            featureCopy.the_glow_around_the_biggest_hubs_It_is_an_extra_sprite_layer_draw_dcf5f94,
        settingBloom: featureCopy.bloom_5812e2b,
        settingBloomDetail:
            featureCopy.the_post_processing_pass_that_makes_bright_points_glow_It_renders_b87c5c8,
        settingEdges: featureCopy.edges_7283b98,
        settingEdgesDetail:
            featureCopy.none_does_not_draw_the_edge_layer_at_all_Dimming_it_to_nothing_wo_82f336b,
        valueEdgesFull: featureCopy.all_d87c448,
        valueEdgesDim: featureCopy.dim_4815cec,
        valueEdgesOff: featureCopy.none_71f8e79,
        settingLabels: featureCopy.labels_c7775e9,
        settingLabelsDetail:
            featureCopy.names_beyond_this_distance_from_the_camera_are_not_drawn_Each_nam_cd02495,
        valueLabelsAll: featureCopy.all_of_them_f5d27be,
        valueLabelsFar: featureCopy.within_twice_the_scene_radius_9adc5eb,
        valueLabelsNear: featureCopy.within_the_scene_radius_8050d11,
        settingFrameCap: featureCopy.frame_ceiling_a68a929,
        settingFrameCapDetail:
            featureCopy.with_a_ceiling_the_render_loop_is_driven_by_a_clock_instead_of_by_4b42bed,
        valueCapOff: featureCopy.none_71f8e79,
        valueCap: (fps: number): string => featureCopy.message_0_per_second_7017736(fps),
        settingAgents: featureCopy.live_agent_layer_a9f2b5b,
        settingAgentsDetail:
            featureCopy.the_glowing_bodies_that_orbit_the_symbol_an_agent_is_working_on_a_095c631,
        settingAgentTails: featureCopy.agent_comet_tails_efe75e2,
        settingAgentTailsDetail:
            featureCopy.the_short_trail_right_behind_a_body_while_it_flies_from_one_symbo_e6e8da7,
        settingAgentTrails: featureCopy.agent_trails_a7f69bf,
        settingAgentTrailsDetail:
            featureCopy.the_dashed_line_through_the_last_symbols_an_actor_touched_drawn_u_a45dc52,
        settingAgentWaves: featureCopy.agent_write_waves_a47b53f,
        settingAgentWavesDetail:
            featureCopy.one_concentric_wave_per_burst_of_writes_on_the_same_symbol_One_pe_b1cfde1,
        settingAgentTimeline: featureCopy.agent_timeline_9315aa3,
        settingAgentTimelineDetail:
            featureCopy.the_strip_under_the_graph_one_track_per_actor_one_tick_per_event__bafccdc,
        switchOn: featureCopy.on_db3d405,
        switchOff: featureCopy.off_da7a687,

        profileTitle: featureCopy.Both_at_once_8be1dd6,
        profileThrifty: featureCopy.thrifty_profile_3631e5b,
        profileThriftyDetail:
            featureCopy.sets_the_flat_view_no_halos_no_bloom_dim_edges_labels_within_the__61b2851,
        profileDefault: featureCopy.back_to_the_default_0e1262b,
        profileDefaultDetail: featureCopy.puts_every_switch_in_this_block_back_to_what_it_starts_with_c45cf58,
        profileIsDefault: featureCopy.every_switch_is_on_its_default_614156f,
        profileChanged: featureCopy.this_differs_from_the_default_46ae5c9,

        keepsTitle: featureCopy.What_stays_where_it_is_83cfba5,
        keepsText:
            featureCopy.Switches_that_only_change_what_you_see_and_cost_nothing_to_draw_s_be74eb5,
    },

    /**
     * The projects panel: the one surface that asks the server to write.
     *
     * Its text lives here, like the settings panel's, because it speaks about
     * the product as a whole (what is indexed, what the server is doing) and
     * not about one subject area.
     */
    projects: {
        title: featureCopy.CBM_LENS_PROJECTS_2db6f64,
        subtitle: featureCopy.what_this_server_has_indexed_and_how_to_give_it_more_1104c22,
        panelLabel: featureCopy.projects_b37b567,
        close: featureCopy.esc_close_1d54db9,
        closeLabel: CLOSE,
        /** The entry in the atlas row. The letter sits in brackets. */
        menuLabel: featureCopy.p_rojects_6745a82,
        /** The atlas row entry that opens this panel to index a repository; alt+p opens it as well. */
        addIndexLabel: featureCopy.Add_project_index_9108ede,
        addIndexTitle: featureCopy.Choose_a_repository_folder_to_index_6d43718,

        /* ------------------------------------------------------- the list */

        listTitle: featureCopy.Projects_on_this_server_1700953,
        listSource: featureCopy.read_from_list_projects_over_rpc_b5c3549,
        listLoading: featureCopy.asking_the_server_1a38fab,
        listEmpty:
            featureCopy.nothing_is_indexed_yet_Index_a_repository_below_or_on_the_command_a78b8e0,
        listError: (detail: string): string => featureCopy.the_list_did_not_arrive_0_911b2e5(detail),
        refresh: featureCopy.refresh_26b56c1,
        openNow: featureCopy.open_now_5173895,
        open: featureCopy.open_5fc7e38,
        openTitle: (name: string): string => featureCopy.open_0_the_page_reloads_with_project_1_3a5f31f(name, name),
        counts: (nodes: number, edges: number): string => featureCopy.message_0_sym_1_edg_d6f0524(nodes, edges),
        countsUnknown: featureCopy.counts_not_sent_62cba59,
        check: featureCopy.check_d56d985,
        checkTitle: 'GET /api/project-health: does the index file open, and what does it hold',
        healthHealthy: (nodes: number, edges: number, mb: string): string =>
            featureCopy.healthy_0_symbols_1_edges_2_MB_on_disk_76721f2(nodes, edges, mb),
        healthMissing: featureCopy.missing_the_server_has_no_index_file_under_this_name_b7371a0,
        healthCorrupt: (reason: string): string => featureCopy.corrupt_0_04b9a58(reason),
        healthUnknown: featureCopy.the_server_answered_with_a_verdict_this_panel_does_not_know_29fc32e,
        reindex: featureCopy.reindex_797161e,
        reindexTitle: (root: string): string => featureCopy.POST_api_index_for_0_rebuilds_the_index_in_the_background_9b05c94(root),
        noRoot: featureCopy.root_path_not_sent_by_the_server_reindex_from_the_form_below_2ef4dd4,
        remove: featureCopy.delete_9485989,
        removeTitle: featureCopy.DELETE_api_project_removes_the_index_file_never_the_repository_800cd8f,
        removeArmed: (name: string): string =>
            featureCopy.delete_the_index_of_0_The_repository_on_disk_stays_as_it_is_d599893(name),
        removeConfirm: featureCopy.yes_delete_the_index_0528e37,
        cancel: featureCopy.cancel_4fd0653,
        removed: (name: string): string => featureCopy.message_0_index_deleted_0c98cff(name),
        removeError: (detail: string): string => featureCopy.not_deleted_0_2acb78d(detail),

        /* ------------------------------------------------------- the form */

        indexTitle: featureCopy.Index_a_repository_e1b5487,
        indexIntro:
            featureCopy.The_server_does_the_indexing_this_window_only_asks_The_path_has_t_281960f,
        pathLabel: featureCopy.repository_path_67d2f09,
        pathPlaceholder: '/absolute/path/to/repository',
        browse: featureCopy.browse_0f6a24f,
        browseTitle: 'GET /api/browse: list the folders under this path',
        browseClose: featureCopy.close_browser_785568f,
        browseAt: (path: string): string => featureCopy.folders_in_0_975301b(path),
        browseUp: featureCopy.up_one_level_05fff1e,
        browseUse: featureCopy.use_this_folder_a4a1019,
        browseEmpty: featureCopy.no_folders_here_c37f586,
        browseError: (detail: string): string => featureCopy.browsing_failed_0_c87422b(detail),
        nameLabel: featureCopy.project_name_cb01b59,
        nameHint: featureCopy.suggested_from_the_last_path_segment_change_it_if_you_like_14e129f,
        start: featureCopy.index_e540cdd,
        startTitle: featureCopy.POST_api_index_start_a_background_job_for_this_path_676c926,
        started: (path: string): string => featureCopy.job_accepted_for_0_its_state_appears_below_fdf30fc(path),
        startError: (detail: string): string => featureCopy.the_server_refused_0_dece6cc(detail),
        jobsTitle: featureCopy.Index_jobs_since_the_server_started_ab2be3c,
        jobsSource: (seconds: string): string =>
            featureCopy.read_from_GET_api_index_status_asked_again_every_0_s_while_a_job__88be9eb(seconds),
        jobsNone: featureCopy.no_job_has_run_yet_bc2bf71,
        jobIndexing: featureCopy.indexing_2b55124,
        jobDone: featureCopy.done_e5fd9cf,
        jobError: (error: string): string => featureCopy.failed_0_0a046cd(error),
        jobUnknown: featureCopy.state_not_known_to_this_panel_b4fd858,

        /* -------------------------------------------------------- the adr */

        adrTitle: featureCopy.Decision_record_10cd48e,
        adrOpen: featureCopy.Open_ADR_20eb557,
        adrIntro: (project: string): string =>
            featureCopy.The_architecture_decision_record_the_server_keeps_for_0_as_markdo_df11b1c(project)
            + featureCopy.stores_it_in_the_project_index_a_reindex_keeps_it_3b9ed97,
        adrNoProject: featureCopy.open_a_project_to_read_or_write_its_decision_record_7f7931d,
        adrLoading: featureCopy.reading_ef3f8d3,
        adrNone: featureCopy.no_record_yet_what_you_save_here_becomes_the_first_one_2075f1e,
        adrUpdated: (at: string): string => featureCopy.last_saved_0_d2b040a(at),
        adrLabel: featureCopy.decision_record_markdown_75d10d9,
        adrSave: featureCopy.save_13a4a11,
        adrSaveTitle: featureCopy.POST_api_adr_store_this_text_for_the_open_project_74923a8,
        adrSaved: featureCopy.saved_c75c31d,
        adrBusy: featureCopy.the_project_is_being_indexed_right_now_save_again_when_the_job_is_3784f90,
        adrError: (detail: string): string => featureCopy.not_saved_0_57d65ae(detail),
        adrReadError: (detail: string): string => featureCopy.the_record_did_not_arrive_0_0cbae2b(detail),

        /* ----------------------------------------------------- the server */

        serverTitle: featureCopy.This_server_d75b234,
        processesSource: featureCopy.read_from_GET_api_processes_bb03393,
        processesSelf: (pid: number, mb: string): string => featureCopy.serving_this_page_pid_0_1_MB_resident_5378578(pid, mb),
        processesOthers: (count: number): string =>
            count === 1 ? featureCopy.one_other_codebase_memory_mcp_process_89c5301 : featureCopy.message_0_other_codebase_memory_mcp_processes_59668b5(count),
        processesNone: featureCopy.no_other_codebase_memory_mcp_process_is_running_3ce7560,
        processRow: (pid: number, cpu: string, mb: string, elapsed: string): string =>
            featureCopy.pid_0_1_cpu_2_MB_up_3_ae39014(pid, cpu, mb, elapsed),
        processesError: (detail: string): string => featureCopy.the_process_list_did_not_arrive_0_36c496c(detail),
        logsTitle: featureCopy.Log_tail_1fc634d,
        logsSource: (shown: number, total: number): string => featureCopy.read_from_GET_api_logs_0_of_1_lines_309a0bc(shown, total),
        logsEmpty: featureCopy.the_log_ring_is_empty_f5dc3af,
        logsError: (detail: string): string => featureCopy.the_log_did_not_arrive_0_57a19bf(detail),
        uiLogTitle: featureCopy.Frontend_log_ed47dc1,
        uiLogSource: (shown: number, total: number, path: string): string =>
            featureCopy.read_from_GET_api_ui_log_0_of_1_lines_of_2_e8dc60a(shown, total, path),
        uiLogPrevious: (path: string): string => featureCopy.Local_compatibility_export_archive_0_retained_history_is_read_fro_650a31a(path),
        uiLogAbout:
            featureCopy.This_page_records_console_output_uncaught_errors_and_failed_reque_a73202a,
        uiLogEmpty: featureCopy.nothing_recorded_yet_4e72009,
        uiLogError: (detail: string): string => featureCopy.the_frontend_log_did_not_arrive_0_8bca320(detail),
        reload: featureCopy.reload_d6e6e57,
    },

    /** Der Rahmen des Twins. Seine Fakten-Saetze stehen in twin/strings.ts. */
    twin: {
        /** Das Etikett des Leseprofils, mit dem dieses Produkt startet. */
        profileLabel: featureCopy.CBM_Lens_Twin_d512c6a,
        /** Der Kopf des Panels, solange kein Symbol vor dem Leser steht. */
        noSymbol: featureCopy.no_symbol_9a0962d,
    },
} as const;

export type Messages = typeof messages;
