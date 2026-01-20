"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

export function TrendMetric() {
    return (
        <div className="relative w-full h-full flex flex-col justify-between p-2 pointer-events-none">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
                <div className="p-1 rounded bg-emerald-500/10">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
            </div>

            <div className="flex items-baseline gap-3 relative z-10 pl-1">
                <span className="text-6xl font-bold bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent tracking-tighter">
                    12%
                </span>
                <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+2.4%</span>
            </div>

            {/* Edge-to-edge Sparkline */}
            <div className="absolute inset-x-0 bottom-0 h-24 w-full opacity-80 mix-blend-screen overflow-hidden rounded-b-xl">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <motion.path
                        d="M0 40 L 0 35 C 15 35, 25 38, 40 25 S 60 10, 80 18 S 100 5, 100 5 L 100 40 Z"
                        fill="url(#sparklineGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    <motion.path
                        d="M0 35 C 15 35, 25 38, 40 25 S 60 10, 80 18 S 100 5, 100 5"
                        fill="none"
                        stroke="rgb(52, 211, 153)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#glowGreen)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
            </div>
        </div>
    );
}
