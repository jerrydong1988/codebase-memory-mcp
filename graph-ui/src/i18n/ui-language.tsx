import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type UiLanguage = 'en' | 'zh';
const UiLanguageContext = createContext<UiLanguage>('en');

export function useUiLanguage(): UiLanguage {
    return useContext(UiLanguageContext);
}

export function UiLanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<UiLanguage>(() =>
        /^zh(?:-|$)/i.test(navigator.language) ? 'zh' : 'en');

    useEffect(() => {
        const controller = new AbortController();
        async function readLanguage() {
            try {
                const response = await fetch('/api/ui-config', { signal: controller.signal });
                if (!response.ok) return;
                const config: unknown = await response.json();
                if (config && typeof config === 'object' && 'lang' in config &&
                    (config.lang === 'en' || config.lang === 'zh') && !controller.signal.aborted) {
                    setLanguage(config.lang);
                }
            } catch { /* Keep the browser language if the daemon is unreachable. */ }
        }
        void readLanguage();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    }, [language]);
    return <UiLanguageContext.Provider value={language}>{children}</UiLanguageContext.Provider>;
}
