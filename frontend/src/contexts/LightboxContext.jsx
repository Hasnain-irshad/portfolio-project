import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/common/Icon';
import { lightboxSrc } from '../lib/media';
import '../components/common/Lightbox.css';

const LightboxContext = createContext(null);

export const useLightbox = () => {
    const ctx = useContext(LightboxContext);
    // Safe no-ops outside the provider.
    return ctx || { openLightbox: () => {}, openGallery: () => {}, closeLightbox: () => {} };
};

export const LightboxProvider = ({ children }) => {
    const [state, setState] = useState(null); // { items: [{src, alt}], index }
    const closeBtn = useRef(null);
    const lastFocus = useRef(null);

    const openGallery = useCallback((items, index = 0) => {
        const list = (items || []).filter((i) => i?.src);
        if (!list.length) return;
        lastFocus.current = document.activeElement;
        setState({ items: list, index: Math.min(index, list.length - 1) });
    }, []);

    const openLightbox = useCallback((src, alt = '') => openGallery([{ src, alt }], 0), [openGallery]);

    const closeLightbox = useCallback(() => setState(null), []);

    const step = useCallback(
        (dir) =>
            setState((s) => (s && s.items.length > 1 ? { ...s, index: (s.index + dir + s.items.length) % s.items.length } : s)),
        []
    );

    const isOpen = !!state;

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowRight') step(1);
            else if (e.key === 'ArrowLeft') step(-1);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeBtn.current?.focus();
        const restore = lastFocus.current;
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            restore?.focus?.();
        };
    }, [isOpen, closeLightbox, step]);

    const value = useMemo(() => ({ openLightbox, openGallery, closeLightbox }), [openLightbox, openGallery, closeLightbox]);
    const item = state?.items[state.index];
    const many = (state?.items.length || 0) > 1;

    return (
        <LightboxContext.Provider value={value}>
            {children}

            {state && (
                <div className="lb" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={closeLightbox}>
                    <button ref={closeBtn} className="lb__btn lb__close" onClick={closeLightbox} aria-label="Close image viewer">
                        <Icon name="close" />
                    </button>

                    {many && (
                        <button
                            className="lb__btn lb__nav lb__nav--prev"
                            onClick={(e) => {
                                e.stopPropagation();
                                step(-1);
                            }}
                            aria-label="Previous image"
                        >
                            <Icon name="chevron-left" />
                        </button>
                    )}

                    <figure className="lb__stage" onClick={(e) => e.stopPropagation()}>
                        <img key={item.src} className="lb__img" src={lightboxSrc(item.src)} alt={item.alt} />
                        {(item.alt || many) && (
                            <figcaption className="lb__caption">
                                {item.alt}
                                {many && (
                                    <span className="meta">
                                        {' '}
                                        {state.index + 1} / {state.items.length}
                                    </span>
                                )}
                            </figcaption>
                        )}
                    </figure>

                    {many && (
                        <button
                            className="lb__btn lb__nav lb__nav--next"
                            onClick={(e) => {
                                e.stopPropagation();
                                step(1);
                            }}
                            aria-label="Next image"
                        >
                            <Icon name="chevron-right" />
                        </button>
                    )}
                </div>
            )}
        </LightboxContext.Provider>
    );
};

export default LightboxContext;
