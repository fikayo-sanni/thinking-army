'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pipeline } from '@/components/crm/Pipeline';
import { crmService } from '@/lib/services/crm.service';
import {
  Building2,
  Clock,
  Copy,
  Eye,
  Filter,
  Search,
  Star,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const industries = [
  'All Industries',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Professional Services',
];

const categories = [
  {
    id: 'sales',
    name: 'Sales',
    icon: BarChart2,
    description: 'Templates for sales processes and customer acquisition',
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    icon: CheckCircle2,
    description: 'Customer and partner onboarding workflows',
  },
  {
    id: 'support',
    name: 'Support',
    icon: MessageSquare,
    description: 'Customer support and issue resolution',
  },
  {
    id: 'engagement',
    name: 'Engagement',
    icon: Mail,
    description: 'Customer engagement and retention',
  },
];

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sales');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['journey-templates'],
    queryFn: () => crmService.getJourneyTemplates(),
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesIndustry =
      selectedIndustry === 'All Industries' || template.industry === selectedIndustry;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    router.push(`/crm/journeys/new?template=${templateId}`);
  };

  const handleViewDetails = (templateId: string) => {
    router.push(`/crm/templates/${templateId}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Template Gallery</h1>
        <p className="text-muted-foreground mt-1">
          Browse and use pre-built journey templates for your industry
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Industry Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          {industries.map((industry) => (
            <Button
              key={industry}
              variant={selectedIndustry === industry ? 'default' : 'outline'}
              className="flex-shrink-0"
              onClick={() => setSelectedIndustry(industry)}
            >
              {industry}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 h-auto p-0 bg-transparent gap-4">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col items-start gap-2 p-4 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                <span className="font-semibold">{category.name}</span>
              </div>
              <p className="text-sm text-left text-muted-foreground">
                {category.description}
              </p>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle>{template.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{template.industry}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {category.name}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">{template.description}</p>

                      {/* Preview Pipeline */}
                      <div className="relative group-hover:after:bg-black/50 group-hover:after:absolute group-hover:after:inset-0 group-hover:after:rounded-lg transition-all">
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
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button
                            variant="default"
                            onClick={() => handleViewDetails(template.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {template.metrics.averageCompletionTime} days
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Avg. Time
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
                              {template.metrics.activeUsers}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Users
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm text-primary">
                            {template.stages.length} stages
                          </span>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Use Template
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 