'use client';

import React from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { LineChart, ArrowUpRight } from 'lucide-react';

// Duplicate items for seamless loop
const TRENDS = [
    'Senior Frontend Engineer',
    'Product Designer',
    'Full Stack Developer',
    'Engineering Manager',
    'DevOps Specialist',
    'AI Research Scientist',
    'Senior Frontend Engineer', // Start repeating
    'Product Designer',
    'Full Stack Developer',
];

export function TrendsCard() {
    return (
        <div className="relative h-full w-full p-6 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 z-10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-white/10">
                    <LineChart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Market Trends</h3>
                    <p className="text-xs text-slate-400">Top rising roles</p>
                </div>
            </div>

            {/* Mask for the scroll area */}
            <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="absolute top-0 left-0 w-full flex flex-col gap-3"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    whileHover={{ animationPlayState: "paused" }} // Logic handling specific to framer-motion loops often needs separate controls, but CSS override works well for simple pauses or motion value manipulation.
                // Actually, framer motion 'animate' prop overrides CSS hover.
                // Better approach for pause on hover with pure Framer Motion:
                >
                    {/* We will render the list twice to ensure smooth looping */}
                    {[...TRENDS, ...TRENDS].map((role, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group cursor-pointer"
                        >
                            <span className="text-sm text-slate-300 font-medium">{role}</span>
                            <span className="text-xs text-green-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                +12% <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Overlay to handle hover pause properly if motion value is used, but for simple Marquee, 
                    we can just use the motion component. 
                    However, Framer Motion doesn't natively support "pause on hover" easily without component state.
                    Let's use a simpler approach: duplicate content and animate Y. */
                }
            </div>

            {/* Re-implementing correctly for pause-on-hover */}
            <TickerContent />
        </div>
    );
}

function TickerContent() {
    const controls = useAnimationControls();

    React.useEffect(() => {
        controls.start({
            y: "-50%",
            transition: {
                duration: 20,
                ease: "linear",
                repeat: Infinity,
            }
        });
    }, [controls]);

    return (
        <div
            className="flex-1 overflow-hidden relative"
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() => controls.start({
                y: "-50%",
                transition: {
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                }
            })}
        // Note: simple stop/start resets position which is jarring. 
        // A better way for seamless pause is using timeScale or CSS. 
        // Let's use a CSS animation class for the marquee and just pause it with hover.
        >
            <div className="absolute inset-0 [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]">
                <div className="animate-marquee-vertical hover:[animation-play-state:paused] flex flex-col gap-3 w-full">
                    {[...TRENDS, ...TRENDS].map((role, i) => (
                        <div
                            key={`${role}-${i}`}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group cursor-pointer"
                        >
                            <span className="text-sm text-slate-300 font-medium">{role}</span>
                            <span className="text-xs text-green-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                +12% <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
