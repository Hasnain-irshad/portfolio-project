import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const buttonClass = `btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`;

    return (
        <motion.button
            className={buttonClass}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn-icon btn-icon-left">{icon}</span>}
                    <span className="btn-text">{children}</span>
                    {icon && iconPosition === 'right' && <span className="btn-icon btn-icon-right">{icon}</span>}
                </>
            )}
        </motion.button>
    );
};

export default Button;
