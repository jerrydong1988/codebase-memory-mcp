// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { UiLanguageProvider, useUiLanguage } from './ui-language';

function CurrentLanguage() {
    return <span>{useUiLanguage()}</span>;
}

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.documentElement.lang = 'en';
});

it.each([
    ['en-US', 'zh', 'zh', 'zh-CN'],
    ['zh-CN', 'en', 'en', 'en'],
    ['en-US', 'unknown', 'en', 'en'],
    ['zh-CN', null, 'zh', 'zh-CN'],
    ['de-DE', null, 'en', 'en'],
] as const)('uses browser %s and daemon %s to display %s', async (browser, daemon, expected, htmlLang) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(browser);
    const request = daemon === null ? vi.fn().mockRejectedValue(new TypeError('offline'))
        : vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: daemon }) });
    vi.stubGlobal('fetch', request);
    const host = document.createElement('div');
    const root = createRoot(host);
    try {
        await act(async () => root.render(<UiLanguageProvider><CurrentLanguage /></UiLanguageProvider>));
        expect(host.textContent).toBe(expected);
        expect(document.documentElement.lang).toBe(htmlLang);
        expect(request).toHaveBeenCalledWith('/api/ui-config', { signal: expect.any(AbortSignal) });
    } finally { await act(async () => root.unmount()); }
});
