import { Agent, SmallAgent, BigAgent, AgentTemplate } from '../types/agent.types';

export const mockSmallAgents: SmallAgent[] = [
  {
    id: 'sa-1',
    name: 'Sales Agent',
    description: 'Automates lead qualification and initial outreach',
    type: 'small',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    metrics: {
      tasksCompleted: 256,
      successRate: 92,
      timesSaved: 48,
      businessImpact: 12500,
      lastActive: '2024-01-15T11:45:00Z'
    },
    businessProcess: 'Sales Automation',
    setupFee: 500,
    monthlyFee: 50,
    missionReports: [
      {
        id: 'mr-1',
        agentId: 'sa-1',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-30T00:00:00Z',
        metrics: {
          tasksCompleted: 256,
          successRate: 92,
          timesSaved: 48,
          businessImpact: 12500,
          lastActive: '2024-01-15T11:45:00Z'
        },
        insights: [
          'Increased response rate by 45%',
          'Reduced lead qualification time by 75%',
          'Generated 150 qualified leads'
        ],
        recommendations: {
          nextSteps: [
            'Implement advanced lead scoring',
            'Add multi-channel outreach',
            'Enable A/B testing for messages'
          ],
          upgradePath: 'Upgrade to Corporate Funnel Agent for full sales automation'
        }
      }
    ],
    configuration: {
      processParameters: {
        leadScoringThreshold: 75,
        followUpDelay: 24,
        maxAttempts: 3
      },
      integrations: ['CRM', 'Email', 'Calendar'],
      schedule: '0 9 * * 1-5' // Weekdays at 9 AM
    }
  },
  {
    id: 'sa-2',
    name: 'Social Content Agent',
    description: 'Creates and schedules social media content',
    type: 'small',
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    metrics: {
      tasksCompleted: 180,
      successRate: 95,
      timesSaved: 36,
      businessImpact: 8500,
      lastActive: '2024-01-15T14:25:00Z'
    },
    businessProcess: 'Content Creation',
    setupFee: 500,
    monthlyFee: 50,
    missionReports: [
      {
        id: 'mr-2',
        agentId: 'sa-2',
        startDate: '2024-01-05T00:00:00Z',
        endDate: '2024-02-04T00:00:00Z',
        metrics: {
          tasksCompleted: 180,
          successRate: 95,
          timesSaved: 36,
          businessImpact: 8500,
          lastActive: '2024-01-15T14:25:00Z'
        },
        insights: [
          'Engagement increased by 65%',
          'Content creation time reduced by 80%',
          'Generated 90 unique posts'
        ],
        recommendations: {
          nextSteps: [
            'Enable video content generation',
            'Implement audience analysis',
            'Add trend monitoring'
          ],
          upgradePath: 'Upgrade to Local Domination Agent for comprehensive marketing'
        }
      }
    ],
    configuration: {
      processParameters: {
        contentTypes: ['text', 'image'],
        postsPerWeek: 5,
        tonePref: 'professional'
      },
      integrations: ['Buffer', 'Canva', 'GoogleAnalytics'],
      schedule: '0 7 * * *' // Daily at 7 AM
    }
  }
];

export const mockBigAgents: BigAgent[] = [
  {
    id: 'ba-1',
    name: 'Corporate Funnel Agent',
    description: 'Complete multi-channel sales automation system',
    type: 'big',
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    metrics: {
      tasksCompleted: 1250,
      successRate: 94,
      timesSaved: 240,
      businessImpact: 150000,
      lastActive: '2024-01-15T15:55:00Z'
    },
    capabilities: [
      'Multi-channel lead generation',
      'Advanced lead scoring',
      'Automated nurture campaigns',
      'Sales pipeline automation',
      'Performance analytics'
    ],
    basePrice: 20000,
    customizations: [
      {
        name: 'Industry-specific training',
        description: 'Custom training for specific industry verticals',
        price: 5000
      },
      {
        name: 'Custom integrations',
        description: 'Integration with existing enterprise systems',
        price: 7500
      }
    ],
    integrations: [
      {
        name: 'Salesforce',
        status: 'active',
        lastSync: '2024-01-15T15:55:00Z'
      },
      {
        name: 'HubSpot',
        status: 'active',
        lastSync: '2024-01-15T15:55:00Z'
      },
      {
        name: 'LinkedIn Sales Navigator',
        status: 'active',
        lastSync: '2024-01-15T15:55:00Z'
      }
    ],
    workflows: [
      {
        id: 'wf-1',
        name: 'Lead Generation',
        status: 'active'
      },
      {
        id: 'wf-2',
        name: 'Nurture Campaign',
        status: 'active'
      },
      {
        id: 'wf-3',
        name: 'Deal Closure',
        status: 'active'
      }
    ]
  }
];

export const mockAgentTemplates: AgentTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Sales Agent',
    description: 'Automate lead qualification and initial outreach',
    type: 'small',
    features: [
      'Lead qualification',
      'Automated outreach',
      'Meeting scheduling',
      'Basic CRM integration'
    ],
    useCases: [
      'Small businesses looking to scale sales',
      'Freelancers managing multiple clients',
      'Startups building sales pipeline'
    ],
    setupTime: '3-5 days',
    pricing: {
      setupFee: 500,
      monthlyFee: 50
    },
    requirements: [
      'Email account',
      'CRM system (or use provided)',
      'Calendar integration'
    ]
  },
  {
    id: 'tpl-2',
    name: 'Corporate Funnel Agent',
    description: 'Complete multi-channel sales machine',
    type: 'big',
    features: [
      'Multi-channel lead generation',
      'Advanced lead scoring',
      'Automated nurture campaigns',
      'Sales pipeline automation',
      'Performance analytics'
    ],
    useCases: [
      'Enterprise sales teams',
      'B2B companies',
      'Large-scale lead generation'
    ],
    setupTime: '14-21 days',
    pricing: {
      basePrice: 20000
    },
    requirements: [
      'CRM system',
      'Marketing automation platform',
      'Sales team of 5+ people'
    ]
  }
];

export const mockAgents: Agent[] = [...mockSmallAgents, ...mockBigAgents]; 