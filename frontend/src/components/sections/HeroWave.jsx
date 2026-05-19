import React, { useEffect, useRef } from 'react';

/**
 * HeroWave — an animated flowing gradient ribbon rendered as layered SVG lines.
 * The lines twist together into a ribbon that pinches and spreads as it travels,
 * giving the signature "flow" look. Paths are mutated directly per frame for
 * smooth animation without React re-renders.
 */
const LINES = 36;
const SAMPLES = 70;
const W = 1200;
const H = 620;

const HeroWave = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const paths = Array.from(svg.querySelectorAll('path'));

        const buildPath = (lineIndex, time) => {
            const u = lineIndex / (LINES - 1); // 0..1 across the ribbon width
            let d = '';
            for (let s = 0; s <= SAMPLES; s++) {
                const px = s / SAMPLES;
                const x = px * W;
                // Base S-curve that drifts over time
                const base =
                    H * 0.5 +
                    Math.sin(px * Math.PI * 1.7 + time) * H * 0.18 +
                    Math.sin(px * Math.PI * 3.4 - time * 0.55) * H * 0.055;
                // Envelope that pinches the ribbon (turn) and spreads it (face-on)
                const spread = Math.sin(px * Math.PI * 2.1 - time * 0.8) * 0.5 + 0.5;
                const y = base + (u - 0.5) * spread * H * 0.66;
                d += `${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
            }
            return d;
        };

        const draw = (time) => {
            for (let i = 0; i < paths.length; i++) {
                paths[i].setAttribute('d', buildPath(i, time));
            }
        };

        const reduced =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduced) {
            draw(0.6);
            return;
        }

        let raf;
        let t = 0;
        const tick = () => {
            t += 0.0055;
            draw(t);
            raf = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <svg
            ref={svgRef}
            className="hero-wave"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="heroWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f0abfc" />
                    <stop offset="38%" stopColor="#d946ef" />
                    <stop offset="68%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>
            {Array.from({ length: LINES }).map((_, i) => (
                <path
                    key={i}
                    fill="none"
                    stroke="url(#heroWaveGrad)"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            ))}
        </svg>
    );
};

export default HeroWave;
