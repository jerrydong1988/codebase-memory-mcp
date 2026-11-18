import { featureCopy } from '../i18n/features/projects';
import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import type { ProjectEntry } from '../provider/rpc-schemas';
import type { ProjectsSource } from './ProjectsPanel';
import { childPath, projectNameFor } from './projects-model';
import type { BrowseLevel } from './projects-model';
import './add-project-index.css';

export interface AddProjectIndexActivity {
    name: string;
    status: 'indexing' | 'done' | 'error';
}
export interface AddProjectIndexDialogProps {
    open: boolean;
    source: Pick<ProjectsSource, 'browse' | 'startIndex' | 'indexJobs' | 'listProjects' | 'projectHealth'>;
    onClose: () => void;
    onOpenProject: (name: string) => void;
    onActivityChange?: (activity: AddProjectIndexActivity | undefined) => void;
    pollMs?: number;
}
interface TrackedIndex extends AddProjectIndexActivity {
    id: number;
    slot: number;
    path: string;
    phase: 'running' | 'verifying' | 'unavailable' | 'lost' | 'finished' | 'failed';
    message: string;
}

function comparablePath(path: string): string {
    const normal = path.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    return /^[A-Za-z]:/.test(normal) || normal.startsWith('//') ? normal.toLowerCase() : normal;
}
function samePath(left: string | undefined, right: string): boolean {
    return !!left && comparablePath(left) === comparablePath(right);
}
/** Mirror portable name mapping, using the existing basename suggestion. */
function normalizedName(name: string): string {
    let result = '';
    for (const byte of new TextEncoder().encode(name)) {
        const character = String.fromCharCode(byte);
        result += /[A-Za-z0-9._-]/.test(character) ? character : byte >= 128 ? byte.toString(16).padStart(2, '0') : '-';
    }
    return result.replace(/-+/g, '-').replace(/\.+/g, '.').replace(/^[-.]+/, '').replace(/-+$/, '') || 'root';
}
function validName(name: string): boolean {
    return name.length > 0 && name.length <= 200 && /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(name)
        && !name.includes('..') && normalizedName(name) === name;
}
const nameHint = 'Use up to 200 letters, numbers, underscores, dots or single dashes. No spaces or leading dots.';

export default function AddProjectIndexDialog({ open, source, onClose, onOpenProject, onActivityChange, pollMs = 1500 }: AddProjectIndexDialogProps): JSX.Element | null {
    const [step, setStep] = useState<'browse' | 'confirm' | 'progress'>('browse');
    const [level, setLevel] = useState<BrowseLevel>();
    const [pathInput, setPathInput] = useState('');
    const [browsing, setBrowsing] = useState(false);
    const [browseError, setBrowseError] = useState('');
    const [entries, setEntries] = useState<ProjectEntry[]>([]);
    const [listStatus, setListStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [selectedPath, setSelectedPath] = useState('');
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [job, setJob] = useState<TrackedIndex>();
    const [readingStatus, setReadingStatus] = useState(false);
    const alive = useRef(true);
    const browseTicket = useRef(0);
    const listTicket = useRef(0);
    const submitPending = useRef(false);
    const pollPending = useRef(false);
    const nextJob = useRef(0);
    const jobRef = useRef<TrackedIndex | undefined>(undefined);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const pollRef = useRef<() => Promise<void>>(async () => {});
    const activityCallback = useRef(onActivityChange);
    activityCallback.current = onActivityChange;
    const panel = useRef<HTMLElement>(null);
    const pathField = useRef<HTMLInputElement>(null);
    const nameField = useRef<HTMLInputElement>(null);
    const opener = useRef<HTMLElement | null>(null);
    const closeCallback = useRef(onClose);
    closeCallback.current = onClose;

    const updateJob = (next: TrackedIndex | undefined): void => { jobRef.current = next; setJob(next); };
    useEffect(() => {
        alive.current = true;
        return () => { alive.current = false; browseTicket.current += 1; listTicket.current += 1; clearTimeout(timer.current); };
    }, []);
    useEffect(() => {
        activityCallback.current?.(job ? { name: job.name, status: job.phase === 'unavailable' ? 'error' : job.status } : undefined);
    }, [job?.name, job?.status, job?.phase]);

    const browse = async (path: string): Promise<void> => {
        const ticket = ++browseTicket.current;
        setBrowsing(true); setBrowseError(''); setPathInput(path);
        try {
            const next = await source.browse(path);
            if (!alive.current || ticket !== browseTicket.current) return;
            setLevel(next); setPathInput(previous => previous === path ? next.path : previous);
        } catch {
            if (alive.current && ticket === browseTicket.current) setBrowseError(featureCopy.Could_not_open_this_folder_Check_the_path_and_try_again_9a5b8d2);
        } finally {
            if (alive.current && ticket === browseTicket.current) setBrowsing(false);
        }
    };
    const loadProjects = async (): Promise<void> => {
        const ticket = ++listTicket.current;
        setListStatus('loading');
        try {
            const projects = await source.listProjects();
            if (alive.current && ticket === listTicket.current) { setEntries(projects); setListStatus('ready'); }
        } catch { if (alive.current && ticket === listTicket.current) setListStatus('error'); }
    };
    useEffect(() => {
        if (!open) return;
        if (!level && !jobRef.current) void browse('');
        if (!jobRef.current) void loadProjects();
        // Reopening retains the folder/form and a job already being tracked.
    }, [open, source]);

    useEffect(() => {
        if (!open) return;
        opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        (pathField.current ?? panel.current)?.focus();
        const keys = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeCallback.current(); return; }
            if (event.key !== 'Tab') return;
            const controls = [...(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') ?? [])];
            const first = controls[0], last = controls[controls.length - 1];
            if (!first) { event.preventDefault(); panel.current?.focus(); return; }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && (document.activeElement === last || !panel.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
        };
        window.addEventListener('keydown', keys, true);
        return () => { window.removeEventListener('keydown', keys, true); if (opener.current?.isConnected) opener.current.focus(); };
    }, [open]);
    useEffect(() => {
        if (open) (step === 'confirm' ? nameField.current : step === 'browse' ? pathField.current : panel.current)?.focus();
    }, [open, step]);

    const poll = async (): Promise<void> => {
        const tracked = jobRef.current;
        if (!tracked || !Number.isInteger(tracked.slot) || tracked.slot < 0 || pollPending.current || tracked.status === 'done' || tracked.phase === 'failed') return;
        clearTimeout(timer.current);
        pollPending.current = true; setReadingStatus(true);
        const current = () => alive.current && jobRef.current?.id === tracked.id;
        try {
            const jobs = await source.indexJobs();
            if (!current()) return;
            const found = jobs.find(candidate => candidate.slot === tracked.slot);
            if (!found || !samePath(found.path, tracked.path) || found.status === 'unknown') {
                updateJob({ ...tracked, status: 'error', phase: 'lost', message: featureCopy.This_job_is_no_longer_identifiable_in_the_server_status_Completio_f3d59e9 });
                return;
            }
            if (found.status === 'error') {
                updateJob({ ...tracked, status: 'error', phase: 'failed', message: found.error || featureCopy.The_server_reported_an_indexing_failure_e5825f6 });
                return;
            }
            if (found.status === 'indexing') {
                updateJob({ ...tracked, status: 'indexing', phase: 'running', message: featureCopy.Indexing_source_and_relationships_17665af });
                return;
            }
            updateJob({ ...tracked, status: 'indexing', phase: 'verifying', message: featureCopy.Indexing_finished_Checking_the_project_7a6f3ce });
            const [projects, health] = await Promise.all([source.listProjects(), source.projectHealth(tracked.name)]);
            if (!current()) return;
            const project = projects.find(candidate => candidate.name === tracked.name);
            setEntries(projects); setListStatus('ready');
            if (project && samePath(project.root_path, tracked.path) && health.status === 'healthy') {
                updateJob({ ...tracked, status: 'done', phase: 'finished', message: featureCopy.The_project_index_is_ready_to_explore_e317eea });
            } else if ((project?.root_path && !samePath(project.root_path, tracked.path)) || health.status === 'corrupt') {
                updateJob({ ...tracked, status: 'error', phase: 'failed', message: health.status === 'corrupt'
                    ? featureCopy.The_index_could_not_be_verified_as_healthy_Inspect_its_errors_in__c921605
                    : featureCopy.The_returned_project_belongs_to_a_different_folder_This_index_was_710a5ef });
            } else {
                updateJob({ ...tracked, status: 'indexing', phase: 'unavailable', message: featureCopy.The_job_finished_but_its_project_index_could_not_be_verified_yet__9b24884 });
            }
        } catch {
            if (current()) updateJob({ ...tracked, phase: 'unavailable', message: featureCopy.Status_is_unavailable_The_job_may_still_be_running_retry_the_stat_97ec853 });
        } finally {
            pollPending.current = false;
            if (alive.current) setReadingStatus(false);
            const latest = jobRef.current;
            if (alive.current && latest?.id === tracked.id && latest.status === 'indexing' && (latest.phase === 'running' || latest.phase === 'verifying')) {
                timer.current = setTimeout(() => { void pollRef.current(); }, Math.max(1, pollMs));
            }
        }
    };
    pollRef.current = poll;

    const folderDuplicate = entries.find(entry => samePath(entry.root_path, selectedPath));
    const nameDuplicate = entries.find(entry => entry.name.toLowerCase() === name.trim().toLowerCase());
    const duplicate = folderDuplicate ?? nameDuplicate;
    const useFolder = (): void => {
        if (!level || browsing || browseError || !level.path || !samePath(pathInput.trim(), level.path)) return;
        setSelectedPath(level.path);
        setName(normalizedName(projectNameFor(level.path)).slice(0, 200).replace(/-+$/, ''));
        setSubmitError(''); setStep('confirm');
    };
    const start = async (): Promise<void> => {
        const projectName = name.trim();
        if (submitPending.current || !selectedPath || !validName(projectName) || duplicate || listStatus !== 'ready' || jobRef.current?.status === 'indexing') return;
        const path = selectedPath;
        submitPending.current = true; setSubmitting(true); setSubmitError('');
        try {
            const projects = await source.listProjects();
            if (!alive.current) return;
            setEntries(projects); setListStatus('ready');
            if (projects.some(entry => samePath(entry.root_path, path) || entry.name.toLowerCase() === projectName.toLowerCase())) return;
            const started = await source.startIndex(path, projectName);
            if (!alive.current) return;
            const valid = Number.isInteger(started.slot) && started.slot >= 0 && samePath(started.path, path);
            const tracked: TrackedIndex = { id: ++nextJob.current, name: projectName, path, slot: started.slot,
                status: valid ? 'indexing' : 'error', phase: valid ? 'running' : 'lost', message: valid
                    ? featureCopy.Indexing_source_and_relationships_17665af : featureCopy.The_server_accepted_the_request_without_a_matching_job_identifier_ee2daa1 };
            updateJob(tracked); setStep('progress');
            if (valid) void pollRef.current();
        } catch {
            if (alive.current) setSubmitError(featureCopy.The_index_request_was_not_confirmed_Check_the_server_in_System_be_1463f1d);
        } finally { submitPending.current = false; if (alive.current) setSubmitting(false); }
    };
    const another = (): void => {
        if (jobRef.current?.status === 'indexing' || pollPending.current) return;
        clearTimeout(timer.current); updateJob(undefined); setStep('browse'); setSubmitError('');
        void loadProjects(); if (!level) void browse('');
    };
    const openProject = (projectName: string): void => { onClose(); onOpenProject(projectName); };
    if (!open) return null;

    return <div className="add-index-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
        <section ref={panel} className="add-index-dialog" role="dialog" aria-modal="true" aria-labelledby="add-index-title" tabIndex={-1}>
            <header><div><p>{featureCopy.Local_repository_5b39f89}</p><h2 id="add-index-title">{featureCopy.Add_project_index_9108ede}</h2></div><button type="button" className="add-index-close" aria-label={featureCopy.Close_add_project_index_3957fea} onClick={onClose}>×</button></header>
            {step === 'browse' && <>
                <form className="add-index-path" onSubmit={event => { event.preventDefault(); void browse(pathInput.trim()); }}>
                    <label htmlFor="add-index-folder">{featureCopy.Folder_30baa24}</label><div><input ref={pathField} id="add-index-folder" value={pathInput} spellCheck={false}
                        placeholder={featureCopy.Enter_a_local_folder_path_52c0b01} onChange={event => setPathInput(event.target.value)} /><button type="submit">{featureCopy.Go_2e0b45f}</button></div>
                </form>
                <div className="add-index-folder-tools">{level && <button type="button" disabled={browsing || !level.parent || samePath(level.parent, level.path)} onClick={() => { void browse(level.parent); }}>{featureCopy.Up_6d58160}</button>}
                    {level?.roots.map(root => <button type="button" key={root} onClick={() => { void browse(root); }}>{root}</button>)}</div>
                <div className="add-index-folders" aria-label={featureCopy.Folders_19adc47} aria-busy={browsing}>
                    {browsing && <p role="status">{featureCopy.Opening_folder_b456efd}</p>}
                    {browseError && <p role="alert">{browseError}</p>}
                    {!browsing && !browseError && level?.dirs.length === 0 && <p>{featureCopy.No_visible_subfolders_4c02395}</p>}
                    {!browseError && <ul>{level?.dirs.slice().sort((left, right) => left.localeCompare(right)).map(dir => <li key={dir}><button type="button" aria-label={featureCopy.Open_folder_0_bf7c21d(dir)} disabled={browsing} onClick={() => { void browse(childPath(level, dir)); }}><span aria-hidden="true">▱</span>{dir}<span aria-hidden="true">›</span></button></li>)}</ul>}
                </div>
                <footer><span>{featureCopy.Choose_a_folder_to_index_Nothing_starts_while_browsing_d9eea54}</span><button type="button" className="add-index-primary" disabled={!level?.path || browsing || !!browseError || !samePath(pathInput.trim(), level.path)} onClick={useFolder}>{featureCopy.Use_this_folder_0e77d6d}</button></footer>
            </>}
            {step === 'confirm' && <form className="add-index-confirm" onSubmit={event => { event.preventDefault(); void start(); }}>
                <p className="add-index-chosen-path">{selectedPath}</p>
                <label htmlFor="add-index-name">{featureCopy.Project_name_ab9773f}</label><input ref={nameField} id="add-index-name" value={name} spellCheck={false} disabled={submitting}
                    onChange={event => { setName(event.target.value); setSubmitError(''); }} aria-describedby="add-index-name-hint" />
                <p id="add-index-name-hint" className="add-index-hint">{nameHint}</p>
                {!validName(name.trim()) && <p role="status">{featureCopy.Choose_a_valid_project_name_before_indexing_ad15a51}</p>}
                {listStatus === 'loading' && <p role="status">{featureCopy.Checking_existing_projects_3b1b2aa}</p>}
                {listStatus === 'error' && <div className="add-index-warning" role="alert"><p>{featureCopy.Could_not_check_existing_projects_74964d8}</p><button type="button" onClick={() => { void loadProjects(); }}>{featureCopy.Retry_project_check_09d135d}</button></div>}
                {duplicate && <div className="add-index-warning" role="status"><p>{folderDuplicate ? featureCopy.This_folder_is_already_indexed_as_0_5aeb6e3(duplicate.name) : featureCopy.The_name_0_is_already_in_use_Choose_another_name_3bf370a(duplicate.name)}</p>
                    {folderDuplicate && <button type="button" onClick={() => openProject(duplicate.name)}>{featureCopy.Open_project_3a6a046}</button>}</div>}
                {submitError && <p className="add-index-warning" role="alert">{submitError}</p>}
                <footer><button type="button" disabled={submitting} onClick={() => setStep('browse')}>{featureCopy.Choose_another_folder_af3575d}</button>
                    <button type="submit" className="add-index-primary" disabled={submitting || !validName(name.trim()) || !!duplicate || listStatus !== 'ready'}>{submitting ? featureCopy.Starting_e5f5809 : featureCopy.Start_indexing_4d09349}</button></footer>
            </form>}
            {step === 'progress' && job && <div className="add-index-progress" data-status={job.status}>
                <span className="add-index-progress-icon" aria-hidden="true">{job.status === 'done' ? '✓' : job.status === 'error' || job.phase === 'unavailable' ? '!' : '◎'}</span>
                <h3>{job.status === 'done' ? featureCopy.Ready_to_explore_4946a16 : job.phase === 'failed' ? featureCopy.Indexing_failed_c76d04d : job.phase === 'lost' ? featureCopy.Tracking_interrupted_c6d1d6b : job.phase === 'unavailable' ? featureCopy.Status_unavailable_f261ff7 : job.phase === 'verifying' ? featureCopy.Checking_the_index_9bad5aa : featureCopy.Indexing_repository_524cae3}</h3>
                <strong>{job.name}</strong><p className="add-index-chosen-path">{job.path}</p>
                {(job.phase === 'running' || job.phase === 'verifying') && <progress aria-label={featureCopy.Indexing_progress_b2c63b5} />}
                <p role={job.status === 'error' || job.phase === 'unavailable' ? 'alert' : 'status'}>{job.message}</p>
                {job.status === 'indexing' && <p className="add-index-hint">{featureCopy.You_can_close_this_window_Indexing_continues_in_the_daemon_548d303}</p>}
                <div className="add-index-progress-actions">
                    {(job.phase === 'unavailable' || job.phase === 'lost') && Number.isInteger(job.slot) && job.slot >= 0 && <button type="button" disabled={readingStatus} onClick={() => { void pollRef.current(); }}>{readingStatus ? featureCopy.Checking_820d600 : featureCopy.Retry_status_8c3370b}</button>}
                    {job.status === 'done' && <button type="button" className="add-index-primary" onClick={() => openProject(job.name)}>{featureCopy.Open_project_3a6a046}</button>}
                    {job.status !== 'indexing' && <button type="button" disabled={readingStatus} onClick={another}>{featureCopy.Add_another_project_b7ce399}</button>}
                    {job.status === 'indexing' && <button type="button" onClick={onClose}>{featureCopy.Close_for_now_4a92f57}</button>}
                </div>
            </div>}
        </section>
    </div>;
}
