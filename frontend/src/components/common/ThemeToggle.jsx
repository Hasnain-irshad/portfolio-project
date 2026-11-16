import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from './Icon';
import './ThemeToggle.css';

/** Keyboard-accessible theme switch (Sun/Moon), announces its state. */
const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    return (
        <button
            type="button"
            className={`theme-toggle ${className}`.trim()}
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            aria-pressed={!isDark}
        >
            <span className="theme-toggle__track" aria-hidden="true">
                <Icon name="moon" className="theme-toggle__icon theme-toggle__icon--moon" />
                <Icon name="sun" className="theme-toggle__icon theme-toggle__icon--sun" />
            </span>
        </button>
    );
};

export default ThemeToggle;
