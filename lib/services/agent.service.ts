import { Agent, SmallAgent, BigAgent, AgentTemplate, AgentType, MissionReport } from '../types/agent.types';
import { mockAgents, mockSmallAgents, mockBigAgents, mockAgentTemplates } from '../mock/agent-data';

class AgentService {
  private static instance: AgentService;
  private agents: Agent[] = mockAgents;
  private templates: AgentTemplate[] = mockAgentTemplates;

  private constructor() {}

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  // Agent Template Methods
  public async getAgentTemplates(type?: AgentType): Promise<AgentTemplate[]> {
    await this.simulateDelay();
    return type 
      ? this.templates.filter(template => template.type === type)
      : this.templates;
  }

  public async getAgentTemplateById(id: string): Promise<AgentTemplate | null> {
    await this.simulateDelay();
    return this.templates.find(template => template.id === id) || null;
  }

  // Agent Methods
  public async getAgents(type?: AgentType): Promise<Agent[]> {
    await this.simulateDelay();
    return type
      ? this.agents.filter(agent => agent.type === type)
      : this.agents;
  }

  public async getAgentById(id: string): Promise<Agent | null> {
    await this.simulateDelay();
    return this.agents.find(agent => agent.id === id) || null;
  }

  public async createAgent(
    templateId: string,
    configuration: Record<string, any>
  ): Promise<Agent> {
    await this.simulateDelay();
    const template = await this.getAgentTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newAgent: Agent = template.type === 'small'
      ? this.createSmallAgent(template, configuration)
      : this.createBigAgent(template, configuration);

    this.agents.push(newAgent);
    return newAgent;
  }

  public async updateAgent(
    id: string,
    updates: Partial<Omit<Agent, 'type'>>
  ): Promise<Agent> {
    await this.simulateDelay();
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index === -1) {
      throw new Error('Agent not found');
    }

    const currentAgent = this.agents[index];
    const updatedAgent = {
      ...currentAgent,
      ...updates,
      type: currentAgent.type, // Preserve the original type
      updatedAt: new Date().toISOString()
    } as Agent;

    this.agents[index] = updatedAgent;
    return updatedAgent;
  }

  public async deleteAgent(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index === -1) {
      throw new Error('Agent not found');
    }

    this.agents.splice(index, 1);
  }

  // Mission Report Methods
  public async getMissionReports(agentId: string): Promise<MissionReport[]> {
    await this.simulateDelay();
    const agent = await this.getAgentById(agentId);
    if (!agent || agent.type !== 'small') {
      throw new Error('Small Agent not found');
    }

    return (agent as SmallAgent).missionReports;
  }

  public async generateMissionReport(agentId: string): Promise<MissionReport> {
    await this.simulateDelay();
    const agent = await this.getAgentById(agentId);
    if (!agent || agent.type !== 'small') {
      throw new Error('Small Agent not found');
    }

    const smallAgent = agent as SmallAgent;
    const report: MissionReport = {
      id: `mr-${Date.now()}`,
      agentId,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      endDate: new Date().toISOString(),
      metrics: smallAgent.metrics,
      insights: [
        'Automated 85% of routine tasks',
        'Improved response time by 65%',
        'Reduced manual work by 12 hours/week'
      ],
      recommendations: {
        nextSteps: [
          'Implement advanced workflow automation',
          'Add integration with additional tools',
          'Enable custom reporting'
        ],
        upgradePath: 'Consider upgrading to a Big Agent for full process automation'
      }
    };

    smallAgent.missionReports.push(report);
    return report;
  }

  // Private Helper Methods
  private createSmallAgent(
    template: AgentTemplate,
    configuration: Record<string, any>
  ): SmallAgent {
    return {
      id: `sa-${Date.now()}`,
      name: template.name,
      description: template.description,
      type: 'small',
      status: 'configuring',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        tasksCompleted: 0,
        successRate: 0,
        timesSaved: 0,
        businessImpact: 0,
        lastActive: new Date().toISOString()
      },
      businessProcess: configuration.businessProcess,
      setupFee: template.pricing.setupFee!,
      monthlyFee: template.pricing.monthlyFee!,
      missionReports: [],
      configuration: {
        processParameters: configuration.processParameters || {},
        integrations: configuration.integrations || [],
        schedule: configuration.schedule
      }
    };
  }

  private createBigAgent(
    template: AgentTemplate,
    configuration: Record<string, any>
  ): BigAgent {
    return {
      id: `ba-${Date.now()}`,
      name: template.name,
      description: template.description,
      type: 'big',
      status: 'configuring',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        tasksCompleted: 0,
        successRate: 0,
        timesSaved: 0,
        businessImpact: 0,
        lastActive: new Date().toISOString()
      },
      capabilities: template.features,
      basePrice: template.pricing.basePrice!,
      customizations: configuration.customizations || [],
      integrations: configuration.integrations?.map((name: string) => ({
        name,
        status: 'pending'
      })) || [],
      workflows: configuration.workflows?.map((name: string) => ({
        id: `wf-${Date.now()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        status: 'inactive'
      })) || []
    };
  }

  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default AgentService; 