'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface ResumeData {
  variant: string
  name: string
  title: string
  contact: {
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
  }
  summary: string
  skills: Record<string, string[]>
  experience: {
    company: string
    title: string
    location: string
    dates: string
    type?: string
    highlights: string[]
  }[]
  education: {
    school: string
    degree: string
    dates: string
  }[]
  certifications?: string[]
  projects?: {
    name: string
    url: string
    description: string
  }[]
  additional: {
    status: string
    languages: string
  }
}

export function ResumeTemplate({ data }: { data: ResumeData }) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print sticky top-0 z-10 bg-white border-b shadow-sm p-4">
        <div className="max-w-[8.5in] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{data.name} - {data.variant}</h1>
            <p className="text-sm text-gray-500">Use Ctrl/Cmd + P to save as PDF</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="py-8 px-4 no-print:py-8">
        <div
          ref={resumeRef}
          className="max-w-[8.5in] mx-auto bg-white shadow-lg print:shadow-none"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '11pt',
            lineHeight: '1.4',
            color: '#1a1a1a',
            padding: '0.5in',
          }}
        >
          {/* Header */}
          <header className="text-center border-b-2 border-gray-800 pb-3 mb-4">
            <h1
              className="font-bold tracking-wide"
              style={{ fontSize: '24pt', marginBottom: '4px' }}
            >
              {data.name.toUpperCase()}
            </h1>
            <p
              className="font-medium text-gray-700"
              style={{ fontSize: '12pt', marginBottom: '8px' }}
            >
              {data.title}
            </p>
            <p className="text-gray-600" style={{ fontSize: '10pt' }}>
              {data.contact.location} | {data.contact.phone} | {data.contact.email}
              <br />
              {data.contact.linkedin} | {data.contact.github}
            </p>
          </header>

          {/* Summary */}
          <section className="mb-4">
            <h2
              className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
              style={{ fontSize: '12pt' }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-justify" style={{ fontSize: '10.5pt' }}>
              {data.summary}
            </p>
          </section>

          {/* Skills */}
          <section className="mb-4">
            <h2
              className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
              style={{ fontSize: '12pt' }}
            >
              TECHNICAL SKILLS
            </h2>
            <div style={{ fontSize: '10.5pt' }}>
              {Object.entries(data.skills).map(([category, skills]) => (
                <p key={category} className="mb-1">
                  <strong>{category}:</strong> {skills.join(' • ')}
                </p>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="mb-4">
            <h2
              className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
              style={{ fontSize: '12pt' }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            {data.experience.map((job, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-bold" style={{ fontSize: '11pt' }}>
                      {job.company}
                    </span>
                    {job.type && (
                      <span className="text-gray-600" style={{ fontSize: '10pt' }}>
                        {' '}
                        ({job.type})
                      </span>
                    )}
                    <span className="text-gray-600"> — {job.location}</span>
                  </div>
                  <span className="text-gray-600" style={{ fontSize: '10pt' }}>
                    {job.dates}
                  </span>
                </div>
                <p className="font-medium italic mb-1" style={{ fontSize: '10.5pt' }}>
                  {job.title}
                </p>
                <ul
                  className="list-disc ml-5"
                  style={{ fontSize: '10.5pt' }}
                >
                  {job.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="mb-0.5 text-justify">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects (if present) */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4">
              <h2
                className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
                style={{ fontSize: '12pt' }}
              >
                KEY PROJECTS
              </h2>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <p style={{ fontSize: '10.5pt' }}>
                    <strong>{project.name}</strong> ({project.url}) — {project.description}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          <section className="mb-4">
            <h2
              className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
              style={{ fontSize: '12pt' }}
            >
              EDUCATION
            </h2>
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between" style={{ fontSize: '10.5pt' }}>
                <div>
                  <strong>{edu.school}</strong> — {edu.degree}
                </div>
                <span className="text-gray-600">{edu.dates}</span>
              </div>
            ))}
          </section>

          {/* Certifications (if present) */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-4">
              <h2
                className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
                style={{ fontSize: '12pt' }}
              >
                CERTIFICATIONS
              </h2>
              <p style={{ fontSize: '10.5pt' }}>{data.certifications.join(' • ')}</p>
            </section>
          )}

          {/* Additional Info */}
          <section>
            <h2
              className="font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide"
              style={{ fontSize: '12pt' }}
            >
              ADDITIONAL INFORMATION
            </h2>
            <p style={{ fontSize: '10.5pt' }}>
              <strong>Status:</strong> {data.additional.status}
              <br />
              <strong>Languages:</strong> {data.additional.languages}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
