import { featureLanguage } from '../i18n/feature-language';
import { featureCopy } from '../i18n/features/galaxy';
/**
 * Was in der Galaxie zu sehen ist, in Worten, die der Server deckt.
 *
 * Das Panel zeigt farbige Punkte in verschiedenen Groessen, helle und dunkle
 * Linien und eine Kamera, die irgendwohin fliegt. Ohne Legende ist jede dieser
 * vier Erscheinungen eine Einladung zum Raten, und Raten wird in einem
 * Verstehens-Werkzeug schnell zu einer Behauptung ("die grossen roten sind die
 * wichtigen"). Diese Datei sagt stattdessen, woher jede Erscheinung kommt.
 *
 * Drei Regeln, an die sich jeder Eintrag haelt:
 *
 * 1. **Nur, was der Server wirklich rechnet.** Knotenfarbe und -groesse kommen
 *    aus cbm/src/ui/layout3d.c: die Farbe ist `stellar_color(degree)`, eine
 *    Spektralklassen-Skala ueber den Knotengrad, die Groesse ist eine Basis je
 *    Label plus ein Zuschlag aus dem Grad. Diese Oberflaeche faerbt keinen
 *    Knoten selbst; sie malt, was im Layout steht.
 * 2. **Die Kantenfarben kommen aus der Tabelle, die sie malt.** Importiert aus
 *    graph/edge-style, wie EdgeLines.tsx. Gezeigt werden nur die Typen, die im
 *    geladenen Layout wirklich vorkommen: eine Legende mit zwanzig Kantenarten
 *    fuer einen Graphen mit dreien ist eine Legende fuer ein anderes Bild.
 *    Seit W9 steht neben jeder Art ihre Zahl, GEZAEHLT in der geladenen
 *    Antwort und nicht aus der Tabelle geraten, und die Liste ist absteigend
 *    sortiert: die haeufigste Beziehung dieses Projekts steht oben. Der Deckel,
 *    der die Liste frueher nach acht Arten abschnitt, ist damit weg. Er war
 *    gegen eine zu lange Legende gedacht, dagegen hilft seit W5c der eigene
 *    Bildlauf des Kastens, und seit W9 waere eine abgeschnittene Art eine, die
 *    man nicht mehr ausblenden kann.
 * 3. **Der Zustand des Kastens ueberlebt den Reload.** Wer die Legende
 *    zuklappt, hat eine Entscheidung getroffen, und sie beim naechsten Laden
 *    zu vergessen macht aus der Entscheidung eine Geste.
 * 4. **Jede Ansicht bekommt ihre eigenen Saetze.** Seit W4e zeigt dasselbe
 *    Panel zwei Bilder: die Galaxie und die Hierarchie des Vorwaerts-Walks. In
 *    der zweiten kommen die Positionen nicht vom Server, sondern sind die
 *    Aufruf-Tiefe. Es gibt darum zwei Saetze Eintraege und keine Formulierung,
 *    die fuer beide passen soll.
 * 5. **Die Kanten stehen oben, und die Saetze sind kurz.** Beides ist eine
 *    Korrektur aus dem Beweisbild von W9: die Legende ist 75 Pixel hoch, die
 *    zwoelf Arten dieses Fixtures brauchen davon vier Zeilen, und darunter
 *    standen frueher fuenf Absaetze Fliesstext. Wer die Legende oeffnete, sah
 *    darum als Erstes einen Satz ueber Knotenfarben und musste zu den Arten
 *    scrollen, die er anklicken wollte. Seit W9-1 steht der Kanten-Eintrag
 *    vorn: er ist der einzige, der auch ein Schalter ist, und er ist der, der
 *    zum Bild gehoert, das dieser Zyklus geaendert hat. Die Erklaersaetze sind
 *    dabei auf hoechstens drei Zeilen gekuerzt worden, ohne dass eine Aussage
 *    weggefallen ist: gestrichen wurde Wiederholung, nicht Inhalt.
 */

import { edgeColor } from '../graph/edge-style';
import { HIERARCHY_DEFAULT_COLOR } from './hierarchy-layout';
import type { GraphData } from './types';

/** Der Schluessel, unter dem der Klappzustand liegt. */
export const GALAXY_LEGEND_KEY = 'codeatlasweb.galaxy.legend';

/**
 * Ob die Legende ohne gespeicherte Antwort offen ist.
 *
 * Seit W5c: ZU. Bis dahin stand hier "offen", mit der Begruendung, ein Leser
 * solle die Erklaerung nicht suchen muessen. Die Begruendung stimmt und die
 * Folge war trotzdem falsch: in einem 440 Pixel breiten Panel nahm die
 * aufgeklappte Legende fast die Haelfte der Hoehe, und das Bild, das sie
 * erklaert, war der Rest (Nutzerfeedback 2026-08-29). Der Schalter steht
 * weiterhin sichtbar im Kopf, die Antwort merkt sich der Browser, und
 * aufgeklappt nimmt die Legende jetzt hoechstens einen kleinen Teil des Panels
 * und scrollt intern.
 */
export const GALAXY_LEGEND_DEFAULT_OPEN = false;

/** Ein farbiger Punkt in der Legende. */
export interface LegendSwatch {
    label: string;
    color: string;
    /** Wie oft diese Art im gezeigten Bild vorkommt. Fehlt, wo nichts zu zaehlen ist. */
    count?: number;
}

/** Ein erklaertes Element des Bildes. */
export interface LegendEntry {
    /** Stabiler Schluessel, auch als `data-entry` im DOM. */
    key: string;
    /** Woruber gesprochen wird. */
    title: string;
    /** Was es bedeutet, und woher es kommt. */
    detail: string;
    /** Farbige Punkte, wenn die Erklaerung welche hat. */
    swatches: LegendSwatch[];
    /**
     * Ob die Punkte dieses Eintrags Schalter sind (W9).
     *
     * Nur der Kanten-Eintrag traegt das: seine Punkte stehen fuer Arten, die
     * man aus dem Bild nehmen kann. Der graue Punkt der Hierarchie steht fuer
     * eine Abwesenheit ("zu diesem Symbol liegt keine Layout-Angabe vor"), und
     * eine Abwesenheit laesst sich nicht ausblenden.
     */
    filterable?: boolean;
}

/** Eine Kantenart des gezeigten Bildes, mit ihrer Zahl und ihrer Farbe. */
export interface EdgeKind {
    type: string;
    /** Wie viele Kanten dieser Art im gezeigten Bild stehen. */
    count: number;
    color: string;
}

/** Die Farbe eines Kantentyps, so wie EdgeLines sie malt. */
export function edgeColorFor(type: string): string {
    return edgeColor(type);
}

/**
 * Die Kantenarten des gezeigten Bildes, mit ihrer Zahl und ihrer Farbe,
 * absteigend nach Zahl.
 *
 * Gezaehlt wird die Antwort, die wirklich geladen wurde, und nicht die
 * Farbtabelle abgefragt: eine Art, die dieses Projekt nicht hat, gehoert nicht
 * in seine Legende, und eine Zahl daneben, die nicht aus den Daten kommt, waere
 * eine Schaetzung im Gewand einer Messung.
 *
 * Bei gleicher Zahl entscheidet der Name, ordinal verglichen. Zwei Maschinen
 * mit verschiedenen Sortierregeln sollen die Legende nicht anders anordnen; das
 * ist dieselbe Regel wie in der Hierarchie-Projektion.
 *
 * Kanten ohne Typ (die Antwort laesst das Feld weg) zaehlen nirgends mit: sie
 * unter einem erfundenen Namen zu fuehren waere eine Art, die es nicht gibt.
 */
export function edgeKinds(data: GraphData | undefined): EdgeKind[] {
    if (data === undefined) {
        return [];
    }
    const counts = new Map<string, number>();
    for (const edge of data.edges) {
        const type = typeof edge.type === 'string' ? edge.type : '';
        if (type.length === 0) {
            continue;
        }
        counts.set(type, (counts.get(type) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([type, count]) => ({ type, count, color: edgeColorFor(type) }))
        .sort((a, b) => (b.count - a.count) || compareText(a.type, b.type));
}

/** Ordinaler Vergleich, wie in hierarchy-layout.ts. Siehe {@link edgeKinds}. */
function compareText(a: string, b: string): number {
    if (a === b) {
        return 0;
    }
    return a < b ? -1 : 1;
}

/** Dieselben Arten als Punkte der Legende. */
export function edgeSwatches(data: GraphData | undefined): LegendSwatch[] {
    return edgeKinds(data).map((kind) => ({
        label: kind.type,
        color: kind.color,
        count: kind.count,
    }));
}

/**
 * Was im Kopf des Panels ueber die Kantenarten steht.
 *
 * Zwei Entscheidungen stecken in diesen wenigen Worten:
 *
 * 1. **Die Zahl der Arten steht immer da**, auch wenn nichts ausgeblendet ist.
 *    Sie ist die Einladung zur Legende ("es gibt hier zwoelf Arten"), und sie
 *    haelt die Zeile im Kopf am Leben: eine Zeile, die beim Ausblenden erst
 *    entsteht, macht das Panel in genau dem Moment hoeher, in dem der Leser
 *    sich das Bild ansieht, und verschiebt ihm die Szene unter dem Blick weg.
 *    (Dieselbe Verschiebung hat im Beweislauf die Pixelmessung zerlegt, bevor
 *    sie hier behoben wurde.)
 * 2. **Die ausgeblendeten kommen als Zahl UND als Ganzes**, damit "es fehlt
 *    etwas" nicht mit "es gibt nichts" verwechselt werden kann.
 *
 * Ohne eine einzige Art steht hier nichts: dann ist auch nichts zu sagen.
 */
export function edgeKindNote(total: number, hidden: number): string {
    if (total <= 0) {
        return '';
    }
    if (featureLanguage() === 'zh') return `${total} 种关系${hidden > 0 ? `，已隐藏 ${hidden} 种` : ''}`;
    const head = `${total} edge ${total === 1 ? 'kind' : 'kinds'}`;
    return hidden <= 0 ? head : `${head}, ${hidden} of ${total} hidden`;
}

/**
 * Dasselbe Bild ohne die ausgeblendeten Kantenarten.
 *
 * Die Knoten bleiben alle stehen, auch die, die danach keine Linie mehr
 * beruehrt. Sie aus dem Bild zu nehmen waere die zweite, viel groessere
 * Aussage: der Filter sagt "diese Art von Beziehung nicht", nicht "diese
 * Symbole gibt es nicht".
 *
 * Ist nichts ausgeblendet, kommt das Objekt selbst zurueck: eine Kopie waere
 * eine neue Identitaet bei jedem Bild und damit ein neuer Aufbau der
 * Szene-Puffer, ohne dass sich etwas geaendert haette.
 */
export function withoutEdgeKinds(data: GraphData, hidden: ReadonlySet<string>): GraphData {
    if (hidden.size === 0) {
        return data;
    }
    return { ...data, edges: data.edges.filter((edge) => !hidden.has(edge.type)) };
}

/**
 * Die Eintraege der Legende, passend zum geladenen Layout.
 *
 * Ohne Layout bleiben die Saetze stehen und die Punkte fehlen: die Herkunft von
 * Farbe, Groesse und Position ist unabhaengig davon, ob schon etwas geladen
 * ist, die konkreten Kantenarten sind es nicht.
 */
export function galaxyLegendEntries(data: GraphData | undefined): LegendEntry[] {
    const swatches = edgeSwatches(data);
    const edgeDetail =
        swatches.length === 0
            ? 'one colour per edge type, from the table that draws the lines. The types appear once a layout is loaded.'
            : 'one colour per edge type, from the table that draws the lines. Counted in this '
                + 'layout, most frequent first. A soft pulse follows known directed relations from source to target. '
                + 'Click a kind to take it out; it stays here, dimmed.';
    return [
        {
            key: 'edge-color',
            title: featureCopy.edge_colour_caba799,
            detail: edgeDetail,
            swatches,
            filterable: true,
        },
        {
            key: 'node-color',
            title: featureCopy.node_colour_afffb9c,
            detail:
                featureCopy.the_server_maps_a_symbol_degree_to_a_stellar_spectral_colour_layo_f377f6e,
            swatches: [],
        },
        {
            key: 'node-size',
            title: featureCopy.node_size_e3bf53e,
            detail:
                featureCopy.a_base_size_per_node_label_plus_a_boost_from_the_same_degree_both_a8a8d86,
            swatches: [],
        },
        {
            key: 'focus',
            title: featureCopy.focus_78918dc,
            detail:
                featureCopy.the_focused_symbol_and_its_direct_neighbours_stay_bright_everythi_6de3423,
            swatches: [],
        },
        {
            key: 'positions',
            title: featureCopy.positions_4c0bba0,
            detail:
                featureCopy.a_deterministic_layout_computed_by_the_server_not_by_this_browser_f54c4d1,
            swatches: [],
        },
        /*
         * Die Spur der Agenten (W11b AC2).
         *
         * Sie steht hier, weil die Legende die Stelle ist, an der ein Leser
         * nachsieht, was eine Linie bedeutet, und weil diese eine Linie GENAU
         * DAS NICHT bedeutet, was alle anderen bedeuten: sie kommt aus
         * Ereignissen und nicht aus dem Index. Der Eintrag steht auch dann da,
         * wenn der Live-Modus aus ist; eine Legende, die nur erklaert, was
         * gerade zu sehen ist, waere eine, in der man nicht nachschlagen kann.
         * Ein Farbpunkt gehoert nicht dazu: die Farbe der Spur ist die Farbe
         * ihres Akteurs, und die steht am Koerper.
         */
        {
            key: 'agent-trail',
            title: featureCopy.agent_trail_dashed_1aeab78,
            detail:
                featureCopy.a_dashed_line_behind_a_live_agent_is_the_path_it_walked_the_last__961635f,
            swatches: [],
        },
    ];
}

/**
 * Dieselben fuenf Elemente, erklaert fuer die Hierarchie-Ansicht.
 *
 * Ein eigener Satz und nicht derselbe: in der Projektion bedeuten zwei der
 * fuenf Erscheinungen etwas anderes. Die Position kommt nicht mehr vom Server,
 * sondern ist die Aufruf-Tiefe, und Farbe und Groesse gelten nur fuer die
 * Symbole, die im geladenen Layout ueberhaupt vorkommen. Die Legende weiter die
 * Galaxie-Saetze zeigen zu lassen waere die teuerste Sorte Legende: eine, die
 * das Bild daneben falsch erklaert.
 *
 * Die Schluessel sind dieselben wie in {@link galaxyLegendEntries}, damit ein
 * Leser die Zeile, die er sucht, an derselben Stelle findet.
 */
export function hierarchyLegendEntries(data: GraphData | undefined, fileRelationships = false,
    /* Die Hierarchie eines Galaxy-Ausschnitts (Handtest K5): keine Walk-Spalten, sondern Ebenen links und rechts der Wurzel. */
    scoped = false): LegendEntry[] {
    const swatches = edgeSwatches(data);
    return [
        {
            key: 'edge-color',
            title: featureCopy.edges_7283b98,
            /*
             * Drei Zeilen, und die Zahl ist gemessen: in der Hierarchie steht
             * ueber diesem Satz eine Zeile mit den Arten, und die Legende
             * fasst vier Zeilen. Was laenger ist, endet an der Kante des
             * Kastens, und genau das war der Befund an den Beweisbildern von
             * W9 (Bernhard, 2026-08-29). Gestrichen ist die Ausfuehrung, nicht
             * die Aussage: die Zyklen stehen weiter da, die uebrigen
             * Beziehungen auch, und der Griff zum Ausblenden steht am
             * Punkt selbst (`title`).
             */
            detail: scoped
                ? featureCopy.Every_relationship_of_this_scope_its_type_and_an_arrow_from_sourc_b42f4f9
                : fileRelationships
                ? featureCopy.Recorded_relationships_touching_the_selected_file_or_marked_code__f13a1ae
                : featureCopy.one_line_per_call_on_this_walk_cycles_included_rather_than_hidden_9e9858a,
            swatches,
            filterable: true,
        },
        {
            key: 'positions',
            title: featureCopy.positions_4c0bba0,
            detail: scoped
                ? featureCopy.Incoming_relationships_on_the_left_the_root_in_the_middle_outgoin_82ac745
                : fileRelationships
                ? featureCopy.Incoming_relationships_on_the_left_selected_definitions_in_the_mi_e84e3f1
                : featureCopy.columns_are_the_call_depth_from_the_entry_point_and_inside_a_colu_510ffed,
            swatches: [],
        },
        {
            key: 'node-color',
            title: featureCopy.node_colour_afffb9c,
            detail:
                featureCopy.taken_from_the_loaded_galaxy_layout_where_the_server_maps_a_symbo_51b5b98
                + featureCopy.carry_stays_neutral_grey_0_nothing_here_knows_its_degree_a50155b(HIERARCHY_DEFAULT_COLOR),
            swatches: [{ label: featureCopy.no_layout_entry_4f24227, color: HIERARCHY_DEFAULT_COLOR }],
        },
        {
            key: 'node-size',
            title: featureCopy.node_size_e3bf53e,
            detail:
                featureCopy.from_the_same_layout_entry_so_a_bigger_dot_means_more_edges_in_th_44b2643,
            swatches: [],
        },
        {
            key: 'focus',
            title: featureCopy.focus_78918dc,
            detail: fileRelationships
                ? featureCopy.Opening_a_file_shows_its_definitions_including_isolated_nodes_Mar_c333068
                : featureCopy.the_symbol_the_reader_stands_on_carries_a_ring_that_follows_every_fe4588c,
            swatches: [],
        },
        {
            key: 'agent-trail',
            title: featureCopy.agent_trail_dashed_1aeab78,
            detail:
                featureCopy.a_dashed_line_behind_a_live_agent_is_the_path_it_walked_drawn_und_7f020ff,
            swatches: [],
        },
    ];
}

/** Der gespeicherte Klappzustand. Ein unlesbarer Speicher entscheidet nichts. */
export function readLegendOpen(store: Storage | undefined): boolean {
    try {
        const raw = store?.getItem(GALAXY_LEGEND_KEY);
        if (raw === 'open') {
            return true;
        }
        if (raw === 'closed') {
            return false;
        }
    } catch {
        // Ein Speicher, der nicht antwortet (privates Fenster, gesperrte Domain),
        // ist kein Grund, die Legende zu verstecken.
    }
    return GALAXY_LEGEND_DEFAULT_OPEN;
}

/** Den Klappzustand merken. Schlaegt es fehl, bleibt es bei dieser Sitzung. */
export function writeLegendOpen(store: Storage | undefined, open: boolean): void {
    try {
        store?.setItem(GALAXY_LEGEND_KEY, open ? 'open' : 'closed');
    } catch {
        // siehe readLegendOpen
    }
}
