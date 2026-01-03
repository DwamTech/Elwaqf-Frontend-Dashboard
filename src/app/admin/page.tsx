"use client";
import React, { useEffect, useState } from "react";
import { FiUsers, FiFileText, FiActivity, FiTrendingUp, FiTrendingDown, FiBook, FiClock, FiCheckCircle, FiXCircle, FiInbox, FiRotateCw } from "react-icons/fi";
import { DashboardService } from "./services/dashboardService";
import { DashboardSummary, SupportRequest, AnalyticsDataPoint } from "./models/dashboard";
import VisitorsChart from "../../components/admin/VisitorsChart";
import SupportToggle from "@/components/admin/SupportToggle";

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
    const [analyticsData, setAnalyticsData] = useState<AnalyticsDataPoint[]>([]);
    const [supportStats, setSupportStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, requestsData, analytics, statsData] = await Promise.all([
                    DashboardService.getSummary().catch(err => {
                        console.error("Failed to fetch summary", err);
                        return null;
                    }),
                    DashboardService.getRecentRequests().catch(err => {
                        console.error("Failed to fetch recent requests", err);
                        return [];
                    }),
                    DashboardService.getAnalytics().catch(err => {
                        console.error("Failed to fetch analytics", err);
                        return [];
                    }),
                    DashboardService.getSupportStats().catch(err => {
                        console.error("Failed to fetch support stats", err);
                        return null;
                    })
                ]);

                if (summaryData) setSummary(summaryData);
                if (requestsData) setRecentRequests(requestsData);
                if (analytics) setAnalyticsData(analytics);
                if (statsData) setSupportStats(statsData);

            } catch (error) {
                console.error("Failed to fetch dashboard data (critical)", error);
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
            {/* Page Title & Support Toggle */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
                        <p className="text-gray-500 mt-1">أهلاً بك، نظرة عامة على إحصائيات المنصة.</p>
                    </div>
                    <SupportToggle />
                </div>
            </div>

            {/* Support Stats Sections */}
            {supportStats && (
                <div className="space-y-10">
                    {/* Institutional Stats */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            احصائيات نظام طلبات الدعم للمؤسسات
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="أجمالي الطلبات"
                                value={supportStats.institutional.total}
                                icon={<FiInbox />}
                                color="bg-indigo-500"
                            />
                            <StatCard
                                title="تحت المراجعة"
                                value={supportStats.institutional.under_review}
                                icon={<FiRotateCw />}
                                color="bg-yellow-500"
                            />
                            <StatCard
                                title="الطلبات المقبولة"
                                value={supportStats.institutional.accepted}
                                icon={<FiCheckCircle />}
                                color="bg-green-500"
                            />
                            <StatCard
                                title="الطلبات المرفوضه"
                                value={supportStats.institutional.rejected}
                                icon={<FiXCircle />}
                                color="bg-red-500"
                            />
                        </div>
                    </div>

                    {/* Individual Stats */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                            إحصائيات نظام طلبات الدعم للأفراد
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="أجمالي الطلبات"
                                value={supportStats.individual.total}
                                icon={<FiInbox />}
                                color="bg-indigo-500"
                            />
                            <StatCard
                                title="تحت المراجعة"
                                value={supportStats.individual.under_review}
                                icon={<FiRotateCw />}
                                color="bg-yellow-500"
                            />
                            <StatCard
                                title="الطلبات المقبولة"
                                value={supportStats.individual.accepted}
                                icon={<FiCheckCircle />}
                                color="bg-green-500"
                            />
                            <StatCard
                                title="الطلبات المرفوضه"
                                value={supportStats.individual.rejected}
                                icon={<FiXCircle />}
                                color="bg-red-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity & Charts */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm min-h-[400px]">
                    <h3 className="mb-6 text-lg font-bold text-gray-800">تحليل الزوار</h3>
                    <div className="h-[320px] w-full">
                        <VisitorsChart data={analyticsData} />
                    </div>
                </div>

                {/* Recent Requests List */}
                <div className="rounded-xl bg-white p-6 shadow-sm h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-800">أحدث الطلبات</h3>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                            {summary?.pending_support_requests ?? 0} معلق
                        </span>
                    </div>

                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {recentRequests.map((req) => (
                            <div key={req.id} className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className={`h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] rounded-full flex items-center justify-center text-white font-bold
                  ${req.status === 'pending' ? 'bg-yellow-500' : req.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}
                `}>
                                    {req.applicant_name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{req.applicant_name}</p>
                                    <p className="text-xs text-gray-500">
                                        {req.type === 'individual' ? 'فرد' : 'مؤسسة'} • منذ {new Date(req.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
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
                            <p className="text-center text-gray-400 text-sm mt-10">لا توجد طلبات حديثة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
