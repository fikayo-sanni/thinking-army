import { Agent, SmallAgent, BigAgent } from '../types/agent.types';

interface BusinessProfile {
  companyName: string;
  industry: string;
  size: string;
  website?: string;
  primaryGoal: string;
}

interface AgentRecommendation {
  type: 'small' | 'big';
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: {
    timeSaved: number; // hours per month
    efficiency: number; // percentage
  };
  pricing: {
    setupFee?: number;
    monthlyFee?: number;
    basePrice?: number;
  };
}

interface DemoResults {
  recommendations: AgentRecommendation[];
  totalImpact: {
    timeSaved: number;
    efficiency: number;
    costSavings: number;
  };
  nextSteps: string[];
}

class MetaAgentService {
  private static instance: MetaAgentService;

  private constructor() {}

  public static getInstance(): MetaAgentService {
    if (!MetaAgentService.instance) {
      MetaAgentService.instance = new MetaAgentService();
    }
    return MetaAgentService.instance;
  }

  public async generateRecommendations(
    profile: BusinessProfile,
    selectedProcesses: string[]
  ): Promise<DemoResults> {
    await this.simulateDelay();

    // Group processes by category
    const processCategories = this.categorizeProcesses(selectedProcesses);

    // Generate recommendations based on business profile and processes
    const recommendations = this.generateAgentRecommendations(
      profile,
      processCategories
    );

    // Calculate total impact
    const totalImpact = this.calculateTotalImpact(recommendations);

    // Generate next steps
    const nextSteps = this.generateNextSteps(recommendations);

    return {
      recommendations,
      totalImpact,
      nextSteps,
    };
  }

  private categorizeProcesses(processes: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      'Sales & Marketing': [],
      'Customer Service': [],
      'Operations': [],
      'Finance & Admin': [],
    };

    // Simple categorization based on keywords
    processes.forEach((process) => {
      if (
        process.toLowerCase().includes('sales') ||
        process.toLowerCase().includes('marketing') ||
        process.toLowerCase().includes('lead') ||
        process.toLowerCase().includes('content')
      ) {
        categories['Sales & Marketing'].push(process);
      } else if (
        process.toLowerCase().includes('customer') ||
        process.toLowerCase().includes('support') ||
        process.toLowerCase().includes('service')
      ) {
        categories['Customer Service'].push(process);
      } else if (
        process.toLowerCase().includes('inventory') ||
        process.toLowerCase().includes('supply') ||
        process.toLowerCase().includes('quality') ||
        process.toLowerCase().includes('process')
      ) {
        categories['Operations'].push(process);
      } else {
        categories['Finance & Admin'].push(process);
      }
    });

    return categories;
  }

  private generateAgentRecommendations(
    profile: BusinessProfile,
    processCategories: Record<string, string[]>
  ): AgentRecommendation[] {
    const recommendations: AgentRecommendation[] = [];

    // Generate Small Agent recommendations
    Object.entries(processCategories).forEach(([category, processes]) => {
      if (processes.length > 0) {
        processes.forEach((process) => {
          recommendations.push({
            type: 'small',
            name: `${process} Agent`,
            description: `Automates ${process.toLowerCase()} tasks and workflows`,
            priority: this.calculatePriority(process, profile),
            estimatedImpact: {
              timeSaved: Math.floor(Math.random() * 20) + 10, // 10-30 hours
              efficiency: Math.floor(Math.random() * 30) + 20, // 20-50%
            },
            pricing: {
              setupFee: 500,
              monthlyFee: 50,
            },
          });
        });
      }
    });

    // Generate Big Sales recommendation if applicable
    if (
      this.shouldRecommendBigSales(profile, processCategories) ||
      recommendations.length >= 3
    ) {
      recommendations.push({
        type: 'big',
        name: 'Enterprise Automation Suite',
        description: 'Complete business process automation solution',
        priority: 'high',
        estimatedImpact: {
          timeSaved: recommendations.reduce(
            (total, rec) => total + rec.estimatedImpact.timeSaved,
            0
          ) * 1.5,
          efficiency: 40,
        },
        pricing: {
          basePrice: 20000,
        },
      });
    }

    return recommendations;
  }

  private calculatePriority(
    process: string,
    profile: BusinessProfile
  ): 'high' | 'medium' | 'low' {
    // Simple priority calculation based on business goal alignment
    const goalKeywords = profile.primaryGoal.toLowerCase().split(' ');
    const processKeywords = process.toLowerCase().split(' ');

    const matchingKeywords = goalKeywords.filter((keyword) =>
      processKeywords.some((processWord) => processWord.includes(keyword))
    );

    if (matchingKeywords.length > 0) return 'high';
    if (process.toLowerCase().includes('automation')) return 'medium';
    return 'low';
  }

  private shouldRecommendBigSales(
    profile: BusinessProfile,
    processCategories: Record<string, string[]>
  ): boolean {
    const totalProcesses = Object.values(processCategories).reduce(
      (total, processes) => total + processes.length,
      0
    );

    // Recommend Big Sales if:
    // 1. Company size is medium or large
    const isLargeCompany = profile.size.includes('50+');
    // 2. Multiple processes across categories
    const hasMultipleProcesses = totalProcesses >= 3;
    // 3. Processes span multiple categories
    const categoriesWithProcesses = Object.values(processCategories).filter(
      (processes) => processes.length > 0
    ).length;
    const hasMultipleCategories = categoriesWithProcesses >= 2;

    return isLargeCompany || (hasMultipleProcesses && hasMultipleCategories);
  }

  private calculateTotalImpact(
    recommendations: AgentRecommendation[]
  ): DemoResults['totalImpact'] {
    const timeSaved = recommendations.reduce(
      (total, rec) => total + rec.estimatedImpact.timeSaved,
      0
    );

    const efficiency = Math.min(
      recommendations.reduce(
        (max, rec) => Math.max(max, rec.estimatedImpact.efficiency),
        0
      ),
      50
    );

    // Estimate cost savings based on time saved
    // Assuming average hourly cost of €50
    const costSavings = timeSaved * 50 * 12; // Annual savings

    return {
      timeSaved,
      efficiency,
      costSavings,
    };
  }

  private generateNextSteps(
    recommendations: AgentRecommendation[]
  ): string[] {
    const steps = [
      'Schedule a consultation with our AI specialists',
      'Review detailed implementation plan',
      'Set up your first AI agent',
    ];

    if (recommendations.some((rec) => rec.type === 'big')) {
      steps.push('Explore enterprise solution customization options');
    }

    return steps;
  }

  private async simulateDelay(ms: number = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MetaAgentService; 