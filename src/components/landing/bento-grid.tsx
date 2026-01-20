'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BentoCard } from './bento-card';

// Feature Cards
import { AnalyticsCard } from './bento-cells/analytics-card';
import { CalendarCard } from './bento-cells/calendar-card';
import { TrendsCard } from './bento-cells/trends-card';
import { QuickAddCard } from './bento-cells/quick-add-card';
import { GlassNotificationStack } from './glass-notification-stack';

export function BentoGrid() {
    return (
        <section id="features" className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Global Background Reflection/Shimmer Effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-45"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Section Header */}
                <div className="mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm text-slate-500 uppercase tracking-wide mb-4 block"
                    >
                        Features
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="headline-massive font-light text-white tracking-tight mb-4"
                    >
                        Everything you need.
                    </motion.h2>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="headline-massive font-light text-[#666] tracking-tight"
                    >
                        Nothing you don&apos;t.
                    </motion.h2>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">

                    {/* 1. Analytics Dashboard (Large, 2x2) */}
                    <BentoCard colSpan={2} rowSpan={2} glowColor="blue">
                        <AnalyticsCard />
                    </BentoCard>

                    {/* 2. Interview Calendar (1x1) */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="purple" delay={0.1} parallaxSpeed={1.1}>
                        <CalendarCard />
                    </BentoCard>

                    {/* 3. Quick Add (1x1) */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="green" delay={0.2} parallaxSpeed={0.9}>
                        <QuickAddCard />
                    </BentoCard>

                    {/* 4. Smart Reminders (1x1) */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="orange" delay={0.3} parallaxSpeed={1.2}>
                        <div className="h-full p-6 flex flex-col">
                            <div className="mb-auto">
                                <h3 className="text-lg font-medium text-white mb-1">Reminders</h3>
                                <p className="text-xs text-slate-400">Never miss a follow-up</p>
                            </div>
                            {/* Reusing existing component but wrapping for sizing */}
                            <div className="relative h-[180px] w-full mt-4 flex items-center justify-center transform scale-90 origin-bottom">
                                <GlassNotificationStack />
                            </div>
                        </div>
                    </BentoCard>

                    {/* 5. Trends (2x1 - Span 2 columns on bottom right) */}
                    {/* Note: Original plan said Trends 1x1, but let's make it 2x1 to fill the grid nicely if we have 3 cols */}
                    {/* Grid layout so far:
                [ Analytics ] [ Analytics ] [ Calendar ]
                [ Analytics ] [ Analytics ] [ QuickAdd ]
                [ Reminders ] [ Trends    ] [ Trends   ] 
             */}
                    <BentoCard colSpan={2} rowSpan={1} glowColor="purple" delay={0.4}>
                        <TrendsCard />
                    </BentoCard>

                </div>

            </div>
        </section>
    );
}
