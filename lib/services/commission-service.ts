import { format, subDays, subMonths, subWeeks } from 'date-fns';

export interface CommissionHistory {
  id: string;
  date: string | number;
  type: 'c1' | 'c2' | 'c3';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid';
  source: string;
  commission_percentage: number;
  volume_amount: number;
  token_id: string;
}

interface CommissionStats {
  totalEarnings: number;
  pendingAmount: number;
  totalWithdrawals: number;
  monthlyGrowth: number;
  c1: number;
  c2: number;
  c3: number;
  currency: string;
}

interface PendingCommission {
  id: string;
  amount: number;
  currency: string;
  type: string;
  source: string;
  date: string;
}

interface ChartData {
  date: string;
  c1: number;
  c2: number;
  c3: number;
  total: number;
}

// Generate random amount between min and max
const randomAmount = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock commission history
const generateMockHistory = (count: number): CommissionHistory[] => {
  const types: ('c1' | 'c2' | 'c3')[] = ['c1', 'c2', 'c3'];
  const currencies = ['VP', 'USDC', 'USDT'];
  const statuses: ('pending' | 'processing' | 'paid')[] = ['pending', 'processing', 'paid'];
  const sources = ['Direct Sale', 'Team Performance', 'Leadership Bonus'];

  return Array.from({ length: count }, (_, i) => ({
    id: `comm-${i + 1}`,
    date: randomDate(subMonths(new Date(), 3), new Date()).getTime(),
    type: types[Math.floor(Math.random() * types.length)],
    amount: randomAmount(100, 10000),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    commission_percentage: Math.random() * 0.1, // 0-10%
    volume_amount: randomAmount(1000, 100000),
    token_id: `${randomAmount(1000, 9999)}`
  }));
};

// Generate mock pending commissions
const generateMockPending = (): PendingCommission[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `pending-${i + 1}`,
    amount: randomAmount(100, 5000),
    currency: 'VP',
    type: ['C1', 'C2', 'C3'][Math.floor(Math.random() * 3)],
    source: ['Direct Sale', 'Team Performance', 'Leadership Bonus'][Math.floor(Math.random() * 3)],
    date: format(subDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd')
  }));
};

// Generate mock chart data
const generateMockChartData = (days: number): ChartData[] => {
  return Array.from({ length: days }, (_, i) => {
    const c1 = randomAmount(100, 1000);
    const c2 = randomAmount(50, 500);
    const c3 = randomAmount(200, 2000);
    return {
      date: format(subDays(new Date(), days - i - 1), 'MMM dd'),
      c1,
      c2,
      c3,
      total: c1 + c2 + c3
    };
  });
};

class CommissionService {
  private static instance: CommissionService;
  private mockHistory: CommissionHistory[];
  private mockStats: CommissionStats;
  private mockPending: PendingCommission[];
  private mockChartData: ChartData[];

  private constructor() {
    this.mockHistory = generateMockHistory(50);
    this.mockPending = generateMockPending();
    this.mockChartData = generateMockChartData(30);

    // Calculate total earnings for each commission type
    const totals = this.mockHistory.reduce(
      (acc, curr) => {
        acc[curr.type] += curr.amount;
        return acc;
      },
      { c1: 0, c2: 0, c3: 0 }
    );

    this.mockStats = {
      totalEarnings: totals.c1 + totals.c2 + totals.c3,
      pendingAmount: this.mockHistory
        .filter(c => c.status === 'pending')
        .reduce((sum, curr) => sum + curr.amount, 0),
      totalWithdrawals: this.mockHistory
        .filter(c => c.status === 'paid')
        .reduce((sum, curr) => sum + curr.amount, 0),
      monthlyGrowth: 15.7, // Mock growth percentage
      c1: totals.c1,
      c2: totals.c2,
      c3: totals.c3,
      currency: 'VP'
    };
  }

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  async getCommissionHistory(
    timeRange: string,
    type?: string,
    status?: string,
    page: number = 1,
    pageSize: number = 10,
    currency?: string
  ): Promise<{ commissions: CommissionHistory[]; total: number; totalPages: number }> {
    await this.simulateDelay();

    let filtered = [...this.mockHistory];

    // Apply time range filter
    const now = new Date();
    const getStartDate = () => {
      switch (timeRange) {
        case 'this-week':
          return subWeeks(now, 1);
        case 'this-month':
          return subMonths(now, 1);
        case 'this-quarter':
          return subMonths(now, 3);
        case 'last-week':
          return subWeeks(now, 2);
        case 'last-month':
          return subMonths(now, 2);
        case 'last-quarter':
          return subMonths(now, 6);
        default:
          return new Date(0); // all-time
      }
    };

    const startDate = getStartDate();
    filtered = filtered.filter(comm => new Date(comm.date) >= startDate);

    // Apply type filter
    if (type) {
      filtered = filtered.filter(comm => comm.type === type.toLowerCase());
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(comm => comm.status === status.toLowerCase());
    }

    // Apply currency filter
    if (currency) {
      filtered = filtered.filter(comm => comm.currency === currency);
    }

    // Sort by date descending
    filtered.sort((a, b) => Number(b.date) - Number(a.date));

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCommissions = filtered.slice(start, end);

    return {
      commissions: paginatedCommissions,
      total,
      totalPages
    };
  }

  async getCommissionStats(timeRange: string): Promise<CommissionStats> {
    await this.simulateDelay();
    return this.mockStats;
  }

  async getPendingCommissions(): Promise<PendingCommission[]> {
    await this.simulateDelay();
    return this.mockPending;
  }

  async getChartData(timeRange: string): Promise<ChartData[]> {
    await this.simulateDelay();
    return this.mockChartData;
  }

  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  }
}

export default CommissionService; 