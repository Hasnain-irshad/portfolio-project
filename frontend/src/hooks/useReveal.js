import { useEffect } from 'react';

/**
 * Adds `.is-visible` to `.reveal` elements as they scroll into view.
 * One shared IntersectionObserver; re-scans when `deps` change (e.g. when
 * live data replaces the snapshot). Without JS or with reduced motion the
 * CSS never hides anything, so content is always reachable.
 */
export function useReveal(deps = []) {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll('.reveal:not(.is-visible)'));
        if (!els.length) return undefined;

        if (!('IntersectionObserver' in window)) {
            els.forEach((el) => el.classList.add('is-visible'));
            return undefined;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
