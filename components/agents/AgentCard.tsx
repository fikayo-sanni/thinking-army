import React from 'react';
import { Agent } from '@/lib/types/agent.types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Calendar, Settings } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onConfigure?: () => void;
  onViewDetails?: () => void;
}

const statusColors = {
  active: 'bg-success text-success-foreground',
  inactive: 'bg-muted text-muted-foreground',
  configuring: 'bg-warning text-warning-foreground',
  error: 'bg-destructive text-destructive-foreground',
};

export function AgentCard({ agent, onConfigure, onViewDetails }: AgentCardProps) {
  const isSmallAgent = agent.type === 'small';
  const pricing = isSmallAgent
    ? `€${agent.setupFee} + €${agent.monthlyFee}/mo`
    : `€${(agent as any).basePrice}`;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSmallAgent ? (
              <Brain className="h-5 w-5 text-primary" />
            ) : (
              <Zap className="h-5 w-5 text-primary" />
            )}
            <CardTitle>{agent.name}</CardTitle>
          </div>
          <Badge className={statusColors[agent.status]}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isSmallAgent ? 'Business Process' : 'Capabilities'}
            </div>
            <div className="font-medium">
              {isSmallAgent
                ? (agent as any).businessProcess
                : `${(agent as any).capabilities.length} Features`}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 inline-block mr-1" />
              Last Active
            </div>
            <div className="font-medium">
              {new Date(agent.metrics.lastActive).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Success Rate
            </div>
            <div className="font-medium">
              {agent.metrics.successRate}%
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Business Impact
            </div>
            <div className="font-medium">
              {formatCurrency(agent.metrics.businessImpact)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onConfigure}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 