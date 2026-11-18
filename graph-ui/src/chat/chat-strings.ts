import { featureCopy } from '../i18n/features/chat';
/**
 * Everything the chat says in its own voice.
 *
 * A separate file for the same reason twin/strings.ts and llm/strings.ts are
 * separate: these sentences are the contract with the reader, the proof run
 * reads them word for word, and they should be checkable without the state
 * machine next to them.
 *
 * The rule behind all of them: the panel says what happened, and when nothing
 * happened it says that instead of showing an empty box. "The model was not
 * asked" and "the model had nothing to say" are different sentences here.
 */

import { SIDECAR_PORT } from '../llm/sidecar';

/** The word over the panel. */
export const CHAT_TITLE = featureCopy.CBM_LENS_CHAT_704e6dd;

/** What the command line hint says when a question would be sent. */
export const CHAT_HINT_READY = featureCopy.enter_asks_CBM_Lens_b6ef87c;

/** What it says when the line looks like a question and the model is off. */
export const CHAT_HINT_OFF = featureCopy.enter_asks_CBM_Lens_the_local_model_is_off_02d21a1;

/** The sentence when the model is off and a question was typed. */
export const CHAT_OFF_MESSAGE =
    featureCopy.the_local_model_is_off_so_nothing_was_sent_to_127_0_0_1_0_59207e4(SIDECAR_PORT)
    + featureCopy.Turn_it_on_in_the_a_tlas_menu_or_on_the_LOCAL_LLM_card_then_ask_a_746ff25;

/** The model is off, but the index-built cards still answer the question. */
export const CHAT_OFF_WITH_CARDS =
    featureCopy.the_local_model_is_off_so_the_answer_below_is_built_from_the_card_6c0d4b1(SIDECAR_PORT);

/** The compiler still answered; this only names why its optional model pass did not run. */
export function chatBuiltUnavailableMessage(reason: 'off' | 'not-running' | 'policy'): string {
    switch (reason) {
        case 'policy':
            return featureCopy.the_local_model_is_denied_by_the_project_policy_so_the_answer_bel_bd0538a;
        case 'not-running':
            return featureCopy.the_local_model_is_on_but_nothing_answers_on_127_0_0_1_0_the_answ_f45b009(SIDECAR_PORT);
        default:
            return CHAT_OFF_WITH_CARDS;
    }
}

export const CHAT_AI_LABEL = featureCopy.AI_version_a9eb753;
export const CHAT_AI_RESTORE = featureCopy.built_version_1ee1845;
export const CHAT_BUILT_PROVENANCE = featureCopy.built_from_indexed_cards_and_their_citations_2df365b;
export function chatAiProvenance(model: string): string {
    return featureCopy.worded_by_local_model_0_every_required_fact_passed_the_rewrite_gu_676f1e5(model);
}

/** The sentence when the model is on but no process answers. */
export const CHAT_NOT_RUNNING_MESSAGE =
    featureCopy.the_local_model_is_on_but_nothing_answers_on_127_0_0_1_0_d02d8a4(SIDECAR_PORT)
    + featureCopy.Start_the_sidecar_with_llm_start_sh_then_ask_again_82e15aa;

/** The sentence when a policy denies the model. */
export const CHAT_POLICY_MESSAGE =
    featureCopy.the_local_model_is_denied_by_the_project_policy_so_nothing_was_se_06a8b6a;

/** The sentence while the compiler is working. */
export const CHAT_COMPILING = featureCopy.compiling_the_cards_from_the_index_b94473c;

/** The sentence while the model is answering. */
export const CHAT_ASKING = featureCopy.the_local_model_is_phrasing_an_answer_from_the_cards_ffe6a91;

/** Why the agreed sentence is there, under it. */
export const CHAT_NO_CARDS_HINT =
    featureCopy.The_index_holds_nothing_this_question_could_be_answered_from_so_t_bb989f8;

// ------------------------------------------------- the name and the symbol --

/**
 * The line over a candidate list.
 *
 * It says the number, because two candidates and eleven are different problems,
 * and it says what a click does, because a list without that is a list.
 */
export function chatChoiceHeadline(name: string, count: number): string {
    return featureCopy.message_0_names_1_symbols_in_this_index_Pick_the_one_you_meant_and_the_sa_da83e4a(name, count)
        + featureCopy.question_is_asked_again_about_it_nothing_was_sent_to_the_model_in_a43cfab;
}

/** One candidate, as the list writes it: the name, the file, the line. */
export function chatCandidateLabel(
    name: string,
    filePath: string | undefined,
    line: number | undefined,
): string {
    const where = filePath === undefined || filePath.length === 0
        ? featureCopy.no_file_in_the_index_3273387
        : line === undefined ? filePath : `${filePath}:${line}`;
    return `${name} (${where})`;
}

/** The tooltip of a candidate. It names the act and not the thing. */
export function chatCandidateTitle(name: string): string {
    return featureCopy.ask_this_question_again_about_0_f223211(name);
}

/** The mark on a candidate the index flagged as test code. */
export const CHAT_CANDIDATE_TEST_MARK = featureCopy.test_a94a8fe;

/**
 * The line that says the answer is about something else than what was asked.
 *
 * Its own line, above the answer and not under it, and in the product's voice
 * rather than the model's: the model was never told that the name failed, so it
 * cannot be the one to say it. A reader who sees "createUser" in an answer to
 * "@createuser" has to be able to see, in the same glance, that the two are the
 * same symbol and how the compiler got from one to the other.
 */
export function chatFocusFallbackLine(asked: string, used: string): string {
    return featureCopy.message_0_was_not_found_in_the_index_answered_about_the_symbol_in_focus_i_c1e97cf(asked)
        + `${used}.`;
}


/** The line over the cards, which fold open. */
export function chatCardsLabel(count: number): string {
    return count === 1 ? featureCopy.the_1_card_this_answer_was_given_06a7886 : featureCopy.the_0_cards_this_answer_was_given_8054eb9(count);
}

/** The honest line under the answer, naming the class and the rule that fired. */
export function chatProvenance(klass: string, rule: string, tokens: number, budget: number): string {
    return featureCopy.question_class_0_rule_1_the_cards_cost_about_2_of_3_88e68bc(klass, rule, tokens, budget)
        + featureCopy.tokens_estimated_at_four_characters_per_token_a5bb45b;
}

/** What the panel says when a claim came back without a citation. */
export function chatCitationWarning(count: number): string {
    return count === 1
        ? featureCopy.message_1_line_of_this_answer_carries_no_card_citation_and_is_shown_as_th_12e24f6
        : featureCopy.message_0_lines_of_this_answer_carry_no_card_citation_and_are_shown_as_th_158ac83(count);
}

/** What it says when the model cited a card that was never given. */
export function chatUnknownCardWarning(ids: readonly string[]): string {
    return featureCopy.this_answer_cites_0_which_was_never_handed_over_874991f(ids.join(', '))
        + featureCopy.Nothing_was_navigated_to_and_nothing_was_believed_4a118e6;
}

/** What it says when a model returned only its own monologue. */
export const CHAT_THOUGHT_ONLY =
    featureCopy.the_model_returned_only_its_internal_monologue_and_no_answer_Noth_c4b646d;

/** What it says when the token ceiling cut the answer off. */
export const CHAT_TRUNCATED =
    featureCopy.the_answer_stopped_at_the_token_limit_so_its_last_line_is_incompl_71cb02e;

/** What it says when the request failed. */
export function chatFailed(detail: string): string {
    return featureCopy.the_local_model_could_not_be_asked_0_f17575f(detail);
}

// ------------------------------------------------ the neighbourhood setting --

/** The label of the depth control. */
export const CHAT_DEPTH_LABEL = featureCopy.context_ec2727b;

/** The three options, in order. */
export const CHAT_DEPTH_OPTIONS: readonly { value: 0 | 1 | 2; label: string; title: string }[] = [
    {
        value: 0,
        label: featureCopy.message_0_hops_09a5389,
        title: featureCopy.the_focus_symbol_alone_no_caller_and_no_callee_goes_into_the_card_8c251f5,
    },
    {
        value: 1,
        label: featureCopy.message_1_hop_73ce478,
        title: featureCopy.the_focus_symbol_plus_its_direct_callers_and_callees_The_default_0b026e3,
    },
    {
        value: 2,
        label: featureCopy.message_2_hops_35d2cba,
        title: featureCopy.the_focus_symbol_plus_two_rings_of_neighbours_More_context_more_t_7e331bb,
    },
];

/**
 * The honest note under the depth control.
 *
 * It says what a wider context does, not what it improves. More neighbours is
 * more for a small model to mix up, and the token budget cuts the far ones
 * anyway; a control labelled "better answers" would be selling the setting
 * rather than describing it.
 *
 * The last sentence is the one a reader would otherwise have to guess: changing
 * the depth does not re-ask anything. An answer that silently changed under a
 * setting would be an answer nobody could quote afterwards, and the whole panel
 * is built so that a citation still means what it meant when it was written.
 */
export const CHAT_DEPTH_NOTE =
    featureCopy.How_much_of_the_neighbourhood_goes_into_the_cards_More_neighbours_978b68a;

/**
 * The offer on the last answer when the depth has been changed since.
 *
 * The reader's finding of 2026-08-29: "wenn ich 1 hop, 2 hop, 3 hop klicke,
 * kein anderer Text, wieso?" The setting applies to the NEXT question on
 * purpose, because an answer that changed under the hand would void its own
 * citations. That sentence stood in the head of the panel and was read past.
 *
 * So the explanation becomes an offer, at the answer it is about. Pressing it
 * asks the same question again as a NEW turn; the old turn stays with its old
 * depth, so the two can be held against each other and every citation still
 * means what it meant. The same pattern W7c introduced for picking between
 * ambiguous candidates.
 */
export function chatRerunLabel(depth: number): string {
    return depth === 1 ? featureCopy.ask_again_with_1_hop_ffabeef : featureCopy.ask_again_with_0_hops_081c1e3(depth);
}

/** Why the offer is there, on the button itself. */
export function chatRerunTooltip(was: number, now: number): string {
    return featureCopy.This_answer_was_compiled_with_0_of_context_and_the_006713a(was === 1 ? '1 hop' : `${was} hops`)
        + featureCopy.setting_now_says_0_Asking_again_makes_a_new_turn_4716c75(now === 1 ? '1 hop' : `${now} hops`)
        + featureCopy.this_one_stays_as_it_is_so_the_two_can_be_compared_9951fe4;
}

/**
 * What the fold over the cards says, in both states.
 *
 * Until W8b it said `[-]` and `[+]`. The reader did not understand the signs
 * when testing the galaxy panel on 2026-08-29, and the same two signs were used
 * here. A word in front of the count answers the question the sign asked.
 */
export function chatCardsFoldLabel(open: boolean): string {
    return open ? featureCopy.collapse_86d3bfb : featureCopy.open_5fc7e38;
}

// -------------------------------------------------------------- the refine --

/** The label on the refine button in the pseudocode view. */
export const REFINE_LABEL = featureCopy.rephrase_68fc2d8;

/** Its tooltip when it can be pressed. */
export const REFINE_TITLE =
    featureCopy.let_the_local_model_rewrite_these_lines_Every_number_and_every_li_0249549;

/** The label that brings the deterministic block back. */
export const REFINE_RESTORE_LABEL = featureCopy.original_d73ef92;

/** Its tooltip. */
export const REFINE_RESTORE_TITLE = featureCopy.show_the_block_as_the_index_produced_it_9d25b69;

/** What the view says while the model works. */
export const REFINE_RUNNING = featureCopy.the_local_model_is_rephrasing_these_lines_dfa0820;

/** What it says when the rewrite was accepted. */
export const REFINE_APPLIED =
    featureCopy.rephrased_by_the_local_model_Every_line_and_every_number_is_the_o_dc1f63d;

/** What it says when the rewrite was refused, with the reason. */
export function refineRejected(reason: string): string {
    return featureCopy.the_rewrite_was_refused_and_the_original_block_is_still_shown_Rea_9ef2884(reason);
}

/** The three reasons a rewrite is refused. Read by the proof run. */
export const REFINE_REASON_COUNT = featureCopy.the_answer_holds_a_different_number_of_lines_than_were_sent_9a4ea65;
export const REFINE_REASON_NUMBERS = featureCopy.a_line_came_back_with_a_different_number_than_it_was_sent_with_03aacd1;
export const REFINE_REASON_EMPTY = featureCopy.the_model_returned_nothing_to_put_back_09a9d6a;
