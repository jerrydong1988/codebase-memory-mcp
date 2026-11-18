import { featureCopy } from '../i18n/features/agents';
import { useEffect, useState } from 'react';
import type { AtlasApi } from '../app/atlas-api';
import hookSource from '../../agents/hooks/atlas-trace.py?raw';

/** POSIX shell word quoting; paths and indexed names are data, never commands. */
export const shellWord = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`;
export const agentInstallCommand = (root: string, project: string, port: number): string =>
    `python3 ~/Downloads/cbm-atlas-trace.py --install-claude --root ${shellWord(root)} --project ${shellWord(project)} --daemon-url ${shellWord(`http://127.0.0.1:${port}`)}`;

export default function AgentSetup({ api, project, port }: { api?: Pick<AtlasApi, 'repoInfo'>; project?: string; port: number }) {
    const [open, setOpen] = useState(false);
    const [reading, setReading] = useState<{ project: string; root: string; error: string }>();
    const [copied, setCopied] = useState('');
    useEffect(() => {
        if (!open || !api || !project) return;
        let disposed = false;
        setReading(undefined); setCopied('');
        void api.repoInfo(project).then(info => {
            if (!disposed) setReading({ project, root: info.rootPath, error: info.rootPath ? '' : 'The daemon did not report this repository root.' });
        }).catch(error => {
            if (!disposed) setReading({ project, root: '', error: error instanceof Error ? error.message : String(error) });
        });
        return () => { disposed = true; };
    }, [open, api, project]);
    const current = reading?.project === project ? reading : undefined;
    const command = current?.root && project ? agentInstallCommand(current.root, project, port) : '';
    const download = () => {
        const url = URL.createObjectURL(new Blob([hookSource], { type: 'text/x-python;charset=utf-8' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'cbm-atlas-trace.py';
        anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    return <details className="cbm-agent-setup" onToggle={event => setOpen(event.currentTarget.open)}>
        <summary>{featureCopy.Connect_your_agent_cf286ca}</summary>
        <p>{featureCopy.setupHookRequirements}</p>
        {!project || !api ? <p>{featureCopy.Select_an_indexed_project_to_generate_its_setup_command_dd81f74}</p> : <>
            <ol>
                <li><button type="button" onClick={download}>{featureCopy.Download_hook_bf829e7}</button>{featureCopy.Save_6bf6e85}<code>cbm-atlas-trace.py</code>{featureCopy.in_Downloads_or_adjust_its_path_in_the_command_below_9371dda}</li>
                <li>{featureCopy.Review_and_run_this_command_in_your_terminal_It_copies_the_hook_i_22d71ab}<code>.claude/hooks/</code>{featureCopy.and_adds_it_to_20a04a8}<code>.claude/settings.local.json</code>{featureCopy.preserving_unrelated_settings_Conflicting_existing_hooks_are_refu_fb9a958}{current?.error ? <p role="alert">{featureCopy.Setup_unavailable_3e0e1ce}{current.error}</p> : command ? <>
                        <pre>{command}</pre><button type="button" onClick={() => { void navigator.clipboard.writeText(command).then(() => setCopied('Command copied')).catch(() => setCopied('Clipboard unavailable; select and copy the command.')); }}>{featureCopy.Copy_setup_command_cb6ffe8}</button> <span role="status">{copied}</span>
                    </> : <p>{featureCopy.Reading_the_indexed_repository_root_3bf59cb}</p>}
                </li>
                <li>{featureCopy.setupSessionStep}<strong>{featureCopy.Load_recorded_activity_07c6bd6}</strong>{featureCopy.here_A_new_recorded_event_is_the_evidence_that_the_hook_reached_t_19829bc}</li>
            </ol>
            <p>{featureCopy.Destination_1d90c07}<code>http://127.0.0.1:{port}/api/agent-events</code>{featureCopy.Project_3d40c02}<code>{project}</code>. No bridge or extra listener. Pending events retry on the next tool call.</p>
        </>}
        <p>{featureCopy.The_hook_records_tool_names_paths_timestamps_optional_line_spans__887f4f0}</p>
        <p>{featureCopy.To_remove_it_delete_only_the_entry_referencing_9e13c91}<code>cbm-atlas-trace.py</code>{featureCopy.from_this_project_s_8322851}<code>PostToolUse</code>{featureCopy.hooks_Other_coding_clients_need_their_own_event_adapter_their_act_efac63b}</p>
    </details>;
}
