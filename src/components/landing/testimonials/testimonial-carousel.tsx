'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Software Engineer',
        company: 'landed at Google',
        avatar: 'SC',
        content: 'Finally landed my dream job! This tool helped me track 47 applications and never miss a follow-up.',
        gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
        name: 'Marcus Johnson',
        role: 'Product Manager',
        company: 'landed at Stripe',
        avatar: 'MJ',
        content: 'The analytics showed me which companies actually respond. Game changer for my job search strategy.',
        gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
        name: 'Emily Rodriguez',
        role: 'UX Designer',
        company: 'landed at Figma',
        avatar: 'ER',
        content: 'Went from spreadsheet chaos to organized clarity. Interview scheduling alone saved me hours.',
        gradient: 'from-orange-500/20 to-red-500/20',
    },
    {
        name: 'David Kim',
        role: 'Data Scientist',
        company: 'landed at OpenAI',
        avatar: 'DK',
        content: 'The pipeline view made it easy to see exactly where each application stood. No more guessing.',
        gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
        name: 'Priya Patel',
        role: 'Frontend Developer',
        company: 'landed at Vercel',
        avatar: 'PP',
        content: 'I tracked 60+ applications without losing my mind. The reminders are incredibly helpful.',
        gradient: 'from-indigo-500/20 to-violet-500/20',
    },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            className="flex-shrink-0 w-[320px] md:w-[380px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <div className="relative group h-full">
                {/* Glassmorphism card */}
                <div className={cn(
                    'relative h-full p-6 rounded-2xl overflow-hidden',
                    'bg-white/[0.03] backdrop-blur-xl',
                    'border border-white/[0.08]',
                    'transition-all duration-500',
                    'hover:bg-white/[0.05] hover:border-white/[0.12]',
                    'hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                )}>
                    {/* Background gradient on hover */}
                    {/* Tactile Surface on hover (Micro-Skeuomorphism) */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />

                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                        }}
                    />

                    <div className="relative z-10">
                        {/* Quote */}
                        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 group-hover:text-white/90 transition-colors">
                            &ldquo;{testimonial.content}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            {/* Avatar with gradient ring */}
                            {prefersReducedMotion ? (
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                                    'bg-gradient-to-br from-white/10 to-white/5',
                                    'border border-white/10',
                                    'text-white/80'
                                )}>
                                    {testimonial.avatar}
                                </div>
                            ) : (
                                <motion.div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                                        'bg-gradient-to-br from-white/10 to-white/5',
                                        'border border-white/10',
                                        'text-white/80'
                                    )}
                                    whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.3)' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    {testimonial.avatar}
                                </motion.div>
                            )}

                            <div>
                                <div className="text-white text-sm font-medium">{testimonial.name}</div>
                                <div className="text-slate-500 text-xs">
                                    {testimonial.role} · <span className="text-green-500/80">{testimonial.company}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated border glow on hover */}
                    {!prefersReducedMotion && (
                        <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                backgroundSize: '200% 100%',
                            }}
                            animate={{
                                backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function TestimonialCarousel() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const prefersReducedMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);

    // Double the testimonials for seamless infinite scroll
    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <div ref={ref} className="mt-12 md:mt-16 lg:mt-20 pt-8 md:pt-12 lg:pt-16 border-t border-[#1a1a1a]">
            {/* Section label */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                    Success Stories
                </span>
            </motion.div>

            {/* Infinite scroll container */}
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Gradient masks for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                {/* Scrolling track */}
                {prefersReducedMotion ? (
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="flex gap-6 py-4"
                        animate={{
                            x: isPaused ? undefined : [0, -50 * testimonials.length + '%'],
                        }}
                        transition={{
                            x: {
                                duration: 40,
                                repeat: Infinity,
                                ease: 'linear',
                            },
                        }}
                        style={{ width: 'max-content' }}
                    >
                        {doubledTestimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={`${testimonial.name}-${index}`}
                                testimonial={testimonial}
                                index={index % testimonials.length}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
