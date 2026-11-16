import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Theme system.
 * - The initial theme is applied by the inline script in index.html before
 *   first paint (no flash). This provider just reads it back.
 * - Only an explicit user choice is persisted (key: "theme-preference").
 *   Without one, the theme follows the OS and updates live if the OS changes.
 */
const STORAGE_KEY = 'theme-preference';
const THEME_COLORS = { dark: '#0B132B', light: '#F7F9FC' };

const ThemeContext = createContext(null);

const readStored = () => {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch {
        return null;
    }
};

const systemTheme = () =>
    window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const applyTheme = (theme, animate) => {
    const root = document.documentElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (animate && !reduce) {
        root.classList.add('theme-switching');
        window.clearTimeout(applyTheme.timer);
        applyTheme.timer = window.setTimeout(() => root.classList.remove('theme-switching'), 320);
    }
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() =>
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    );

    // Follow the OS while the visitor hasn't made an explicit choice.
    useEffect(() => {
        const mq = window.matchMedia?.('(prefers-color-scheme: light)');
        if (!mq) return undefined;
        const onChange = () => {
            if (readStored()) return;
            const next = systemTheme();
            applyTheme(next, true);
            setTheme(next);
        };
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === 'dark' ? 'light' : 'dark';
            applyTheme(next, true);
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                /* storage unavailable — theme still applies for this visit */
            }
            return next;
        });
    }, []);

    const value = useMemo(() => ({ theme, isDark: theme === 'dark', toggleTheme }), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};

export default ThemeContext;
