'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, TrendingUp } from 'lucide-react';

export interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  timeSaved: number;
}

interface AgentMetricsProps {
  metrics: AgentMetrics;
}

export function AgentMetrics({ metrics }: AgentMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1">
        <div className="flex items-center text-[#5F6368] dark:text-[#A0A0A0]">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Tasks</span>
        </div>
        <p className="font-semibold">{metrics.tasksCompleted}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-[#5F6368] dark:text-[#A0A0A0]">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">Success</span>
        </div>
        <p className="font-semibold">{metrics.successRate}%</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-[#5F6368] dark:text-[#A0A0A0]">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">Time Saved</span>
        </div>
        <p className="font-semibold">{metrics.timeSaved}h</p>
      </div>
    </div>
  );
} 