/** Resume opens in Google's viewer (Cloudinary serves raw PDFs as downloads). */
export const resumeUrl = (resume) => {
    const url = resume?.fileUrl || resume?.url;
    if (!url) return null;
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

/** Social links present on the profile, in display order. */
export const socialLinks = (profile) => {
    const s = profile?.socialLinks || {};
    return [
        s.github && { key: 'github', label: 'GitHub', href: s.github, icon: 'github' },
        s.linkedin && { key: 'linkedin', label: 'LinkedIn', href: s.linkedin, icon: 'linkedin' },
        s.twitter && { key: 'twitter', label: 'X (Twitter)', href: s.twitter, icon: 'x' },
        s.instagram && { key: 'instagram', label: 'Instagram', href: s.instagram, icon: 'instagram' },
        s.website && { key: 'website', label: 'Website', href: s.website, icon: 'globe' },
    ].filter(Boolean);
};

export const initials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('') || 'P';
