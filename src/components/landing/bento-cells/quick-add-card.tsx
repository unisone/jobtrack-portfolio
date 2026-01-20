'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * QuickAddCard - Animated fake input field for Quick Add preview
 * Shows typewriter effect demonstrating smart autofill
 */
export function QuickAddCard() {
    const [displayText, setDisplayText] = useState('');
    const [showSuggestion, setShowSuggestion] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.8 });
    const prefersReducedMotion = useReducedMotion();

    // Short text to fit in narrow cards
    const fullText = 'SWE';
    const suggestion = ' @ Google';

    useEffect(() => {
        if (!isInView || prefersReducedMotion) {
            if (prefersReducedMotion) {
                setDisplayText(fullText);
                setShowSuggestion(true);
            }
            return;
        }

        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                // Show suggestion after typing completes
                setTimeout(() => setShowSuggestion(true), 200);
            }
        }, 80);

        return () => clearInterval(typeInterval);
    }, [isInView, prefersReducedMotion]);

    return (
        <div ref={ref} className="h-full w-full p-5 flex flex-col justify-between">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center border border-white/10">
                    <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Quick Add</h3>
                    <p className="text-xs text-slate-400">Autofill details</p>
                </div>
            </div>

            {/* Interaction Area */}
            <div className="mt-4 space-y-2">
                {/* Fake input field */}
                <div className="relative">
                    <div className={cn(
                        'w-full px-3 py-2.5 rounded-lg text-sm',
                        'bg-white/[0.03] border border-white/[0.08]',
                        'flex items-center min-w-0'
                    )}>
                        <span className="text-white/90 truncate">{displayText}</span>
                        {showSuggestion && (
                            <motion.span
                                className="text-white/40 truncate"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {suggestion}
                            </motion.span>
                        )}
                        <motion.span
                            className="w-0.5 h-4 bg-white/60 ml-0.5 flex-shrink-0"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                        />
                    </div>
                </div>

                {/* Tab hint - moved below input */}
                {showSuggestion && (
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center gap-1.5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.08] text-emerald-400/80 font-mono border border-white/5">Tab</kbd>
                            <span className="text-[10px] text-white/40">to accept</span>
                        </motion.div>

                        {/* Autofill chips */}
                        <motion.div
                            className="flex flex-wrap gap-1.5"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            {['Remote', '$180k'].map((chip) => (
                                <span
                                    key={chip}
                                    className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300/70 border border-emerald-500/20"
                                >
                                    {chip}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
