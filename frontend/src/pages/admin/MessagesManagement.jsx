import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminMessagesAPI } from '../../services/adminApi';
import Toast from '../../components/admin/common/Toast';
import Icon from '../../components/common/Icon';
import './MessagesManagement.css';

const dateTime = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
});

const shortDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    return sameDay
        ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Inbox for contact-form submissions. Every submission is saved to the
 * database before any email is attempted, so this page shows all messages
 * even when email delivery (Brevo) is failing.
 */
const MessagesManagement = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | unread
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [toast, setToast] = useState(null);

    const load = useCallback(async () => {
        try {
            const res = await adminMessagesAPI.getAll(token);
            const data = res.data?.data || {};
            setMessages(data.messages || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to load messages', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return messages.filter((m) => {
            if (filter === 'unread' && m.isRead) return false;
            if (!q) return true;
            return [m.name, m.email, m.subject, m.message].some((f) => f?.toLowerCase().includes(q));
        });
    }, [messages, filter, query]);

    const selected = messages.find((m) => m._id === selectedId) || null;

    const open = async (msg) => {
        setSelectedId(msg._id);
        if (msg.isRead) return;
        // Optimistic: mark read locally, then persist.
        setMessages((list) => list.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)));
        setUnreadCount((n) => Math.max(0, n - 1));
        try {
            await adminMessagesAPI.markRead(token, msg._id);
        } catch {
            setMessages((list) => list.map((m) => (m._id === msg._id ? { ...m, isRead: false } : m)));
            setUnreadCount((n) => n + 1);
            setToast({ message: 'Could not mark message as read', type: 'error' });
        }
    };

    const remove = async (msg) => {
        if (!window.confirm(`Delete the message from ${msg.name}? This cannot be undone.`)) return;
        try {
            await adminMessagesAPI.delete(token, msg._id);
            setMessages((list) => list.filter((m) => m._id !== msg._id));
            if (!msg.isRead) setUnreadCount((n) => Math.max(0, n - 1));
            setSelectedId(null);
            setToast({ message: 'Message deleted', type: 'success' });
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to delete message', type: 'error' });
        }
    };

    // Reply opens Gmail's web composer. (mailto: links were removed: they
    // silently do nothing on Windows when no desktop email app is set up.)
    const replyParts = (m) => {
        const subject = `Re: ${m.subject}`;
        // Keep URLs well under browser/OS length limits.
        const quoted = m.message.length > 1200 ? `${m.message.slice(0, 1200)}…` : m.message;
        const body = `\n\n— On ${dateTime.format(new Date(m.createdAt))}, ${m.name} wrote:\n> ${quoted.replace(/\n/g, '\n> ')}`;
        return { subject, body };
    };

    const gmailHref = (m) => {
        const { subject, body } = replyParts(m);
        const q = new URLSearchParams({ view: 'cm', fs: '1', to: m.email, su: subject, body });
        return `https://mail.google.com/mail/?${q.toString()}`;
    };

    const copyAddress = async (m) => {
        try {
            await navigator.clipboard.writeText(m.email);
            setToast({ message: `Copied ${m.email}`, type: 'success' });
        } catch {
            setToast({ message: `Couldn't copy — the address is ${m.email}`, type: 'info' });
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading messages…</div>;
    }

    return (
        <div className="management-page inbox-page">
            <div className="page-header">
                <h2 className="page-title">
                    Messages
                    {unreadCount > 0 && <span className="inbox-badge">{unreadCount} unread</span>}
                </h2>
                <button type="button" className="btn-secondary inbox-refresh" onClick={load}>
                    Refresh
                </button>
            </div>

            <p className="inbox-note">
                Every contact-form submission is saved here, even when the email notification fails to send.
            </p>

            <div className={`inbox ${selected ? 'has-selection' : ''}`}>
                <section className="inbox-list" aria-label="Message list">
                    <div className="inbox-tools">
                        <div className="inbox-filter" role="group" aria-label="Filter messages">
                            {[
                                ['all', `All (${messages.length})`],
                                ['unread', `Unread (${unreadCount})`],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={filter === key ? 'is-active' : ''}
                                    aria-pressed={filter === key}
                                    onClick={() => setFilter(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <label className="inbox-search">
                            <span className="sr-only">Search messages</span>
                            <input
                                type="search"
                                placeholder="Search name, email, subject…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </label>
                    </div>

                    {visible.length === 0 ? (
                        <div className="inbox-empty">
                            {messages.length === 0 ? 'No messages yet.' : 'No messages match this filter.'}
                        </div>
                    ) : (
                        <ul role="list" className="inbox-items">
                            {visible.map((m) => (
                                <li key={m._id}>
                                    <button
                                        type="button"
                                        className={`inbox-item ${m.isRead ? '' : 'is-unread'} ${m._id === selectedId ? 'is-selected' : ''}`}
                                        onClick={() => open(m)}
                                        aria-current={m._id === selectedId ? 'true' : undefined}
                                    >
                                        <span className="inbox-item__top">
                                            <span className="inbox-item__name">
                                                {!m.isRead && <span className="inbox-dot" aria-label="Unread" />}
                                                {m.name}
                                            </span>
                                            <time dateTime={m.createdAt}>{shortDate(m.createdAt)}</time>
                                        </span>
                                        <span className="inbox-item__subject">{m.subject}</span>
                                        <span className="inbox-item__preview">{m.message}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="inbox-detail" aria-label="Selected message" aria-live="polite">
                    {selected ? (
                        <article>
                            <button type="button" className="inbox-back" onClick={() => setSelectedId(null)}>
                                <Icon name="arrow-left" width="16" height="16" /> All messages
                            </button>
                            <header className="inbox-detail__head">
                                <h3>{selected.subject}</h3>
                                <p className="inbox-detail__from">
                                    <strong>{selected.name}</strong>{' '}
                                    <span className="inbox-detail__email">&lt;{selected.email}&gt;</span>
                                </p>
                                <p className="inbox-detail__date">{dateTime.format(new Date(selected.createdAt))}</p>
                            </header>
                            <div className="inbox-detail__body">{selected.message}</div>
                            <div className="inbox-detail__actions">
                                <a className="btn-primary" href={gmailHref(selected)} target="_blank" rel="noopener noreferrer">
                                    <Icon name="send" width="16" height="16" /> Reply in Gmail
                                </a>
                                <button type="button" className="btn-secondary inbox-alt" onClick={() => copyAddress(selected)}>
                                    <Icon name="link" width="16" height="16" /> Copy address
                                </button>
                                <button type="button" className="btn-delete" onClick={() => remove(selected)}>
                                    Delete
                                </button>
                            </div>
                        </article>
                    ) : (
                        <div className="inbox-placeholder">
                            <Icon name="mail" width="28" height="28" />
                            <p>Select a message to read it.</p>
                        </div>
                    )}
                </section>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default MessagesManagement;
