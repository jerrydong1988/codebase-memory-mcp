import { useSettingsText } from './settings-strings';
import type { GraphDisplaySettings } from '../galaxy/density';
import { DEFAULT_GRAPH_DISPLAY } from '../galaxy/density';
import { useEdgeMotionPreference } from '../graph/edge-motion';
import { GALAXY_EDGE_LIMITS, GALAXY_NODE_LIMITS, useViewPreferences } from './view-preferences';

export interface BrowserConfigProps {
    project: string;
    display: GraphDisplaySettings;
    onDisplay: (display: GraphDisplaySettings) => void;
    onOpenBrowserModels: () => void;
    onOpenDisplay: () => void;
}

export default function BrowserConfig({ project, display, onDisplay, onOpenBrowserModels, onOpenDisplay }: BrowserConfigProps) {
    const text = useSettingsText();
    const { preferences, setPreferences, resetPreferences } = useViewPreferences(project);
    const motion = useEdgeMotionPreference();
    return <div className="cbm-config-browser">
        <section><h3>{text.graphRendering}</h3><p>{text.appliesBrowser(project || text.thisProject)}</p>
            <div className="cbm-config-control-grid">
                <label>{text.projection}<select value={display.projection} onChange={event => onDisplay({ ...display, projection: event.target.value as GraphDisplaySettings['projection'] })}><option value="spatial">3D</option><option value="flat">{text.plan}</option></select></label>
                <label>{text.edgeVisibility}<select value={display.edges} onChange={event => onDisplay({ ...display, edges: event.target.value as GraphDisplaySettings['edges'] })}><option value="full">{text.full}</option><option value="dim">{text.dim}</option><option value="off">{text.off}</option></select></label>
                <label>{text.frameLimit}<select value={display.frameCap} onChange={event => onDisplay({ ...display, frameCap: Number(event.target.value) })}><option value={0}>{text.uncapped}</option><option value={60}>60 FPS</option><option value={30}>30 FPS</option></select></label>
                <label>{text.labelRange}<select value={display.labelDistanceFactor} onChange={event => onDisplay({ ...display, labelDistanceFactor: Number(event.target.value) })}><option value={0}>{text.allDistances}</option><option value={2}>{text.nearby}</option><option value={1}>{text.close}</option></select></label>
                <label><input type="checkbox" checked={display.halos} onChange={event => onDisplay({ ...display, halos: event.target.checked })} />{" "}{text.nodeHalos}</label>
                <label><input type="checkbox" checked={display.bloom} onChange={event => onDisplay({ ...display, bloom: event.target.checked })} />{" "}{text.bloom}</label>
                <label><input type="checkbox" checked={motion.enabled} onChange={event => motion.setEnabled(event.target.checked)} />{" "}{text.animatedEdges}{" "}<small>{text.allProjects}{motion.reduced ? text.reducedMotion : ''}</small></label>
            </div>
            <button type="button" onClick={() => onDisplay({ ...DEFAULT_GRAPH_DISPLAY })}>{text.resetDisplay}</button>
        </section>
        <section><h3>{text.galaxy}</h3><p>{text.renderLimits}</p>
            <div className="cbm-config-control-grid">
                <label>{text.nodeLimit}<select value={preferences.galaxyNodes} onChange={event => setPreferences({ galaxyNodes: Number(event.target.value) })}>{GALAXY_NODE_LIMITS.map(value => <option key={value} value={value}>{value.toLocaleString()}</option>)}</select></label>
                <label>{text.edgeLimit}<select value={preferences.galaxyEdges} onChange={event => setPreferences({ galaxyEdges: Number(event.target.value) })}>{GALAXY_EDGE_LIMITS.map(value => <option key={value} value={value}>{value.toLocaleString()}</option>)}</select></label>
                <label><input type="checkbox" checked={preferences.coverageShadow} onChange={event => setPreferences({ coverageShadow: event.target.checked })} />{" "}{text.coverageShadow}</label>
            </div>
        </section>
        <section><h3>{text.architecture}</h3><div className="cbm-config-control-grid">
            <label>{text.brickHeight}<select value={preferences.brickHeight} onChange={event => setPreferences({ brickHeight: event.target.value as typeof preferences.brickHeight })}><option value="lines">{text.sourceSize}</option><option value="uniform">{text.uniform}</option></select></label>
            <label>{text.brickColor}<select value={preferences.brickColor} onChange={event => setPreferences({ brickColor: event.target.value as typeof preferences.brickColor })}><option value="language">{text.language}</option><option value="kind">{text.nodeKind}</option></select></label>
            <label>{text.files}<select value={preferences.fileVisibility} onChange={event => setPreferences({ fileVisibility: event.target.value as typeof preferences.fileVisibility })}><option value="all">{text.allFiles}</option><option value="connected">{text.connected}</option><option value="unconnected">{text.unconnected}</option></select></label>
            <label><input type="checkbox" checked={preferences.hotspotGravity} onChange={event => setPreferences({ hotspotGravity: event.target.checked })} />{" "}{text.hotspotGravity}</label>
        </div><button type="button" onClick={resetPreferences}>{text.resetGraph}</button></section>
        <section><h3>{text.localAgent}</h3><p>{text.modelDescription}</p><button type="button" onClick={onOpenBrowserModels}>{text.configureAgent}</button></section>
        <section><h3>{text.displayDetails}</h3><p>{text.displayDescription}</p><button type="button" onClick={onOpenDisplay}>{text.moreControls}</button></section>
    </div>;
}
