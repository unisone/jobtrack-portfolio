/**
 * Resumes layout - minimal wrapper for PDF printing
 * Uses a minimal div wrapper instead of html/body to work with Next.js App Router
 */
export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="resumes-layout bg-white min-h-screen print:min-h-0">
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .resumes-layout {
            min-height: auto;
          }
        }
      `}</style>
      {children}
    </div>
  )
}
