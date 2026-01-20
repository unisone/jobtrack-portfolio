'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'motion/react';

import {
  ArrowRight,
  ArrowUpRight,
  Target,
  Calendar,
  Briefcase,
  TrendingUp,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Scroll components
import { LenisProvider } from './scroll/lenis-provider';
import { ScrollProgress } from './scroll/scroll-progress';
import { HeroInput } from './hero-input';
import { AmbientBackground } from './ambient-background';
import { KineticTypography } from './kinetic-typography';
import { TestimonialCarousel } from './testimonials/testimonial-carousel';
import { CinematicText } from './ui/cinematic-text';
import { FloatingActivityNotifications } from './ui/activity-notifications';
import { GradientBorderCard } from './ui/gradient-border-card';

// ═══════════════════════════════════════════════════════════════════════════
// Design System - Dark Mode Editorial + Modern Cool Stuff
// ═══════════════════════════════════════════════════════════════════════════

const ease = [0.16, 1, 0.3, 1] as const;

// Helper to detect touch devices moved to @/hooks/use-is-touch-device

// View Transitions utility for smooth section navigation
function useViewTransitions() {
  const smoothScrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Check if View Transitions API is supported
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    } else {
      // Fallback for browsers without View Transitions
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return { smoothScrollToSection };
}

// ═══════════════════════════════════════════════════════════════════════════
// Social Proof - Bento Grid
// ═══════════════════════════════════════════════════════════════════════════

import { SocialBento } from './social-bento';


// ═══════════════════════════════════════════════════════════════════════════
// Testimonial Carousel - Infinite scrolling testimonials with glassmorphism
// ═══════════════════════════════════════════════════════════════════════════

// TestimonialCarousel extracted to ./testimonials/testimonial-carousel

// ═══════════════════════════════════════════════════════════════════════════
// NEW: Cinematic Text Reveal Component
// ═══════════════════════════════════════════════════════════════════════════

// CinematicText extracted to ./ui/cinematic-text

// ═══════════════════════════════════════════════════════════════════════════
// Floating Activity Notifications - Live social proof
// ═══════════════════════════════════════════════════════════════════════════

// FloatingActivityNotifications extracted to ./ui/activity-notifications

// ═══════════════════════════════════════════════════════════════════════════
// Text Scramble Effect - Characters scramble then reveal
// ═══════════════════════════════════════════════════════════════════════════


// Scramble character set - defined outside hook to avoid recreation
// Text Scramble extracted to ./ui/cinematic-text

// ═══════════════════════════════════════════════════════════════════════════
// Word Reveal Animation - 2026 High-End Staggered Blur Reveal
// (Replaced SplitText character animation for cleaner, faster effect)
// ═══════════════════════════════════════════════════════════════════════════

// WordReveal extracted to ./ui/cinematic-text

// ═══════════════════════════════════════════════════════════════════════════
// Kinetic Typography - Rotating value proposition words
// ═══════════════════════════════════════════════════════════════════════════

// RotatingWords extracted to ./ui/cinematic-text

// ═══════════════════════════════════════════════════════════════════════════
// Animated Gradient Border - Rotating conic gradient
// ═══════════════════════════════════════════════════════════════════════════

// GradientBorderCard extracted to ./ui/gradient-border-card

// ═══════════════════════════════════════════════════════════════════════════
// Scroll Velocity Skew - Elements skew based on scroll speed
// ═══════════════════════════════════════════════════════════════════════════

// ScrollVelocityText extracted to ./ui/cinematic-text

// ═══════════════════════════════════════════════════════════════════════════
// Interactive Feature Showcase - Modern 3D Experience
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// Premium Feature Showcase - Apple/Linear/Vercel Quality
// ═══════════════════════════════════════════════════════════════════════════

// Magnetic hover effect hook - pulls element slightly toward cursor
function useMagneticHover(strength: number = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x: xSpring, y: ySpring, handleMouseMove, handleMouseLeave };
}

// Premium Card with neumorphic shadows and micro-interactions
function PremiumFeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    accentColor: string;
    stats: { value: string; label: string }[];
  };
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const magnetic = useMagneticHover(0.15);
  const prefersReducedMotion = useReducedMotion();

  // Cleanup ripple timeouts on unmount to prevent memory leaks
  useEffect(() => {
    const timeouts = rippleTimeouts.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  // 3D tilt effect
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 400, damping: 30 });
  const shadowBlur = useSpring(20, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Subtle tilt - max 8 degrees
    rotateX.set((mouseY / (rect.height / 2)) * -8);
    rotateY.set((mouseX / (rect.width / 2)) * 8);

    magnetic.handleMouseMove(e);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!prefersReducedMotion) {
      scale.set(1.02);
      shadowBlur.set(40);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    shadowBlur.set(20);
    magnetic.handleMouseLeave();
  };

  // Ripple effect on click - with proper cleanup
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    // Limit max ripples to prevent accumulation on rapid clicks
    setRipples(prev => [...prev.slice(-4), { x, y, id }]);

    const timeoutId = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
      rippleTimeouts.current.delete(timeoutId);
    }, 600);

    rippleTimeouts.current.add(timeoutId);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotateX: 0,
      } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1], // Custom ease-out expo
      }}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
    >
      <motion.div
        className="relative h-full"
        style={{
          rotateX,
          rotateY,
          scale,
          x: magnetic.x,
          y: magnetic.y,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Neumorphic shadow layers - creates depth */}
        <motion.div
          className="absolute -inset-1 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${feature.accentColor}15 0%, transparent 50%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Main card */}
        <div
          className={cn(
            'relative h-full rounded-3xl overflow-hidden cursor-pointer',
            'transition-all duration-500 ease-out',
            // Neumorphic shadows
            'shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]',
            isHovered && 'shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]',
            isPressed && 'shadow-[0_2px_10px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05),inset_0_2px_4px_rgba(0,0,0,0.2)]',
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            'absolute inset-0 transition-opacity duration-700',
            feature.gradient,
          )} />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${feature.accentColor}20 0%, transparent 60%)`,
            }}
          />

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                background: `radial-gradient(circle, ${feature.accentColor}30 0%, transparent 70%)`,
              }}
              initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
              animate={{ width: 400, height: 400, x: -200, y: -200, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
            {/* Icon with micro-interaction */}
            <motion.div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                'bg-white/10 backdrop-blur-sm border border-white/10',
                'transition-all duration-300',
                isHovered && 'bg-white/15 border-white/20',
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Icon className={cn(
                'w-7 h-7 transition-all duration-300',
                isHovered ? 'text-white' : 'text-white/80',
              )} />
            </motion.div>

            {/* Title with stagger */}
            <motion.h3
              className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
            >
              {feature.title}
            </motion.h3>

            {/* Subtitle */}
            <motion.p
              className={cn(
                'text-sm font-medium mb-4 transition-colors duration-300',
                isHovered ? 'text-white/90' : 'text-white/60',
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
            >
              {feature.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-white/70 leading-relaxed mb-8 flex-grow"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
            >
              {feature.description}
            </motion.p>

            {/* Stats row with counting animation */}
            <div className="flex gap-6 pt-6 border-t border-white/10">
              {feature.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15 + 0.5 + i * 0.1, duration: 0.4 }}
                >
                  <div className={cn(
                    'text-xl md:text-2xl font-semibold transition-colors duration-300',
                    isHovered ? 'text-white' : 'text-white/90',
                  )}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hover arrow indicator */}
            <motion.div
              className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
                x: isHovered ? 0 : -10,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InteractiveFeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
  const isCardsInView = useInView(cardsRef, { once: true, margin: '-50px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms - disabled for reduced motion
  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [1, 1.1, 1.2]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], prefersReducedMotion ? ['0%', '0%'] : ['0%', '-10%']);

  const features = [
    {
      id: 'tracking',
      title: 'All Your Applications',
      subtitle: 'Never lose track again',
      description: 'Every job you apply to, tracked in one place. Smart categorization, status updates, and timeline views keep your search organized.',
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]',
      accentColor: '#3b82f6',
      stats: [
        { value: '10K+', label: 'Jobs Tracked' },
        { value: '99.9%', label: 'Uptime' },
      ],
    },
    {
      id: 'analytics',
      title: 'Response Analytics',
      subtitle: 'Understand your success',
      description: 'See which roles and companies respond most. Data-driven insights reveal patterns to optimize your job search strategy.',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-[#0a0a0a] via-[#110a14] to-[#0a0a0a]',
      accentColor: '#a855f7',
      stats: [
        { value: '87%', label: 'Avg Response' },
        { value: '3.2x', label: 'Faster Offers' },
      ],
    },
    {
      id: 'pipeline',
      title: 'Interview Pipeline',
      subtitle: 'From application to offer',
      description: 'Visual pipeline guides you through every stage. Phone screens, technicals, onsites—track your progress in real-time.',
      icon: Calendar,
      gradient: 'bg-gradient-to-br from-[#0a0a0a] via-[#14100a] to-[#0a0a0a]',
      accentColor: '#f97316',
      stats: [
        { value: '5', label: 'Stages' },
        { value: '24h', label: 'Reminders' },
      ],
    },
    {
      id: 'network',
      title: 'Network Connections',
      subtitle: 'Your professional web',
      description: 'Track referrals and contacts. Map your professional network and leverage connections for better opportunities.',
      icon: Users,
      gradient: 'bg-gradient-to-br from-[#0a0a0a] via-[#0a140a] to-[#0a0a0a]',
      accentColor: '#22c55e',
      stats: [
        { value: '40%', label: 'Better Odds' },
        { value: '∞', label: 'Connections' },
      ],
    },
  ];

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative py-32 md:py-40 lg:py-48 bg-[#030303] overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        {/* Subtle radial gradients - lightweight CSS effects */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.02] rounded-full blur-[100px]" />

        {/* Particle effects removed for cleaner 2026 aesthetic - using SpotlightEffect instead */}
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header with parallax */}
        <motion.div
          ref={headerRef}
          className="text-center mb-20 md:mb-28"
          style={{ y: headerY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isHeaderInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 uppercase tracking-wide mb-8">
              {prefersReducedMotion ? (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              ) : (
                <motion.span
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              Powerful Features
            </span>
          </motion.div>

          {/* Title */}
          <RevealText delay={0.1}>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6">
              Everything you need
            </h2>
          </RevealText>

          {/* Subtitle */}
          <FadeUp delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Four powerful tools working together to transform your job search from chaotic to organized.
            </p>
          </FadeUp>
        </motion.div>

        {/* Cards Grid with staggered reveal */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <PremiumFeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isInView={isCardsInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <MagneticButton
            href="/jobs"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-medium transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <span>Start tracking for free</span>
            <motion.span
              className="inline-flex"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

// CustomCursor removed - using native cursor for cleaner 2026 aesthetic

// ═══════════════════════════════════════════════════════════════════════════
// Spotlight Effect - Mouse-following gradient (kept for interactive background)
// ═══════════════════════════════════════════════════════════════════════════

function SpotlightEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsTouchDevice();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Throttle with requestAnimationFrame for better performance
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Don't render on mobile or during SSR
  if (isMobile === null || isMobile) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-50"
      aria-hidden="true"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.06), transparent 40%)`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Magnetic Button
// ═══════════════════════════════════════════════════════════════════════════

function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.2;
    const y = (clientY - top - height / 2) * 0.2;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const innerContent = (
    <motion.span
      animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      data-magnetic
    >
      {href ? (
        <Link href={href} className={className}>
          {innerContent}
        </Link>
      ) : (
        <div className={className}>{innerContent}</div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Basic Animation Components
// ═══════════════════════════════════════════════════════════════════════════

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  // Respect user's reduced motion preference - WCAG 2.3.3
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Subtle fade with scale - great for cards and interactive elements
function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide in from left - for horizontal reveals
function SlideInLeft({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide in from right
function SlideInRight({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Blur to focus - subtle blur reveal effect
function BlurIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation wrapper
function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Hover lift effect - subtle elevation on hover
function HoverLift({
  children,
  className,
  liftAmount = -4,
}: {
  children: React.ReactNode;
  className?: string;
  liftAmount?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: liftAmount }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function RevealText({
  children,
  delay = 0,
  className,
  allow3D = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  allow3D?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  // Respect user's reduced motion preference - WCAG 2.3.3
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        // Use clip-path instead of overflow-hidden for 3D content
        // This allows 3D transforms to extend beyond bounds while still masking the reveal
        allow3D ? 'overflow-visible' : 'overflow-hidden',
        className
      )}
      style={allow3D ? {
        // Add padding to prevent clipping of 3D transforms and descenders
        paddingBottom: '0.15em',
        marginBottom: '-0.15em',
      } : undefined}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease }}
        style={allow3D ? { transformStyle: 'preserve-3d' } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}

// AnimatedNumber removed (unused)

// ═══════════════════════════════════════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════════════════════════════════════

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { smoothScrollToSection } = useViewTransitions();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    smoothScrollToSection(sectionId);
  };

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled && 'backdrop-blur-xl bg-black/50'
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Target className="w-5 h-5 text-black" />
          </motion.div>
          <motion.span
            className="font-medium text-lg text-white tracking-tight"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            JobTrack
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-10 ml-16 lg:ml-24">
          {[
            { name: 'Features', id: 'features' },
            { name: 'Process', id: 'process' }
          ].map((item, i) => (
            <motion.button
              key={item.name}
              onClick={() => handleNavClick(item.id)}
              className="relative text-sm text-slate-400 hover:text-white focus-visible:text-white transition-colors duration-300 tracking-wide uppercase group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {item.name}
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-white via-blue-200 to-white"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease }}
              />
            </motion.button>
          ))}
        </div>

        <MagneticButton
          href="/jobs"
          className={cn(
            "group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
            "bg-transparent border border-white/20 text-white/90",
            "hover:bg-white/10 hover:border-white/40 hover:text-white",
            scrolled && "border-white/30 bg-white/5"
          )}
        >
          Get Started
          <motion.span
            className="inline-block"
            animate={scrolled ? { x: [0, 3, 0] } : { x: 0 }}
            transition={{ duration: 1, repeat: scrolled ? Infinity : 0, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </MagneticButton>
      </div>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Hero Section
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection({ onNavClick }: { onNavClick: (sectionId: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      ref={ref}
      className="relative min-h-[110vh] flex flex-col justify-center bg-black overflow-hidden"
    >
      {/* 1. Cinematic Ambient Background */}
      <AmbientBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-24 lg:pt-32 pb-32 md:pb-48 overflow-visible"
        style={{ perspective: '1000px' }}
      >
        <div className="text-center relative">

          {/* Eyebrow - Minimal pill - Layer 1 (Fades out fast) */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
              y: useTransform(scrollYProgress, [0, 0.1], [0, -50])
            }}
          >
            <FadeUp delay={0.1}>
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-xs font-medium text-blue-200/80 tracking-widest uppercase">JobTrack 2.0</span>
                </div>
              </div>
            </FadeUp>
          </motion.div>

          {/* Massive Cinematic Typography - Layer 2 (Curtain Raiser / Zoom) */}
          <motion.div
            className="mb-12 relative z-20 mix-blend-screen"
            style={{
              scale: useTransform(scrollYProgress, [0, 0.3], [1, 1.5]), // Aggressive Zoom
              opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]), // Fade out
              filter: useTransform(scrollYProgress, [0, 0.3], ["blur(0px)", "blur(12px)"])
            }}
          >
            <CinematicText className="text-display-hero tracking-tighter text-white">
              <span className="block mb-2">Your search,</span>
              <span className="block flex flex-wrap items-center justify-center gap-x-4">
                <span className="font-serif italic font-light text-white/90">Curated</span>
                {/* Scroll-Driven Kinetic Type */}
                <KineticTypography className="font-serif text-white inline-block">Simple.</KineticTypography>
              </span>
            </CinematicText>
          </motion.div>

          {/* Subheadline - Layer 3 (Moves down) */}
          <motion.div
            style={{
              y: useTransform(scrollYProgress, [0, 0.3], [0, 100]),
              opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0])
            }}
          >
            <FadeUp delay={0.4}>
              <p className="text-lg md:text-xl text-blue-100/60 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
                Stop losing track in spreadsheets. Experience the <span className="text-white/90 font-medium">zero-gravity</span> way to manage applications, interviews, and offers.
              </p>
            </FadeUp>
          </motion.div>

          {/* Command Center Input CTA - Layer 4 (Hero-to-Bento Transition) */}
          <FadeUp delay={0.6}>
            <motion.div
              style={{
                y: useTransform(scrollYProgress, [0, 0.4], [0, 300]), // Fly down further
                scale: useTransform(scrollYProgress, [0, 0.4], [1, 0.6]), // Shrink to card size
                opacity: useTransform(scrollYProgress, [0.3, 0.45], [1, 0]), // Fade out just before Bento
              }}
              className="relative z-30" // Keep above other elements
            >
              <HeroInput className="mb-8" />
            </motion.div>

            {/* Secondary Action - Fades out with subhead */}
            <motion.div
              style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
            >
              <button
                onClick={() => onNavClick('features')}
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto group perspective-1000"
              >
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Explore features</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </FadeUp>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 inset-x-0 flex justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-light">Scroll to explore</span>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Bento Grid Features
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MiniChart - Animated bar chart for Analytics Dashboard preview
 * Uses useInView to trigger animation when card scrolls into viewport
 */


/**
 * CalendarPreview - Mini calendar grid for Interview Calendar preview
 * Shows a stylized date picker with interview dates highlighted
 */
// CalendarPreview removed (unused)

/**
 * QuickAddInput - Animated fake input field for Quick Add preview
 * Shows typewriter effect demonstrating smart autofill
 */
// QuickAddInput removed (unused)

import { BentoGrid } from './bento-grid';

function BentoSection() {
  return <BentoGrid />;
}

// ═══════════════════════════════════════════════════════════════════════════
// Process Section
// ═══════════════════════════════════════════════════════════════════════════

function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Animate the timeline line as user scrolls - static for reduced motion
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], prefersReducedMotion ? ['100%', '100%'] : ['0%', '100%']);

  const steps = [
    {
      step: '01',
      title: 'Add applications',
      description: 'Log each opportunity in seconds. Company, role, status, notes—all captured.',
    },
    {
      step: '02',
      title: 'Track progress',
      description: 'Move applications through your pipeline. Applied → Interview → Offer.',
    },
    {
      step: '03',
      title: 'Never miss a beat',
      description: 'Follow-ups and deadlines surface automatically. Take action at the right time.',
    },
  ];

  return (
    <section ref={containerRef} id="process" className="py-16 md:py-24 lg:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16 lg:mb-20 max-w-3xl">
          <SlideInLeft>
            <span className="text-sm text-slate-500 uppercase tracking-wide mb-4 md:mb-6 block">
              Process
            </span>
          </SlideInLeft>
          <SlideInRight delay={0.1}>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
              Simple by design.
            </h2>
          </SlideInRight>
        </div>

        <div className="relative">
          {/* Animated beam timeline */}
          <div className="absolute left-0 md:left-20 top-0 bottom-0 w-px hidden md:block overflow-hidden">
            {/* Base line */}
            <div className="absolute inset-0 bg-[#1a1a1a]" />

            {/* Scroll-progress fill */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-transparent"
              style={{ height: lineHeight }}
            />

            {/* Animated beam particle - flows continuously down the line */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-20 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.8) 30%, rgba(168, 85, 247, 0.9) 50%, rgba(99, 102, 241, 0.8) 70%, transparent 100%)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)',
                  }}
                  animate={{
                    y: ['0%', '500%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                {/* Second beam with offset for continuous flow */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-16 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.7) 30%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.7) 70%, transparent 100%)',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
                  }}
                  animate={{
                    y: ['0%', '600%'],
                    opacity: [0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 1.5,
                  }}
                />
              </>
            )}
          </div>

          <div className="space-y-0">
            {steps.map((item, i) => (
              <ScaleIn key={item.step} delay={i * 0.15}>
                <HoverLift liftAmount={-2}>
                  <div className="group py-8 md:py-12 lg:py-16 border-t border-[#222] hover:border-[#333] transition-all duration-300 hover:bg-white/[0.01] rounded-lg">
                    <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start relative">
                      {/* Timeline bullet - static for reduced motion users */}
                      {prefersReducedMotion ? (
                        <div className="absolute left-16 md:left-20 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 rounded-full border border-[#333] bg-black hidden md:flex items-center justify-center z-10">
                          <div className="w-2 h-2 md:w-2 md:h-2 rounded-full bg-white/50 group-hover:bg-white transition-colors" />
                        </div>
                      ) : (
                        <motion.div
                          className="absolute left-16 md:left-20 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 rounded-full border border-[#333] bg-black hidden md:flex items-center justify-center z-10"
                          whileHover={{ scale: 1.5, borderColor: '#fff' }}
                          whileInView={{ borderColor: ['#333', '#666', '#333'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div
                            className="w-2 h-2 md:w-2 md:h-2 rounded-full bg-white/50 group-hover:bg-white transition-colors"
                            whileInView={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          />
                        </motion.div>
                      )}
                      <div className="md:col-span-2 relative">
                        <motion.span
                          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight text-[#222] group-hover:text-[#444] transition-colors duration-500 md:ml-4 lg:ml-6 block"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.step}
                        </motion.span>
                      </div>

                      <div className="md:col-span-10 md:pt-2 lg:pt-4">
                        <motion.h3
                          className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-3 md:mb-4 tracking-tight"
                          whileHover={{ x: 8 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          {item.title}
                        </motion.h3>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverLift>
              </ScaleIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA Section
// ═══════════════════════════════════════════════════════════════════════════

function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <section ref={ctaRef} className="py-16 md:py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScaleIn delay={0}>
          <GradientBorderCard>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20" />
              {/* Animated gradient - static for reduced motion users */}
              {prefersReducedMotion ? (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(99, 111, 246, 0.3), transparent 50%)',
                  }}
                />
              ) : (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3), transparent 50%)',
                  }}
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3), transparent 50%)',
                      'radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.3), transparent 50%)',
                      'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3), transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
              )}

              <div className="absolute inset-0 backdrop-blur-3xl" />

              <div className="relative z-10 p-12 md:p-20 lg:p-32">
                <div className="max-w-3xl">
                  <BlurIn delay={0.1}>
                    <span className="text-sm text-white/60 uppercase tracking-wide mb-8 block">
                      Ready?
                    </span>
                  </BlurIn>

                  <RevealText delay={0.2}>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-8">
                      Take control of your job search.
                    </h2>
                  </RevealText>

                  <SlideInLeft delay={0.3}>
                    <p className="text-xl text-white/60 mb-12 leading-relaxed">
                      Join thousands who&apos;ve transformed chaos into clarity.
                    </p>
                  </SlideInLeft>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5, ease }}
                  >
                    <MagneticButton
                      href="/jobs"
                      className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-medium text-lg transition-all duration-500 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 active:shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]"
                    >
                      Get started for free
                      {/* Arrow animation - static for reduced motion users */}
                      {prefersReducedMotion ? (
                        <span className="inline-block">
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      ) : (
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      )}
                    </MagneticButton>
                  </motion.div>
                </div>
              </div>
            </div>
          </GradientBorderCard>
        </ScaleIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════════════════════════════════════

function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  return (
    <footer ref={footerRef} className="py-16 pb-32 md:pb-16 bg-black border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <Target className="w-5 h-5 text-black" />
            </motion.div>
            <motion.span
              className="font-medium text-white"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              JobTrack
            </motion.span>
          </Link>

          <StaggerContainer className="flex flex-wrap items-center gap-6 md:gap-12" staggerDelay={0.05}>
            {[
              { label: 'Features', href: '#features' },
              { label: 'Dashboard', href: '/jobs' },
              { label: 'Sign in', href: '/auth/login' },
            ].map((link) => (
              <StaggerItem key={link.label}>
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={link.href}
                    className="relative text-sm text-slate-400 hover:text-white transition-colors group inline-block"
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            © {new Date().getFullYear()} JobTrack
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Landing Page
// ═══════════════════════════════════════════════════════════════════════════

export function LandingPage() {
  const { smoothScrollToSection } = useViewTransitions();

  const handleNavClick = (sectionId: string) => {
    smoothScrollToSection(sectionId);
  };

  return (
    <LenisProvider>
      <div className="min-h-screen bg-black overflow-x-hidden">
        {/* Skip link for accessibility - WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
        >
          Skip to main content
        </a>
        {/* CustomCursor removed - using native cursor for cleaner 2026 aesthetic */}
        <SpotlightEffect />
        <ScrollProgress />
        <FloatingActivityNotifications />
        <Navigation />
        <main id="main-content">
          <HeroSection onNavClick={handleNavClick} />
          <SocialBento />
          <TestimonialCarousel />
          <BentoSection />
          <InteractiveFeatureShowcase />
          <ProcessSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
