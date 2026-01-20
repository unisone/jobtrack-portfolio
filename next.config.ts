import type { NextConfig } from 'next';

/**
 * Security Headers Configuration
 *
 * These headers protect against common web vulnerabilities:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME type sniffing
 * - Information disclosure
 */
const securityHeaders = [
  {
    // Enable DNS prefetching for performance
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // Enforce HTTPS for 2 years with subdomains
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Prevent clickjacking by only allowing same-origin framing
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Enable XSS filter in older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Disable browser features we don't use
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Content Security Policy
    // Allows: self, Supabase, inline styles (required for Tailwind), data URIs for images
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self and unsafe-inline/eval required for Next.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self and unsafe-inline required for Tailwind CSS
      "style-src 'self' 'unsafe-inline'",
      // Images: self, data URIs, HTTPS sources (for avatars, etc.)
      "img-src 'self' data: https: blob:",
      // Fonts: self and data URIs
      "font-src 'self' data:",
      // Connect: self and Supabase endpoints
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      // Prevent framing by external sites
      "frame-ancestors 'self'",
      // Restrict base URI to prevent base tag hijacking
      "base-uri 'self'",
      // Restrict form submissions to same origin
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Disable x-powered-by header to hide framework info
  poweredByHeader: false,

  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
