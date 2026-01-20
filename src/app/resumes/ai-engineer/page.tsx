'use client'

import { ResumeTemplate } from '@/components/resume/resume-template'

const aiEngineerResumeData = {
  variant: 'AI/Full Stack Engineer' as const,
  name: 'Alex Zaytsev',
  title: 'Full Stack Engineer | AI Integration Specialist',
  contact: {
    email: 'alexvzay@gmail.com',
    phone: '(310) 569-6777',
    location: 'Washington, DC',
    linkedin: 'linkedin.com/in/alexzay',
    github: 'github.com/unisone',
  },
  summary: `Full Stack Engineer with 7+ years building applications for 1M+ users, recently focused on AI-powered solutions. Delivered production AI chat platform achieving 60% cost reduction through intelligent caching while maintaining response quality. Combines deep product development experience with hands-on LLM integration expertise to ship AI features from prototype to production.`,

  skills: {
    'AI & Machine Learning': [
      'OpenAI API',
      'LLM Integration',
      'Prompt Engineering',
      'AI Cost Optimization',
      'Vercel AI SDK',
      'Context Management',
    ],
    'Frontend': [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'shadcn/ui',
    ],
    'Backend': [
      'Node.js',
      'PostgreSQL',
      'Supabase',
      'REST APIs',
      'Webhooks',
      'Real-time Systems',
    ],
    'DevOps & Tools': [
      'Vercel',
      'GitHub Actions',
      'Playwright',
      'Vitest',
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
        'Built production AI chat platform from scratch, delivering enterprise solution in 4 months using AI-assisted development (Claude Code, Cursor)',
        'Reduced AI operational costs by 60% through multi-layer caching and context optimization strategies',
        'Implemented real-time messaging system handling 1000+ messages daily with sub-second latency',
        'Integrated voice-to-text processing enabling support for voice messages across 4 languages',
        'Designed webhook architecture with HMAC security verification processing 500+ daily events',
        'Achieved 90%+ test coverage through comprehensive automated testing strategy',
      ],
    },
    {
      company: 'Beachbody (BODi)',
      title: 'Business Systems Analyst Lead / ProdOps Lead',
      location: 'Los Angeles, CA',
      dates: 'Oct 2020 – Aug 2025',
      highlights: [
        'Led product operations for streaming platform serving 1M+ active subscribers',
        'Built 4 Slack automation bots using JavaScript/Node.js, reducing investigation time by 80%',
        'Owned data analysis pipeline synthesizing metrics from 5+ platforms for executive presentations',
        'Managed releases across 7 platforms coordinating engineering, QA, and stakeholder teams',
        'Resolved 50+ high-severity production incidents annually with systematic debugging approach',
      ],
    },
    {
      company: 'AT&T',
      title: 'Data Quality Analyst',
      location: 'El Segundo, CA',
      dates: 'Jul 2019 – Oct 2020',
      highlights: [
        'Built Python and SQL automation scripts reducing manual effort by 40%',
        'Validated analytics pipelines ensuring data accuracy across digital properties',
      ],
    },
    {
      company: 'DIRECTV',
      title: 'Software QA Engineer',
      location: 'El Segundo, CA',
      dates: 'Jul 2017 – Nov 2018',
      highlights: [
        'Contributed to Selenium automation framework for streaming app testing',
        'Performed network debugging using Charles Proxy and Wireshark',
      ],
    },
    {
      company: 'Zaydream Media',
      title: 'Founder / Web Developer',
      location: 'Los Angeles, CA',
      dates: 'Jan 2018 – Jan 2022',
      type: 'Part-time',
      highlights: [
        'Built WordPress and Shopify sites for small businesses (meridianexport.com, simplefew.com)',
        'Managed PPC campaigns (Google Ads, Meta) with A/B testing optimization',
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

  projects: [
    {
      name: 'AI Customer Support Platform',
      url: 'chat.meridianexport.com',
      description: 'Production WhatsApp integration with AI-powered responses and real-time sync',
    },
  ],

  additional: {
    status: 'U.S. Citizen | Security Clearance Eligible',
    languages: 'English (Fluent), Russian (Native)',
  },
}

export default function AIEngineerResumePage() {
  return <ResumeTemplate data={aiEngineerResumeData} />
}
