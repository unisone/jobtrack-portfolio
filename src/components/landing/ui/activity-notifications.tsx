'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';

const activityNotifications = [
    { name: 'Alex', action: 'just tracked', detail: '5 new applications', location: 'San Francisco' },
    { name: 'Jordan', action: 'moved to', detail: 'Interview stage', location: 'New York' },
    { name: 'Taylor', action: 'received', detail: 'an offer!', location: 'Austin' },
    { name: 'Morgan', action: 'scheduled', detail: 'a technical interview', location: 'Seattle' },
    { name: 'Casey', action: 'added', detail: '3 referrals', location: 'Boston' },
];

export function FloatingActivityNotifications() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [progress, setProgress] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    const isTouch = useIsTouchDevice();

    const DISPLAY_DURATION = 8000; // 8 seconds per notification

    useEffect(() => {
        // Don't show on touch devices or if user prefers reduced motion or dismissed
        if (isTouch || prefersReducedMotion || isDismissed) return;

        let revealTimeout: ReturnType<typeof setTimeout> | null = null;
        let progressInterval: ReturnType<typeof setInterval> | null = null;

        // Initial delay before first notification
        const initialDelay = setTimeout(() => {
            setIsVisible(true);
            setProgress(0);
        }, 5000);

        const startProgressTimer = () => {
            setProgress(0);
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 100 / (DISPLAY_DURATION / 100), 100));
            }, 100);
        };

        const scheduleReveal = () => {
            setIsVisible(false);
            if (revealTimeout) clearTimeout(revealTimeout);
            if (progressInterval) clearInterval(progressInterval);

            revealTimeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % activityNotifications.length);
                setIsVisible(true);
                startProgressTimer();
            }, 500);
        };

        // Start initial progress timer after initial delay
        const progressDelay = setTimeout(startProgressTimer, 5000);

        // Cycle through notifications
        const interval = setInterval(scheduleReveal, DISPLAY_DURATION);

        return () => {
            clearTimeout(initialDelay);
            clearTimeout(progressDelay);
            clearInterval(interval);
            if (revealTimeout) clearTimeout(revealTimeout);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isTouch, prefersReducedMotion, isDismissed]);

    // Don't render on mobile or SSR or if dismissed
    if (isTouch === null || isTouch || prefersReducedMotion || isDismissed) return null;

    const notification = activityNotifications[currentIndex];

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50 pointer-events-auto"
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? [0, -5, 0] : 20, // Floating animation handled here mixed with entrance
                x: isVisible ? 0 : 20,
            }}
            // Continuous floating animation
            transition={{
                y: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    repeatType: "mirror"
                },
                default: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
        >
            {/* Glassmorphism container with glow */}
            <div className="relative group">
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main toast - Enhanced glassmorphism */}
                <div className={cn(
                    'relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl',
                    'glass-premium'
                )}>
                    {/* Animated avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center ring-1 ring-white/10">
                            <span className="text-xs font-medium text-white">
                                {notification.name.charAt(0)}
                            </span>
                        </div>
                        {/* Live indicator */}
                        <motion.div
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black/80"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Content */}
                    <div className="text-sm flex-1 min-w-0">
                        <span className="text-white font-medium">{notification.name}</span>
                        <span className="text-slate-400"> {notification.action} </span>
                        <span className="text-white/90">{notification.detail}</span>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors ml-1"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500/50 to-purple-500/50"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
