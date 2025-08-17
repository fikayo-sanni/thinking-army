'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Clock,
  Settings,
  TrendingUp,
  Users,
  Link as LinkIcon,
  PlayCircle,
  PauseCircle,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for the agent
const mockAgent = {
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
};

interface AgentDetailsClientProps {
  id: string;
}

export default function AgentDetailsClient({ id }: AgentDetailsClientProps) {
  // In a real app, this would fetch from an API
  const agent = mockAgent;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-muted-foreground mt-1">{agent.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className={cn(
              "px-4 py-1",
              agent.status === 'active'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-yellow-500/10 text-yellow-500'
            )}
          >
            {agent.status === 'active' ? (
              <PlayCircle className="mr-2 h-4 w-4" />
            ) : (
              <PauseCircle className="mr-2 h-4 w-4" />
            )}
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </Badge>
          <Button>
            {agent.status === 'active' ? 'Pause Agent' : 'Start Agent'}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent.metrics.tasksCompleted.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Last 30 days
            </div>
            <Progress
              value={75}
              className="mt-4"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent.metrics.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
            <Progress
              value={agent.metrics.successRate}
              className="mt-4"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Saved
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent.metrics.timeSaved}h
            </div>
            <p className="text-xs text-muted-foreground">
              Per week on average
            </p>
            <Progress
              value={65}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Process Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Process Name</p>
                <p className="text-sm text-muted-foreground">
                  {agent.configuration.processName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-sm text-muted-foreground">
                  {agent.configuration.schedule}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Integrations</p>
              <div className="flex flex-wrap gap-2">
                {agent.configuration.integrations.map((integration) => (
                  <Badge key={integration} variant="secondary">
                    <LinkIcon className="mr-1 h-3 w-3" />
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Parameters</p>
              <div className="space-y-2">
                {Object.entries(agent.configuration.parameters).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Task Completed',
                  description: 'Generated 25 new leads',
                  time: '2 hours ago',
                },
                {
                  action: 'Configuration Updated',
                  description: 'Search criteria modified',
                  time: '1 day ago',
                },
                {
                  action: 'Integration Check',
                  description: 'All systems operational',
                  time: '2 days ago',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4"
                >
                  <div className="rounded-full p-2 bg-primary/10">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 