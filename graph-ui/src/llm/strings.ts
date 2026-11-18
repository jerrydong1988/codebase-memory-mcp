import { featureCopy } from '../i18n/features/llm';
/**
 * Was das Panel und die Statusleiste ueber den Sidecar sagen.
 *
 * Eigene Datei, wie twin/strings.ts und traces/bug-wizard-strings.ts, aus
 * demselben Grund: die Saetze sind der Vertrag mit dem Leser, sie werden im
 * Beweislauf woertlich gelesen, und sie sollen an einer Stelle stehen, an der
 * man sie ohne die Zustandslogik daneben pruefen kann.
 *
 * Die Regel hinter allen Saetzen: sie sagen, was IST, und im Zweifel, was nicht
 * ist. Kein "wird geladen", wenn niemand laedt; kein "nicht verfuegbar", wenn
 * einfach niemand das Skript gefahren hat.
 */

import type { SidecarState } from './sidecar';
import { SIDECAR_PORT } from './sidecar';
import { POLICY_PATH } from './policy';

/**
 * Die Ueberschrift des Panels.
 *
 * Sie hiess bis zum 2026-08-29 `LOCAL_MODEL`, waehrend der Menuepunkt `[l]lm`
 * hiess und der Statusleisten-Chip `llm`. Drei Namen fuer eine Sache, und der
 * Nutzer hat genau das gemeldet. Seit W7c heisst sie an allen drei Stellen
 * gleich: `LOCAL LLM` hier, `[l]ocal llm on/off` im Menue, `local llm` im Chip.
 * Der Unterstrich faellt mit weg; er war die Schreibweise einer Konstanten und
 * nicht die eines Namens, den jemand liest.
 */
export const LLM_TITLE = featureCopy.LOCAL_LLM_b56db5c;

/**
 * Der konkrete Aufruf, den das Panel im Zustand `not-running` nennt.
 *
 * Er hiess bis zum 2026-08-29 `llm/start.sh 1b`, und das war Befund 17 des
 * unabhaengigen Audits: der Sieger dieser Klasse ist Qwen3.5-2B, also ein
 * 2B-Modell, und eine Beschriftung, die es "1b" nennt, sagt dem Leser eine
 * Groesse, die die Datei nicht hat. Die Klasse haengt am Kontextfenster
 * (`modelClassOf`) und nicht an der Parameterzahl, also heisst die Wahl jetzt
 * nach der Klasse und die Groesse wird nirgends behauptet.
 */
export const LLM_START_COMMAND = featureCopy.llm_start_sh_class_a_3a4f673;

/** Der Gegenbefehl, damit die Anleitung nicht nur in eine Richtung geht. */
export const LLM_STOP_COMMAND = featureCopy.llm_stop_sh_2b7878d;

/** Die Modellwahlen, die das Startskript kennt. Wortgleich mit llm/start.sh. */
export const LLM_MODEL_CHOICES =
    'class-a | class-a-lfm | class-a-minicpm | class-a-coder | class-b | class-b-gemma';

/**
 * Was die zwei Klassen bedeuten, in einem Satz und mit echten Namen.
 *
 * Die Wahl heisst nach der Klasse, weil die Klasse das ist, was das Programm
 * unterscheidet. Ein Leser will trotzdem wissen, welche Datei `class-a` laedt,
 * und die Antwort darf nicht "ungefaehr 1B" lauten: sie lautet Qwen3.5-2B, mit
 * 3072 Token Kontext, und das ist nachpruefbar.
 */
export const LLM_CLASS_NOTE =
    'class-a is Qwen3.5-2B at 3072 tokens of context, class-b is gemma-4-E4B at 8192. '
    + 'The class is the context window, not a parameter count.';

/** Der Satz im Zustand `off`. Er sagt ausdruecklich, dass nichts gefragt wird. */
export const LLM_OFF_MESSAGE =
    featureCopy.off_Nothing_is_started_and_nothing_is_probed_while_this_is_off_th_a408e3c
    + featureCopy.sends_no_request_to_127_0_0_1_0_2a6ee0c(SIDECAR_PORT);

/** Was daruntersteht, damit der Schalter auffindbar ist. */
export const LLM_OFF_HINT =
    featureCopy.Turn_it_on_here_or_in_the_a_tlas_menu_Everything_else_on_this_sur_df624ff;

/** Der Satz im Zustand `not-running`: eine Anleitung, keine Fehlermeldung. */
export const LLM_NOT_RUNNING_MESSAGE =
    featureCopy.on_but_nothing_is_listening_on_127_0_0_1_0_This_page_has_no_backe_85e67a1(SIDECAR_PORT)
    + featureCopy.cannot_start_a_process_so_the_sidecar_is_started_from_a_shell_12a2751;

/** Die zweite Zeile derselben Anleitung. */
export const LLM_NOT_RUNNING_HINT =
    featureCopy.Other_models_0_1_Stop_it_again_with_2_868e227(LLM_MODEL_CHOICES, LLM_CLASS_NOTE, LLM_STOP_COMMAND);

/** Der Satz im Zustand `starting`. */
export const LLM_STARTING_MESSAGE =
    featureCopy.a_sidecar_on_127_0_0_1_0_answers_Loading_model_Waiting_for_it_to__46f5e82(SIDECAR_PORT);

/** Der Satz im Zustand `ready`, vor dem Modellnamen. */
export const LLM_READY_MESSAGE = featureCopy.ready_on_127_0_0_1_bdc2681 + String(SIDECAR_PORT) + '.';

/**
 * Der Satz im Zustand `disabled-by-policy`.
 *
 * Er nennt die Datei, und er nennt sie als Datei des indizierten Projekts. Ohne
 * diesen Zusatz suchte der Leser sie in diesem Repository, wo sie nicht liegt.
 */
export function llmPolicyMessage(project: string): string {
    const where = project.length > 0 ? featureCopy.of_the_indexed_project_0_4f6fb3a(project) : featureCopy.of_the_indexed_project_f2b5b80;
    return featureCopy.off_by_policy_The_committed_0_1_says_llm_deny_18312b7(POLICY_PATH, where)
        + featureCopy.and_a_committed_policy_beats_any_preference_of_this_browser_f4c502d;
}

/** Was unter dem Policy-Satz steht, wenn die Datei zwar da, aber unlesbar war. */
export function llmPolicyDetail(detail: string): string {
    return detail.length === 0
        ? ''
        : featureCopy.The_switch_stays_visible_and_stays_without_effect_Reason_0_b8771ab(detail);
}

/** Der Wert des Statusleisten-Chips zu einer Lage. Der Beweislauf liest ihn woertlich. */
export function llmChipValue(state: SidecarState, model: string): string {
    switch (state) {
        case 'off':
            return featureCopy.off_da7a687;
        case 'disabled-by-policy':
            return featureCopy.off_by_policy_b418f32;
        case 'not-running':
            return featureCopy.not_running_9acc891;
        case 'starting':
            return featureCopy.starting_9493af0;
        case 'ready':
            return model.length > 0 ? featureCopy.ready_0_f32bdd5(model) : featureCopy.ready_75c0533;
        default:
            return featureCopy.off_da7a687;
    }
}

/** Der `title` des Menuepunktes, je nach Lage. */
export function llmMenuTitle(state: SidecarState): string {
    if (state === 'disabled-by-policy') {
        return featureCopy.atlas_the_local_model_is_denied_by_the_project_s_0_the_switch_has_d9844d4(POLICY_PATH);
    }
    return state === 'off'
        ? featureCopy.atlas_turn_the_local_model_on_nothing_is_probed_while_it_is_off_b1a7465
        : featureCopy.atlas_turn_the_local_model_off_no_request_goes_to_the_sidecar_aft_38153a9;
}

/**
 * Das Etikett des Menuepunktes. Es traegt seinen Zustand, weil ein Extra keinen
 * hat, und seit dem 2026-08-29 auch seinen Buchstaben (Audit-Befund 12).
 *
 * Der Buchstabe steht vorn und der Zustand hinten, in beiden Lagen an derselben
 * Stelle: die zwei Etiketten sind eine Zeile, die sich nur an einem Wort
 * aendert, und ein Kuerzel, das mit der Lage die Stelle wechselte, waere ein
 * Kuerzel, das man beim Lesen suchen muss.
 *
 * Der Punkt heisst seit W7c `[l]ocal llm` und nicht mehr `[l]lm`
 * (Nutzerwunsch 2026-08-29): `llm` ist eine Abkuerzung, die nicht sagt, wo das
 * Modell laeuft, und genau das ist die Eigenschaft, um die es bei diesem
 * Schalter geht. Der Buchstabe bleibt `l`, also aendert sich kein Kuerzel und
 * keine Verdrahtung; es aendert sich, was danebensteht.
 */
export function llmMenuLabel(state: SidecarState): string {
    return state === 'off' || state === 'disabled-by-policy' ? featureCopy.l_ocal_llm_off_7064d6c : featureCopy.l_ocal_llm_on_e82fba5;
}
