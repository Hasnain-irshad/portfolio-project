import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import PostList from '../common/PostList';
import Icon from '../common/Icon';

const Blogs = ({ index, blogs }) => {
    if (!blogs?.length) return null;

    return (
        <section id="blogs" className="sec blogs" aria-labelledby="blogs-title">
            <div className="container">
                <SectionHeader
                    id="blogs-title"
                    index={index}
                    eyebrow="Writing"
                    title={
                        <>
                            Notes on <em>building</em> with AI.
                        </>
                    }
                />
                <PostList posts={blogs.slice(0, 3)} />
                <div className="blogs__more reveal" style={{ marginTop: 32 }}>
                    <Link to="/blogs" className="btn btn--ghost">
                        All writing <Icon name="arrow-right" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
