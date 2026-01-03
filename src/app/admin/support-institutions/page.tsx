"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SupportService, SupportRequest } from "@/app/admin/services/supportService";
import StatusBadge from "@/components/admin/StatusBadge";
import { FiSearch, FiEye, FiUser, FiPhone, FiCalendar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/admin/ToastProvider";
import SupportToggle from "@/components/admin/SupportToggle";
import { usePendingCounts } from "@/contexts/PendingCountsContext";
import DataExportPanel from "@/components/admin/DataExportPanel";

export default function InstitutionalRequestsPage() {
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
        if (counts?.institutional?.total_action_needed) {
            document.title = `(${counts.institutional.total_action_needed}) طلبات دعم المؤسسات`;
        } else {
            document.title = "طلبات دعم المؤسسات";
        }
    }, [counts]);

    useEffect(() => {
        fetchRequests();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const exportMapping = {
        id: "ID",
        request_number: "رقم الطلب",
        institution_name: "اسم المؤسسة",
        license_number: "رقم الترخيص",
        email: "البريد الإلكتروني",
        phone_number: "رقم الهاتف",
        ceo_name: "اسم المدير التنفيذي",
        ceo_mobile: "جوال المدير التنفيذي",
        whatsapp_number: "رقم الواتساب",
        city: "المدينة",
        activity_type: "نوع النشاط",
        activity_type_other: "نوع نشاط آخر",
        project_name: "اسم المشروع",
        project_type: "نوع المشروع",
        project_type_other: "نوع مشروع آخر",
        project_manager_name: "اسم مدير المشروع",
        project_manager_mobile: "جوال مدير المشروع",
        goal_1: "الهدف الأول",
        goal_2: "الهدف الثاني",
        goal_3: "الهدف الثالث",
        goal_4: "الهدف الرابع",
        other_goals: "أهداف أخرى",
        beneficiaries: "المستفيدين",
        beneficiaries_other: "مستفيدين آخرين",
        project_cost: "تكلفة المشروع",
        project_outputs: "مخرجات المشروع",
        support_scope: "نطاق الدعم",
        amount_requested: "المبلغ المطلوب",
        account_name: "اسم الحساب البنكي",
        bank_name: "اسم البنك",
        bank_account_iban: "IBAN",
        status: "حالة الطلب",
        rejection_reason: "سبب الرفض",
        admin_response_message: "رد الإدارة",
        created_at: "تاريخ التقديم",
        updated_at: "تاريخ التحديث"
    };

    const fetchExportData = async (start: string, end: string) => {
        const res = await SupportService.institutional.getAllForExport(start, end);
        return res.data || res; // Adjust based on actual API response
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await SupportService.institutional.getAll(currentPage, statusFilter, search);
            setRequests(data.data || []);
            setTotalPages(data.meta?.last_page || 1);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">طلبات دعم المؤسسات</h1>
                    <p className="text-gray-500 mt-1">إدارة ومتابعة طلبات الدعم المقدمة من المؤسسات والجمعيات</p>
                </div>
                <SupportToggle />
            </div>

            {/* Export Section */}
            <DataExportPanel
                onFetchData={fetchExportData}
                fieldMapping={exportMapping}
                title="تقرير طلبات دعم المؤسسات"
                fileName="Institutional_Support_Report"
            />

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search */}
                <div className="md:col-span-7 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <FiSearch className="text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="بحث برقم الطلب، اسم المؤسسة، أو رقم الهاتف..."
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

            {/* Requests List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">اسم المؤسسة</th>
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
                                                <span className="text-sm text-gray-900">{request.institution_name}</span>
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
                                                    href={`/admin/support-institutions/${request.id}`}
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

                {/* Pagination */}
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
