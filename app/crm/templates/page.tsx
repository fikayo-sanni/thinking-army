'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pipeline } from '@/components/crm/Pipeline';
import { crmService } from '@/lib/services/crm.service';
import {
  Building2,
  Clock,
  Copy,
  Edit2,
  Plus,
  Search,
  Star,
  Users,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function TemplatesPage() {
  const router = useRouter();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['journey-templates'],
    queryFn: () => crmService.getJourneyTemplates(),
  });

  const handleCreateTemplate = () => {
    router.push('/crm/journeys/builder');
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/crm/journeys/builder?template=${templateId}`);
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/crm/journeys/new?template=${templateId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journey Templates</h1>
          <p className="text-muted-foreground mt-1">
            Pre-built journey templates for different industries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/crm/templates/gallery')}>
            <Search className="mr-2 h-4 w-4" />
            Browse Gallery
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-9"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{template.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{template.industry}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{template.description}</p>

                <Pipeline
                  journey={{
                    id: 'preview',
                    customerId: '',
                    templateId: template.id,
                    name: template.name,
                    description: template.description,
                    currentStage: template.stages[0]?.id,
                    stageHistory: [],
                    status: 'active',
                    metrics: {
                      timeInStage: 0,
                      totalTime: 0,
                      completedTasks: 0,
                      totalTasks: template.stages.length,
                    },
                  }}
                  stages={template.stages}
                />

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {template.metrics.averageCompletionTime} days
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg. Completion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {Math.round(template.metrics.successRate * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatNumber(template.metrics.activeUsers)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active Users
                      </p>
                    </div>
                  </div>
                </div>

                {/* Required Fields */}
                {template.stages.some(s => s.requiredFields.length > 0) && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Required Fields</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(
                        template.stages.flatMap(s => s.requiredFields)
                      )).map((field) => (
                        <div
                          key={field}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {field}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 