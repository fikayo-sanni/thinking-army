export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  status: 'active' | 'inactive' | 'pending';
  source: 'website' | 'referral' | 'direct' | 'other';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  order: number;
  automationRules: AutomationRule[];
  requiredFields: string[];
  nextStages: string[]; // IDs of possible next stages
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  templateId?: string;
  name: string;
  description: string;
  currentStage: string; // ID of current stage
  stageHistory: {
    stageId: string;
    enteredAt: string;
    completedAt?: string;
    notes?: string;
  }[];
  status: 'active' | 'completed' | 'paused';
  metrics: {
    timeInStage: number;
    totalTime: number;
    completedTasks: number;
    totalTasks: number;
  };
}

export interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  industry?: string;
  stages: JourneyStage[];
  automationRules: AutomationRule[];
  metrics: {
    averageCompletionTime: number;
    successRate: number;
    activeUsers: number;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'event' | 'condition';
    config: Record<string, any>;
  };
  actions: {
    type: string;
    config: Record<string, any>;
  }[];
  enabled: boolean;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  subject: string;
  description: string;
  status: 'pending' | 'completed' | 'scheduled';
  scheduledAt?: string;
  completedAt?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerMetrics {
  totalSpent: number;
  lifetimeValue: number;
  interactionCount: number;
  lastInteraction: string;
  journeysCompleted: number;
  averageJourneyTime: number;
  successRate: number;
}

export interface CRMDashboardMetrics {
  activeCustomers: number;
  activeJourneys: number;
  completedJourneys: number;
  averageJourneyTime: number;
  customerSatisfaction: number;
  revenueGenerated: number;
  topPerformingTemplates: {
    templateId: string;
    name: string;
    successRate: number;
    activeUsers: number;
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    customerId: string;
  }[];
} 