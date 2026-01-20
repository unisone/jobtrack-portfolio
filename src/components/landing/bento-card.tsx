'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { HolographicCard } from './holographic-card';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
    glowColor?: 'blue' | 'purple' | 'green' | 'orange';
    delay?: number;
    parallaxSpeed?: number;
}

const spotlightColors = {
    blue: 'rgba(59, 130, 246, 0.35)',
    purple: 'rgba(139, 92, 246, 0.35)',
    green: 'rgba(34, 197, 94, 0.35)',
    orange: 'rgba(249, 115, 22, 0.35)',
};

export function BentoCard({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    glowColor = 'blue',
    parallaxSpeed = 1,
}: BentoCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Connect to scroll progress for this specific card
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'], // Triggers when top of card hits bottom of screen
    });

    // Apple-style Interpolation:
    // As it scrolls into view (0 to 0.3 range effectively):
    // Scale: 0.9 -> 1
    // Opacity: 0 -> 1
    // RotateX: 15deg -> 0deg (flips up)
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const rotateX = useTransform(scrollYProgress, [0, 0.3], [15, 0]);
    // Combined entrance (50->0) and parallax drift (0 -> -50 * speed)
    const y = useTransform(scrollYProgress, [0, 0.3, 1], [50, 0, -50 * parallaxSpeed]);

    // Add spring physics for smoother feel
    const springConfig = { stiffness: 300, damping: 30, mass: 1 };
    const smoothScale = useSpring(scale, springConfig);
    const smoothOpacity = useSpring(opacity, springConfig);
    const smoothRotateX = useSpring(rotateX, springConfig);
    const smoothY = useSpring(y, springConfig);

    // Dynamic Grid Classes
    const gridClasses = cn(
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'md:col-span-3',
        rowSpan === 2 && 'md:row-span-2',
    );

    return (
        <motion.div
            ref={ref}
            className={cn('h-full perspective-1000', gridClasses, className)}
            style={{
                scale: smoothScale,
                opacity: smoothOpacity,
                rotateX: smoothRotateX,
                y: smoothY,
                transformStyle: 'preserve-3d', // Crucial for 3D flip effect
            }}
        >
            <HolographicCard
                spotlightColor={spotlightColors[glowColor]}
                className="h-full rounded-2xl border-white/[0.08]"
            >
                {children}
            </HolographicCard>
        </motion.div>
    );
}
