// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

it.each([['zh-CN', 'auto', 'zh'], ['zh-CN', 'en', 'en'], ['en-US', 'zh', 'zh'], ['de-DE', 'auto', 'en']] as const)(
    'initializes all catalogs before imports: browser %s, configured %s', async (browser, configured, expected) => {
        vi.resetModules();
        vi.spyOn(navigator, 'language', 'get').mockReturnValue(browser);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: configured }) }));
        const locale = await import('./feature-language');
        await locale.initializeFeatureLanguage();
        const { architectureText } = await import('../architecture/strings');
        const { DIAGNOSTIC_LABELS } = await import('../diagnostics/diagnostics-model');
        const { presentationLabel } = await import('./presentation');
        expect(locale.featureLanguage()).toBe(expected);
        expect(architectureText.views.overview).toBe(expected === 'zh' ? '概览' : 'Overview');
        expect(DIAGNOSTIC_LABELS.partial).toBe(expected === 'zh' ? '部分解析' : 'Partial parse');
        expect(presentationLabel('calls')).toBe(expected === 'zh' ? '调用' : 'calls');
        expect(presentationLabel('custom_relation')).toBe('custom_relation');
        expect(architectureText.openSource('src/EnglishName.ts')).toContain('src/EnglishName.ts');
    },
);

it('keeps the Chinese browser preference when offline and does not reinitialize static catalogs', async () => {
    vi.resetModules();
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('zh-CN');
    const fetch = vi.fn().mockRejectedValue(new TypeError('offline'));
    vi.stubGlobal('fetch', fetch);
    const locale = await import('./feature-language');
    await locale.initializeFeatureLanguage();
    await locale.initializeFeatureLanguage();
    expect(locale.featureLanguage()).toBe('zh');
    expect(fetch).toHaveBeenCalledOnce();
});

it('aborts a stalled configuration request without preventing startup', async () => {
    vi.resetModules(); vi.useFakeTimers();
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    vi.stubGlobal('fetch', vi.fn((_url, { signal }: { signal: AbortSignal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
    })));
    const locale = await import('./feature-language');
    const initialized = locale.initializeFeatureLanguage();
    await vi.advanceTimersByTimeAsync(1500);
    await initialized;
    expect(locale.featureLanguage()).toBe('en');
});
