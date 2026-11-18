import { featureCopy } from '../i18n/features/galaxy';
import type { EdgeKind } from './galaxy-legend';
import { FitLabel } from './toolbar-fit';

/** This changes which relationships traversal follows, not just their paint. */
export function TraceEdgeFilter({ kinds, availableTypes, selected, onChange }: {
    kinds: readonly EdgeKind[];
    /** Preserve relationships outside render limits when toggling a visible type. */
    availableTypes?: readonly string[];
    selected?: readonly string[];
    onChange: (types: string[] | undefined) => void;
}) {
    const included = new Set(selected ?? availableTypes ?? kinds.map(kind => kind.type));
    const includedCount = kinds.filter(kind => included.has(kind.type)).length;
    const shown = selected === undefined ? 'All' : includedCount === 0 ? 'None' : String(includedCount);
    return <details className="atlas-trace-edge-filter" onKeyDown={event => {
        if (event.key === 'Escape') {
            event.stopPropagation(); event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
        }
    }}>
        {/* Review of K3: a narrow scoped toolbar shows "Types · All" (src/galaxy/toolbar-fit.tsx). */}
        <summary><FitLabel wide={`Edge types · ${shown}`} narrow={`Types · ${shown}`} /></summary>
        <div className="atlas-trace-edge-menu" role="group" aria-label={featureCopy.Trace_edge_types_d0540ef}>
            <div className="atlas-trace-edge-actions">
                <button type="button" onClick={() => onChange(undefined)}>{featureCopy.All_types_30c8a0f}</button>
                <button type="button" onClick={() => onChange([])}>{featureCopy.No_types_42a471e}</button>
            </div>
            <small>{featureCopy.Rendered_edges_All_types_restores_hidden_types_40dc906}</small>
            {kinds.length === 0 && <small>{featureCopy.No_edges_in_this_view_d143895}</small>}
            {kinds.map(kind => <div className="atlas-trace-edge-row" key={kind.type}>
                <label><input type="checkbox" checked={included.has(kind.type)} onChange={() => {
                    const next = new Set(included);
                    if (!next.delete(kind.type)) next.add(kind.type);
                    onChange([...next].sort());
                }} /><i style={{ backgroundColor: kind.color }} aria-hidden="true" />{kind.type}</label>
                <span className="atlas-trace-edge-count" aria-label={featureCopy.message_0_rendered_1_edges_41d70fd(kind.count.toLocaleString(), kind.type)}>{kind.count.toLocaleString()}</span>
                <button type="button" aria-label={featureCopy.Only_0_dceb310(kind.type)} onClick={() => onChange([kind.type])}>{featureCopy.Only_8737f09}</button>
            </div>)}
        </div>
    </details>;
}
