'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Calendar } from 'lucide-react';

export function CalendarCard() {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            mouseX.set(x);
            mouseY.set(y);
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const springConfig = { damping: 25, stiffness: 150 };
    const xSpring = useSpring(mouseX, springConfig);
    const ySpring = useSpring(mouseY, springConfig);

    // Parallax layers move at different speeds
    const layer1X = useTransform(xSpring, [-200, 200], [-10, 10]);
    const layer1Y = useTransform(ySpring, [-200, 200], [-10, 10]);

    const layer2X = useTransform(xSpring, [-200, 200], [-25, 25]);
    const layer2Y = useTransform(ySpring, [-200, 200], [-25, 25]);

    return (
        <div
            ref={ref}
            className="relative h-full w-full p-6 flex flex-col overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-white/10">
                    <Calendar className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Schedule</h3>
                    <p className="text-xs text-slate-400">Upcoming interviews</p>
                </div>
            </div>

            {/* Parallax Content Container */}
            <div className="relative flex-1 min-h-[120px]">
                {/* Background Layer (Static faint dates) */}
                <div className="absolute inset-0 grid grid-cols-7 gap-2 opacity-10 pointer-events-none">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className="rounded-full bg-white aspect-square" />
                    ))}
                </div>

                {/* Layer 1: Normal depth */}
                <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-0 z-10">
                    <div className="absolute top-2 left-4 px-3 py-2 bg-zinc-800/90 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
                        <div className="text-[10px] text-slate-400">Tue, 10:00 AM</div>
                        <div className="text-sm font-medium text-white">Google - Sys Design</div>
                    </div>
                </motion.div>

                {/* Layer 2: Closer depth (High parallax) */}
                <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute bottom-4 right-2 px-3 py-2 bg-blue-600/90 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
                        <div className="text-[10px] text-blue-100">Fri, 2:00 PM</div>
                        <div className="text-sm font-medium text-white">Netflix - Culture</div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
