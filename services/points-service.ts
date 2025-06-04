export type PointsStatistics = {
  totalPoints: number;
  pointsThisMonth: number;
  pointsToNextLevel: number;
  percentToNextLevel: number;
  currentLevel: string;
  nextLevel: string;
};

export type PointsTransaction = {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
  category: string;
};

// Mock data for demonstration purposes
const mockStatistics: PointsStatistics = {
  totalPoints: 7850,
  pointsThisMonth: 430,
  pointsToNextLevel: 2150,
  percentToNextLevel: 78.5,
  currentLevel: 'Gold',
  nextLevel: 'Platinum'
};

const mockTransactions: PointsTransaction[] = [
  {
    id: '1',
    date: '2023-04-01T10:30:00Z',
    description: 'Purchase at XYZ Store',
    points: 250,
    type: 'earned',
    category: 'Purchase'
  },
  {
    id: '2',
    date: '2023-04-03T14:15:00Z',
    description: 'Referral Bonus',
    points: 500,
    type: 'earned',
    category: 'Referral'
  },
  {
    id: '3',
    date: '2023-04-10T09:45:00Z',
    description: 'Flight Ticket Redemption',
    points: 1200,
    type: 'redeemed',
    category: 'Travel'
  },
  {
    id: '4',
    date: '2023-04-15T11:20:00Z',
    description: 'Special Promotion',
    points: 300,
    type: 'earned',
    category: 'Promotion'
  },
  {
    id: '5',
    date: '2023-04-22T16:40:00Z',
    description: 'Hotel Stay',
    points: 450,
    type: 'earned',
    category: 'Travel'
  },
  {
    id: '6',
    date: '2023-04-27T13:50:00Z',
    description: 'Gift Card Redemption',
    points: 800,
    type: 'redeemed',
    category: 'Shopping'
  },
  {
    id: '7',
    date: '2023-05-02T08:30:00Z',
    description: 'Online Purchase',
    points: 180,
    type: 'earned',
    category: 'Shopping'
  },
  {
    id: '8',
    date: '2023-05-08T15:10:00Z',
    description: 'Monthly Activity Bonus',
    points: 250,
    type: 'earned',
    category: 'Bonus'
  }
];

export const pointsService = {
  getPointsStatistics: async (): Promise<PointsStatistics> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockStatistics;
  },
  
  getPointsTransactions: async (
    page = 1, 
    limit = 10, 
    filter?: { type?: 'earned' | 'redeemed', category?: string }
  ): Promise<{ transactions: PointsTransaction[], total: number }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredTransactions = [...mockTransactions];
    
    if (filter?.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === filter.type);
    }
    
    if (filter?.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === filter.category);
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      transactions: filteredTransactions.slice(start, end),
      total: filteredTransactions.length
    };
  }
};