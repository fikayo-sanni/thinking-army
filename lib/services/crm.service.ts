import { 
  Customer, 
  CustomerJourney, 
  JourneyTemplate, 
  CustomerInteraction,
  CustomerMetrics,
  CRMDashboardMetrics
} from '@/lib/types/crm.types';

class CRMService {
  private static instance: CRMService;
  
  private constructor() {}

  public static getInstance(): CRMService {
    if (!CRMService.instance) {
      CRMService.instance = new CRMService();
    }
    return CRMService.instance;
  }

  // Mock data generators
  private generateMockCustomers(count: number = 10): Customer[] {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'];
    const sources = ['website', 'referral', 'direct', 'other'] as const;
    const statuses = ['active', 'inactive', 'pending'] as const;

    return Array.from({ length: count }, (_, i) => ({
      id: `cust_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1234567${i.toString().padStart(4, '0')}`,
      company: `Company ${i + 1}`,
      industry: industries[i % industries.length],
      status: statuses[i % statuses.length],
      source: sources[i % sources.length],
      assignedTo: `agent_${i % 3 + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      tags: ['tag1', 'tag2'],
      customFields: {
        preferredContact: 'email',
        lastPurchase: new Date(Date.now() - i * 86400000).toISOString(),
      },
    }));
  }

  private generateMockJourneys(count: number = 5): CustomerJourney[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `journey_${i + 1}`,
      customerId: `cust_${i + 1}`,
      templateId: `template_${i % 3 + 1}`,
      name: `Journey ${i + 1}`,
      description: `Customer journey for process ${i + 1}`,
      currentStage: `stage_${i % 4 + 1}`,
      stageHistory: [
        {
          stageId: `stage_1`,
          enteredAt: new Date(Date.now() - i * 86400000).toISOString(),
          completedAt: new Date(Date.now() - i * 43200000).toISOString(),
          notes: 'Completed successfully',
        },
      ],
      status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'active' : 'paused',
      metrics: {
        timeInStage: i * 24,
        totalTime: i * 72,
        completedTasks: i * 2,
        totalTasks: i * 3,
      },
    }));
  }

  private generateMockTemplates(count: number = 3): JourneyTemplate[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `template_${i + 1}`,
      name: `Template ${i + 1}`,
      description: `Journey template for industry ${i + 1}`,
      industry: ['Technology', 'Healthcare', 'Finance'][i],
      stages: [
        {
          id: `stage_${i}_1`,
          name: 'Initial Contact',
          description: 'First interaction with the customer',
          order: 1,
          automationRules: [],
          requiredFields: ['email', 'phone'],
          nextStages: [`stage_${i}_2`],
        },
        {
          id: `stage_${i}_2`,
          name: 'Needs Assessment',
          description: 'Understand customer requirements',
          order: 2,
          automationRules: [],
          requiredFields: ['requirements', 'budget'],
          nextStages: [`stage_${i}_3`],
        },
      ],
      automationRules: [],
      metrics: {
        averageCompletionTime: 14 * (i + 1),
        successRate: 0.7 + (i * 0.1),
        activeUsers: 10 * (i + 1),
      },
    }));
  }

  private generateMockInteractions(count: number = 20): CustomerInteraction[] {
    const types = ['email', 'call', 'meeting', 'note', 'task'] as const;
    const statuses = ['pending', 'completed', 'scheduled'] as const;

    return Array.from({ length: count }, (_, i) => ({
      id: `interaction_${i + 1}`,
      customerId: `cust_${i % 10 + 1}`,
      type: types[i % types.length],
      subject: `Interaction ${i + 1}`,
      description: `Details for interaction ${i + 1}`,
      status: statuses[i % statuses.length],
      scheduledAt: new Date(Date.now() + i * 86400000).toISOString(),
      completedAt: i % 2 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      assignedTo: `agent_${i % 3 + 1}`,
      createdBy: `agent_${i % 3 + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
    }));
  }

  private generateMockMetrics(): CRMDashboardMetrics {
    return {
      activeCustomers: 150,
      activeJourneys: 75,
      completedJourneys: 250,
      averageJourneyTime: 14, // days
      customerSatisfaction: 0.85,
      revenueGenerated: 1500000,
      topPerformingTemplates: [
        {
          templateId: 'template_1',
          name: 'Enterprise Sales',
          successRate: 0.85,
          activeUsers: 45,
        },
        {
          templateId: 'template_2',
          name: 'SMB Onboarding',
          successRate: 0.78,
          activeUsers: 120,
        },
      ],
      recentActivities: [
        {
          id: 'activity_1',
          type: 'journey_completed',
          description: 'Customer completed enterprise sales journey',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          customerId: 'cust_1',
        },
        {
          id: 'activity_2',
          type: 'stage_advanced',
          description: 'Customer moved to implementation stage',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          customerId: 'cust_2',
        },
      ],
    };
  }

  // Public API methods
  async getCustomers(): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return this.generateMockCustomers();
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const customers = this.generateMockCustomers();
    return customers.find(c => c.id === id) || null;
  }

  async getCustomerJourneys(customerId: string): Promise<CustomerJourney[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const journeys = this.generateMockJourneys();
    return journeys.filter(j => j.customerId === customerId);
  }

  async getJourneyTemplates(): Promise<JourneyTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return this.generateMockTemplates();
  }

  async getCustomerInteractions(customerId: string): Promise<CustomerInteraction[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const interactions = this.generateMockInteractions();
    return interactions.filter(i => i.customerId === customerId);
  }

  async getCustomerMetrics(customerId: string): Promise<CustomerMetrics> {
    await new Promise(resolve => setTimeout(resolve, 900));
    return {
      totalSpent: 25000,
      lifetimeValue: 75000,
      interactionCount: 15,
      lastInteraction: new Date(Date.now() - 86400000).toISOString(),
      journeysCompleted: 3,
      averageJourneyTime: 14,
      successRate: 0.8,
    };
  }

  async getDashboardMetrics(): Promise<CRMDashboardMetrics> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return this.generateMockMetrics();
  }
}

export const crmService = CRMService.getInstance(); 