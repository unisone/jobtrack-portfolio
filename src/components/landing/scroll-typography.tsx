'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScrollTypographyProps {
    children: React.ReactNode;
    className?: string;
    variableFont?: boolean; // If true, uses font-variation-settings
}

export function ScrollTypography({ children, className, variableFont = false }: ScrollTypographyProps) {
    const ref = useRef<HTMLHeadingElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Animation range: As it moves from bottom (0) to top (1)
    // Peak effect at center (0.5)
    // Tracking: Starts wide (tight), gets normal at center, gets wide again
    // Weight: Light at edges, Bold at center

    // Mapping:
    // 0.2 (entering) -> normal weight, tight tracking
    // 0.5 (center) -> bold weight, normal tracking
    // 0.8 (leaving) -> normal weight, tight tracking

    // Using simple spring to smooth values
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 20 });

    const letterSpacing = useTransform(
        smoothProgress,
        [0.2, 0.5, 0.8],
        ['-0.05em', '0em', '-0.05em']
    );

    const fontWeight = useTransform(
        smoothProgress,
        [0.2, 0.5, 0.8],
        [300, 600, 300]
    );

    const blur = useTransform(
        smoothProgress,
        [0.2, 0.5, 0.8],
        [4, 0, 4]
    );

    const opacity = useTransform(
        smoothProgress,
        [0.1, 0.5, 0.9],
        [0.3, 1, 0.3]
    );

    const weightVariation = useTransform(fontWeight, (w) => `'wght' ${w}`);

    return (
        <motion.h2
            ref={ref}
            className={cn('will-change-transform', className)}
            style={{
                letterSpacing,
                fontWeight: variableFont ? undefined : fontWeight, // Standard CSS weight
                filter: useTransform(blur, (b) => `blur(${b}px)`),
                opacity,
                // If using variable fonts (e.g. Inter var), we can animate 'wght' axis precisely:
                fontVariationSettings: variableFont ? weightVariation : undefined
            }}
        >
            {children}
        </motion.h2>
    );
}
