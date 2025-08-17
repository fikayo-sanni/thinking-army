export interface NetworkUser {
  id: string;
  nickname: string;
  level: number;
  totalReferrals: number;
  isActive: boolean;
  avatar?: string;
  rank?: string;
  children?: NetworkUser[];
}

export interface NetworkStructure {
  currentUser: NetworkUser;
  sponsor?: NetworkUser;
}

export interface NetworkStats {
  activeMembers: number;
  totalDirectDownlines: number;
  totalActiveDownlines: number;
  totalDownlines: number;
}

class NetworkService {
  private static instance: NetworkService;
  
  private mockNetworkStructure: NetworkStructure = {
    currentUser: {
      id: '1',
      nickname: 'John Smith',
      level: 1,
      totalReferrals: 12,
      isActive: true,
      rank: 'Gold',
      children: [
        {
          id: '101',
          nickname: 'Alice Smith',
          level: 2,
          totalReferrals: 8,
          isActive: true,
          rank: 'Gold',
          children: [
            {
              id: '201',
              nickname: 'Bob Johnson',
              level: 3,
              totalReferrals: 3,
              isActive: true,
              rank: 'Silver',
              children: []
            },
            {
              id: '202',
              nickname: 'Carol White',
              level: 3,
              totalReferrals: 2,
              isActive: true,
              rank: 'Bronze',
              children: []
            }
          ]
        },
        {
          id: '102',
          nickname: 'David Brown',
          level: 2,
          totalReferrals: 5,
          isActive: true,
          rank: 'Silver',
          children: [
            {
              id: '203',
              nickname: 'Eve Wilson',
              level: 3,
              totalReferrals: 1,
              isActive: false,
              rank: 'Bronze',
              children: []
            }
          ]
        },
        {
          id: '103',
          nickname: 'Frank Davis',
          level: 2,
          totalReferrals: 0,
          isActive: false,
          rank: 'Bronze',
          children: []
        }
      ]
    },
    sponsor: {
      id: '0',
      nickname: 'Sarah Johnson',
      level: 0,
      totalReferrals: 25,
      isActive: true,
      rank: 'Diamond'
    }
  };

  private mockNetworkStats: NetworkStats = {
    activeMembers: 12,
    totalDirectDownlines: 15,
    totalActiveDownlines: 45,
    totalDownlines: 50
  };

  private constructor() {}

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  async getNetworkStructure(): Promise<NetworkStructure> {
    await this.simulateDelay();
    return this.mockNetworkStructure;
  }

  async getNetworkStats(timeRange: string): Promise<NetworkStats> {
    await this.simulateDelay();
    return this.mockNetworkStats;
  }

  async getDirectDownlines(userId: string, level: number): Promise<NetworkUser[]> {
    await this.simulateDelay();
    
    // Find the user in the network structure
    const findUser = (user: NetworkUser, targetId: string): NetworkUser | null => {
      if (user.id === targetId) return user;
      if (!user.children) return null;
      
      for (const child of user.children) {
        const found = findUser(child, targetId);
        if (found) return found;
      }
      
      return null;
    };

    const user = findUser(this.mockNetworkStructure.currentUser, userId);
    return user?.children || [];
  }

  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  }

  // Helper method to calculate total network size
  calculateTotalNetwork(user: NetworkUser): number {
    let total = user.totalReferrals;
    if (user.children) {
      for (const child of user.children) {
        total += this.calculateTotalNetwork(child);
      }
    }
    return total;
  }
}

export default NetworkService; 