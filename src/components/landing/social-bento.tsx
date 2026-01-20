'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BentoCard } from './bento-card';
import { Users, TrendingUp, Star, Clock } from 'lucide-react';

export function SocialBento() {
    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Trusted By Builders</h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {/* Metric 1 */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="blue">
                        <div className="h-full p-6 flex flex-col justify-between">
                            <Users className="w-6 h-6 text-white/60" />
                            <div>
                                <div className="text-4xl font-light text-white tracking-tight">10K+</div>
                                <div className="text-sm text-slate-500 mt-1">Applications Tracked</div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Metric 2 */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="green">
                        <div className="h-full p-6 flex flex-col justify-between">
                            <TrendingUp className="w-6 h-6 text-white/60" />
                            <div>
                                <div className="text-4xl font-light text-white tracking-tight">87%</div>
                                <div className="text-sm text-slate-500 mt-1">Interview Rate</div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Metric 3 */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="orange">
                        <div className="h-full p-6 flex flex-col justify-between">
                            <Star className="w-6 h-6 text-white/60" />
                            <div>
                                <div className="text-4xl font-light text-white tracking-tight">4.9</div>
                                <div className="text-sm text-slate-500 mt-1">User Rating</div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Metric 4 */}
                    <BentoCard colSpan={1} rowSpan={1} glowColor="purple">
                        <div className="h-full p-6 flex flex-col justify-between">
                            <Clock className="w-6 h-6 text-white/60" />
                            <div>
                                <div className="text-4xl font-light text-white tracking-tight">24h</div>
                                <div className="text-sm text-slate-500 mt-1">Time Saved / Week</div>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    );
}
