import React from 'react';

/**
 * Editorial section header: "01 —— EYEBROW" + serif title.
 * `title` may contain an <em> for the italic accent word.
 */
const SectionHeader = ({ index, eyebrow, title, lede, id }) => (
    <header className="sec-head reveal">
        <p className="eyebrow">
            {index && <span className="eyebrow__index">{index}</span>}
            <span className="eyebrow__rule" aria-hidden="true" />
            {eyebrow}
        </p>
        <h2 className="sec-title" id={id}>
            {title}
        </h2>
        {lede && <p className="sec-lede">{lede}</p>}
    </header>
);

export default SectionHeader;
