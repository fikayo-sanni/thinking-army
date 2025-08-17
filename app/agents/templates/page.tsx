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
import {
  Brain,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
  FileText,
  Mail,
  Settings,
  Zap,
} from 'lucide-react';

const categories = [
  {
    id: 'small',
    name: 'Small Agents',
    icon: Brain,
    description: 'Entry-level AI workflows for specific tasks',
    price: '€500 + €50/month',
  },
  {
    id: 'big',
    name: 'Big Sales',
    icon: TrendingUp,
    description: 'Enterprise-grade AI transformation solutions',
    price: '€20,000+',
  },
];

const templates = [
  {
    id: 'social-content',
    name: 'Social Content Agent',
    category: 'small',
    description: '30 days of posts, captions, and visuals',
    features: [
      'Content calendar generation',
      'Image suggestions',
      'Hashtag optimization',
      'Engagement analytics',
    ],
    metrics: {
      timeToValue: '24 hours',
      avgTimeSaved: '15 hours/week',
      successRate: 92,
    },
  },
  {
    id: 'appointment',
    name: 'Appointment Booking Agent',
    category: 'small',
    description: 'Automated scheduling and reminders',
    features: [
      'Calendar integration',
      'Automated follow-ups',
      'Custom availability rules',
      'Multi-timezone support',
    ],
    metrics: {
      timeToValue: '2 days',
      avgTimeSaved: '10 hours/week',
      successRate: 95,
    },
  },
  {
    id: 'quote',
    name: 'Quote & Proposal Agent',
    category: 'small',
    description: 'Ready-to-send offers in hours',
    features: [
      'Template customization',
      'Pricing optimization',
      'Competitor analysis',
      'Follow-up automation',
    ],
    metrics: {
      timeToValue: '48 hours',
      avgTimeSaved: '12 hours/week',
      successRate: 88,
    },
  },
  {
    id: 'corporate-funnel',
    name: 'Corporate Funnel Agent',
    category: 'big',
    description: 'Complete multi-channel sales machine',
    features: [
      'Lead scoring & qualification',
      'Multi-channel orchestration',
      'Advanced analytics dashboard',
      'Custom workflow builder',
    ],
    metrics: {
      timeToValue: '2 weeks',
      avgRevenue: '€150,000+',
      successRate: 85,
    },
  },
  {
    id: 'local-domination',
    name: 'Local Domination Agent',
    category: 'big',
    description: 'Dominate local markets with integrated marketing',
    features: [
      'Local SEO optimization',
      'Review management',
      'Competitor tracking',
      'Local ad automation',
    ],
    metrics: {
      timeToValue: '3 weeks',
      avgRevenue: '€100,000+',
      successRate: 82,
    },
  },
];

export default function AgentTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('small');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = template.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    router.push(`/agents/new?template=${templateId}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Agent Templates</h1>
        <p className="text-muted-foreground mt-1">
          Choose from our pre-built AI agents for your specific needs
        </p>
      </div>

      {/* Search and Filters */}
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

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 h-auto p-0 bg-transparent gap-4">
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
              <p className="text-sm font-medium text-left text-primary">
                {category.price}
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
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{template.name}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {category.name}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {template.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features</h4>
                        <ul className="space-y-2">
                          {template.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <Zap className="h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {template.metrics.timeToValue}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Time to Value
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {template.category === 'small' ? (
                            <>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {template.metrics.avgTimeSaved}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Time Saved
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {template.metrics.avgRevenue}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Avg. Revenue
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {template.metrics.successRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Success Rate
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t">
                        <Button
                          className="w-full"
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