import { settingsStrings, useSettingsText } from './settings-strings';
import { useUiLanguage } from '../i18n/ui-language';
import { localizedSetting, configurationLabel, languageOption } from './configuration-metadata';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import BrowserConfig, { type BrowserConfigProps } from './BrowserConfig';
import ConfigReference from './ConfigReference';
import { configValueError, type ConfigService, type ConfigSetting, type ConfigSnapshot } from './config-model';
import './configuration.css';

interface Props extends BrowserConfigProps { service: ConfigService; onClose: () => void; embedded?: boolean; active?: boolean }
const displayValue = (value: string | null, text: typeof settingsStrings.en) => value === null ? text.automatic : value === 'true' ? text.on : value === 'false' ? text.off : value || text.empty;
const title = (value: string) => value.replace(/[_-]/g, ' ').replace(/^./, char => char.toUpperCase());
const timing = (value: string, text: typeof settingsStrings.en) => ({ restart: text.processRestart, 'next-session': text.nextSession, 'next-request': text.nextRequest, live: text.immediate, startup: text.afterRestart, 'next-index': text.nextIndex }[value] ?? title(value));

function SettingRow({ setting, draft, changed, onChange, disabled }: { setting: ConfigSetting; draft?: string | null; changed: boolean; onChange: (value: string | null) => void; disabled: boolean }) {
    const text = useSettingsText();
    const language = useUiLanguage();
    const metadata = localizedSetting(setting, language);
    const value = changed ? draft ?? null : setting.override ?? setting.value;
    const error = changed ? configValueError(setting, value, text) : undefined;
    const id = `config-${setting.key}`;
    const legacyInput = !changed && value !== null && !!configValueError(setting, value, text);
    const effectiveLabel = setting.effectiveKnown === false ? text.runtimeValue(displayValue(setting.effective, text)) : text.usingValue(displayValue(setting.effective, text));
    return <article className={`cbm-config-setting${changed ? ' is-changed' : ''}`}>
        <div className="cbm-config-setting-main"><div><label htmlFor={id}>{metadata.label}</label><p>{metadata.description}</p></div>
            <div className="cbm-config-value">
                {!setting.editable ? <span>{displayValue(setting.effective, text)}</span>
                    : setting.type === 'boolean' || setting.type === 'enum' ? <select id={id} value={value ?? ''} disabled={disabled} aria-invalid={!!error} onChange={event => onChange(event.target.value || null)}>
                        <option value="">{text.inherited}</option>{(setting.type === 'boolean' ? ['true', 'false'] : setting.options ?? []).map(option => <option key={option} value={option}>{setting.key === 'ui-lang' ? languageOption(option, language) : displayValue(option, text)}</option>)}
                    </select> : <input id={id} type={setting.type === 'integer' || setting.type === 'number' ? 'number' : 'text'}
                        value={legacyInput ? '' : value ?? ''} placeholder={text.inherited} min={setting.minimum} max={setting.maximum} step={setting.type === 'number' ? 'any' : 1}
                        disabled={disabled} aria-invalid={!!error} onChange={event => onChange(event.target.value)} />}
                {setting.editable && <button type="button" disabled={disabled || (!changed && setting.override === null)} onClick={() => onChange(null)}>{text.reset}</button>}
            </div>
        </div>
        {error && <p className="cbm-config-error" role="alert">{error}</p>}
        <div className="cbm-config-setting-meta"><span>{setting.pendingRestart ? text.pendingRestart : timing(setting.applyMode, text)}</span><span>{effectiveLabel}</span><span>{configurationLabel(setting.source, language)}</span>{changed && <span>{draft === null ? text.resetStaged : text.unsaved}</span>}</div>
        {setting.readOnlyReason && <p className="cbm-config-readonly">{metadata.readOnlyReason}</p>}
        <details className="cbm-config-setting-details"><summary>{text.sourceDefault}</summary><dl>
            <div><dt>{text.key}</dt><dd>{setting.key}</dd></div><div><dt>{text.default}</dt><dd>{displayValue(setting.defaultValue, text)}</dd></div>
            <div><dt>{text.savedOverride}</dt><dd>{setting.override === null ? text.none : displayValue(setting.override, text)}</dd></div>
            {setting.environment && <div><dt>{text.environment}</dt><dd>{setting.environment}</dd></div>}
            {setting.cli && <div><dt>CLI</dt><dd>{setting.cli}</dd></div>}
            {setting.sourceFile && <div><dt>{text.consumer}</dt><dd>{setting.sourceFile}</dd></div>}
        </dl></details>
    </article>;
}

export default function ConfigPanel({ service, onClose, embedded = false, active = true, ...browser }: Props) {
    const text = useSettingsText();
    const language = useUiLanguage();
    const [snapshot, setSnapshot] = useState<ConfigSnapshot>();
    const [category, setCategory] = useState('');
    const [draft, setDraft] = useState<Record<string, string | null>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [confirmClose, setConfirmClose] = useState(false);
    const dialog = useRef<HTMLDivElement>(null);
    const generation = useRef(0);
    const pending = useRef(false);
    const count = Object.keys(draft).length;
    const draftCount = useRef(count);
    draftCount.current = count;
    const references = snapshot?.settings.filter(setting => setting.category.toLowerCase() === 'reference') ?? [];
    const categories = [...new Set(snapshot?.settings.filter(setting => setting.category.toLowerCase() !== 'reference').map(setting => setting.category) ?? [])];
    const activeCategory = category || categories[0] || 'browser';
    const invalid = snapshot?.settings.some(setting => Object.hasOwn(draft, setting.key) && configValueError(setting, draft[setting.key], text));
    const reload = useCallback(async () => {
        const ticket = ++generation.current;
        setLoading(true); setError(''); setNotice('');
        try { const next = await service.configuration(); if (ticket === generation.current) { setSnapshot(next); setDraft({}); setConfirmClose(false); } }
        catch (failure) { if (ticket === generation.current) setError(failure instanceof Error ? failure.message : text.readFailed); }
        finally { if (ticket === generation.current) setLoading(false); }
    }, [service, text]);
    useEffect(() => () => { generation.current++; }, [service]);
    useEffect(() => { if (active && draftCount.current === 0 && !pending.current) void reload(); }, [active, reload]);
    useEffect(() => {
        if (embedded) return;
        const previous = document.activeElement;
        dialog.current?.focus();
        return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
    }, [embedded]);
    const close = () => { if (pending.current) return; if (count) setConfirmClose(true); else onClose(); };
    const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') { event.stopPropagation(); close(); }
        if (event.key !== 'Tab') return;
        const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), summary, [tabindex="0"]') ?? [])].filter(element => element.getClientRects().length);
        const first = focusable[0], last = focusable.at(-1);
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const save = async () => {
        if (!snapshot || pending.current || !count || invalid) return;
        pending.current = true; setSaving(true); setError(''); setNotice('');
        const ticket = ++generation.current;
        try {
            const next = await service.saveConfiguration(snapshot.revision, draft);
            if (ticket === generation.current) {
                setSnapshot(next); setDraft({}); setConfirmClose(false);
                setNotice(next.settings.some(setting => setting.pendingRestart) ? text.savedRestart : text.saved);
            }
        } catch (failure) { if (ticket === generation.current) setError(failure instanceof Error ? failure.message : text.saveFailed); }
        finally { pending.current = false; if (ticket === generation.current) setSaving(false); }
    };
    const navigate = (action: () => void) => { if (count) { setError(text.navigateUnsaved); return; } action(); };
    const panel = <div className={`cbm-config-dialog${embedded ? ' cbm-config-embedded' : ''}`} ref={dialog} role={embedded ? 'region' : 'dialog'} aria-modal={embedded ? undefined : true} aria-labelledby="cbm-config-title" tabIndex={embedded ? undefined : -1} onKeyDown={embedded ? undefined : keyDown}>
            <header className="cbm-config-heading"><div><h2 id="cbm-config-title">{embedded ? text.configuration : text.config}</h2><p>{text.description}</p></div>{!embedded && <button type="button" onClick={close} disabled={saving} aria-label={text.configClose}>×</button>}</header>
            <nav className="cbm-config-categories" aria-label={text.categories}>{[...categories, 'browser', 'reference'].map(value => <button type="button" key={value} aria-pressed={activeCategory === value} onClick={() => setCategory(value)}>{value === 'reference' ? text.reference : configurationLabel(value, language)}</button>)}</nav>
            <div className="cbm-config-content">
                {error && <div className="cbm-config-error" role="alert">{error}<p>{text.changesRetained}</p></div>}
                {notice && <p className="cbm-config-notice" role="status">{notice}</p>}
                {confirmClose && <div className="cbm-config-unsaved" role="alert"><p>{text.discardQuestion(count, count === 1 ? text.change : text.changes)}</p><button type="button" onClick={() => setConfirmClose(false)}>{text.keepEditing}</button><button type="button" onClick={onClose}>{text.discardClose}</button></div>}
                {activeCategory === 'browser' ? <BrowserConfig {...browser} onOpenBrowserModels={() => navigate(browser.onOpenBrowserModels)} onOpenDisplay={() => navigate(browser.onOpenDisplay)} />
                    : activeCategory === 'reference' ? <><ConfigReference />{references.length > 0 && <details className="cbm-config-setting-details"><summary>{text.referenceValues}</summary>{references.map(setting => <SettingRow key={setting.key} setting={setting} changed={false} disabled onChange={() => undefined} />)}</details>}</>
                    : <><p className="cbm-config-scope">{text.scope}</p>
                        {loading && <p role="status">{text.reading}</p>}
                        {snapshot?.settings.filter(setting => setting.category === activeCategory).map(setting => <SettingRow key={setting.key} setting={setting} draft={draft[setting.key]} changed={Object.hasOwn(draft, setting.key)} disabled={saving || loading} onChange={value => {
                            setNotice(''); setDraft(previous => { const next = { ...previous }; if (value === setting.override || (setting.override === null && value === setting.value)) delete next[setting.key]; else next[setting.key] = value; return next; });
                        }} />)}
                    </>}
            </div>
            <footer className="cbm-config-footer"><span>{count ? text.unsavedCount(count, count === 1 ? text.change : text.changes) : snapshot ? text.settingCount(snapshot.settings.length) : text.unavailable}</span><div>
                <button type="button" disabled={loading || saving} onClick={() => { if (count) { setDraft({}); setNotice(text.editsDiscarded); } else void reload(); }}>{count ? text.discardEdits : text.reloadValues}</button>
                <button type="button" className="cbm-config-save" disabled={!count || !!invalid || loading || saving} onClick={() => { void save(); }}>{saving ? text.saving : text.save}</button>
            </div></footer>
        </div>;
    return embedded ? panel : <div className="cbm-config-backdrop" onClick={event => { if (event.target === event.currentTarget) close(); }}>{panel}</div>;
}
