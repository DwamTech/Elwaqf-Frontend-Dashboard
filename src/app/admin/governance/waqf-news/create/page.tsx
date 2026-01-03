"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArticleService } from "@/app/admin/services/articleService";
import { SectionService } from "@/app/admin/services/sectionService";
import { FiSave, FiImage, FiType, FiUser, FiCalendar, FiTag, FiLayers, FiFileText, FiPlus } from "react-icons/fi";
import { useToast } from "@/components/admin/ToastProvider";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function CreateRegulationPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form States (matching CreateArticlePage exactly)
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [status, setStatus] = useState<"draft" | "published">("published");
    const [sectionId, setSectionId] = useState<number | "">(""); // Match Articles structure
    const [excerpt, setExcerpt] = useState("");
    const [gregorianDate, setGregorianDate] = useState("");
    const [keywords, setKeywords] = useState(""); // Added to match Articles
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSlugTouched, setIsSlugTouched] = useState(false);

    // Author Logic
    const [authors, setAuthors] = useState<string[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<string[]>([]);
    const [showAuthorsDropdown, setShowAuthorsDropdown] = useState(false);

    useEffect(() => {
        initializePage();
    }, []);

    const initializePage = async () => {
        try {
            await fetchAuthors();

            // Setup Section: "أخبار الوقف" - Auto-find or create
            const sections = await SectionService.getAll();
            let targetSection = sections.find((s: any) => s.name === "أخبار الوقف");

            if (!targetSection) {
                try {
                    targetSection = await SectionService.create("أخبار الوقف", "قسم خاص بأخبار الوقف والسياسات");
                } catch (e) {
                    console.error("Failed to create section", e);
                    toast.error("فشل إنشاء قسم أخبار الوقف تلقائياً");
                }
            }

            if (targetSection) {
                setSectionId(targetSection.id);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const fetchAuthors = async () => {
        try {
            const data = await ArticleService.getAuthors();
            setAuthors(data);
            setFilteredAuthors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuthorName(value);
        setShowAuthorsDropdown(true);

        const filtered = authors.filter(author =>
            author.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredAuthors(filtered);
    };

    const handleAuthorSelect = (author: string) => {
        setAuthorName(author);
        setShowAuthorsDropdown(false);
    };

    // Slug Helper (matching Articles exactly)
    const slugify = (text: string) => {
        return text
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}\-_]+/gu, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);

        const currentSlugified = slugify(val);
        if (!isSlugTouched) {
            setSlug(currentSlugified);
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFeaturedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Smart Publish Logic (matching Articles exactly)
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const isFutureDate = (date: string) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate > today;
    };

    // Auto-set today's date when status changes to "published" if no date or future date
    useEffect(() => {
        if (status === 'published') {
            if (!gregorianDate || isFutureDate(gregorianDate)) {
                setGregorianDate(getTodayDate());
            }
        }
    }, [status, gregorianDate]);

    // Auto-convert to draft if future date is selected with published status
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setGregorianDate(newDate);

        if (status === 'published' && isFutureDate(newDate)) {
            setStatus('draft');
            toast.warning('تم تحويل الخبر إلى مسودة تلقائياً لأن تاريخ النشر مستقبلي');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validation (matching Articles)
        const missingFields = [];
        if (!title) missingFields.push("عنوان الخبر");
        if (!slug) missingFields.push("الرابط الدائم");
        if (!content) missingFields.push("محتوى الخبر");
        if (!authorName) missingFields.push("اسم الكاتب");
        if (!sectionId) missingFields.push("القسم");

        if (missingFields.length > 0) {
            setError(`يرجى ملء الحقول الإلزامية المفقودة: ${missingFields.join("، ")}`);
            setLoading(false);
            window.scrollTo(0, 0);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("slug", slug);
            formData.append("content", content);
            formData.append("author_name", authorName);
            formData.append("status", status);

            if (sectionId) formData.append("section_id", String(sectionId));
            if (featuredImage) formData.append("featured_image", featuredImage);
            if (excerpt) formData.append("excerpt", excerpt);
            if (gregorianDate) formData.append("gregorian_date", gregorianDate);
            if (keywords) formData.append("keywords", keywords);

            await ArticleService.create(formData);

            setSuccess("تم إنشاء الخبر بنجاح!");

            setTimeout(() => {
                router.push("/admin/governance/waqf-news");
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "حدث خطأ أثناء إنشاء الخبر");
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">إضافة خبر جديدة</h1>
                    <p className="text-gray-500 text-sm mt-1">قم بملء البيانات التالية لإنشاء خبر جديدة في قسم "أخبار الوقف"</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 font-medium shadow-sm"
                >
                    <FiSave />
                    {loading ? "جاري الحفظ..." : "حفظ الخبر"}
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <strong>خطأ:</strong> {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <strong>نجح:</strong> {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-3 mb-4">
                            <FiType className="text-primary" size={20} />
                            <h2 className="text-lg">المعلومات الأساسية</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                عنوان الخبر <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="مثال: خبر تنظيم العمل الداخلي"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الرابط الدائم (Slug) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => { setSlug(e.target.value); setIsSlugTouched(true); }}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 font-mono text-sm"
                                placeholder="regulation-slug"
                                dir="ltr"
                            />
                            <p className="text-xs text-gray-500 mt-1">يتم إنشاؤه تلقائياً من العنوان، يمكنك تعديله</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ملخص قصير
                            </label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                placeholder="وصف مختصر عن الخبر..."
                            />
                        </div>
                    </div>

                    {/* Rich Content Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-3 mb-4">
                            <FiFileText className="text-primary" size={20} />
                            <h2 className="text-lg">محتوى الخبر <span className="text-red-500">*</span></h2>
                        </div>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-3 mb-4">
                            <FiLayers className="text-primary" size={20} />
                            <h2 className="text-lg">حالة النشر</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">الحالة</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    <option value="published">منشور</option>
                                    <option value="draft">مسودة</option>
                                </select>
                            </div>

                            {/* Section readonly display */}
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">القسم:</span>
                                    <span className="text-sm font-bold text-blue-700">أخبار الوقف</span>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">محدد تلقائياً</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-3 mb-4">
                            <FiTag className="text-primary" size={20} />
                            <h2 className="text-lg">البيانات الوصفية</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Author with Autocomplete */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم الكاتب <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={authorName}
                                        onChange={handleAuthorChange}
                                        onFocus={() => setShowAuthorsDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowAuthorsDropdown(false), 200)}
                                        className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="ابحث أو اكتب اسم جديد"
                                    />
                                </div>
                                {showAuthorsDropdown && filteredAuthors.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                        {filteredAuthors.map((author, index) => (
                                            <li
                                                key={index}
                                                onMouseDown={() => handleAuthorSelect(author)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                                            >
                                                {author}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تاريخ النشر (ميلادي)
                                </label>
                                <div className="relative">
                                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        value={gregorianDate}
                                        onChange={handleDateChange}
                                        className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">يتم تعيين اليوم تلقائياً عند النشر</p>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الكلمات المفتاحية
                                </label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="فصل بفواصل: قانون، تنظيم، سياسة"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-3 mb-4">
                            <FiImage className="text-primary" size={20} />
                            <h2 className="text-lg">الصورة البارزة</h2>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary/50 transition-colors relative cursor-pointer group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-48">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <span className="text-white text-sm font-medium">انقر لتغيير الصورة</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">انقر لرفع صورة</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG أقل من 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

