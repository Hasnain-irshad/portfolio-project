import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    className = '',
    glass = false,
    hover = true,
    padding = 'default',
    ...props
}) => {
    const cardClass = `
        card 
        ${glass ? 'card-glass' : ''} 
        ${hover ? 'card-hover' : ''} 
        card-padding-${padding}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <motion.div
            className={cardClass}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
