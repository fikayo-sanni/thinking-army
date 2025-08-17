'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, Pause, ArrowLeft } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/use-page-title';
import { AgentMetrics } from '@/components/agents/AgentMetrics';
import Link from 'next/link';

interface AgentConfig {
  processName: string;
  schedule: string;
  integrations: string[];
  parameters: Record<string, string | number>;
}

export interface Agent {
  id: string;
  name: string;
  type: 'small' | 'big';
  status: 'active' | 'inactive';
  description: string;
  metrics: {
    tasksCompleted: number;
    successRate: number;
    timeSaved: number;
  };
  configuration: AgentConfig;
}

interface AgentDetailsClientProps {
  agent: Agent;
}

export default function AgentDetailsClient({ agent }: AgentDetailsClientProps) {
  useSetPageTitle(`Agent: ${agent.name}`);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#202124] dark:text-[#E6E6E6]">
              {agent.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={agent.type === 'small' ? 'default' : 'destructive'}>
                {agent.type === 'small' ? 'Small Agent' : 'Big Sales'}
              </Badge>
              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            {agent.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-[#5F6368] dark:text-[#A0A0A0]">
            {agent.description}
          </p>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentMetrics metrics={agent.metrics} />
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Process</h3>
              <p className="text-[#5F6368] dark:text-[#A0A0A0]">
                {agent.configuration.processName}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Schedule</h3>
              <p className="text-[#5F6368] dark:text-[#A0A0A0]">
                {agent.configuration.schedule}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Integrations</h3>
            <div className="flex gap-2">
              {agent.configuration.integrations.map((integration) => (
                <Badge key={integration} variant="outline">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Parameters</h3>
            <div className="space-y-2">
              {Object.entries(agent.configuration.parameters).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-[#E4E6EB] dark:border-[#2A2A2A] last:border-0">
                  <span className="text-[#5F6368] dark:text-[#A0A0A0] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 