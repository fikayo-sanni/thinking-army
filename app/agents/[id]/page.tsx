import AgentDetailsClient from './client';

// Mock data for all agents
const mockAgents = [
  {
    id: '1',
    name: 'Lead Generation Assistant',
    type: 'small' as const,
    status: 'active' as const,
    description: 'Automates lead research and initial outreach',
    metrics: {
      tasksCompleted: 1250,
      successRate: 92,
      timeSaved: 45,
    },
    configuration: {
      processName: 'Lead Generation',
      schedule: 'Every 2 hours',
      integrations: ['CRM', 'Email', 'LinkedIn'],
      parameters: {
        searchCriteria: 'Technology companies, 50-200 employees',
        outreachTemplate: 'Standard introduction',
        followUpDays: 3,
      },
    },
  },
  {
    id: '2',
    name: 'Sales Process Optimizer',
    type: 'big' as const,
    status: 'active' as const,
    description: 'AI-driven sales funnel optimization',
    metrics: {
      tasksCompleted: 3500,
      successRate: 88,
      timeSaved: 120,
    },
    configuration: {
      processName: 'Sales Optimization',
      schedule: 'Continuous',
      integrations: ['CRM', 'Analytics', 'Sales Tools'],
      parameters: {
        optimizationTarget: 'Conversion Rate',
        analysisInterval: 'Daily',
        minimumDataPoints: 1000,
      },
    },
  },
  {
    id: '3',
    name: 'Customer Support Bot',
    type: 'small' as const,
    status: 'active' as const,
    description: 'Handles routine customer inquiries',
    metrics: {
      tasksCompleted: 8900,
      successRate: 95,
      timeSaved: 80,
    },
    configuration: {
      processName: 'Support Automation',
      schedule: 'Real-time',
      integrations: ['Help Desk', 'Knowledge Base', 'Chat'],
      parameters: {
        responseTime: '30 seconds',
        escalationThreshold: '80%',
        learningRate: 'Adaptive',
      },
    },
  },
];

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  const agent = mockAgents.find(a => a.id === params.id);
  if (!agent) {
    throw new Error(`Agent with ID ${params.id} not found`);
  }
  return <AgentDetailsClient agent={agent} />;
}

// This is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Return an array of possible values for [id]
  return mockAgents.map(agent => ({
    id: agent.id,
  }));
} 