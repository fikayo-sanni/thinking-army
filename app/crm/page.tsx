'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { crmService } from '@/lib/services/crm.service';
import { formatNumber, formatCurrency, safeFormatDate } from '@/lib/utils';
import {
  Activity,
  BarChart2,
  Clock,
  DollarSign,
  MessageSquare,
  Star,
  Users,
  GitBranch,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CRMDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['crm', 'dashboard'],
    queryFn: () => crmService.getDashboardMetrics(),
  });

  if (isLoading || !metrics) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      name: 'Active Customers',
      value: formatNumber(metrics.activeCustomers),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      description: 'Total active customers in the system',
    },
    {
      name: 'Active Journeys',
      value: formatNumber(metrics.activeJourneys),
      change: '+8%',
      trend: 'up',
      icon: GitBranch,
      color: 'text-purple-500',
      description: 'Customer journeys in progress',
    },
    {
      name: 'Customer Satisfaction',
      value: `${Math.round(metrics.customerSatisfaction * 100)}%`,
      change: '+5%',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-500',
      description: 'Overall customer satisfaction score',
    },
    {
      name: 'Revenue Generated',
      value: formatCurrency(metrics.revenueGenerated),
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500',
      description: 'Total revenue from all customers',
    },
  ];

  const recentActivities = [
    {
      type: 'new_customer',
      icon: UserPlus,
      color: 'text-green-500',
      content: 'New customer onboarded: Tech Solutions Inc.',
      timestamp: '2 hours ago',
    },
    {
      type: 'journey_completed',
      icon: CheckCircle2,
      color: 'text-blue-500',
      content: 'Enterprise sales journey completed successfully',
      timestamp: '3 hours ago',
    },
    {
      type: 'journey_stalled',
      icon: AlertCircle,
      color: 'text-yellow-500',
      content: 'Journey stalled: Awaiting customer response',
      timestamp: '5 hours ago',
    },
    {
      type: 'journey_failed',
      icon: XCircle,
      color: 'text-red-500',
      content: 'Journey ended: Customer requirements changed',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your customer relationships and journeys
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={cn(
                    "flex items-center",
                    stat.trend === 'up' ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Journey Performance */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Journey Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {metrics.topPerformingTemplates.map((template, index) => (
                <div key={template.templateId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {template.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.activeUsers} active users
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {Math.round(template.successRate * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Success rate
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={template.successRate * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-8">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4"
                  >
                    <div className={cn(
                      "rounded-full p-2",
                      activity.color.replace('text-', 'bg-').concat('/10')
                    )}>
                      <activity.icon className={cn("h-4 w-4", activity.color)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.content}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
              <UserPlus className="h-5 w-5 text-primary" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium leading-none">Add Customer</p>
                <p className="text-sm text-muted-foreground">
                  Create a new customer profile
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto mt-2" />
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
              <GitBranch className="h-5 w-5 text-primary" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium leading-none">Start Journey</p>
                <p className="text-sm text-muted-foreground">
                  Begin a new customer journey
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto mt-2" />
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium leading-none">Send Message</p>
                <p className="text-sm text-muted-foreground">
                  Contact a customer directly
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto mt-2" />
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
              <BarChart2 className="h-5 w-5 text-primary" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium leading-none">View Reports</p>
                <p className="text-sm text-muted-foreground">
                  Analyze customer data
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto mt-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 