import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Play, Pause, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  startTime: string;
  endTime?: string;
  progress: number;
  currentAction?: string;
  error?: string;
  actions: {
    name: string;
    status: 'completed' | 'running' | 'pending' | 'failed';
    duration?: number;
    error?: string;
  }[];
}

interface WorkflowMonitorProps {
  runs: WorkflowRun[];
  onRefresh?: () => void;
}

const statusColors = {
  running: 'bg-blue-500 text-white',
  completed: 'bg-green-500 text-white',
  failed: 'bg-red-500 text-white',
  pending: 'bg-yellow-500 text-white',
};

const statusIcons = {
  running: RefreshCw,
  completed: CheckCircle,
  failed: AlertCircle,
  pending: Clock,
};

export function WorkflowMonitor({ runs, onRefresh }: WorkflowMonitorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workflow Monitor</CardTitle>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {runs.map((run) => {
              const StatusIcon = statusIcons[run.status];
              return (
                <Card key={run.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-5 w-5 ${
                          run.status === 'running' ? 'animate-spin' : ''
                        }`} />
                        <span className="font-medium">Run #{run.id}</span>
                      </div>
                      <Badge className={statusColors[run.status]}>
                        {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{run.progress}%</span>
                      </div>
                      <Progress value={run.progress} />
                    </div>

                    {run.currentAction && (
                      <div className="text-sm text-muted-foreground">
                        Currently executing: {run.currentAction}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Actions</div>
                      <div className="space-y-2">
                        {run.actions.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center space-x-2">
                              {action.status === 'running' ? (
                                <Play className="h-4 w-4 text-blue-500" />
                              ) : action.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : action.status === 'failed' ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <Pause className="h-4 w-4 text-yellow-500" />
                              )}
                              <span>{action.name}</span>
                            </div>
                            {action.duration && (
                              <span className="text-muted-foreground">
                                {action.duration}ms
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {run.error && (
                      <div className="text-sm text-red-500">
                        Error: {run.error}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Started {formatDistanceToNow(new Date(run.startTime))} ago
                      {run.endTime &&
                        ` • Ended ${formatDistanceToNow(new Date(run.endTime))} ago`}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 