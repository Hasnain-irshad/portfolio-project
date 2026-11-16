import React, { useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import Icon from '../common/Icon';
import { contactAPI } from '../../services/api';
import { socialLinks } from '../../lib/links';
import './Contact.css';

const EMPTY = { name: '', email: '', subject: '', message: '' };

const Contact = ({ index, profile }) => {
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle | sending | success | error

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ state: 'sending', message: '' });
        try {
            await contactAPI.submit(form);
            setForm(EMPTY);
            setStatus({ state: 'success', message: "Thanks — your message is on its way. I'll reply soon." });
        } catch (err) {
            setStatus({
                state: 'error',
                message: err.response?.data?.message || 'Something went wrong sending your message. Please try again or email me directly.',
            });
        }
    };

    const socials = socialLinks(profile);
    const sending = status.state === 'sending';

    return (
        <section id="contact" className="sec contact" aria-labelledby="contact-title">
            <div className="container">
                {/* Always rendered with dark tokens: Prompt Blue anchors the brand in both themes */}
                <div className="contact__panel reveal" data-theme="dark">
                    <div className="contact__intro">
                        <SectionHeader
                            id="contact-title"
                            index={index}
                            eyebrow="Contact"
                            title={
                                <>
                                    Let&rsquo;s build something <em>intelligent</em>.
                                </>
                            }
                            lede="Open to AI engineering roles, research collaborations and interesting problems. The fastest way to reach me is email."
                        />

                        {profile?.email && (
                            <a className="contact__email" href={`mailto:${profile.email}`}>
                                <span>{profile.email}</span>
                                <Icon name="arrow-up-right" />
                            </a>
                        )}

                        <ul role="list" className="contact__details">
                            {profile?.location && (
                                <li>
                                    <Icon name="map-pin" /> {profile.location}
                                </li>
                            )}
                            {profile?.phone && (
                                <li>
                                    <Icon name="phone" />
                                    <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
                                </li>
                            )}
                        </ul>

                        {socials.length > 0 && (
                            <ul role="list" className="contact__social">
                                {socials.map((s) => (
                                    <li key={s.key}>
                                        <a className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                            <Icon name={s.icon} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <form className="cf" onSubmit={onSubmit} noValidate={false}>
                        <div className="cf__row">
                            <div className="cf__field">
                                <label htmlFor="cf-name">Name</label>
                                <input id="cf-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={onChange} />
                            </div>
                            <div className="cf__field">
                                <label htmlFor="cf-email">Email</label>
                                <input id="cf-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={onChange} />
                            </div>
                        </div>
                        <div className="cf__field">
                            <label htmlFor="cf-subject">Subject</label>
                            <input id="cf-subject" name="subject" type="text" required value={form.subject} onChange={onChange} />
                        </div>
                        <div className="cf__field">
                            <label htmlFor="cf-message">Message</label>
                            <textarea id="cf-message" name="message" rows="5" maxLength={2000} required value={form.message} onChange={onChange} />
                        </div>

                        <div className="cf__footer">
                            <button type="submit" className="btn btn--primary" disabled={sending}>
                                {sending ? 'Sending…' : 'Send message'}
                                {!sending && <Icon name="send" />}
                            </button>
                            <p
                                className={`cf__status cf__status--${status.state}`}
                                role={status.state === 'error' ? 'alert' : 'status'}
                                aria-live="polite"
                            >
                                {status.state === 'success' && <Icon name="check-circle" />}
                                {status.state === 'error' && <Icon name="alert" />}
                                {status.message}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
