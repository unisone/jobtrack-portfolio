'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';

interface HeroHeadlineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Apple-style Massive Headline
 * - 96-128px responsive font size
 * - Light weight (300)
 * - Tight letter spacing
 * - Reveal animation on scroll
 */
export function HeroHeadline({ children, className, delay = 0 }: HeroHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.h1
      ref={ref}
      className={cn(
        'font-light tracking-tight leading-[0.95]',
        // Responsive massive typography
        'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem]',
        className
      )}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      {children}
    </motion.h1>
  );
}

/**
 * Gradient text span for emphasis
 */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#0052CC]',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Section headline - smaller than hero but still bold
 */
export function SectionHeadline({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.h2
      ref={ref}
      className={cn(
        'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight',
        'text-gray-900',
        align === 'center' && 'text-center',
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      {children}
    </motion.h2>
  );
}
