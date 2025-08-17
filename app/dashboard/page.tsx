'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AgentMetrics } from '@/components/agents/AgentMetrics';
import { ReportCard } from '@/components/mission/ReportCard';
import { MetricsDisplay } from '@/components/mission/MetricsDisplay';
import { useQuery } from '@tanstack/react-query';
import AgentService from '@/lib/services/agent.service';

export default function Dashboard() {
  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => AgentService.getInstance().getAgents(),
  });

  const aggregateMetrics = React.useMemo(() => {
    if (!agents) return null;

    return agents.reduce(
      (acc, agent) => ({
        tasksCompleted: acc.tasksCompleted + agent.metrics.tasksCompleted,
        successRate:
          acc.successRate +
          (agent.metrics.successRate * agent.metrics.tasksCompleted) /
            (acc.tasksCompleted || 1),
        timesSaved: acc.timesSaved + agent.metrics.timesSaved,
        businessImpact: acc.businessImpact + agent.metrics.businessImpact,
        lastActive: acc.lastActive > agent.metrics.lastActive ? acc.lastActive : agent.metrics.lastActive,
      }),
      {
        tasksCompleted: 0,
        successRate: 0,
        timesSaved: 0,
        businessImpact: 0,
        lastActive: '',
      }
    );
  }, [agents]);

  const latestMissionReport = React.useMemo(() => {
    if (!agents) return null;

    const smallAgents = agents.filter((a) => a.type === 'small');
    let latestReport = null;
    let latestDate = '';

    for (const agent of smallAgents) {
      for (const report of agent.missionReports) {
        if (!latestDate || report.endDate > latestDate) {
          latestReport = report;
          latestDate = report.endDate;
        }
      }
    }

    return latestReport;
  }, [agents]);

  if (!agents || !aggregateMetrics) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Agent Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {agents.length} Active Agent{agents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Overall Metrics */}
      <MetricsDisplay metrics={aggregateMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <AgentMetrics
                  key={agent.id}
                  agent={agent}
                  className="border-b pb-4 last:border-0 last:pb-0"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest Mission Report */}
        {latestMissionReport && (
          <ReportCard
            report={latestMissionReport}
            onViewDetails={() => {/* Handle view details */}}
            onUpgrade={() => {/* Handle upgrade */}}
          />
        )}
      </div>
    </div>
  );
} 