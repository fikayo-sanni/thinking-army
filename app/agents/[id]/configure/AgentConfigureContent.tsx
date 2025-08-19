'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/components/agents/AgentConfig';
import { ArrowLeft } from 'lucide-react';
import AgentService from '@/lib/services/agent.service';
import type { Agent } from '@/lib/types/agent.types';

interface AgentConfigureContentProps {
  agent: Agent;
}

export function AgentConfigureContent({ agent }: AgentConfigureContentProps) {
  const router = useRouter();

  const handleSave = async (config: any) => {
    try {
      await AgentService.getInstance().updateAgent(agent.id, {
        ...agent,
        ...config,
        status: 'configuring',
      });
      router.push(`/agents/${agent.id}`);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.push(`/agents/${agent.id}`)}>
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
        onCancel={() => router.push(`/agents/${agent.id}`)}
      />
    </div>
  );
} 