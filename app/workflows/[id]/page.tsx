import { notFound } from 'next/navigation';
import AgentService from '@/lib/services/agent.service';
import { WorkflowDetailsContent } from './WorkflowDetailsContent';

// Generate static paths for all workflows
export async function generateStaticParams() {
  try {
    const agents = await AgentService.getInstance().getAgents();
    const workflowIds = agents
      .filter((agent) => agent.type === 'big')
      .flatMap((agent: any) => agent.workflows.map((w: any) => ({
        id: w.id,
      })));
    return workflowIds;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Get static props for the page
async function getWorkflowData(id: string) {
  try {
    const agents = await AgentService.getInstance().getAgents();
    for (const agent of agents) {
      if (agent.type === 'big') {
        const workflow = (agent as any).workflows.find((w: any) => w.id === id);
        if (workflow) {
          return {
            workflow: {
              ...workflow,
              agentId: agent.id,
              agentName: agent.name,
            },
            agents,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching workflow data:', error);
    return null;
  }
}

export default async function WorkflowDetailsPage({ params }: { params: { id: string } }) {
  const data = await getWorkflowData(params.id);

  if (!data) {
    notFound();
  }

  return <WorkflowDetailsContent {...data} />;
} 