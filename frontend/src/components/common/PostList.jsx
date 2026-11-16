import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { cld, cldSrcSet } from '../../lib/media';
import { formatLongDate, readingTime } from '../../lib/format';
import './PostList.css';

const excerptOf = (b) =>
    b.excerpt || (b.content ? (b.content.length > 180 ? `${b.content.slice(0, 180).trim()}…` : b.content) : '');

/** Editorial list of blog posts; whole row is one link (title is the label). */
const PostList = ({ posts, headingLevel = 3 }) => {
    const H = `h${headingLevel}`;
    return (
        <ol role="list" className="posts">
            {posts.map((b) => (
                <li key={b._id} className="post reveal">
                    <Link to={`/blog/${b._id}`} className="post__link">
                        <div className="post__meta">
                            <time className="meta" dateTime={b.publishDate || b.createdAt}>
                                {formatLongDate(b.publishDate || b.createdAt)}
                            </time>
                            {b.content && <span className="meta">{readingTime(b.content)} min read</span>}
                        </div>

                        <div className="post__main">
                            <H className="post__title">{b.title}</H>
                            <p className="post__excerpt">{excerptOf(b)}</p>
                            {b.tags?.length > 0 && (
                                <ul role="list" className="chip-list post__tags" aria-label="Tags">
                                    {b.tags.slice(0, 4).map((t) => (
                                        <li key={t} className="chip">{t}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {b.image?.url ? (
                            <div className="post__thumb">
                                <img
                                    src={cld(b.image.url, { w: 480 })}
                                    srcSet={cldSrcSet(b.image.url, [320, 480, 720])}
                                    sizes="(max-width: 760px) 100vw, 240px"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    width="240"
                                    height="160"
                                />
                            </div>
                        ) : (
                            <span className="post__arrow" aria-hidden="true">
                                <Icon name="arrow-up-right" />
                            </span>
                        )}
                    </Link>
                </li>
            ))}
        </ol>
    );
};

export default PostList;
