'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  tiltAmount?: number;
  perspective?: number;
  glareOpacity?: number;
}

export function TiltCard({
  children,
  className,
  glareEnabled = true,
  tiltAmount = 15,
  perspective = 1000,
  glareOpacity = 0.2,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for smooth animation
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // Glare position
  const glareX = useSpring(50, { stiffness: 300, damping: 30 });
  const glareY = useSpring(50, { stiffness: 300, damping: 30 });

  // Transform glare position to CSS values (must be at top level)
  const glareLeftStyle = useTransform(glareX, (v) => `${v}%`);
  const glareTopStyle = useTransform(glareY, (v) => `${v}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position
    const rotateXValue = (mouseY / (rect.height / 2)) * -tiltAmount;
    const rotateYValue = (mouseX / (rect.width / 2)) * tiltAmount;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Update glare position
    const glareXValue = ((e.clientX - rect.left) / rect.width) * 100;
    const glareYValue = ((e.clientY - rect.top) / rect.height) * 100;
    glareX.set(glareXValue);
    glareY.set(glareYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative', className)}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Glare overlay */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
            style={{
              opacity: isHovered ? glareOpacity : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <motion.div
              className="absolute w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: glareLeftStyle,
                top: glareTopStyle,
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
              }}
            />
          </motion.div>
        )}

        {/* Subtle border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.15), inset 0 0 0 1px rgba(139, 92, 246, 0.1)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// 3D floating element that responds to mouse position globally
export function Float3D({
  children,
  className,
  depth = 20,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className={className}
      animate={{
        x: mousePosition.x * depth,
        y: mousePosition.y * depth,
        rotateX: mousePosition.y * -5,
        rotateY: mousePosition.x * 5,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// Layered parallax container
export function ParallaxLayers({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      // Scroll handling logic can be added here if needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)} style={{ perspective: 1000 }}>
      {children}
    </div>
  );
}
