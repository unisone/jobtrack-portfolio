'use client';

import { useMotionTemplate, useMotionValue, motion } from 'motion/react';
import React from 'react';
import { cn } from '@/lib/utils';

export function HolographicCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className={cn(
                'group relative overflow-hidden glass-premium',
                className
            )}
            onMouseMove={handleMouseMove}
            initial={{ y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Tactile Spotlight - Technical Monochrome */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 40%
            )
          `,
                }}
            />
            {/* Edge Highlight - Micro-Skeuomorphism */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-300" />

            <div className="relative h-full">{children}</div>
        </motion.div>
    );
}
