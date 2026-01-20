'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// Animated Gradient Border - Rotating conic gradient
// ═══════════════════════════════════════════════════════════════════════════

export function GradientBorderCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('relative group', className)}>
            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-gradient-rotate" />
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-70 transition-opacity duration-500 animate-gradient-rotate" />

            {/* Content */}
            <div className="relative rounded-2xl bg-[#0a0a0a] border border-[#222] group-hover:border-transparent transition-colors duration-500">
                {children}
            </div>
        </div>
    );
}
