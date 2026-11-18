export type FeatureLanguage = 'en' | 'zh';
let language: FeatureLanguage = 'en';
let initialized = false;

export const featureLanguage = () => initialized ? language : undefined;

/** Resolve before importing feature catalogs, including lazily loaded workspaces. */
export async function initializeFeatureLanguage(): Promise<void> {
    if (initialized) return;
    language = /^zh(?:-|$)/i.test(navigator.language) ? 'zh' : 'en';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    try {
        const response = await fetch('/api/ui-config', { signal: controller.signal });
        if (response.ok) {
            const data: unknown = await response.json();
            if (data && typeof data === 'object' && 'lang' in data && (data.lang === 'en' || data.lang === 'zh')) language = data.lang;
        }
    } catch { /* Offline startup keeps the browser preference. */ }
    finally { clearTimeout(timeout); initialized = true; }
}

/** Both catalogs must expose the same names, value types and function signatures. */
export function localizedMessages<T>(en: T, zh: T): T {
    return language === 'zh' ? zh : en;
}
