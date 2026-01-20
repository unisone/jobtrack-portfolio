'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { Search, ArrowRight, Clipboard, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple click away hook if not available
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

export function HeroInput({
    className,
}: {
    className?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => {
        if (isOpen && !value) setIsOpen(false);
    });

    // Magnetic Pull Logic
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOpen) return; // Disable magnetic pull when open/focused
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        mouseX.set((clientX - centerX) * 0.3); // Pull factor
        mouseY.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            className={cn("relative z-50 w-full max-w-2xl mx-auto h-[60px]", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={ref}
        >
            {/* Layout wrapper to prevent layout shift */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">

                <motion.div
                    layout
                    ref={containerRef}
                    style={{ x, y }}
                    initial={{ borderRadius: 32 }}
                    animate={{
                        borderRadius: isOpen ? 24 : 32,
                        width: isOpen ? '100%' : '60%',
                        x: isOpen ? 0 : x.get(), // Reset position when open
                        y: isOpen ? 0 : y.get(),
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "relative overflow-hidden transition-colors duration-500 glass-premium",
                        isOpen ? "border-white/20 shadow-2xl shadow-blue-500/20" : "hover:border-white/10"
                    )}
                    // Custom border gradient via style or utility if possible, using standard border for now with after element for gradient
                    onClick={() => !isOpen && setIsOpen(true)}
                >
                    {/* Linear Gradient Border Overlay */}
                    <div
                        className="absolute inset-0 rounded-[inherit] pointer-events-none p-[1px]"
                        style={{
                            background: isOpen
                                ? 'linear-gradient(to bottom right, rgba(255,255,255,0.3), rgba(255,255,255,0.05))'
                                : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                        }}
                    />

                    {/* Clean Technical Background - No Blobs */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-white/1" />

                    <motion.div layout className="relative flex flex-col">
                        {/* Input Row */}
                        <div className="flex items-center gap-4 px-6 h-[60px]">
                            <Search className={cn(
                                "w-5 h-5 transition-colors",
                                isOpen ? "text-blue-400" : "text-slate-500"
                            )} />

                            <motion.input
                                layout
                                autoFocus={isOpen}
                                type="text"
                                placeholder="Paste a job URL to track..."
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base font-medium h-full w-full"
                            />

                            <AnimatePresence mode="popLayout">
                                {value && (
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-6 pb-6 overflow-hidden"
                                >
                                    <div className="h-px w-full bg-white/10 mb-4" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                                                <Clipboard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">Paste from Clipboard</div>
                                                <div className="text-xs text-slate-400">Quick add link</div>
                                            </div>
                                        </button>

                                        <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">Upload Resume</div>
                                                <div className="text-xs text-slate-400">Parse PDF/Docx</div>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <div className="text-xs text-slate-300">
                                            <span className="font-medium text-white">Pro Tip:</span> Paste a LinkedIn job post to auto-fill details.
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
