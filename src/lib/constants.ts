/**
 * Application Configuration Constants
 *
 * Centralized configuration for app-wide settings.
 * This makes values easy to find, audit, and adjust.
 */

export const APP_CONFIG = {
  // Job search goals and metrics
  GOALS: {
    /** Default weekly application target */
    DEFAULT_WEEKLY_APPLICATIONS: 10,
    /** Industry average response rate (for comparison) */
    INDUSTRY_AVG_RESPONSE_RATE: 12, // 10-15% typically
  },

  // Dashboard display limits
  DISPLAY: {
    /** Number of recent jobs to show on dashboard */
    RECENT_JOBS_LIMIT: 5,
    /** Number of overdue actions to show */
    NEEDS_ACTION_LIMIT: 5,
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
} as const;

// Type exports for type safety
export type AppConfigKey = keyof typeof APP_CONFIG;

// Workflow compliance tracking
export const WORKFLOW_VERSION = '1.0.0' as const;
