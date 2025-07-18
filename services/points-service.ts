import { PointsType } from "@/enums";

export type PointsStatistics = {
  totalPoints: number;
  pointsThisMonth: number;
  pointsToNextLevel: number;
  percentToNextLevel: number;
  currentLevel: string;
  nextLevel: string;
};

export interface PointTransaction {
  id: string;
  type: PointsType;
  points: number;
  expiredAt: Date | null;
  description?: string;
  transactionReference?: string;
  createdAt: Date;
  conversionRate: {
    points: number;
    currency: string;
  };
}

// Mock data for demonstration purposes
const mockStatistics: PointsStatistics = {
  totalPoints: 7850,
  pointsThisMonth: 430,
  pointsToNextLevel: 2150,
  percentToNextLevel: 78.5,
  currentLevel: "Gold",
  nextLevel: "Platinum",
};

const mockTransactions = [
  {
    id: "1",
    type: "earned",
    points: 250,
    amount: 100,
    currency: "USD",
    voucherCode: "PROMO2025",
    description: "Purchase at XYZ Store",
    referenceId: "REF-001",
    metadata: { category: "Purchase" },
    createdAt: "2023-04-01T10:30:00Z",
  },
  {
    id: "2",
    type: "earned",
    points: 500,
    amount: 0,
    currency: "USD",
    voucherCode: "",
    description: "Referral Bonus",
    referenceId: "REF-002",
    metadata: { category: "Referral" },
    createdAt: "2023-04-03T14:15:00Z",
  },
  {
    id: "3",
    type: "redeemed",
    points: 1200,
    amount: 400,
    currency: "USD",
    voucherCode: "FLIGHT2025",
    description: "Flight Ticket Redemption",
    referenceId: "REF-003",
    metadata: { category: "Travel" },
    createdAt: "2023-04-10T09:45:00Z",
  },
  {
    id: "4",
    type: "earned",
    points: 300,
    amount: 50,
    currency: "USD",
    voucherCode: "PROMOAPR",
    description: "Special Promotion",
    referenceId: "REF-004",
    metadata: { category: "Promotion" },
    createdAt: "2023-04-15T11:20:00Z",
  },
  {
    id: "5",
    type: "earned",
    points: 450,
    amount: 200,
    currency: "USD",
    voucherCode: "",
    description: "Hotel Stay",
    referenceId: "REF-005",
    metadata: { category: "Travel" },
    createdAt: "2023-04-22T16:40:00Z",
  },
  {
    id: "6",
    type: "redeemed",
    points: 800,
    amount: 80,
    currency: "USD",
    voucherCode: "GIFT800",
    description: "Gift Card Redemption",
    referenceId: "REF-006",
    metadata: { category: "Shopping" },
    createdAt: "2023-04-27T13:50:00Z",
  },
  {
    id: "7",
    type: "earned",
    points: 180,
    amount: 75,
    currency: "USD",
    voucherCode: "",
    description: "Online Purchase",
    referenceId: "REF-007",
    metadata: { category: "Shopping" },
    createdAt: "2023-05-02T08:30:00Z",
  },
  {
    id: "8",
    type: "earned",
    points: 250,
    amount: 0,
    currency: "USD",
    voucherCode: "",
    description: "Monthly Activity Bonus",
    referenceId: "REF-008",
    metadata: { category: "Bonus" },
    createdAt: "2023-05-08T15:10:00Z",
  },
];

export const pointsService = {
  getPointsStatistics: async (): Promise<PointsStatistics> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700));

    return mockStatistics;
  },

  getPointsTransactions: async (
    page = 1,
    limit = 10,
    filter?: { type?: "adding" | "spending"; category?: string }
  ): Promise<{ transactions: any[]; total: number }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredTransactions = [...mockTransactions];

    if (filter?.type) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filter.type
      );
    }

    // Sort by date (newest first)
    filteredTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      transactions: filteredTransactions.slice(start, end),
      total: filteredTransactions.length,
    };
  },
};
