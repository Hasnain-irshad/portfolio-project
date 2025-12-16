import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { contactAPI } from '../../services/api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await contactAPI.submit(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="section contact">
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="contact-content"
                >
                    <div className="contact-info">
                        <h3>Let's work together!</h3>
                        <p>Have a project in mind or just want to say hi? Feel free to drop me a message!</p>

                        <div className="contact-details">
                            <div className="contact-detail">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p>your@email.com</p>
                                </div>
                            </div>

                            <div className="contact-detail">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Location</h4>
                                    <p>Your City, Country</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        {success && (
                            <div className="alert alert-success">
                                <i className="fas fa-check-circle"></i> Message sent successfully! I'll get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            loading={loading}
                            disabled={loading}
                        >
                            Send Message
                        </Button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
