'use client';

/**
 * Global error boundary for the entire application
 * Handles errors across both Client and Server components
 *
 * Note: This component must use 'use client' directive for error boundaries.
 * The error parameter is safely accessed with optional chaining.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000', color: '#fff', margin: 0 }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem' }}>
            <h1 style={{ fontSize: '3.75rem', fontWeight: 300, marginBottom: '1rem' }}>500</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              {error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => reset()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fff',
                color: '#000',
                borderRadius: '0.5rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
