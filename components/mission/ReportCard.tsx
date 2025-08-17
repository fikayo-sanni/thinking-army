import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ChartBar, ArrowUpRight, Calendar } from 'lucide-react';
import { MissionReport } from '@/lib/types/agent.types';
import { formatCurrency } from '@/lib/utils';

interface ReportCardProps {
  report: MissionReport;
  onViewDetails?: () => void;
  onUpgrade?: () => void;
}

export function ReportCard({ report, onViewDetails, onUpgrade }: ReportCardProps) {
  const duration = formatDistanceToNow(new Date(report.startDate), {
    addSuffix: true,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <ChartBar className="h-5 w-5 text-primary" />
              <span>Mission Report</span>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {duration}
            </CardDescription>
          </div>
          <Badge variant="outline">
            30-Day Analysis
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
              <div className="text-2xl font-bold">
                {report.metrics.tasksCompleted.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold">
                {report.metrics.successRate}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Time Saved</div>
              <div className="text-2xl font-bold">
                {report.metrics.timesSaved}h
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Business Impact</div>
              <div className="text-2xl font-bold">
                {formatCurrency(report.metrics.businessImpact)}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2">
            <div className="font-medium">Key Insights</div>
            <ul className="space-y-1">
              {report.insights.map((insight, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <div className="font-medium">Recommendations</div>
            <ul className="space-y-1">
              {report.recommendations.nextSteps.map((step, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade Path */}
          {report.recommendations.upgradePath && (
            <div className="bg-primary/5 p-4 rounded-lg space-y-2">
              <div className="font-medium flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Upgrade Opportunity
              </div>
              <p className="text-sm text-muted-foreground">
                {report.recommendations.upgradePath}
              </p>
              {onUpgrade && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full mt-2"
                  onClick={onUpgrade}
                >
                  Explore Upgrade
                </Button>
              )}
            </div>
          )}

          {/* Actions */}
          {onViewDetails && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onViewDetails}>
                View Full Report
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 