import React from 'react';
import { useLightbox } from '../../contexts/LightboxContext';

/**
 * Drop-in replacement for <img>. Clicking the image opens it in a fullscreen
 * lightbox. Forwards any extra props (e.g. loading, style) to the <img>.
 */
const ZoomableImage = ({ src, alt = '', className = '', onClick, ...props }) => {
    const { openLightbox } = useLightbox();

    const handleClick = (e) => {
        openLightbox(src, alt);
        if (onClick) onClick(e);
    };

    return (
        <img
            src={src}
            alt={alt}
            className={`zoomable-image ${className}`.trim()}
            onClick={handleClick}
            {...props}
        />
    );
};

export default ZoomableImage;
