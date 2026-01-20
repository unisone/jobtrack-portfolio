'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

const data = [20, 35, 28, 45, 40, 55, 48, 62];

export function AnalyticsCard({ }: { scrollProgress?: MotionValue<number> }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-20%' });
    const [activePoint, setActivePoint] = useState<number | null>(null);

    // Calculate path
    const width = 100;
    const height = 40;
    const max = Math.max(...data);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d / max) * height;
        return `${x},${y}`;
    }).join(' ');

    const pathD = `M ${points}`;

    return (
        <div ref={ref} className="relative h-full w-full flex flex-col justify-between p-6 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-white/10">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">Analytics</h3>
                        <p className="text-xs text-slate-400">Live performance metrics</p>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-40 w-full mt-auto">
                {/* Glow effect around the line */}
                <div className="absolute inset-0 filter blur-[10px] opacity-70">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="rgba(59, 130, 246, 0.5)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                </div>

                {/* Main Line */}
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                {/* Interactive Overlay & Staggered Bars */}
                <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-between px-1">
                    {data.map((h, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "w-2 rounded-t-sm transition-colors duration-300 cursor-pointer",
                                activePoint === i ? "bg-white" : "bg-white/10 hover:bg-white/20"
                            )}
                            style={{ height: `${(h / max) * 100}%` }}
                            initial={{ scaleY: 0 }}
                            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                            transition={{
                                delay: 1.2 + (i * 0.1), // Starts after line is mostly drawn
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }}
                            onMouseEnter={() => setActivePoint(i)}
                            onMouseLeave={() => setActivePoint(null)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
