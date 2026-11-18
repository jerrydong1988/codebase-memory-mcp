import { featureCopy } from '../i18n/features/graph';
import { useEffect, useRef } from 'react';
import { edgeColor } from './edge-style';
import { useEdgeMotionPreference } from './edge-motion';
import './edge-style.css';

const KEY = [
    ['CALLS', 'Calls'], ['IMPORTS', 'Imports'], ['USAGE', 'Usage'], ['DATA_FLOWS', 'Data flow'],
    ['READS', 'Reads'], ['WRITES', 'Writes'],
    ['HTTP_CALLS', 'HTTP'], ['ASYNC_CALLS', 'Async'], ['INHERITS', 'Inheritance'], ['IMPLEMENTS', 'Implementation'],
    ['CONTAINS', 'Containment'], ['DEFINES', 'Definitions'], ['CONFIGURES', 'Configuration'], ['RAISES', 'Errors'],
    ['CALL_REFERENCE', 'Call references'], ['TESTS', 'Tests'],
    ['SIMILAR_TO', 'Similarity'], ['RELATIONSHIPS', 'Mixed / unknown'],
];

export default function GraphEdgeControls() {
    const { enabled, reduced, setEnabled } = useEdgeMotionPreference();
    const details = useRef<HTMLDetailsElement>(null);
    useEffect(() => {
        const close = (event: PointerEvent) => {
            if (details.current?.open && !details.current.contains(event.target as Node)) details.current.open = false;
        };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, []);
    return <details ref={details} className="graph-edge-controls" onKeyDown={event => {
        if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); }
    }}>
        <summary title={featureCopy.message_3D_graph_edge_colors_and_motion_08b9fc5}>{featureCopy.Edges_dffa33c}</summary>
        <div className="graph-edge-settings" role="group" aria-label={featureCopy.message_3D_edge_appearance_0d4c0e1}>
            <label><input type="checkbox" checked={enabled && !reduced} disabled={reduced} onChange={event => setEnabled(event.target.checked)} />{featureCopy.Direction_pulse_4a4c94a}</label>
            <p>{reduced ? featureCopy.Motion_is_paused_by_your_reduced_motion_setting_6befd45 : featureCopy.A_subtle_pulse_shows_relationship_direction_across_all_3D_graphs_6eacb00}</p>
            <ul className="graph-edge-key" aria-label={featureCopy.Edge_color_key_6685d11}>{KEY.map(([type, label]) => <li key={type} title={type}><i style={{ backgroundColor: edgeColor(type) }} />{label}</li>)}</ul>
        </div>
    </details>;
}
