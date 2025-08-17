'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/components/agents/AgentConfig';
import { ArrowLeft } from 'lucide-react';
import AgentService from '@/lib/services/agent.service';

interface AgentConfigPageProps {
  params: {
    id: string;
  };
}

export default function AgentConfigPage({ params }: AgentConfigPageProps) {
  const router = useRouter();
  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', params.id],
    queryFn: () => AgentService.getInstance().getAgentById(params.id),
  });

  const handleSave = async (config: any) => {
    try {
      await AgentService.getInstance().updateAgent(params.id, {
        ...agent,
        ...config,
        status: 'configuring',
      });
      router.push(`/agents/${params.id}`);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Agent not found</h3>
            <p className="text-sm text-muted-foreground">
              The agent you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/agents')}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.push(`/agents/${params.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configure {agent.name}</h1>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      </div>

      {/* Configuration Form */}
      <AgentConfig
        agent={agent}
        onSave={handleSave}
        onCancel={() => router.push(`/agents/${params.id}`)}
      />
    </div>
  );
} 