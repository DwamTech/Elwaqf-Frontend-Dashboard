"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArticleService } from "../services/articleService";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiMoreVertical, FiUser, FiEyeOff, FiFilter } from "react-icons/fi";
import { useToast } from "@/components/admin/ToastProvider";
import { SectionService, Section } from "../services/sectionService";

export default function ArticlesPage() {
    const toast = useToast();
    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Filters
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedAuthor, setSelectedAuthor] = useState<string>("");
    const [sections, setSections] = useState<Section[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;

    // Delete Confirmation State
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean, id: number | null, title: string }>({
        show: false,
        id: null,
        title: ''
    });

    // Fetch All on Mount (Smart Full Fetch)
    useEffect(() => {
        fetchArticles();
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const data = await SectionService.getAll();
            setSections(data);
        } catch (err) {
            console.error("Failed to fetch sections", err);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // 1. Fetch first page to assess total data size
            const res = await ArticleService.getAll(1, "", 15); // Use standard chunks

            let initialData = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
            const lastPage = res.last_page || 1;

            // Show first page immediately for better UX
            setAllArticles(initialData);
            setLoading(false);

            // 2. If more pages exist, fetch them all in parallel to build local cache
            if (lastPage > 1) {
                // Create promises for pages 2 to lastPage
                const promises = [];
                for (let i = 2; i <= lastPage; i++) {
                    promises.push(ArticleService.getAll(i, "", 15));
                }

                // Wait for all
                const results = await Promise.all(promises);

                let moreData: any[] = [];
                // Combine data
                results.forEach(r => {
                    const pageData = Array.isArray(r.data) ? r.data : (Array.isArray(r) ? r : []);
                    moreData.push(...pageData);
                });

                // Update state with remaining data + deduplicate
                setAllArticles(prev => {
                    const combined = [...prev, ...moreData];
                    return Array.from(new Map(combined.map((item: any) => [item.id, item])).values());
                });
            }

        } catch (err) {
            console.error("Failed to fetch articles", err);
            setLoading(false);
        }
    };

    // Client-Side Search & Filtering Logic
    const filteredArticles = allArticles
        .filter(article => {
            // Search filter
            const matchesSearch = article.title?.toLowerCase().includes(search.toLowerCase()) ||
                article.author_name?.toLowerCase().includes(search.toLowerCase());

            // Section filter
            const matchesSection = !selectedSection || article.section_id?.toString() === selectedSection;

            // Author filter
            const matchesAuthor = !selectedAuthor || article.author_name === selectedAuthor;

            return matchesSearch && matchesSection && matchesAuthor;
        })
        .sort((a, b) => b.id - a.id); // Sort by Newest (Highest ID)

    // Get unique authors from all articles
    const uniqueAuthors = Array.from(new Set(allArticles.map(a => a.author_name).filter(Boolean)));
    uniqueAuthors.sort();

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedSection, selectedAuthor]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const handleDelete = async (id: number, title: string) => {
        setDeleteConfirm({ show: true, id, title });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;

        try {
            await ArticleService.delete(deleteConfirm.id);
            // Refresh local data by removing the item
            setAllArticles(prev => prev.filter(a => a.id !== deleteConfirm.id));
            toast.success('تم حذف المقال بنجاح');
        } catch (err) {
            toast.error('فشل حذف المقال');
        } finally {
            setDeleteConfirm({ show: false, id: null, title: '' });
        }
    };

    const toggleStatus = async (id: number, currentStatus: string) => {
        try {
            const response = await ArticleService.toggleStatus(id);
            const newStatus = response.article?.status || (currentStatus === 'published' ? 'draft' : 'published');

            // Optimistic update
            setAllArticles(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
            toast.success(`تم ${newStatus === 'published' ? 'نشر' : 'إيقاف نشر'} المقال بنجاح`);
        } catch (err) {
            console.error(err);
            toast.error('فشل تغيير حالة المقال');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إدارة المقالات</h1>
                    <p className="text-gray-500 text-sm mt-1">عرض وإدارة جميع المقالات المنشورة والمسودات</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <FiPlus size={18} />
                        <span>أضافة مقال</span>
                    </Link>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Box - Takes 6 cols */}
                <div className="md:col-span-6 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <FiSearch className="text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="بحث عن مقال بالعنوان أو الكاتب..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 px-3 text-sm"
                    />
                </div>

                {/* Section Filter - Takes 2 cols */}
                <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full px-3 py-1.5 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    >
                        <option value="">كل الأقسام</option>
                        {sections.map(section => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Author Filter - Takes 2 cols */}
                <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="w-full px-3 py-1.5 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    >
                        <option value="">كل الكُتاب</option>
                        {uniqueAuthors.map(author => (
                            <option key={author} value={author}>
                                {author}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Total Count - Takes 2 cols */}
                <div className="md:col-span-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <span className="text-xs text-gray-500">إجمالي النتائج</span>
                    <span className="text-lg font-bold text-primary">{filteredArticles.length}</span>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">المقال</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الكاتب</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">القسم</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">تاريخ النشر</th>
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
                            ) : filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        لا توجد مقالات
                                    </td>
                                </tr>
                            ) : (
                                paginatedArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800 line-clamp-1" title={article.title}>
                                                    {article.title}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-0.5">{article.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                                    <FiUser />
                                                </div>
                                                {article.author_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs">
                                                {article.section?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${article.status === 'published'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {article.status === 'published' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                                                {article.status === 'published' ? 'منشور' : 'مسودة'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dir-ltr text-right">
                                            {article.gregorian_date || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Toggle Status Button */}
                                                <div className="relative group">
                                                    <button
                                                        onClick={() => toggleStatus(article.id, article.status)}
                                                        className={`p-1.5 rounded-md transition-all ${article.status === 'published'
                                                            ? 'text-red-600 hover:bg-red-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={article.status === 'published' ? 'إيقاف النشر' : 'نشر المقال'}
                                                    >
                                                        {article.status === 'published' ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                        {article.status === 'published' ? 'إيقاف نشر المقال' : 'نشر المقال'}
                                                    </div>
                                                </div>

                                                {/* Edit Button */}
                                                <Link
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="تعديل"
                                                >
                                                    <FiEdit2 size={16} />
                                                </Link>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(article.id, article.title)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="حذف"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        عرض الصفحة {currentPage} من {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            السابق
                        </button>
                        <div className="flex gap-1">
                            {/* Simple Logic: Just show numbers if few, or simpler logic */}
                            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                                // A very basic pager: 1,2,3,4,5 or sliding window is better but complex. 
                                // Let's keep it simple: just Prev/Next for now is safest, or dynamic.
                                // Let's try to map around current page.
                                let p = currentPage - 2 + idx;
                                if (currentPage < 3) p = 1 + idx;
                                if (p > totalPages) return null;
                                if (p < 1) return null;

                                return (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`w-8 h-8 flex items-center justify-center text-sm rounded-md border ${p === currentPage
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || loading}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-[slideDown_0.3s_ease-out]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FiTrash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">تأكيد الحذف</h3>
                                <p className="text-sm text-gray-500">هذا الإجراء لا يمكن التراجع عنه</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                هل أنت متأكد من حذف المقال:
                            </p>
                            <p className="font-semibold text-gray-900 mt-2 p-3 bg-gray-50 rounded-lg">
                                "{deleteConfirm.title}"
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, title: '' })}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiTrash2 size={18} />
                                حذف نهائياً
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
