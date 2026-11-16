import React from 'react';
import { useLightbox } from '../../contexts/LightboxContext';
import { cld, cldSrcSet } from '../../lib/media';

/**
 * Optimised, keyboard-accessible image that opens the lightbox.
 * - Serves Cloudinary f_auto/q_auto at responsive widths.
 * - Lazy-loads unless `eager`.
 * - Pass `gallery` (array of {src, alt}) + `index` to browse several images.
 */
const ZoomableImage = ({
    src,
    alt = '',
    widths = [480, 800, 1200],
    sizes = '(max-width: 640px) 100vw, 50vw',
    gallery,
    index = 0,
    eager = false,
    className = '',
    imgClassName = '',
    width,
    height,
}) => {
    const { openLightbox, openGallery } = useLightbox();
    if (!src) return null;

    const open = () => (gallery?.length ? openGallery(gallery, index) : openLightbox(src, alt));

    return (
        <button type="button" className={`zoomable ${className}`.trim()} onClick={open} aria-label={`View larger image${alt ? `: ${alt}` : ''}`}>
            <img
                src={cld(src, { w: widths[Math.min(1, widths.length - 1)] })}
                srcSet={cldSrcSet(src, widths)}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className={imgClassName}
            />
        </button>
    );
};

export default ZoomableImage;
