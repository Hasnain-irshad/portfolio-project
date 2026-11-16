import { useEffect, useState } from 'react';

/** Returns the id of the section currently in the upper part of the viewport. */
export function useActiveSection(ids, enabled = true) {
    const [active, setActive] = useState('');
    const key = ids.join('|');

    useEffect(() => {
        if (!enabled || !('IntersectionObserver' in window)) return undefined;
        const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
        if (!els.length) return undefined;

        const visible = new Map();
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
                const first = ids.find((id) => visible.get(id));
                setActive(first || '');
            },
            // A thin band ~30% from the top decides the "current" section.
            { rootMargin: '-30% 0px -65% 0px', threshold: 0 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, enabled]);

    return active;
}
