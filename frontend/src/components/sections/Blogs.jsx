import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Blogs.css';

const Blogs = ({ blogs }) => {
    if (!blogs || blogs.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const displayBlogs = blogs.slice(0, 3);

    return (
        <section id="blogs" className="section blogs">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Blog</h2>
                    <p className="section-subtitle">Thoughts, tutorials, and insights</p>
                </div>

                <div className="blogs-grid grid-3">
                    {displayBlogs.map((blog, index) => (
                        <motion.article
                            key={blog._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="blog-card card"
                        >
                            {blog.image?.url && (
                                <div className="blog-image">
                                    <img src={blog.image.url} alt={blog.title} />
                                </div>
                            )}

                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="blog-date">
                                        <i className="fas fa-calendar"></i>
                                        {formatDate(blog.publishDate || blog.createdAt)}
                                    </span>
                                </div>

                                <h3 className="blog-title">{blog.title}</h3>

                                <p className="blog-excerpt">
                                    {blog.excerpt || (blog.content ? (blog.content.length > 180 ? blog.content.slice(0, 180) + '...' : blog.content) : '')}
                                </p>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="blog-tags">
                                        {blog.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="blog-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="blog-footer">
                                    <Link to={`/blog/${blog._id}`} className="read-more">
                                        Read More <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="view-all-container">
                    <Link to="/blogs" className="btn btn-outline view-all-btn">
                        View All Blogs <i className="fas fa-external-link-alt"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
