'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  /** Height multiplier for scroll distance (e.g., 2 = 200vh scroll distance) */
  scrollMultiplier?: number;
}

/**
 * Sticky Scroll Section
 * Content stays pinned while user scrolls through the section height
 * Perfect for phase-based animations like Apple.com product reveals
 */
export function ScrollSection({
  children,
  className,
  scrollMultiplier = 2,
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Progress range when this content is visible (0-1) */
  showRange?: [number, number];
}

/**
 * Content that reveals based on scroll position within a ScrollSection
 */
export function ScrollReveal({
  children,
  className,
  showRange = [0, 1],
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [showRange[0], showRange[0] + 0.1, showRange[1] - 0.1, showRange[1]],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [showRange[0], showRange[0] + 0.1, showRange[1] - 0.1, showRange[1]],
    [50, 0, 0, -50]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Speed multiplier (0.5 = half speed, 2 = double speed) */
  speed?: number;
}

/**
 * Parallax Layer
 * Content moves at different speed than scroll for depth effect
 */
export function ParallaxLayer({
  children,
  className,
  speed = 0.5,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${(1 - speed) * 100}%`]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
}
