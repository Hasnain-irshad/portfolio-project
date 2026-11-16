/**
 * Build-time content snapshot.
 *
 * Fetches the public portfolio content from the API and writes it to
 * src/data/snapshot.json. The app renders this snapshot instantly on first
 * paint and then refreshes it from the live API in the background, so
 * visitors never wait on a sleeping (cold-start) backend.
 *
 * Never fails the build: if the API is unreachable, the previously committed
 * snapshot is kept as-is.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/data/snapshot.json');

// Vite env files are not loaded for plain node scripts, so read VITE_API_URL
// from the process env first, then from .env.production / .env as fallbacks.
async function apiBase() {
    if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
    for (const f of ['.env.production', '.env']) {
        try {
            const txt = await readFile(resolve(root, f), 'utf8');
            const m = txt.match(/^\s*VITE_API_URL\s*=\s*(.+)\s*$/m);
            if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
        } catch { /* file missing */ }
    }
    return null;
}

const ENDPOINTS = {
    profile: '/profile',
    resume: '/resume',
    projects: '/projects',
    skills: '/skills',
    experience: '/experience',
    achievements: '/achievements',
    education: '/education',
    certificates: '/certificates',
    blogs: '/blogs',
    publications: '/publications',
    activities: '/activities',
};

async function main() {
    const base = (await apiBase())?.replace(/\/$/, '');
    if (!base || /localhost|127\.0\.0\.1/.test(base)) {
        console.log(`[snapshot] Skipped (API base is ${base || 'unset'}); keeping existing snapshot.`);
        return;
    }

    console.log(`[snapshot] Fetching content from ${base} (may take ~30s if the API is cold)…`);
    // 90s budget covers a Render free-tier cold start.
    const signal = AbortSignal.timeout(90_000);

    const entries = await Promise.allSettled(
        Object.entries(ENDPOINTS).map(async ([key, path]) => {
            const res = await fetch(base + path, { signal, headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
            const body = await res.json();
            let data = body?.data ?? null;
            if (key === 'skills') data = data?.skills || data || [];
            return [key, data];
        })
    );

    const failed = entries.filter((e) => e.status === 'rejected');
    if (failed.length) {
        console.warn(`[snapshot] ${failed.length} request(s) failed (${failed.map((f) => f.reason?.message).join('; ')}). Keeping existing snapshot.`);
        return;
    }

    const snapshot = { generatedAt: new Date().toISOString(), ...Object.fromEntries(entries.map((e) => e.value)) };
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(snapshot, null, 2) + '\n');
    console.log(`[snapshot] Wrote ${out}`);
}

main().catch((err) => {
    console.warn(`[snapshot] Unexpected error, keeping existing snapshot: ${err.message}`);
});
