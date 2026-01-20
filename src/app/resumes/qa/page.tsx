'use client'

import { ResumeTemplate } from '@/components/resume/resume-template'

const qaResumeData = {
  variant: 'QA Engineer / SDET' as const,
  name: 'Alex Zaytsev',
  title: 'QA Engineer | Test Automation Lead',
  contact: {
    email: 'alexvzay@gmail.com',
    phone: '(310) 569-6777',
    location: 'Washington, DC',
    linkedin: 'linkedin.com/in/alexzay',
    github: 'github.com/unisone',
  },
  summary: `QA Engineer with 7+ years ensuring quality for streaming and e-commerce applications serving 1M+ users across Web, iOS, Android, Roku, and FireTV. Increased automated test coverage by 25% while reducing regression testing time by 70% through strategic framework improvements. Proven track record leading QA teams and establishing quality standards at scale.`,

  skills: {
    'Test Automation': [
      'Playwright',
      'Selenium',
      'Vitest',
      'Jest',
      'React Testing Library',
      'CI/CD Integration',
    ],
    'Testing Methods': [
      'E2E Testing',
      'API Testing (Postman)',
      'Regression Testing',
      'Mobile Testing',
      'Performance Testing',
    ],
    'Tools': [
      'Charles Proxy',
      'Wireshark',
      'Android Studio (ADB)',
      'Xcode',
      'Jira',
      'GitHub Actions',
    ],
    'Monitoring': [
      'Datadog',
      'Firebase',
      'New Relic',
      'Amplitude',
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
        'Achieved 90%+ code coverage through comprehensive unit, integration, and E2E test suites',
        'Implemented Playwright E2E testing with parallel execution, reducing test runtime by 70%',
        'Designed API testing strategy covering authentication flows, webhooks, and real-time messaging',
        'Established test patterns for AI integrations ensuring consistent response validation',
      ],
    },
    {
      company: 'Beachbody (BODi)',
      title: 'Business Systems Analyst Lead / ProdOps Lead',
      location: 'Los Angeles, CA',
      dates: 'Oct 2020 – Aug 2025',
      highlights: [
        'Led QA operations for streaming platform serving 1M+ subscribers across 7 platforms',
        'Trained and managed 15-person offshore QA team, improving defect detection rate by 35%',
        'Established release validation procedures maintaining 99.5%+ deployment success rate',
        'Resolved 50+ high-severity production incidents annually through systematic root cause analysis',
        'Built automated monitoring tools reducing incident detection time from hours to minutes',
        'Created comprehensive test documentation ensuring consistent quality standards across releases',
      ],
    },
    {
      company: 'AT&T',
      title: 'Data Quality Analyst',
      location: 'El Segundo, CA',
      dates: 'Jul 2019 – Oct 2020',
      highlights: [
        'Built Python and SQL validation scripts automating 40% of manual QA workflows',
        'Validated data pipelines ensuring 99%+ accuracy across Adobe Analytics and New Relic',
        'Documented data quality standards adopted by multiple product teams',
      ],
    },
    {
      company: 'DIRECTV',
      title: 'Software QA Engineer',
      location: 'El Segundo, CA',
      dates: 'Jul 2017 – Nov 2018',
      highlights: [
        'Contributed to Selenium automation framework increasing test coverage by 25%',
        'Executed functional and regression testing across Android, iOS, and VR platforms',
        'Performed network debugging using Charles Proxy and Wireshark to diagnose streaming issues',
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

export default function QAResumePage() {
  return <ResumeTemplate data={qaResumeData} />
}
