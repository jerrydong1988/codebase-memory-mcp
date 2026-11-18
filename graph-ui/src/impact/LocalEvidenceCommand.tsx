import { featureCopy } from '../i18n/features/impact';
import { useState } from 'react';

/** Clipboard writes occur only on the explicit button click. Nothing is executed or sent. */
export default function LocalEvidenceCommand({ command, label = 'Copy local command' }: { command: string; label?: string }) {
    const [result, setResult] = useState<{ command: string; message: string }>();
    const copy = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(featureCopy.Clipboard_unavailable_Select_the_command_below_and_copy_it_manual_75b9d0f);
            await navigator.clipboard.writeText(command);
            setResult({ command, message: featureCopy.Command_copied_locally_Nothing_was_executed_or_sent_fbebbc2 });
        } catch (error) {
            setResult({ command, message: error instanceof Error ? error.message : featureCopy.Could_not_copy_Select_the_command_and_copy_it_manually_f837daa });
        }
    };
    return <div className="local-evidence-command">
        <button type="button" disabled={!command} onClick={() => { void copy(); }}>{label}</button>
        <code tabIndex={0}>{command}</code>
        {result?.command === command && <span role="status">{result.message}</span>}
    </div>;
}
