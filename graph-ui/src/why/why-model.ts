import { featureCopy } from '../i18n/features/why';
/**
 * What the reader came here to do, and what the panel does with the answer.
 *
 * The question is asked once per project and the answer is used once, at the
 * moment it is given: it sets how much the twin shows and which lenses it shows
 * it through, and then it is remembered only so the question is not asked again.
 * Nothing downstream reads the intent back. That is the reference project's own
 * rule (`codeatlas-views/src/browser/why-widget.tsx`) and it is worth keeping:
 * an intent that stayed live would become a mode, and a mode is a second product
 * hiding inside the first.
 *
 * ## The order of the cards
 *
 * Order of a working day, not alphabetical and not by how much of it is built.
 * Something is broken, then something has to change, then somebody needs to
 * know the shape of the place, then somebody already knows where they want to
 * start. A reader scanning four cards reads them in that order anyway.
 *
 * ## The wording
 *
 * Every visible string in this file is checked by the browser run against a list
 * of words this product does not use about its reader. It is a reading tool for
 * people who already write software; the vocabulary of a course would describe
 * a different relationship than the one this surface has.
 *
 * ## All four cards open something
 *
 * Until W4b, "Hunt a bug" and "Scope a change" set their profile and said so in
 * their own sentence, because a card that quietly did half of what it promises
 * is the failure this project is written against. Both now open the panel they
 * name (src/traces/BugWizard.tsx and src/impact/ImpactPanel.tsx), so the
 * sentence is gone rather than reworded: a note saying "this does less than it
 * says" that stayed after it stopped being true would be the same failure with
 * the sign flipped. The `stub` field is kept on the type because the next card
 * that lands before its panel does will need it.
 */

import { Facet } from '../twin/presentation-profile';
import type { PresentationProfile } from '../twin/presentation-profile';

/** What a reader can answer. `none` is the decline, and it is a real answer. */
export type WhyIntent = 'bug' | 'change' | 'understand' | 'entry';

/** What the panel asks. */
export const WHY_HEADLINE = 'Choose a starting point';

/** The sentence under the headline: where the answer goes and what it costs. */
export const WHY_SUBLINE =
    'Open a repository map, inspect a change, or follow indexed calls. '
    + 'Select code to see Selection context with its graph evidence and recorded activity.';

/**
 * What the button under the cards says, and why it stopped saying "Not now".
 *
 * User finding of 2026-08-29 (AC6f): the panel would not go away. Four causes
 * worked together, and this was the fourth: the only way out was a button
 * labelled "Not now", which reads as "later" and not as "close this". A reader
 * who wants to read a file does not want to postpone a question, they want the
 * question out of the way, and the button has to say that it does exactly that.
 *
 * The other three causes are fixed in App.tsx: opening a file, choosing a
 * symbol or asking a question closes it, and Escape closes it too.
 */
export const WHY_DECLINE_LABEL = featureCopy.Continue_exploring_d5d6e83;

/** What the button says when it is touched: what closing costs, which is nothing. */
export const WHY_DECLINE_TOOLTIP =
    'Close this panel and read. The question is not asked again for this project in this browser; '
    + 'the atlas menu brings it back whenever you want it.';

/**
 * What the [a]tlas menu calls the way back to this panel.
 *
 * The bracketed letter is the shortcut, written the way the top menu row writes
 * its own. Audit finding 12 of 2026-08-29: the four entries of the atlas row
 * carried no letter at all while PLAN paragraph 4 says every menu item carries
 * its shortcut, and a keyboard-first surface with four mouse-only entries is
 * keyboard-first for the top row only.
 */
export const WHY_MENU_LABEL = featureCopy.w_here_to_start_c2922a0;

/** One card. `stub` is the honest sentence a card that does not open anything owes. */
export interface WhyCard {
    intent: WhyIntent;
    label: string;
    /** One sentence about what the answer is for. */
    detail: string;
    /** What the card does now, when that is less than its label suggests. */
    stub?: string;
}

/**
 * The four cards, in the order of a working day.
 *
 * The two sentences on each card divide the same way everywhere: the first says
 * what the answer is about, the second, where there is one, says what part of
 * that is not built yet.
 */
export const WHY_CARDS: readonly WhyCard[] = [
    {
        intent: 'bug',
        label: featureCopy.Hunt_a_bug_12e012a,
        detail: featureCopy.Something_is_wrong_and_you_want_the_error_paths_and_what_ran_not__1f438fa,
    },
    {
        intent: 'change',
        label: featureCopy.Scope_a_change_eab0b8d,
        detail: featureCopy.You_are_about_to_touch_something_and_want_what_it_reaches_and_wha_c8904d6,
    },
    {
        intent: 'understand',
        label: featureCopy.Understand_the_project_197d285,
        detail: featureCopy.Open_the_repository_map_find_an_entry_point_and_follow_relationsh_50bc149,
    },
    {
        intent: 'entry',
        label: featureCopy.Pick_my_own_entry_point_8b4fe66,
        detail: featureCopy.You_already_know_a_name_Start_there_and_walk_forward_over_the_cal_fccc648,
    },
];

/**
 * How an answer changes the twin, and why each mapping is what it is.
 *
 * The reference maps its five intents onto its five presentation presets, and
 * each preset carries a panel layout as well as a depth and a set of lenses.
 * There is one panel here, so a preset's `panels` list would be a claim about a
 * layout that does not exist; the depth and the facets are what carries over,
 * exactly as the default profile in App.tsx already explains. So these are
 * custom profiles with the presets' readings, not the presets themselves.
 *
 * - `bug` takes the `debug-impact` reading: technical depth, and the lenses that
 *   answer "how does this fail and what ran": calls, errors, runtime. Runtime is
 *   on although this backend records no runtime relation, because the reader
 *   asked for it and the twin says `unsupported` in the section itself. Turning
 *   it off for them would answer their question by hiding it.
 * - `change` takes the `verification` reading: technical depth with data, tests
 *   and changes, which are the three that say what a change would break.
 * - `understand` takes the `understanding` reading: one step shallower, with
 *   logic, calls and tests, which is the reading the topsort walk is written for.
 * - `entry` keeps the workbench default. Somebody who names their own starting
 *   point has said where to go and nothing about how much to show, and inventing
 *   a narrower reading from that would be putting words in their mouth.
 */
export function profileFor(intent: WhyIntent, fallback: PresentationProfile): PresentationProfile {
    switch (intent) {
        case 'bug':
            return {
                id: 'custom:why-bug',
                label: featureCopy.Bug_hunt_2d06f07,
                depth: 2,
                facets: [Facet.Logic, Facet.Calls, Facet.Errors, Facet.Runtime],
                terminology: 'technical',
                conceptCallouts: false,
                panels: [],
                aiChangeWatcher: false,
            };
        case 'change':
            return {
                id: 'custom:why-change',
                label: featureCopy.Change_scope_874ee67,
                depth: 2,
                facets: [Facet.Calls, Facet.Data, Facet.Tests, Facet.Changes],
                terminology: 'technical',
                conceptCallouts: false,
                panels: [],
                aiChangeWatcher: false,
            };
        case 'understand':
            return {
                id: 'custom:why-understand',
                label: featureCopy.Project_walk_dcb2021,
                depth: 1,
                facets: [Facet.Logic, Facet.Calls, Facet.Tests],
                terminology: 'plain',
                conceptCallouts: false,
                panels: [],
                aiChangeWatcher: false,
            };
        case 'entry':
        default:
            return fallback;
    }
}

/**
 * Words this product does not use about the person reading it.
 *
 * Kept here as data rather than in the browser run alone, so the rule is visible
 * where the strings are written and not only where they are checked.
 */
export const AVOIDED_WORDS: readonly string[] = ['learn', 'lesson', 'course', 'tutorial', 'student'];

/** Which avoided words a piece of visible text contains. Empty is the passing answer. */
export function avoidedWordsIn(text: string): string[] {
    const lower = text.toLowerCase();
    return AVOIDED_WORDS.filter((word) => lower.includes(word));
}
