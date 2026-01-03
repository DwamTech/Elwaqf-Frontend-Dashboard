"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiFileText, FiArrowRight } from "react-icons/fi";
import DocumentForm from "@/components/admin/DocumentForm";

export default function CreateFinancialReportPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push("/admin/governance/financial-reports");
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FiFileText className="text-primary" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">إضافة تقرير مالي جديد</h1>
                            <p className="text-sm text-gray-500 mt-1">أضف تقريراً مالياً جديداً</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/admin/governance/financial-reports')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <FiArrowRight size={18} />
                        <span>الرجوع للقائمة</span>
                    </button>
                </div>
            </div>

            {/* Document Form */}
            <DocumentForm
                mode="create"
                reportType="financial"
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}
