'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Play, Pause, Settings, ArrowUpRight } from 'lucide-react';
import AgentService from '@/lib/services/agent.service';

export default function WorkflowsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => AgentService.getInstance().getAgents(),
  });

  const workflows = React.useMemo(() => {
    if (!agents) return [];
    return agents
      .filter((agent) => agent.type === 'big')
      .flatMap((agent: any) =>
        agent.workflows.map((workflow: any) => ({
          ...workflow,
          agentId: agent.id,
          agentName: agent.name,
        }))
      );
  }, [agents]);

  const filteredWorkflows = React.useMemo(() => {
    if (!workflows) return [];
    return workflows.filter(
      (workflow) =>
        search === '' ||
        workflow.name.toLowerCase().includes(search.toLowerCase()) ||
        workflow.agentName.toLowerCase().includes(search.toLowerCase())
    );
  }, [workflows, search]);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button onClick={() => router.push('/workflows/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{workflow.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Agent: {workflow.agentName}
                  </div>
                </div>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/workflows/${workflow.id}`)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredWorkflows.length === 0 && (
          <Card className="p-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No workflows found</h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating a new workflow'}
              </p>
              {!search && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/workflows/new')}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 