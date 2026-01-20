'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// ═══════════════════════════════════════════════════════════════════════════
// NEW: Cinematic Text Reveal Component
// ═══════════════════════════════════════════════════════════════════════════

export function CinematicText({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay
                    }
                }
            }}
        >
            {React.Children.map(children, (child) => (
                <motion.span
                    className="inline-block"
                    variants={{
                        hidden: {
                            y: 20,
                            opacity: 0,
                            filter: 'blur(12px)'
                        },
                        visible: {
                            y: 0,
                            opacity: 1,
                            filter: 'blur(0px)',
                            transition: {
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }
                    }}
                >
                    {child}
                </motion.span>
            ))}
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Text Scramble Effect - Characters scramble then reveal
// ═══════════════════════════════════════════════════════════════════════════


// Scramble character set - defined outside hook to avoid recreation
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function useTextScramble(text: string, isInView: boolean) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!isInView) return;

        let iteration = 0;
        const maxIterations = text.length;

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration) return text[index];
                        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                    })
                    .join('')
            );

            iteration += 1 / 3;

            if (iteration >= maxIterations) {
                clearInterval(interval);
                setDisplayText(text);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, isInView]);

    return displayText;
}

export function ScrambleText({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const displayText = useTextScramble(children, isInView);

    return (
        <span ref={ref} className={cn('font-mono', className)}>
            {displayText}
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Word Reveal Animation - 2026 High-End Staggered Blur Reveal
// (Replaced SplitText character animation for cleaner, faster effect)
// ═══════════════════════════════════════════════════════════════════════════

export function WordReveal({
    children,
    className,
    delay = 0,
    priority = false,
}: {
    children: string;
    className?: string;
    delay?: number;
    priority?: boolean;
}) {
    const words = children.split(' ');
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [isMounted, setIsMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Track mount state for SSR handling
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // SSR / pre-hydration / reduced motion: show plain text immediately
    // This ensures text is always visible (critical for SEO and accessibility)
    // Note: prefersReducedMotion can be null during initial hydration, treat as false
    if (!isMounted || prefersReducedMotion === true) {
        return <span className={cn('inline-block', className)}>{children}</span>;
    }

    return (
        <span className={cn('inline', className)} ref={ref}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline"
                    initial={priority ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={priority ? undefined : (isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {})}
                    transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        delay: delay + i * 0.1,
                    }}
                >
                    {word}
                    {i < words.length - 1 && ' '}
                </motion.span>
            ))}
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Kinetic Typography - Rotating value proposition words
// ═══════════════════════════════════════════════════════════════════════════

const valuePropositionWords = ['organized.', 'simplified.', 'automated.', 'accelerated.'];

export function RotatingWords({
    words = valuePropositionWords,
    className,
    interval = 3000,
}: {
    words?: string[];
    className?: string;
    interval?: number;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Track when component is mounted on client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Start rotation only after mount and if motion is allowed
    useEffect(() => {
        if (!isMounted || prefersReducedMotion) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval, prefersReducedMotion, isMounted]);

    // SSR / initial render / reduced motion: show plain text immediately
    // This ensures the word is ALWAYS visible
    if (!isMounted || prefersReducedMotion) {
        return <span className={className}>{words[0]}</span>;
    }

    // Client-side with animations enabled
    return (
        <span className={cn('relative inline-block', className)}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[currentIndex]}
                    className="inline-block"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    {words[currentIndex]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Scroll Velocity Skew - Elements skew based on scroll speed
// ═══════════════════════════════════════════════════════════════════════════

export function ScrollVelocityText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const skewX = useTransform(smoothVelocity, [-500, 0, 500], [5, 0, -5]);
    const scaleX = useTransform(smoothVelocity, [-500, 0, 500], [0.98, 1, 0.98]);

    return (
        <motion.div style={{ skewX, scaleX }} className={className}>
            {children}
        </motion.div>
    );
}
