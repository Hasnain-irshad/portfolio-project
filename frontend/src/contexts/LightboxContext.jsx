import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../components/common/Lightbox.css';

const LightboxContext = createContext(null);

export const useLightbox = () => {
    const ctx = useContext(LightboxContext);
    // Stay safe if used outside a provider (e.g. admin) — return no-ops.
    return ctx || { openLightbox: () => {}, closeLightbox: () => {} };
};

export const LightboxProvider = ({ children }) => {
    const [image, setImage] = useState(null); // { src, alt }

    const openLightbox = useCallback((src, alt = '') => {
        if (src) setImage({ src, alt });
    }, []);

    const closeLightbox = useCallback(() => setImage(null), []);

    // Esc to close + lock body scroll while open
    useEffect(() => {
        if (!image) return;

        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [image, closeLightbox]);

    return (
        <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
            {children}

            <AnimatePresence>
                {image && (
                    <motion.div
                        className="lightbox-overlay"
                        onClick={closeLightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image viewer"
                    >
                        <button
                            className="lightbox-close"
                            onClick={closeLightbox}
                            aria-label="Close image"
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        <motion.div
                            className="lightbox-stage"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
                        >
                            <img className="lightbox-image" src={image.src} alt={image.alt} />
                            {image.alt && <p className="lightbox-caption">{image.alt}</p>}
                        </motion.div>

                        <span className="lightbox-hint">Click anywhere or press Esc to close</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </LightboxContext.Provider>
    );
};

export default LightboxContext;
