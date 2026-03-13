import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import { blogsAPI, profileAPI } from '../services/api';
import './BlogsPage.css';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const [blogsRes, profileRes] = await Promise.all([
                    blogsAPI.getAll(),
                    profileAPI.get()
                ]);
                setBlogs(blogsRes.data.data);
                setProfile(profileRes.data.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
        window.scrollTo(0, 0);
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return <Loading />;

    return (
        <div className="blogs-page">
            <Header />
            <main className="blogs-main">
                <section className="blogs-hero">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hero-content"
                        >
                            <h1 className="page-title">Blog Articles</h1>
                            <p className="page-subtitle">Exploring technology, design, and software development.</p>
                        </motion.div>
                    </div>
                </section>

                <section className="blogs-list-section">
                    <div className="container">
                        {blogs.length === 0 ? (
                            <div className="no-blogs">
                                <h3>No blog posts found.</h3>
                                <Link to="/" className="btn btn-primary">Back to Home</Link>
                            </div>
                        ) : (
                            <div className="blogs-grid">
                                {blogs.map((blog, index) => (
                                    <motion.article
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
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
                                                    {blog.tags.map((tag, i) => (
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
                        )}
                    </div>
                </section>
            </main>
            <Footer profile={profile} />
        </div>
    );
};

export default BlogsPage;
