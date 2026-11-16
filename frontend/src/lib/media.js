/**
 * Cloudinary delivery helpers. Uploaded originals are served at full size and
 * in their original format (PNGs up to 350 KB); these add on-the-fly
 * f_auto (WebP/AVIF), q_auto and width limits.
 * Non-Cloudinary URLs and raw files (PDFs) are returned unchanged.
 */
const MARKER = '/image/upload/';

export function cld(url, { w, h, crop = 'limit' } = {}) {
    if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes(MARKER)) {
        return url;
    }
    const parts = ['f_auto', 'q_auto'];
    if (w) parts.push(`w_${w}`);
    if (h) parts.push(`h_${h}`);
    if (w || h) parts.push(`c_${crop}`);
    return url.replace(MARKER, `${MARKER}${parts.join(',')}/`);
}

/** Responsive srcset for a list of widths. */
export function cldSrcSet(url, widths, opts) {
    if (!url || !url.includes('res.cloudinary.com')) return undefined;
    return widths.map((w) => `${cld(url, { ...opts, w })} ${w}w`).join(', ');
}

/** Large-but-sane version for the lightbox. */
export const lightboxSrc = (url) => cld(url, { w: 1800 });
