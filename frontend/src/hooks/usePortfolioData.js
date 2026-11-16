import { useEffect, useState } from 'react';
import snapshot from '../data/snapshot.json';
import {
    profileAPI,
    resumeAPI,
    projectsAPI,
    skillsAPI,
    experienceAPI,
    achievementsAPI,
    educationAPI,
    certificatesAPI,
    blogsAPI,
    publicationsAPI,
    activitiesAPI,
} from '../services/api';

/**
 * Stale-while-revalidate portfolio content.
 *
 * Renders immediately from the build-time snapshot (src/data/snapshot.json),
 * then refreshes every section from the live API in the background. The live
 * request is made once per page session and shared by every page, so a
 * sleeping Render backend (≈30 s cold start) never blocks first paint.
 */
const SOURCES = {
    profile: () => profileAPI.get(),
    resume: () => resumeAPI.get(),
    projects: () => projectsAPI.getAll(),
    skills: () => skillsAPI.getAll(),
    experience: () => experienceAPI.getAll(),
    achievements: () => achievementsAPI.getAll(),
    education: () => educationAPI.getAll(),
    certificates: () => certificatesAPI.getAll(),
    blogs: () => blogsAPI.getAll(),
    publications: () => publicationsAPI.getAll(),
    activities: () => activitiesAPI.getAll(),
};

const LIST_KEYS = Object.keys(SOURCES).filter((k) => k !== 'profile' && k !== 'resume');

const normalize = (raw = {}) => {
    const out = { profile: raw.profile ?? null, resume: raw.resume ?? null };
    LIST_KEYS.forEach((k) => {
        out[k] = Array.isArray(raw[k]) ? raw[k] : [];
    });
    return out;
};

let current = normalize(snapshot);
let livePromise = null;
let liveDone = false;
const listeners = new Set();

function loadLive() {
    if (livePromise) return livePromise;
    livePromise = Promise.allSettled(
        Object.entries(SOURCES).map(async ([key, fn]) => {
            const res = await fn();
            let data = res?.data?.data ?? null;
            if (key === 'skills') data = data?.skills || data;
            return [key, data];
        })
    ).then((results) => {
        const next = { ...current };
        let changed = false;
        results.forEach((r) => {
            if (r.status !== 'fulfilled') return; // keep snapshot value for this section
            const [key, data] = r.value;
            const value = LIST_KEYS.includes(key) ? (Array.isArray(data) ? data : []) : data ?? null;
            // Only replace sections whose content actually changed, so an
            // up-to-date snapshot causes no re-render at all.
            if (JSON.stringify(value) !== JSON.stringify(current[key])) {
                next[key] = value;
                changed = true;
            }
        });
        liveDone = true;
        if (changed) current = next;
        listeners.forEach((fn) => fn(current, changed));
        return current;
    });
    return livePromise;
}

/**
 * @param {{ trackLive?: boolean }} [opts] — set trackLive when the page needs
 *   to know the live request has finished (e.g. to tell "not found" from
 *   "still loading"). Off by default so an unchanged refresh re-renders nothing.
 */
export function usePortfolioData({ trackLive = false } = {}) {
    const [data, setData] = useState(current);
    const [isLive, setIsLive] = useState(liveDone);

    useEffect(() => {
        // setData with the same object reference is a no-op in React.
        const onUpdate = (next) => {
            setData(next);
            if (trackLive) setIsLive(true);
        };
        listeners.add(onUpdate);
        loadLive();
        // Covers the case where live data landed between render and effect.
        if (liveDone && current !== data) onUpdate(current);
        return () => listeners.delete(onUpdate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, isLive };
}
