'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pipeline } from '@/components/crm/Pipeline';
import { CustomerCard } from '@/components/crm/CustomerCard';
import { formatCurrency, formatNumber, safeFormatDate } from '@/lib/utils';
import {
  Activity,
  BarChart2,
  Clock,
  DollarSign,
  MessageSquare,
  Star,
} from 'lucide-react';
import type { Customer, CustomerJourney, CustomerInteraction, CustomerMetrics } from '@/lib/types/crm.types';

interface CustomerDetailsContentProps {
  customer: Customer;
  journeys: CustomerJourney[];
  interactions: CustomerInteraction[];
  metrics: CustomerMetrics;
}

export function CustomerDetailsContent({
  customer,
  journeys = [],
  interactions = [],
  metrics,
}: CustomerDetailsContentProps) {
  const activeJourney = journeys.find((j) => j.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CustomerCard customer={customer} />

        {/* Metrics */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(metrics.totalSpent)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>Lifetime Value</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(metrics.lifetimeValue)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Interactions</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatNumber(metrics.interactionCount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart2 className="h-4 w-4" />
                    <span>Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {Math.round(metrics.successRate * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Journey */}
      {activeJourney && (
        <Card>
          <CardHeader>
            <CardTitle>Active Journey: {activeJourney.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Pipeline
              journey={activeJourney}
              stages={[
                {
                  id: 'stage_1',
                  name: 'Initial Contact',
                  description: 'First interaction with the customer',
                  order: 1,
                  automationRules: [],
                  requiredFields: ['email', 'phone'],
                  nextStages: ['stage_2'],
                },
                {
                  id: 'stage_2',
                  name: 'Needs Assessment',
                  description: 'Understand customer requirements',
                  order: 2,
                  automationRules: [],
                  requiredFields: ['requirements', 'budget'],
                  nextStages: ['stage_3'],
                },
                {
                  id: 'stage_3',
                  name: 'Proposal',
                  description: 'Present solution and pricing',
                  order: 3,
                  automationRules: [],
                  requiredFields: [],
                  nextStages: ['stage_4'],
                },
                {
                  id: 'stage_4',
                  name: 'Negotiation',
                  description: 'Finalize terms and conditions',
                  order: 4,
                  automationRules: [],
                  requiredFields: [],
                  nextStages: ['stage_5'],
                },
                {
                  id: 'stage_5',
                  name: 'Closed Won',
                  description: 'Deal successfully closed',
                  order: 5,
                  automationRules: [],
                  requiredFields: [],
                  nextStages: [],
                },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Interactions & History */}
      <Tabs defaultValue="interactions">
        <TabsList>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="history">Journey History</TabsTrigger>
        </TabsList>
        <TabsContent value="interactions">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {interactions.map((interaction, index) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 border-l-2 border-primary/20 pl-4"
                  >
                    <Activity className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{interaction.subject}</h4>
                        <time className="text-sm text-muted-foreground">
                          {safeFormatDate(interaction.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {interaction.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Type: {interaction.type}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Status: {interaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {journeys.map((journey, index) => (
                  <motion.div
                    key={journey.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 border-l-2 border-primary/20 pl-4"
                  >
                    <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{journey.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {journey.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {journey.description}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          Completed Tasks: {journey.metrics.completedTasks}/
                          {journey.metrics.totalTasks}
                        </div>
                        <div>
                          Time in Journey: {journey.metrics.totalTime} hours
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 