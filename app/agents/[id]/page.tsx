import { notFound } from 'next/navigation';
import AgentService from '@/lib/services/agent.service';
import AgentDetailsClient from './client';

// This is a server component that handles static params and data fetching
export async function generateStaticParams() {
  try {
    const agents = await AgentService.getInstance().getAgents();
    // Include all agent IDs plus special routes
    return [
      ...agents.map(agent => ({ id: agent.id })),
      { id: 'new' },
      { id: 'templates' },
    ];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [
      { id: 'new' },
      { id: 'templates' },
    ];
  }
}

// Get static props for the page
async function getAgentData(id: string) {
  if (id === 'new' || id === 'templates') {
    return { type: id };
  }

  try {
    const agent = await AgentService.getInstance().getAgentById(id);
    if (!agent) {
      return null;
    }
    return { type: 'agent', agent };
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return null;
  }
}

export default async function AgentDetailsPage({ params }: { params: { id: string } }) {
  const data = await getAgentData(params.id);

  if (!data) {
    notFound();
  }

  if (data.type === 'new') {
    return <div>New Agent Page</div>;
  }

  if (data.type === 'templates') {
    return <div>Templates Page</div>;
  }

  return <AgentDetailsClient agent={data.agent} />;
} 