export type AgentType = 'small' | 'big';

export type AgentStatus = 'active' | 'inactive' | 'configuring' | 'error';

export interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  timesSaved: number; // in hours
  businessImpact: number; // in EUR
  lastActive: string;
}

export interface MissionReport {
  id: string;
  agentId: string;
  startDate: string;
  endDate: string;
  metrics: AgentMetrics;
  insights: string[];
  recommendations: {
    nextSteps: string[];
    upgradePath?: string;
  };
}

export interface BaseAgent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
  metrics: AgentMetrics;
}

export interface SmallAgent extends BaseAgent {
  type: 'small';
  businessProcess: string;
  setupFee: number;
  monthlyFee: number;
  missionReports: MissionReport[];
  configuration: {
    processParameters: Record<string, any>;
    integrations: string[];
    schedule?: string;
  };
}

export interface BigAgent extends BaseAgent {
  type: 'big';
  capabilities: string[];
  basePrice: number;
  customizations: {
    name: string;
    description: string;
    price: number;
  }[];
  integrations: {
    name: string;
    status: 'active' | 'pending' | 'failed';
    lastSync?: string;
  }[];
  workflows: {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'error';
  }[];
}

export type Agent = SmallAgent | BigAgent;

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  features: string[];
  useCases: string[];
  setupTime: string;
  pricing: {
    setupFee?: number;
    monthlyFee?: number;
    basePrice?: number;
  };
  requirements: string[];
} 