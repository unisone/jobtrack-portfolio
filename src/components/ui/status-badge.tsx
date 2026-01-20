/**
 * StatusBadge Component
 *
 * Consistent status badge styling using centralized STATUS_CONFIG.
 * Supports animated dot for active statuses and proper dark mode.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusConfig } from '@/lib/status';
import type { JobStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: JobStatus;
  /** Show animated dot indicator */
  showDot?: boolean;
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'default';
}

/**
 * StatusBadge displays a job status with consistent styling.
 *
 * @example
 * ```tsx
 * <StatusBadge status="interview" showDot />
 * <StatusBadge status="offer" size="sm" />
 * ```
 */
export function StatusBadge({
  status,
  showDot = true,
  className,
  size = 'default',
}: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const { badge, label } = config;

  return (
    <Badge
      className={cn(
        badge.bg,
        badge.text,
        'font-medium',
        showDot && 'gap-1.5',
        size === 'sm' && 'text-xs px-2 py-0.5',
        className
      )}
    >
      {showDot && (
        <span
          className={cn('size-1.5 rounded-full', badge.dot)}
          aria-hidden="true"
        />
      )}
      {label}
    </Badge>
  );
}

/**
 * StatusDot displays just the colored dot for compact displays
 */
export function StatusDot({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn('size-2 rounded-full', config.badge.dot, className)}
      aria-label={config.label}
    />
  );
}

/**
 * StatusIcon displays the icon associated with a status
 */
export function StatusIcon({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return <Icon className={cn('size-4', className)} aria-hidden="true" />;
}
