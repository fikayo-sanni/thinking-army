'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkflowBuilder } from '@/components/workflows/WorkflowBuilder';
import { ActionSelector } from '@/components/workflows/ActionSelector';
import { ArrowLeft } from 'lucide-react';
import AgentService from '@/lib/services/agent.service';

const actionTemplates = [
  {
    id: 'fetch-data',
    name: 'Fetch Data',
    description: 'Retrieve data from external sources',
    type: 'data',
    category: 'Input',
    parameters: [
      {
        name: 'source',
        type: 'string',
        description: 'Data source URL or identifier',
        required: true,
      },
      {
        name: 'format',
        type: 'string',
        description: 'Expected data format',
        required: false,
        default: 'json',
      },
    ],
  },
  {
    id: 'process-data',
    name: 'Process Data',
    description: 'Transform and analyze data',
    type: 'transform',
    category: 'Processing',
    parameters: [
      {
        name: 'operation',
        type: 'string',
        description: 'Processing operation to perform',
        required: true,
      },
      {
        name: 'filters',
        type: 'array',
        description: 'Data filters to apply',
        required: false,
      },
    ],
  },
  {
    id: 'generate-report',
    name: 'Generate Report',
    description: 'Create reports from processed data',
    type: 'output',
    category: 'Output',
    parameters: [
      {
        name: 'template',
        type: 'string',
        description: 'Report template to use',
        required: true,
      },
      {
        name: 'format',
        type: 'string',
        description: 'Output format',
        required: false,
        default: 'pdf',
      },
    ],
  },
];

export default function NewWorkflowPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null);

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => AgentService.getInstance().getAgents(),
  });

  const bigAgents = React.useMemo(() => {
    if (!agents) return [];
    return agents.filter((agent) => agent.type === 'big');
  }, [agents]);

  const handleSave = async (workflow: any) => {
    if (!selectedAgent) return;

    try {
      const agent = bigAgents.find((a) => a.id === selectedAgent);
      if (!agent) return;

      await AgentService.getInstance().updateAgent(selectedAgent, {
        ...agent,
        workflows: [...(agent as any).workflows, workflow],
      });

      router.push('/workflows');
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.push('/workflows')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create Workflow</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Workflow Builder */}
        <WorkflowBuilder onSave={handleSave} />

        {/* Action Templates */}
        <div className="space-y-6">
          {/* Agent Selection */}
          <Card className="p-4">
            <div className="space-y-2">
              <div className="font-medium">Select Agent</div>
              <div className="space-y-2">
                {bigAgents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant={selectedAgent === agent.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    {agent.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Selector */}
          <ActionSelector
            templates={actionTemplates}
            onSelect={(template) => {
              // Handle action selection
              console.log('Selected template:', template);
            }}
          />
        </div>
      </div>
    </div>
  );
} 