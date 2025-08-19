import { notFound } from 'next/navigation';
import AgentService from '@/lib/services/agent.service';
import { AgentConfigureContent } from './AgentConfigureContent';

// Generate static paths for all agents
export async function generateStaticParams() {
  try {
    const agents = await AgentService.getInstance().getAgents();
    return agents.map((agent) => ({
      id: agent.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Get static props for the page
async function getAgentData(id: string) {
  try {
    const agent = await AgentService.getInstance().getAgentById(id);
    if (!agent) {
      return null;
    }
    return { agent };
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return null;
  }
}

export default async function AgentConfigPage({ params }: { params: { id: string } }) {
  const data = await getAgentData(params.id);

  if (!data) {
    notFound();
  }

  return <AgentConfigureContent agent={data.agent} />;
} 