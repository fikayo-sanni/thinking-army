'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pipeline } from '@/components/crm/Pipeline';
import { crmService } from '@/lib/services/crm.service';
import { CustomerJourney } from '@/lib/types/crm.types';
import {
  Search,
  Plus,
  GitBranch,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

const statusColors = {
  active: 'text-green-500',
  completed: 'text-blue-500',
  paused: 'text-yellow-500',
} as const;

const statusIcons = {
  active: CheckCircle2,
  completed: CheckCircle2,
  paused: AlertCircle,
} as const;

export default function JourneysPage() {
  const router = useRouter();

  const { data: journeys = [], isLoading } = useQuery({
    queryKey: ['customer-journeys'],
    queryFn: () => crmService.getCustomerJourneys('all'),
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['journey-templates'],
    queryFn: () => crmService.getJourneyTemplates(),
  });

  const handleStartJourney = () => {
    router.push('/crm/journeys/new');
  };

  const handleViewJourney = (journeyId: string) => {
    router.push(`/crm/journeys/${journeyId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Journeys</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer journey progress
          </p>
        </div>
        <Button onClick={handleStartJourney}>
          <Plus className="mr-2 h-4 w-4" />
          Start Journey
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search journeys..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Journey Cards */}
      <div className="grid gap-4">
        {journeys.map((journey, index) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{journey.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {journey.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      statusColors[journey.status]
                    )}>
                      {React.createElement(statusIcons[journey.status], {
                        className: "h-4 w-4",
                      })}
                      <span className="capitalize">{journey.status}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewJourney(journey.id)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Pipeline
                  journey={journey}
                  stages={templates.find(t => t.id === journey.templateId)?.stages || []}
                />

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {journey.metrics.timeInStage}h
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Time in stage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {journey.metrics.completedTasks}/{journey.metrics.totalTasks}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {journey.stageHistory.length} stages
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Journey progress
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 