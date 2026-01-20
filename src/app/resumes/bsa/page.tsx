'use client'

import { ResumeTemplate } from '@/components/resume/resume-template'

const bsaResumeData = {
  variant: 'BSA / Product Operations Lead' as const,
  name: 'Alex Zaytsev',
  title: 'Business Systems Analyst | Product Operations Lead',
  contact: {
    email: 'alexvzay@gmail.com',
    phone: '(310) 569-6777',
    location: 'Washington, DC',
    linkedin: 'linkedin.com/in/alexzay',
    github: 'github.com/unisone',
  },
  summary: `Business Systems Analyst with 7+ years driving product operations for streaming and e-commerce applications serving 1M+ users. Led cross-functional releases across 7 platforms while reducing incident resolution time by 80% through custom automation tools. Expert in translating business requirements into actionable specifications and measurable outcomes.`,

  skills: {
    'Business Analysis (Expert)': [
      'User Stories & Acceptance Criteria',
      'Requirements Gathering',
      'Stakeholder Interviews',
      'Process Documentation',
      'UAT Coordination',
    ],
    'Operations': [
      'Release Management',
      'Incident Response',
      'Cross-Platform Coordination',
      'Agile/Scrum',
      'KPI Tracking',
    ],
    'Tools & Platforms': [
      'Jira (Expert)',
      'Confluence (Expert)',
      'ServiceNow',
      'PagerDuty',
      'Slack',
    ],
    'Analytics': [
      'SQL',
      'Datadog',
      'Amplitude',
      'Snowflake',
      'Tableau',
      'Adobe Analytics',
    ],
  },

  experience: [
    {
      company: 'Meridian Freight Inc',
      title: 'Full Stack Engineer',
      location: 'Washington, DC',
      dates: 'Sep 2025 – Present',
      type: 'Contract',
      highlights: [
        'Built production customer support platform from scratch, delivering enterprise-grade solution in 4 months',
        'Reduced customer response time by 60% through real-time messaging and automated routing',
        'Implemented multi-language support (English, Russian, Spanish, Arabic) expanding customer reach by 40%',
        'Created 22+ architecture specification documents demonstrating enterprise-level planning',
      ],
    },
    {
      company: 'Beachbody (BODi)',
      title: 'Business Systems Analyst Lead / ProdOps Lead',
      location: 'Los Angeles, CA',
      dates: 'Oct 2020 – Aug 2025',
      highlights: [
        'Led product operations for streaming platform serving 1M+ subscribers, coordinating biweekly app releases and weekly commerce releases across Web, iOS, Android, Roku, and FireTV',
        'Managed 3-person ProdOps team and trained 15-person offshore QA team, improving release quality by 25%',
        'Built 4 Slack automation bots reducing incident investigation time from 15 minutes to under 2 minutes',
        'Authored user stories and acceptance criteria for features generating $2M+ annual subscription revenue',
        'Delivered weekly executive presentations synthesizing data from Datadog, Amplitude, Conviva, and Snowflake',
        'Resolved 50+ high-severity incidents annually and managed 15-50 customer escalations weekly',
      ],
    },
    {
      company: 'AT&T',
      title: 'Data Quality Analyst',
      location: 'El Segundo, CA',
      dates: 'Jul 2019 – Oct 2020',
      highlights: [
        'Validated analytics pipelines ensuring 99%+ data accuracy across Adobe Analytics and New Relic',
        'Built reusable Python and SQL validation scripts reducing manual QA effort by 40%',
        'Documented data quality standards adopted across 3 product teams',
      ],
    },
    {
      company: 'DIRECTV',
      title: 'Software QA Engineer',
      location: 'El Segundo, CA',
      dates: 'Jul 2017 – Nov 2018',
      highlights: [
        'Executed functional and regression testing for streaming apps across Android, iOS, and VR platforms',
        'Contributed to automation framework increasing test coverage by 25%',
        'Reduced average bug resolution time by 30% through detailed defect documentation',
      ],
    },
  ],

  education: [
    {
      school: 'North-Caucasus Federal University',
      degree: 'BTech, Computer/IT Administration and Management',
      dates: '2003 – 2008',
    },
    {
      school: 'Santa Monica College',
      degree: 'Graphic Design Coursework',
      dates: '2014',
    },
  ],

  certifications: [
    'AWS Cloud Practitioner (In Progress)',
  ],

  additional: {
    status: 'U.S. Citizen | Security Clearance Eligible',
    languages: 'English (Fluent), Russian (Native)',
  },
}

export default function BSAResumePage() {
  return <ResumeTemplate data={bsaResumeData} />
}
