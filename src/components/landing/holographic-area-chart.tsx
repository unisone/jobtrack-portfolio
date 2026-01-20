"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Mock Data: Applications vs Interviews over 6 months
const data = [
    { label: "Jan", apps: 20, interviews: 2 },
    { label: "Feb", apps: 35, interviews: 5 },
    { label: "Mar", apps: 28, interviews: 4 },
    { label: "Apr", apps: 45, interviews: 8 },
    { label: "May", apps: 40, interviews: 12 },
    { label: "Jun", apps: 55, interviews: 15 },
];

export function HolographicAreaChart({ className }: { className?: string }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Dimensions - Increased padding to prevent clipping and overlap
    const padding = 20;
    const bottomPadding = 40; // More space for labels/bottom axis
    const width = 600; // viewBox width
    const height = 300; // viewBox height
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding - bottomPadding;

    // Scales
    const maxApps = Math.max(...data.map((d) => d.apps));

    // Helper to map value to coordinate
    const getX = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
    const getY = (value: number, max: number) => (height - bottomPadding) - (value / max) * chartHeight;

    const createPath = (key: "apps" | "interviews", max: number) => {
        return data.map((d, i) =>
            `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d[key], max)}`
        ).join(" ");
    };

    const createAreaPath = (key: "apps" | "interviews", max: number) => {
        const linePath = createPath(key, max);
        return `${linePath} L ${getX(data.length - 1)},${height - bottomPadding} L ${padding},${height - bottomPadding} Z`;
    };

    const appsPath = useMemo(() => createPath("apps", maxApps), [maxApps]);
    const appsArea = useMemo(() => createAreaPath("apps", maxApps), [maxApps]);

    const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
        <div ref={containerRef} className={cn("relative w-full h-full min-h-[220px] flex flex-col pointer-events-auto", className)}>
            <div className="absolute top-4 left-6 z-10 pointer-events-none">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Analytics</h3>
                <p className="text-[10px] text-slate-500">Applications vs Interviews</p>
            </div>

            <div className="flex-1 w-full h-full relative"
                onMouseLeave={() => setHoveredIndex(null)}>

                {/* Interaction Layer */}
                <div className="absolute inset-0 z-20 flex row-auto">
                    {data.map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full cursor-crosshair"
                            onMouseEnter={() => setHoveredIndex(i)}
                        />
                    ))}
                </div>

                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="appsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="interviewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.5, 1].map((t) => (
                        <line
                            key={t}
                            x1={padding}
                            y1={padding + t * chartHeight}
                            x2={width - padding}
                            y2={padding + t * chartHeight}
                            stroke="white"
                            strokeOpacity="0.08"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Apps Area & Line */}
                    <motion.path
                        d={appsArea}
                        fill="url(#appsGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <motion.path
                        d={appsPath}
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="3"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Interviews Area & Line */}
                    <motion.path
                        d={createAreaPath("interviews", maxApps)}
                        fill="url(#interviewsGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    />
                    <motion.path
                        d={createPath("interviews", maxApps)}
                        fill="none"
                        stroke="rgb(168, 85, 247)"
                        strokeWidth="3"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                    />

                    {/* Hover Indicator */}
                    <AnimatePresence>
                        {hoveredIndex !== null && (
                            <g>
                                <motion.line
                                    initial={{ opacity: 0, y2: height - bottomPadding }}
                                    animate={{ opacity: 1, y2: padding }}
                                    exit={{ opacity: 0, y2: height - bottomPadding }}
                                    x1={getX(hoveredIndex)}
                                    x2={getX(hoveredIndex)}
                                    y1={height - bottomPadding}
                                    y2={padding}
                                    stroke="white"
                                    strokeOpacity="0.4"
                                    strokeDasharray="3 3"
                                />

                                {/* Points on lines */}
                                {[
                                    { val: data[hoveredIndex].apps, color: "rgb(59, 130, 246)" },
                                    { val: data[hoveredIndex].interviews, color: "rgb(168, 85, 247)" }
                                ].map((pt, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={getX(hoveredIndex)}
                                        cy={getY(pt.val, maxApps)}
                                        r="6"
                                        fill="black"
                                        stroke={pt.color}
                                        strokeWidth="3"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    />
                                ))}
                            </g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Tooltip Overlay */}
                <AnimatePresence>
                    {hoveredIndex !== null && activePoint && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute top-4 right-6 bg-zinc-900/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl z-30 min-w-[140px]"
                        >
                            <div className="text-xs text-slate-400 mb-2 font-medium tracking-wide">{activePoint.label} 2026</div>
                            <div className="flex items-center justify-between gap-4 mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    <span className="text-xs font-medium text-slate-200">Applied</span>
                                </div>
                                <span className="text-sm font-bold text-white font-mono">{activePoint.apps}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                    <span className="text-xs font-medium text-slate-200">Intrvw</span>
                                </div>
                                <span className="text-sm font-bold text-white font-mono">{activePoint.interviews}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
