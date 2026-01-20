'use client'

import Link from 'next/link'
import { FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const resumeVariants = [
  {
    id: 'bsa',
    title: 'BSA / Product Operations Lead',
    description: 'Emphasizes requirements gathering, release management, incident response, and team leadership. Best for Business Systems Analyst, Product Operations, and Technical Program Manager roles.',
    keywords: ['Business Systems Analyst', 'Product Operations', 'Release Management', 'Requirements', 'Agile'],
    targetRoles: ['Business Systems Analyst', 'Product Operations Lead', 'Technical Program Manager', 'Release Manager'],
  },
  {
    id: 'qa',
    title: 'QA Engineer / SDET',
    description: 'Highlights test automation, E2E testing, API validation, and quality leadership. Best for QA Engineer, SDET, and Test Automation roles.',
    keywords: ['QA Engineer', 'SDET', 'Test Automation', 'Playwright', 'Selenium', 'E2E Testing'],
    targetRoles: ['QA Engineer', 'SDET', 'Test Automation Engineer', 'QA Lead', 'Quality Manager'],
  },
  {
    id: 'ai-engineer',
    title: 'AI/Full Stack Engineer',
    description: 'Showcases AI-assisted development, LLM integration, and modern full-stack skills. Best for AI Engineer, Full Stack Developer, and GenAI roles.',
    keywords: ['AI Engineer', 'Full Stack', 'LLM', 'OpenAI', 'Next.js', 'React', 'TypeScript'],
    targetRoles: ['AI/ML Engineer', 'Full Stack Engineer', 'GenAI Engineer', 'LLM Integration Specialist'],
  },
]

export default function ResumesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alex Zaytsev - Resume Variants</h1>
          <p className="text-gray-600">
            Three optimized resume versions targeting different role types. Click to view and print/save as PDF.
          </p>
        </div>

        <div className="grid gap-6">
          {resumeVariants.map((variant) => (
            <Card key={variant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{variant.title}</CardTitle>
                      <CardDescription className="mt-1">{variant.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Target Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.targetRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">ATS Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/resumes/${variant.id}`} className="flex-1">
                    <Button className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View & Print to PDF
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Save as PDF</h2>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Click &ldquo;View &amp; Print to PDF&rdquo; on any resume variant</li>
            <li>Press <kbd className="px-2 py-1 bg-blue-100 rounded text-xs font-mono">Ctrl+P</kbd> (Windows) or <kbd className="px-2 py-1 bg-blue-100 rounded text-xs font-mono">Cmd+P</kbd> (Mac)</li>
            <li>Select &ldquo;Save as PDF&rdquo; as the destination</li>
            <li>Click Save and choose your download location</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Job Hunt Tracker
          </Link>
        </div>
      </div>
    </div>
  )
}
