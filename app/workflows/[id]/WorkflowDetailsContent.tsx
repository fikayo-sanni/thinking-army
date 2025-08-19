'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowMonitor } from '@/components/workflows/WorkflowMonitor';
import { ArrowLeft, Settings, Play, Pause } from 'lucide-react';
import type { Agent } from '@/lib/types/agent.types';

interface WorkflowDetailsContentProps {
  workflow: {
    id: string;
    name: string;
    status: string;
    agentId: string;
    agentName: string;
  };
  agents: Agent[];
}

export function WorkflowDetailsContent({ workflow, agents }: WorkflowDetailsContentProps) {
  const router = useRouter();

  // Mock workflow runs for demonstration
  const mockRuns = React.useMemo(() => {
    return [
      {
        id: 'run-1',
        workflowId: workflow.id,
        status: 'completed' as const,
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        progress: 100,
        actions: [
          {
            name: 'Fetch Data',
            status: 'completed' as const,
            duration: 5000,
          },
          {
            name: 'Process Data',
            status: 'completed' as const,
            duration: 8000,
          },
          {
            name: 'Generate Report',
            status: 'completed' as const,
            duration: 2000,
          },
        ],
      },
      {
        id: 'run-2',
        workflowId: workflow.id,
        status: 'running' as const,
        startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        progress: 66,
        currentAction: 'Process Data',
        actions: [
          {
            name: 'Fetch Data',
            status: 'completed' as const,
            duration: 4800,
          },
          {
            name: 'Process Data',
            status: 'running' as const,
          },
          {
            name: 'Generate Report',
            status: 'pending' as const,
          },
        ],
      },
    ];
  }, [workflow.id]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/workflows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-sm text-muted-foreground">
              Agent: {workflow.agentName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              workflow.status === 'active'
                ? 'default'
                : workflow.status === 'error'
                ? 'destructive'
                : 'outline'
            }
          >
            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            {workflow.status === 'active' ? (
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

      {/* Workflow Monitor */}
      <WorkflowMonitor
        runs={mockRuns}
        onRefresh={() => {
          // Handle refresh
        }}
      />
    </div>
  );
} 