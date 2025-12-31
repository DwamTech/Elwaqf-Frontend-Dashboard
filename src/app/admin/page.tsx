"use client";
import React, { useEffect, useState } from "react";
import { FiUsers, FiFileText, FiActivity, FiTrendingUp, FiTrendingDown, FiBook, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { DashboardService } from "./services/dashboardService";
import { DashboardSummary, SupportRequest } from "./models/dashboard";

const StatCard = ({ title, value, icon, color, trend }: any) => {
    const isPositive = trend && trend.includes("+");
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg p-3 ${color} bg-opacity-10`}>
                    {React.cloneElement(icon, { className: `text-2xl ${color.replace('bg-', 'text-')}` })}
                </div>
                {trend && (
                    <span className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {trend} {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

export default function AdminDashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [recentRequests, setRecentRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, requestsData] = await Promise.all([
                    DashboardService.getSummary(),
                    DashboardService.getRecentRequests(),
                ]);
                setSummary(summaryData);
                setRecentRequests(requestsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
                <p className="text-gray-500 mt-1">أهلاً بك، نظرة عامة على إحصائيات المنصة.</p>
            </div>

            {/* Stats Grid */}
            {summary && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="إجمالي المقالات"
                        value={summary.total_articles}
                        icon={<FiFileText />}
                        color="bg-blue-500"
                        trend={summary.trends.articles}
                    />
                    <StatCard
                        title="المستخدمين"
                        value={summary.total_users}
                        icon={<FiUsers />}
                        color="bg-purple-500"
                        trend={summary.trends.users}
                    />
                    <StatCard
                        title="الزيارات اليومية"
                        value={summary.daily_visits}
                        icon={<FiActivity />}
                        color="bg-orange-500"
                        trend={summary.trends.visits}
                    />
                    <StatCard
                        title="الكتب"
                        value={summary.total_books}
                        icon={<FiBook />}
                        color="bg-green-500"
                    />
                </div>
            )}

            {/* Recent Activity & Charts */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Chart Area (Placeholder for now) */}
                <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm min-h-[400px]">
                    <h3 className="mb-6 text-lg font-bold text-gray-800">تحليل الزوار</h3>
                    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50 flex-col gap-2">
                        <FiActivity size={48} className="text-gray-300" />
                        <span className="text-gray-400">سيتم إضافة الرسم البياني هنا</span>
                    </div>
                </div>

                {/* Recent Requests List */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">أحدث الطلبات</h3>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                            {summary?.pending_support_requests} معلق
                        </span>
                    </div>

                    <div className="space-y-4">
                        {recentRequests.map((req) => (
                            <div key={req.id} className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                  ${req.status === 'pending' ? 'bg-yellow-500' : req.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}
                `}>
                                    {req.applicant_name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">{req.applicant_name}</p>
                                    <p className="text-xs text-gray-500">
                                        {req.type === 'individual' ? 'فرد' : 'مؤسسة'} •منذ {new Date(req.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div>
                                    {req.status === 'pending' && <FiClock className="text-yellow-500" />}
                                    {req.status === 'approved' && <FiCheckCircle className="text-green-500" />}
                                    {req.status === 'rejected' && <FiXCircle className="text-red-500" />}
                                </div>
                            </div>
                        ))}
                        {recentRequests.length === 0 && (
                            <p className="text-center text-gray-400 text-sm">لا توجد طلبات حديثة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
