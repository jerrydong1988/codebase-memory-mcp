import { featureCopy } from '../i18n/features/browser-ai';
import { useRef, useState, type JSX, type ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

function safeMarkdownUrl(value: string): string {
    try {
        const url = new URL(value);
        if (url.username || url.password || !['https:', 'http:', 'mailto:'].includes(url.protocol)) return '';
        return url.href;
    } catch { return ''; }
}

function CodeBlock({ children, language, codeText }: { children: ReactNode; language: string; codeText: string }): JSX.Element {
    const [copy, setCopy] = useState<{ text: string; status: 'idle' | 'copying' | 'copied' | 'failed' }>({ text: '', status: 'idle' });
    const copyTicket = useRef(0);
    const status = copy.text === codeText ? copy.status : 'idle';
    const copyCode = async (): Promise<void> => {
        const ticket = ++copyTicket.current;
        setCopy({ text: codeText, status: 'copying' });
        try {
            if (!navigator.clipboard?.writeText) throw new Error(featureCopy.Clipboard_unavailable_bec46a2);
            await navigator.clipboard.writeText(codeText);
            if (ticket === copyTicket.current) setCopy({ text: codeText, status: 'copied' });
        } catch {
            if (ticket === copyTicket.current) setCopy({ text: codeText, status: 'failed' });
        }
    };
    return <div className="cbm-chat-code-block">
        <div className="cbm-chat-code-header"><span className="cbm-chat-code-language">{language}</span><div>
            {status === 'failed' && <span className="cbm-chat-code-copy-error" role="status">{featureCopy.Copy_unavailable_9389d09}</span>}
            <button type="button" aria-label={featureCopy.Copy_code_6c10692} disabled={status === 'copying'} onClick={() => { void copyCode(); }}>{status === 'copied' ? featureCopy.Copied_8e3df45 : status === 'copying' ? featureCopy.Copying_d004489 : featureCopy.Copy_af74f7c}</button>
        </div></div>
        <pre tabIndex={0} aria-label={featureCopy.message_0_code_80f683d(language)}>{children}</pre>
    </div>;
}

const components: Components = {
    a: ({ href, children, title }) => {
        const safe = href ? safeMarkdownUrl(href) : '';
        return safe ? <a href={safe} target="_blank" rel="noopener noreferrer" title={title}>{children}</a> : <span>{children}</span>;
    },
    // An image URL is an explicit link; rendering Markdown never contacts its server.
    img: ({ src, alt }) => {
        const safe = typeof src === 'string' ? safeMarkdownUrl(src) : '';
        const label = featureCopy.Image_0_9e4b87c(alt || 'open image link');
        return safe ? <a href={safe} target="_blank" rel="noopener noreferrer">{label}</a> : <span>{label}</span>;
    },
    pre: ({ children, node }) => {
        const code = node?.children.find(child => child.type === 'element' && child.tagName === 'code');
        const classes = code?.type === 'element' ? code.properties.className : undefined;
        const languageClass = Array.isArray(classes) ? classes.find(item => typeof item === 'string' && item.startsWith('language-')) : undefined;
        const language = typeof languageClass === 'string' ? languageClass.slice('language-'.length) : 'text';
        const codeText = code?.type === 'element' ? code.children.map(child => child.type === 'text' ? child.value : '').join('') : '';
        return <CodeBlock language={language} codeText={codeText}>{children}</CodeBlock>;
    },
    table: ({ children }) => <div className="cbm-chat-table-scroll" role="region" aria-label={featureCopy.Markdown_table_6d9defb} tabIndex={0}><table>{children}</table></div>,
};

export default function ChatMarkdown({ text }: { text: string }): JSX.Element {
    return <div className="cbm-chat-markdown"><Markdown remarkPlugins={[remarkGfm]} components={components} urlTransform={safeMarkdownUrl}>{text}</Markdown></div>;
}
