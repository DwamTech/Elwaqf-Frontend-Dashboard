"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SupportService, SupportRequest, RequestStatus } from "@/app/admin/services/supportService";
import StatusBadge from "@/components/admin/StatusBadge";
import { FiSearch, FiEye, FiUser, FiPhone, FiCalendar, FiFilter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/admin/ToastProvider";
import SupportToggle from "@/components/admin/SupportToggle";
import { usePendingCounts } from "@/contexts/PendingCountsContext";

export default function IndividualRequestsPage() {
    const toast = useToast();
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Pending Counts for Tab Title
    const { counts } = usePendingCounts();

    useEffect(() => {
        if (counts?.individual?.total_action_needed) {
            document.title = `(${counts.individual.total_action_needed}) طلبات دعم الأفراد`;
        } else {
            document.title = "طلبات دعم الأفراد";
        }
    }, [counts]);

    useEffect(() => {
        fetchRequests();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await SupportService.individual.getAll(currentPage, statusFilter, search);
            setRequests(res.data || []);
            setTotalPages(res.last_page || 1);
        } catch (err) {
            console.error(err);
            toast.error("فشل تحميل الطلبات");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = () => {
        fetchRequests();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">طلبات دعم الأفراد</h1>
                    <p className="text-gray-500 text-sm mt-1">إدارة ومتابعة طلبات الدعم المقدمة من الأفراد</p>
                </div>
                <SupportToggle />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search */}
                <div className="md:col-span-7 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <FiSearch className="text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="بحث برقم الطلب، الاسم، أو رقم الهاتف..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 px-3 text-sm"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                        بحث
                    </button>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    >
                        <option value="">كل الحالات</option>
                        <option value="pending">تحت المراجعة</option>
                        <option value="waiting_for_documents">بانتظار المرفقات</option>
                        <option value="documents_review">مراجعة المرفقات</option>
                        <option value="completed">مكتمل</option>
                        <option value="rejected">مرفوض</option>
                        <option value="archived">مؤرشف</option>
                    </select>
                </div>

                {/* Total Count */}
                <div className="md:col-span-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <span className="text-xs text-gray-500">النتائج</span>
                    <span className="text-lg font-bold text-primary">{requests.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الاسم</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الهاتف</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">تاريخ التقديم</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            جاري التحميل...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            لا توجد طلبات
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-900 font-medium">
                                                    {request.request_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="text-gray-400" size={14} />
                                                    <span className="text-sm text-gray-900">{request.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FiPhone className="text-gray-400" size={14} />
                                                    <span className="text-sm text-gray-600 font-mono">{request.phone_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="text-gray-400" size={14} />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(request.created_at).toLocaleDateString('ar-EG')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`tel:${request.phone_number}`}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                        title="اتصال"
                                                    >
                                                        <FiPhone size={16} />
                                                    </a>
                                                    <a
                                                        href={`https://wa.me/${request.phone_number.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                        title="واتساب"
                                                    >
                                                        <FaWhatsapp size={16} />
                                                    </a>
                                                    <Link
                                                        href={`/admin/support-individuals/${request.id}`}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    >
                                                        <FiEye size={16} />
                                                        عرض التفاصيل
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-3 md:hidden">
                    {loading ? (
                        <div className="px-3 py-6 text-center text-gray-500">جاري التحميل...</div>
                    ) : requests.length === 0 ? (
                        <div className="px-3 py-6 text-center text-gray-500">لا توجد طلبات</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {requests.map((request) => (
                                <div key={request.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-mono text-gray-900 font-medium">{request.request_number}</span>
                                        <StatusBadge status={request.status} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="text-gray-400" size={14} />
                                            <span className="text-sm text-gray-900">{request.full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-gray-400" size={14} />
                                            <span className="text-sm text-gray-600 font-mono">{request.phone_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-gray-400" size={14} />
                                            <span className="text-sm text-gray-600">
                                                {new Date(request.created_at).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <a
                                            href={`tel:${request.phone_number}`}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="اتصال"
                                        >
                                            <FiPhone size={16} />
                                        </a>
                                        <a
                                            href={`https://wa.me/${request.phone_number.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="واتساب"
                                        >
                                            <FaWhatsapp size={16} />
                                        </a>
                                        <Link
                                            href={`/admin/support-individuals/${request.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        >
                                            <FiEye size={16} />
                                            عرض التفاصيل
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        عرض الصفحة {currentPage} من {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            السابق
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${currentPage === pageNum
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
