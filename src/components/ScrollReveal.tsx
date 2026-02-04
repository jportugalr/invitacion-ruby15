'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    distance?: number;
    className?: string;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 50,
    className = '',
    once = true
}: ScrollRevealProps) {

    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { y: distance, opacity: 0 };
            case 'down': return { y: -distance, opacity: 0 };
            case 'left': return { x: distance, opacity: 0 };
            case 'right': return { x: -distance, opacity: 0 };
            default: return { y: distance, opacity: 0 };
        }
    };

    const getFinalPosition = () => {
        switch (direction) {
            case 'up':
            case 'down': return { y: 0, opacity: 1 };
            case 'left':
            case 'right': return { x: 0, opacity: 1 };
            default: return { y: 0, opacity: 1 };
        }
    };

    return (
        <motion.div
            initial={getInitialPosition()}
            whileInView={getFinalPosition()}
            viewport={{ once }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier for premium feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
