const fmt = (opts) => new Intl.DateTimeFormat('en-US', opts);
const monthYear = fmt({ month: 'short', year: 'numeric' });
const longDate = fmt({ month: 'long', day: 'numeric', year: 'numeric' });

const valid = (d) => d && !Number.isNaN(new Date(d).getTime());

export const formatMonthYear = (d) => (valid(d) ? monthYear.format(new Date(d)) : '');
export const formatLongDate = (d) => (valid(d) ? longDate.format(new Date(d)) : '');
export const formatYear = (d) => (valid(d) ? String(new Date(d).getFullYear()) : '');

/** "Jun 2024 — Sep 2024" / "Jul 2026 — Present" */
export const formatRange = (start, end, current) => {
    const s = formatMonthYear(start);
    const e = current ? 'Present' : formatMonthYear(end);
    if (!s) return e;
    return e ? `${s} — ${e}` : s;
};

/** First sentence of a block of text. */
export const firstSentence = (text = '') => text.match(/^[\s\S]*?[.!?](\s|$)/)?.[0].trim() || text;

/** Reading time estimate for blog content. */
export const readingTime = (text = '') => Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
