'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, Sparkles, Target, Users, Workflow, ArrowRight, Plus, Settings, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSetPageTitle } from '@/hooks/use-page-title';
import { AgentCard } from '@/components/agents/AgentCard';
import { AgentMetrics } from '@/components/agents/AgentMetrics';
import { cn } from '@/lib/utils';

export default function AgentsPage() {
  useSetPageTitle('AI Agents');

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Quick Actions Section
  const quickActions = [
    {
      title: 'Deploy Small Agent',
      description: 'Launch an entry-level AI workflow',
      icon: Brain,
      href: '/agents/new?type=small',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Configure Big Sales',
      description: 'Set up enterprise-grade AI solution',
      icon: Target,
      href: '/agents/new?type=big',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Workflow Builder',
      description: 'Create custom AI workflows',
      icon: Workflow,
      href: '/workflows/new',
      color: 'bg-green-500/10 text-green-500',
    },
  ];

  // Featured Templates Section
  const featuredTemplates = [
    {
      title: 'Lead Generation Assistant',
      description: 'Automates lead research and initial outreach',
      metrics: {
        tasksCompleted: 1250,
        successRate: 92,
        timeSaved: 45,
      },
      type: 'small',
      status: 'popular',
      setupTime: '5 min',
      price: '€50/month',
    },
    {
      title: 'Sales Process Optimizer',
      description: 'AI-driven sales funnel optimization',
      metrics: {
        tasksCompleted: 3500,
        successRate: 88,
        timeSaved: 120,
      },
      type: 'big',
      status: 'enterprise',
      setupTime: '2 hours',
      price: 'Custom',
    },
    {
      title: 'Customer Support Bot',
      description: 'Handles routine customer inquiries',
      metrics: {
        tasksCompleted: 8900,
        successRate: 95,
        timeSaved: 80,
      },
      type: 'small',
      status: 'trending',
      setupTime: '10 min',
      price: '€50/month',
    },
  ];

  // Success Stories Section
  const successStories = [
    {
      company: 'TechCorp Inc.',
      agentType: 'Small Agent',
      results: '45% increase in lead response rate',
      timeframe: '3 months',
      savings: '€15,000/month',
    },
    {
      company: 'Global Sales Ltd.',
      agentType: 'Big Sales',
      results: '2.5x sales pipeline growth',
      timeframe: '6 months',
      savings: '€120,000/quarter',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] dark:text-[#E6E6E6]">AI Agents</h1>
          <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-2">
            Deploy AI agents to automate and optimize your business processes
          </p>
        </div>
        <Button onClick={() => window.location.href = '/agents/new'}>
          <Plus className="mr-2 h-4 w-4" /> New Agent
        </Button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = action.href}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className={cn("p-3 rounded-lg", action.color)}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#202124] dark:text-[#E6E6E6]">{action.title}</h3>
                  <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-1">{action.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#5F6368] dark:text-[#A0A0A0]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Templates */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#202124] dark:text-[#E6E6E6]">Featured Templates</h2>
          <Button variant="outline" onClick={() => window.location.href = '/agents/templates'}>
            View All Templates
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <Card key={template.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{template.title}</CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                  <Badge
                    variant={template.status === 'enterprise' ? 'destructive' : 'default'}
                    className="capitalize"
                  >
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AgentMetrics metrics={template.metrics} />
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">Setup Time</p>
                      <p className="font-medium">{template.setupTime}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">Starting at</p>
                      <p className="font-medium">{template.price}</p>
                    </div>
                  </div>
                  <Button className="w-full" variant={template.type === 'big' ? 'destructive' : 'default'}>
                    Deploy {template.type === 'big' ? 'Big Sales' : 'Small Agent'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#202124] dark:text-[#E6E6E6]">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {successStories.map((story) => (
            <Card key={story.company} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#202124] dark:text-[#E6E6E6]">{story.company}</h3>
                    <Badge className="mt-2">{story.agentType}</Badge>
                    <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-4">{story.results}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">Timeframe</p>
                        <p className="font-medium">{story.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">Cost Savings</p>
                        <p className="font-medium text-green-500">{story.savings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to launch your first AI agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">1. Choose Your Agent Type</h3>
                <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-1">
                  Start with a Small Agent for specific tasks or Big Sales for enterprise solutions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">2. Configure Your Workflow</h3>
                <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-1">
                  Customize the agent's behavior and integration points
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">3. Deploy and Monitor</h3>
                <p className="text-[#5F6368] dark:text-[#A0A0A0] mt-1">
                  Launch your agent and track its performance in real-time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 