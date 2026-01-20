'use client';

import { motion, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

export function KineticTypography({ children, className }: { children: React.ReactNode; className?: string }) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Smooth velocity
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Map velocity to Font Weight (400 -> 800) and Width (100 -> 120)
    // As you scroll faster, the text gets heavier and wider
    // Map velocity to Font Weight (400 -> 800) and Width (100 -> 75 - narrower when fast?)
    // Actually user said "get bolder or change shape".
    // Let's go wider when fast: 100 (Normal) -> 100 is max? No, Bricolage goes 75 to 100.
    // So maybe 85 -> 100 when fast? Or 100 -> 75 (compress when fast)?
    // Let's try expanding: 75 -> 100.
    const fontWeight = useTransform(smoothVelocity, [-1000, 0, 1000], [800, 400, 800]);
    const fontWidth = useTransform(smoothVelocity, [-1000, 0, 1000], [100, 75, 100]); // Compress slightly on speed for aerodynamic feel

    return (
        <motion.div
            style={{
                fontVariationSettings: "'wght' 500, 'wdth' 100", // Fallback / Initial
            }}
            className={cn("font-display", className)} // Ensure font-display is applied
        >
            <motion.div
                style={{
                    // Composing the variation string dynamically
                    fontVariationSettings: useTransform(
                        [fontWeight, fontWidth],
                        ([w, wd]) => `'wght' ${w}, 'wdth' ${wd}`
                    )
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
