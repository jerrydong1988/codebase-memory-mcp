// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { UiLanguageProvider } from '../i18n/ui-language';
import { DEFAULT_GRAPH_DISPLAY } from '../galaxy/density';
import { readHealth, readProcesses } from '../projects/projects-model';
import ConfigPanel from '../settings/ConfigPanel';
import type { ConfigSetting } from '../settings/config-model';
import { localizedSetting } from '../settings/configuration-metadata';
import SystemWorkspace from './SystemWorkspace';

let container: HTMLDivElement, root: Root;
beforeEach(() => {
    (globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
    vi.stubGlobal('localStorage', (globalThis as unknown as { jsdom: { window: Window } }).jsdom.window.localStorage);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('zh-CN');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: 'zh' }) }));
    container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const click = async (label: string) => {
    const button = [...container.querySelectorAll('button')].find(element => element.textContent === label);
    expect(button).toBeDefined(); await act(async () => button!.click());
};
const watcher: ConfigSetting = { key: 'watcher_enabled', label: 'Background watcher', description: "Enable the daemon's background watcher thread.",
    category: 'Indexing', type: 'boolean', defaultValue: 'true', value: 'true', override: null, effective: 'true', source: 'default',
    applyMode: 'restart', pendingRestart: false, editable: true };

it('translates System content, dynamic metrics, index states and log controls while preserving raw data', async () => {
    const raw = 'level=ERROR source=/repo/main.ts msg=Index_failed';
    const api = {
        processes: vi.fn().mockResolvedValue(readProcesses({ self_pid: 42, self_rss_mb: 15, cpu_unit: 'seconds', memory_kind: 'working_set', self_memory_kind: 'working_set',
            processes: [{ pid: 42, cpu: 2.5, rss_mb: 15, elapsed: '01:00', command: 'codebase-memory-mcp --port=9749', is_self: true }] })),
        logs: vi.fn().mockResolvedValue({ lines: [raw], total: 1 }),
        indexJobs: vi.fn().mockResolvedValue([{ slot: 1, status: 'indexing', path: '/repo', error: '' }]),
        configuration: vi.fn().mockResolvedValue({ revision: 'r1', settings: [watcher] }),
        projectHealth: vi.fn().mockResolvedValue(readHealth({ status: 'healthy', nodes: 42, edges: 73, watch_registered: true, watcher_running: true })),
    };
    await act(async () => root.render(<UiLanguageProvider><SystemWorkspace api={api} onOpenProjects={vi.fn()} project="raw-project-name"
        listProjects={async () => [{ name: 'raw-project-name', root_path: '/repo' }]} /></UiLanguageProvider>));
    expect(container.querySelector('h1')?.textContent).toBe('系统');
    expect([...container.querySelectorAll('[role="tab"]')].map(element => element.textContent)).toEqual(['概览', '配置', '索引', '日志']);
    const overview = container.querySelector('#system-panel-overview')!.textContent;
    expect(overview).toContain('工作集');
    expect(overview).toContain('2.5 秒');
    expect(overview).toContain('15.0 MiB');
    expect(overview).toContain('codebase-memory-mcp --port=9749');
    await click('暂停自动刷新');
    expect(container.textContent).toContain('已暂停自动刷新');
    await click('恢复自动刷新');
    await click('索引');
    expect(container.querySelector('.system-index-table')!.textContent).toContain('raw-project-name');
    expect(container.querySelector('.system-index-table')!.textContent).toContain('42 个节点');
    expect(container.querySelector('.system-index-table')!.textContent).toContain('正在监视');
    expect(container.textContent).toContain('已保存：开启');
    await click('日志');
    expect(container.querySelector('[aria-label="日志范围"]')).not.toBeNull();
    expect(container.querySelector('.system-log')!.textContent).toBe(raw);
    expect(container.querySelector('.system-log-meta')!.textContent).toContain('已显示 1 条');
});

it('translates setting help but sends the original enum values and revision', async () => {
    const service = { configuration: vi.fn().mockResolvedValue({ revision: 'r1', settings: [watcher] }),
        saveConfiguration: vi.fn().mockResolvedValue({ revision: 'r2', settings: [{ ...watcher, override: 'false', value: 'false', pendingRestart: true }] }) };
    await act(async () => root.render(<UiLanguageProvider><ConfigPanel service={service} onClose={vi.fn()} project="raw-project-name" display={DEFAULT_GRAPH_DISPLAY}
        onDisplay={vi.fn()} onOpenBrowserModels={vi.fn()} onOpenDisplay={vi.fn()} /></UiLanguageProvider>));
    expect(container.querySelector('label')!.textContent).toBe('后台文件监视');
    expect(container.textContent).toContain('启用后台服务的文件监视线程。');
    const select = container.querySelector<HTMLSelectElement>('#config-watcher_enabled')!;
    expect([...select.options].map(option => [option.value, option.textContent])).toEqual([['', '继承或自动'], ['true', '开启'], ['false', '关闭']]);
    await act(async () => { select.value = 'false'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await click('保存更改');
    expect(service.saveConfiguration).toHaveBeenCalledExactlyOnceWith('r1', { watcher_enabled: 'false' });
    expect(container.textContent).toContain('等待重启');
    await click('浏览器');
    expect(container.textContent).toContain('raw-project-name');
    expect(container.textContent).toContain('节点');
    await click('外部配置');
    expect(container.textContent).toContain('.codebase-memory.json');
    expect(container.textContent).toContain('项目');
});

it('keeps unknown settings and changed upstream descriptions intact', () => {
    const future = { ...watcher, key: 'future_setting', label: 'Future setting', description: 'New semantics', readOnlyReason: 'New platform constraint' };
    expect(localizedSetting(future, 'zh')).toEqual(future);
    expect(localizedSetting({ ...watcher, description: 'Changed semantics' }, 'zh').description).toBe('Changed semantics');
    expect(localizedSetting(watcher, 'en')).toBe(watcher);
});

it('honors a daemon English override even with a Chinese browser', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: 'en' }) }));
    const api = { processes: vi.fn().mockResolvedValue(readProcesses({ processes: [] })), logs: vi.fn(), indexJobs: vi.fn() };
    await act(async () => root.render(<UiLanguageProvider><SystemWorkspace api={api} onOpenProjects={vi.fn()} /></UiLanguageProvider>));
    expect(container.querySelector('h1')!.textContent).toBe('System');
    expect(container.querySelector('.system-tabs')!.textContent).toBe('OverviewConfigurationIndexesLogs');
});
