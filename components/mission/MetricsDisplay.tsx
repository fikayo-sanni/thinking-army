import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AgentMetrics } from '@/lib/types/agent.types';
import { formatCurrency } from '@/lib/utils';
import { Brain, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: AgentMetrics;
  previousMetrics?: AgentMetrics;
  className?: string;
}

interface MetricChange {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
}

export function MetricsDisplay({
  metrics,
  previousMetrics,
  className = '',
}: MetricsDisplayProps) {
  const calculateChange = (current: number, previous?: number): MetricChange => {
    if (!previous) {
      return { value: 0, percentage: 0, trend: 'neutral' };
    }

    const change = current - previous;
    const percentage = (change / previous) * 100;

    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  };

  const metricItems = [
    {
      icon: Brain,
      label: 'Tasks Completed',
      value: metrics.tasksCompleted,
      format: (value: number) => value.toLocaleString(),
      color: 'text-blue-500',
      change: calculateChange(
        metrics.tasksCompleted,
        previousMetrics?.tasksCompleted
      ),
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: metrics.successRate,
      format: (value: number) => `${value}%`,
      color: 'text-green-500',
      change: calculateChange(metrics.successRate, previousMetrics?.successRate),
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: metrics.timesSaved,
      format: (value: number) => `${value}h`,
      color: 'text-purple-500',
      change: calculateChange(metrics.timesSaved, previousMetrics?.timesSaved),
    },
    {
      icon: DollarSign,
      label: 'Business Impact',
      value: metrics.businessImpact,
      format: (value: number) => formatCurrency(value),
      color: 'text-yellow-500',
      change: calculateChange(
        metrics.businessImpact,
        previousMetrics?.businessImpact
      ),
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metricItems.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-full bg-background ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              {item.change.trend !== 'neutral' && (
                <div
                  className={`text-sm ${
                    item.change.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {item.change.trend === 'up' ? '↑' : '↓'} {item.change.percentage.toFixed(1)}%
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-2xl font-bold">{item.format(item.value)}</div>
            </div>

            {previousMetrics && (
              <div className="pt-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.min(100, (item.value / (previousMetrics[item.label.toLowerCase().replace(/\s+/g, '')] || 1)) * 100).toFixed(0)}%</span>
                </div>
                <Progress
                  value={Math.min(100, (item.value / (previousMetrics[item.label.toLowerCase().replace(/\s+/g, '')] || 1)) * 100)}
                  className="h-1"
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
} 