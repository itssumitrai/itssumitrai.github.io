import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'theme-preference';
const VALID = ['light', 'dark', 'system'];

function readInitial() {
    if (!browser) return 'system';
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return VALID.includes(v) ? v : 'system';
    } catch {
        return 'system';
    }
}

export const preference = writable(readInitial());

export const resolved = derived(preference, ($p, set) => {
    if (!browser) {
        set('light');
        return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const compute = () => ($p === 'system' ? (mq.matches ? 'dark' : 'light') : $p);
    set(compute());
    const onChange = () => {
        if ($p === 'system') set(compute());
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
});

if (browser) {
    preference.subscribe((p) => {
        try {
            localStorage.setItem(STORAGE_KEY, p);
        } catch {}
    });
    resolved.subscribe((r) => {
        document.documentElement.setAttribute('data-theme', r);
    });
}
