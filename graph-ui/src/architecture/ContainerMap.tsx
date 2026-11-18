import { featureCopy } from '../i18n/features/architecture';
import { Component, useEffect, useMemo, useState, type ReactNode } from 'react';
import { RpcIntelligenceClient } from '../provider/rpc-client';
import type { ProjectEntry } from '../provider/rpc-schemas';
import { ArchitectureScene } from './ArchitectureScene';
import { layoutContainers } from './container-layout';
import { loadContainerInventory, loadContainerTopology, type ContainerReading, type ContainerSelection } from './container-source';
import type { ServiceEvidence } from './container-topology';
import { useSelectionEvidence, type SelectionEvidenceListener } from '../galaxy/selection-evidence';
import { architectureText as text } from './strings';
import { RefreshControl, useRefreshFeedback } from '../ui/refresh/refresh-feedback';
import './spatial-architecture.css';
import './container-map.css';

interface Props {
    project: string; generation?: string; active: boolean; filter: string; onNavigate: (path: string, line?: number) => void; onClearSelection?: () => void; onSelectionEvidence?: SelectionEvidenceListener;
    /** Leads from a project without deployment files to the routes it does have. */
    onShowEndpoints?: () => void;
    navigation?: ReactNode;
}
/** Reading the deployment inventory: a project without Compose files is an answer, not a failure. */
type Discovery = keyof typeof text.serviceMap | undefined;
class ContainerSceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? <p className="spatial-unavailable">{featureCopy.message_3D_is_unavailable_Use_the_service_and_connection_lists_to_inspect_0d1de57}</p> : this.props.children; }
}
const evidenceLabel = (kind: string) => kind === 'startup' ? 'Startup dependency' : kind === 'configuration' ? 'Configured destination' : 'Call found in source';
const relativeSource = (absolute: string, selection: ContainerSelection) => {
    const prefix = selection.inventory.rootPath.replaceAll('\\', '/').replace(/\/$/, '') + '/';
    return absolute.startsWith(prefix) ? absolute.slice(prefix.length) : undefined;
};

export default function ContainerMap({ project, generation, active, filter, onNavigate, onClearSelection, onSelectionEvidence, onShowEndpoints, navigation }: Props) {
    const [available, setAvailable] = useState<ProjectEntry[]>([]);
    const [selections, setSelections] = useState<ContainerSelection[]>([]);
    const [discovery, setDiscovery] = useState<Discovery>('reading');
    /** The `discoveryRevision` the current `discovery` answers, so a refresh can tell its own answer from the earlier one. */
    const [discovered, setDiscovered] = useState<number>();
    const [reading, setReading] = useState<{ key: string; result?: ContainerReading; error?: string }>();
    const [revision, setRevision] = useState(0);
    const [discoveryRevision, setDiscoveryRevision] = useState(0);
    const [startup, setStartup] = useState(false);
    const [configured, setConfigured] = useState(true);
    const [planar, setPlanar] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [selected, setSelected] = useState<{ key: string; node?: string; edge?: string }>();
    const [focus, setFocus] = useState<string>();
    const [adding, setAdding] = useState(false);
    const [source, setSource] = useState<{ key: string; evidence: ServiceEvidence; text?: string; error?: string }>();
    const [memberLimit, setMemberLimit] = useState(12);
    useEffect(() => {
        if (!active) return;
        const controller = new AbortController(), client = new RpcIntelligenceClient({ signal: controller.signal });
        setDiscovery('reading');
        void client.listProjects().then(async response => {
            const projects = response.projects;
            const current = projects.find(entry => entry.name === project);
            if (!current) throw new Error(featureCopy.Project_is_no_longer_indexed_a377bb6);
            const inventory = await loadContainerInventory(current, client);
            if (controller.signal.aborted) return;
            setAvailable(projects); setSelections([{ inventory, manifest: inventory.manifests[0] ?? '' }]);
            setDiscovery(inventory.manifests.length ? undefined : 'none'); setDiscovered(discoveryRevision);
        }).catch(() => { if (!controller.signal.aborted) { setDiscovery('failed'); setDiscovered(discoveryRevision); } });
        return () => controller.abort();
    }, [project, active, generation, discoveryRevision]);
    const selectionKey = JSON.stringify(selections.map(item => [item.inventory.project, item.manifest]));
    const key = `${project}:${generation ?? ''}:${selectionKey}:${revision}`;
    // Settled once the inventory answered this revision and, when a Compose file is chosen, its services were read.
    const readsTopology = selections.some(item => item.manifest);
    const topologyReading = reading?.key === key ? reading : undefined;
    const shownTopology = topologyReading?.result?.topology;
    const shown = useMemo(() => [discovery, shownTopology], [discovery, shownTopology]);
    const refresh = useRefreshFeedback({ key: `${key}:${discoveryRevision}`,
        settled: discovered === discoveryRevision && discovery !== 'reading' && (!readsTopology || Boolean(topologyReading?.result || topologyReading?.error)),
        value: shown,
        error: discovery === 'failed' ? text.serviceMap.failed : topologyReading?.error });
    useEffect(() => {
        if (!active || !selections.length || selections[0].inventory.project !== project || !selections.some(item => item.manifest)) return;
        const controller = new AbortController(), client = new RpcIntelligenceClient({ signal: controller.signal });
        setReading({ key }); setFocus(undefined); setSource(undefined);
        void loadContainerTopology(selections, client, controller.signal).then(result => {
            if (!controller.signal.aborted) setReading({ key, result });
        }).catch(() => { if (!controller.signal.aborted) setReading({ key, error: 'Could not complete service inspection. Refresh to try again.' }); });
        return () => controller.abort();
    }, [active, project, key, selections]);
    const result = reading?.key === key ? reading.result : undefined;
    const topology = result?.topology;
    const layout = useMemo(() => topology ? layoutContainers(topology) : undefined, [topology]);
    const selectedService = selected?.key === key ? topology?.services.find(service => service.id === selected.node) : undefined;
    const selectedEdge = selected?.key === key ? topology?.connections.find(edge => edge.id === selected.edge) : undefined;
    const shownEdges = useMemo(() => topology?.connections.filter(edge => (startup || edge.kind !== 'startup') && (configured || edge.kind !== 'configuration')) ?? [], [topology, startup, configured]);
    const graph = useMemo(() => {
        if (!layout || !topology) return undefined;
        const connected = new Set<string>(focus ? [focus] : []);
        if (focus) shownEdges.forEach(edge => { if (edge.source === focus || edge.target === focus) { connected.add(edge.source); connected.add(edge.target); } });
        const query = filter.trim().toLowerCase();
        const ids = new Set(topology.services.filter(service => (!focus || connected.has(service.id))
            && (!query || `${service.name} ${service.project} ${service.image ?? ''}`.toLowerCase().includes(query))).map(service => service.id));
        const edges = new Set(shownEdges.filter(edge => ids.has(edge.source) && ids.has(edge.target)).map(edge => edge.id));
        return { ...layout.graph, scopeKey: `${layout.graph.scopeKey}:${focus ?? ''}`,
            nodes: layout.graph.nodes.filter(node => ids.has(node.id)), edges: layout.graph.edges.filter(edge => edges.has(edge.id)),
            omittedNodes: layout.graph.nodes.length - ids.size, omittedEdges: layout.graph.edges.length - edges.size };
    }, [layout, topology, filter, focus, shownEdges]);
    const servicesById = useMemo(() => new Map(topology?.services.map(service => [service.id, service]) ?? []), [topology]);
    const clearSelection = () => { setSelected(undefined); setFocus(undefined); setSource(undefined); setResetKey(value => value + 1); onClearSelection?.(); };
    const selectService = (id: string) => { setSelected({ key, node: id }); setMemberLimit(12); setSource(undefined); };
    const inspect = (evidence: ServiceEvidence) => {
        if (evidence.project === project) { onNavigate(evidence.path, evidence.line); return; }
        setSource({ key, evidence });
    };
    const sourceEvidence = source?.key === key ? source.evidence : undefined;
    useEffect(() => {
        if (!sourceEvidence) return;
        const inventory = selections.find(selection => selection.inventory.project === sourceEvidence.project)?.inventory;
        const qn = inventory?.files.get(sourceEvidence.path);
        if (!qn) { setSource({ key, evidence: sourceEvidence, error: 'This source location is not in the selected project inventory.' }); return; }
        const controller = new AbortController(), client = new RpcIntelligenceClient({ signal: controller.signal });
        void client.getCodeSnippet(sourceEvidence.project, qn, { startLine: Math.max(1, sourceEvidence.line - 2), maxLines: 12 }).then(snippet => {
            if (!controller.signal.aborted) setSource({ key, evidence: sourceEvidence, text: snippet.source });
        }).catch(() => { if (!controller.signal.aborted) setSource({ key, evidence: sourceEvidence, error: 'Source evidence is unavailable.' }); });
        return () => controller.abort();
    }, [sourceEvidence, key, selections]);
    const addProject = async (name: string) => {
        const entry = available.find(item => item.name === name);
        if (!entry || adding || selections.length >= 4) return;
        setAdding(true);
        try {
            const inventory = await loadContainerInventory(entry, new RpcIntelligenceClient());
            setSelections(current => current.some(item => item.inventory.project === name) ? current : [...current, { inventory, manifest: inventory.manifests[0] ?? '' }]);
        } catch { setDiscovery('compareFailed'); }
        finally { setAdding(false); }
    };
    const evidenceButton = (evidence: ServiceEvidence, index: number) => <button key={`${evidence.project}:${evidence.path}:${evidence.line}:${index}`} onClick={() => inspect(evidence)}>
        {evidence.summary}<small>{evidence.project} / {evidence.path}:{evidence.line}</small></button>;
    const incident = selectedService ? shownEdges.filter(edge => edge.source === selectedService.id || edge.target === selectedService.id) : [];
    const warnings = [...new Set([...(topology?.warnings ?? []), ...(result?.warnings ?? [])])];
    useSelectionEvidence(onSelectionEvidence, selectedService || selectedEdge ? {
        project, generation, view: 'architecture-services', source: 'selected indexed Compose manifests and bounded source inspection',
        label: selectedService?.name ?? `${servicesById.get(selectedEdge!.source)?.name} → ${servicesById.get(selectedEdge!.target)?.name}`,
        selected: { service: selectedService, connection: selectedEdge,
            ...(selectedEdge ? { sourceService: servicesById.get(selectedEdge.source), targetService: servicesById.get(selectedEdge.target) } : {}),
            currentSource: source?.key === key ? { location: source.evidence, text: source.text, error: source.error,
                provenance: 'Current local source; may differ from the indexed snapshot.' } : undefined },
        relationships: selectedService ? { count: incident.length, items: incident } : undefined,
        scope: { manifests: selections.map(item => ({ project: item.inventory.project, manifest: item.manifest })), startupDependencies: startup, configuredDestinations: configured },
        limitations: { warnings, unresolvedDestinations: topology?.unresolved.length, omittedNodes: graph?.omittedNodes, omittedEdges: graph?.omittedEdges,
            interpretation: 'Static declarations, not live containers. Startup dependencies are not calls. Configured destinations do not prove execution; source ownership is inferred from build inputs.' },
    } : undefined, active);
    return <section className="spatial-architecture container-map" aria-label={featureCopy.Container_service_map_0117288}>
        <header className="spatial-heading"><div><span className="spatial-eyebrow">{featureCopy.Routes_Services_dc78ea9}</span><h2>{featureCopy.How_the_services_connect_e1cacee}</h2>
            <p>{featureCopy.One_square_per_declared_service_Follow_a_connection_to_see_the_co_e63af2c}</p></div>
            <div className="spatial-camera-controls"><button aria-pressed={!planar} onClick={() => setPlanar(false)}>3D</button><button aria-pressed={planar} onClick={() => setPlanar(true)}>{featureCopy.Plan_ae2f98a}</button>
                <button onClick={() => setResetKey(value => value + 1)}>{text.fitMap}</button><RefreshControl labels={text.refreshFeedback.services} feedback={refresh.feedback} onRefresh={() => {
                    refresh.begin();
                    setRevision(value => value + 1);
                    if (!selections.length || !selections[0].inventory.manifests.length) setDiscoveryRevision(value => value + 1);
                }} /></div></header>
        <div className="container-projects" aria-label={featureCopy.Deployment_sources_1f1cca7}>{selections.map((selection, index) => <label key={selection.inventory.project}><span>{selection.inventory.project}</span>
            <select aria-label={featureCopy.Compose_file_for_0_585eefe(selection.inventory.project)} value={selection.manifest} onChange={event => setSelections(current => current.map((item, i) => i === index ? { ...item, manifest: event.target.value } : item))}>
                <option value="">{featureCopy.Source_only_d5790ee}</option>{selection.inventory.manifests.map(path => <option key={path}>{path}</option>)}</select>
            {index > 0 && <button aria-label={featureCopy.Remove_0_c9318bc(selection.inventory.project)} onClick={() => setSelections(current => current.filter((_, i) => i !== index))}>×</button>}</label>)}
            {selections.length < 4 && <select aria-label={featureCopy.Compare_indexed_project_577c0c7} value="" disabled={adding} onChange={event => { void addProject(event.target.value); }}><option value="">{adding ? featureCopy.Reading_project_68617b1 : featureCopy.Compare_project_3badb20}</option>
                {available.filter(entry => !selections.some(selection => selection.inventory.project === entry.name)).map(entry => <option key={entry.name} value={entry.name}>{entry.name}</option>)}</select>}</div>
        <div className="spatial-controls"><div className="atlas-arch-context">{navigation}<nav aria-label={featureCopy.Service_navigation_390ce37}><button onClick={clearSelection}>{featureCopy.All_services_53840e9}</button>{focus && <span> / {servicesById.get(focus)?.name}{featureCopy.and_neighbors_0f1d780}</span>}</nav></div>
            <div className="container-edge-key"><span><i className="container-call-key" />{featureCopy.Calls_0a19b7e}</span><label><input type="checkbox" checked={configured} onChange={event => setConfigured(event.target.checked)} />{featureCopy.Configured_destinations_743cbd3}</label>
                <label><input type="checkbox" checked={startup} onChange={event => setStartup(event.target.checked)} />{featureCopy.Startup_dependencies_6b86ba1}</label></div></div>
        {discovery && <div role="status" className="spatial-notice container-discovery" data-discovery={discovery}><p>{text.serviceMap[discovery]}</p>
            {discovery === 'none' && onShowEndpoints && <button className="spatial-primary" onClick={onShowEndpoints}>{text.showEndpoints}</button>}</div>}
        {!discovery && selections.length > 0 && !selections.some(selection => selection.manifest) && <p className="spatial-notice">{featureCopy.Select_a_Compose_file_to_show_its_declared_services_df03ef8}</p>}
        {reading?.key === key && !result && <p role="status" className="spatial-notice">{reading.error ?? featureCopy.Reading_deployment_definitions_and_bounded_source_evidence_4e8756a}</p>}
        {graph && topology && <><div className="spatial-map-layout"><div className="spatial-map">
            {graph.nodes.length ? <ContainerSceneBoundary key={key}><ArchitectureScene model={graph} active={active} planar={planar} resetKey={resetKey} adaptiveLabels={graph.nodes.length > 16}
                selectedId={selectedService?.id} selectedEdgeId={selectedEdge?.id} onSelect={selectService} onSelectEdge={id => { setSelected({ key, edge: id }); setSource(undefined); }}
                onClearSelection={clearSelection} onOpen={id => { selectService(id); setFocus(id); }} /></ContainerSceneBoundary> : <p className="spatial-unavailable">{featureCopy.No_matching_service_declarations_in_the_selected_files_c2a6b44}</p>}
            <div className="spatial-map-caption"><span>{featureCopy.Static_declarations_not_live_containers_96e2707}</span><span>{featureCopy.Double_click_a_square_to_focus_select_an_arrow_for_evidence_368bf7c}</span></div></div>
            <aside className="spatial-inspector" aria-label={featureCopy.Service_inspector_ab4b28a}>
                {selectedService ? <><span className="spatial-eyebrow">{featureCopy.Declared_service_95d770a}</span><h3>{selectedService.name}</h3><p className="spatial-muted">{selectedService.project}</p>
                    <button className="spatial-primary" onClick={() => setFocus(selectedService.id)}>{featureCopy.Focus_service_a9b127b}</button>
                    <button onClick={() => inspect({ project: selectedService.project, path: selectedService.manifest, line: selectedService.line, summary: featureCopy.Service_declaration_5490e5a })}>{featureCopy.Open_declaration_ef6a0ad}</button>
                    <dl className="container-facts"><dt>{featureCopy.Image_50e19fd}</dt><dd>{selectedService.image ?? featureCopy.Built_locally_c1c5d3c}</dd><dt>{featureCopy.Networks_e931cb5}</dt><dd>{selectedService.networks.map(network => network.split(':').at(-1)).join(', ') || featureCopy.No_resolved_network_f11b80a}</dd>
                        <dt>{featureCopy.Ports_16c2eb4}</dt><dd>{selectedService.ports.join(', ') || featureCopy.Not_declared_c5d7de5}</dd>{Boolean(selectedService.profiles?.length) && <><dt>{featureCopy.Profiles_0c2a930}</dt><dd>{selectedService.profiles!.join(', ')}{featureCopy.optional_cc946d4}</dd></>}
                        <dt>{featureCopy.Source_6da13ad}</dt><dd>{selectedService.sourcePaths.length ? featureCopy.message_0_candidate_files_b1d4297(selectedService.sourcePaths.length) : featureCopy.Image_only_or_unresolved_ownership_3ccdf0d}</dd></dl>
                    <div className="spatial-members"><h4>{featureCopy.Connections_8f3509b}</h4>{incident.length ? incident.map(edge => <button key={edge.id} onClick={() => setSelected({ key, edge: edge.id })}>{servicesById.get(edge.source)?.name} → {servicesById.get(edge.target)?.name}<small>{evidenceLabel(edge.kind)} · {edge.protocol}</small></button>) : <p>{featureCopy.No_detected_connections_with_the_current_filters_1d52a68}</p>}
                        <h4>{featureCopy.Source_files_e660d20}</h4>{selectedService.sourcePaths.slice(0, memberLimit).map(absolute => {
                            const owner = selections.find(selection => { const path = relativeSource(absolute, selection); return path !== undefined && selection.inventory.files.has(path); });
                            const path = owner && relativeSource(absolute, owner);
                            return path && owner ? <button key={absolute} onClick={() => inspect({ project: owner.inventory.project, path, line: 1, summary: featureCopy.Candidate_source_file_9fc75e6 })}>{path}<small>{owner.inventory.project}</small></button> : <span key={absolute}>{absolute}</span>;
                        })}{selectedService.sourcePaths.length > memberLimit && <button onClick={() => setMemberLimit(value => value + 24)}>{featureCopy.Show_more_files_9044aec}</button>}</div></>
                    : selectedEdge ? <><span className="spatial-eyebrow">{evidenceLabel(selectedEdge.kind)}</span><h3>{servicesById.get(selectedEdge.source)?.name} → {servicesById.get(selectedEdge.target)?.name}</h3><p>{selectedEdge.protocol}</p>
                        <p className="spatial-muted">{selectedEdge.kind === 'startup' ? featureCopy.The_deployment_declares_a_startup_dependency_This_does_not_establ_90c5997 : selectedEdge.kind === 'configuration' ? featureCopy.Configuration_names_this_destination_An_executed_call_has_not_bee_4c90465 : featureCopy.Static_source_identifies_this_destination_The_arrow_shows_the_cal_5e9d153}</p>
                        <div className="spatial-members">{selectedEdge.evidence.map(evidenceButton)}</div></>
                        : <><span className="spatial-eyebrow">{featureCopy.Service_map_a2e9a24}</span><h3>{topology.services.length}{featureCopy.declared_services_8d7c6da}</h3><p>{featureCopy.Select_a_service_or_connection_to_inspect_its_source_Double_click_8d16b0c}</p></>}
                {source?.key === key && <div className="container-source"><h4>{source.evidence.project} / {source.evidence.path}:{source.evidence.line}</h4><button onClick={() => setSource(undefined)}>{featureCopy.Close_source_f5b6349}</button><pre>{source.error ?? source.text ?? 'Reading source…'}</pre></div>}
            </aside></div>
            <div className="spatial-bottom"><span>{graph.nodes.length} / {topology.services.length}{featureCopy.services_85a8e8b}{graph.edges.length}{featureCopy.connections_shown_e91022a}</span>{!!topology.unresolved.length && <span>{topology.unresolved.length}{featureCopy.unresolved_destinations_59ba2c9}</span>}</div>
            <details className="spatial-map-details"><summary>{featureCopy.Browse_services_and_connection_evidence_7a09c34}</summary>
            <div className="container-service-list" aria-label={featureCopy.All_declared_services_bd4a671}>{topology.services.map(service => <button key={service.id} aria-pressed={selectedService?.id === service.id} onClick={() => selectService(service.id)} onDoubleClick={() => { selectService(service.id); setFocus(service.id); }}>{service.name}<small>{service.project}{service.profiles?.length ? featureCopy.optional_cc946d4 : ''}</small></button>)}</div>
            {!!layout?.cycles.length && <details className="spatial-coverage"><summary>{featureCopy.Dependency_cycles_1536c8a}{layout.cycles.length}</summary>{layout.cycles.map(cycle => <p key={cycle.join('|')}>{cycle.map(id => servicesById.get(id)?.name).join(' ↔ ')}{featureCopy.mutually_reachable_through_detected_calls_or_configured_destinati_53b661d}</p>)}</details>}
            <details className="spatial-relationship-list"><summary>{featureCopy.All_connections_234f953}{shownEdges.length}</summary><div>{shownEdges.map(edge => <button key={edge.id} onClick={() => setSelected({ key, edge: edge.id })}>{servicesById.get(edge.source)?.name} → {servicesById.get(edge.target)?.name}<small>{evidenceLabel(edge.kind)} · {edge.protocol}</small></button>)}</div></details>
            {!!topology.unresolved.length && <details className="spatial-coverage"><summary>{featureCopy.Unresolved_destinations_2ddb9ab}{topology.unresolved.length}</summary><div className="spatial-members">{topology.unresolved.map(evidenceButton)}</div></details>}
            </details>
        </>}
        <details className="spatial-coverage"><summary>{featureCopy.Coverage_and_interpretation_17362cf}{warnings.length ? featureCopy.message_0_notes_50dd846(warnings.length) : ''}</summary><p>{featureCopy.One_selected_Compose_file_per_project_Overrides_includes_host_env_537fb11}</p>
            {warnings.map(warning => <p key={warning}>{warning}</p>)}</details>
    </section>;
}
