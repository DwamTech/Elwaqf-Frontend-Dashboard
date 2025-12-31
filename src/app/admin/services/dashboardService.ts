import { DashboardSummary, AnalyticsDataPoint, SupportRequest, ApiResponse } from "../models/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Mock Data
const MOCK_SUMMARY: DashboardSummary = {
    total_articles: 1245,
    total_users: 854,
    daily_visits: 3422,
    pending_support_requests: 12,
    total_books: 320,
    trends: {
        articles: "+2.5%",
        users: "+1.2%",
        visits: "-0.5%",
    },
};

const MOCK_ANALYTICS: AnalyticsDataPoint[] = [
    { date: "2025-12-24", visits: 120, requests: 5 },
    { date: "2025-12-25", visits: 150, requests: 8 },
    { date: "2025-12-26", visits: 110, requests: 2 },
    { date: "2025-12-27", visits: 130, requests: 6 },
    { date: "2025-12-28", visits: 180, requests: 12 },
    { date: "2025-12-29", visits: 170, requests: 9 },
    { date: "2025-12-30", visits: 190, requests: 15 },
];

const MOCK_REQUESTS: SupportRequest[] = [
    {
        id: 105,
        type: "individual",
        applicant_name: "أحمد محمد",
        status: "pending",
        created_at: "2025-12-30T10:30:00Z",
    },
    {
        id: 104,
        type: "institution",
        applicant_name: "جمعية الأمل",
        status: "approved",
        created_at: "2025-12-29T15:20:00Z",
    },
    {
        id: 103,
        type: "individual",
        applicant_name: "سارة علي",
        status: "rejected",
        created_at: "2025-12-28T09:15:00Z",
    },
];

export const DashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_SUMMARY), 500);
        });
        // Real implementation:
        // const res = await fetch(`${API_BASE_URL}/admin/dashboard/summary`);
        // const json = await res.json();
        // return json.data;
    },

    getAnalytics: async (period = "7d"): Promise<AnalyticsDataPoint[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_ANALYTICS), 600);
        });
    },

    getRecentRequests: async (): Promise<SupportRequest[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_REQUESTS), 700);
        });
    },
};
