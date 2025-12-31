"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiChevronDown,
    FiChevronLeft,
    FiSettings,
    FiDatabase,
    FiX,
    FiMenu
} from "react-icons/fi";
import {
    FaBook,
    FaBuilding,
    FaHandHoldingHeart,
    FaUserShield,
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";

// Type definition for navigation items
type NavItem = {
    title: string;
    icon: React.ReactNode;
    href?: string;
    submenu?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
    {
        title: "الرئيسية",
        icon: <FiHome size={20} />,
        href: "/admin",
    },
    {
        title: "إدارة المقالات",
        icon: <MdArticle size={20} />,
        submenu: [
            { title: "عرض المقالات", href: "/admin/articles" },
            { title: "أضافة مقال", href: "/admin/articles/create" },
        ],
    },
    {
        title: "إدارة الكتب",
        icon: <FaBook size={20} />,
        submenu: [
            { title: "عرض الكتب", href: "/admin/books" },
            { title: "أضافة كتاب", href: "/admin/books/create" },
        ],
    },
    {
        title: "طلبات دعم المؤسسات",
        icon: <FaBuilding size={20} />,
        href: "/admin/support-institutions",
    },
    {
        title: "طلبات دعم الافراد",
        icon: <FaHandHoldingHeart size={20} />,
        href: "/admin/support-individuals",
    },
    {
        title: "الأدارة والمشرفين",
        icon: <FaUserShield size={20} />,
        href: "/admin/users",
    },
    {
        title: "النسخ الاحتياطي",
        icon: <FiDatabase size={20} />,
        href: "/admin/backup",
    },
    {
        title: "الاعدادات",
        icon: <FiSettings size={20} />,
        href: "/admin/settings",
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (title: string) => {
        if (openSubmenu === title) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(title);
        }
    };

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 right-0 z-50 h-[100dvh] w-64 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header / Logo */}
                <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {/* Using the logo from the homepage */}
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                            <Image
                                src="/Untitled-1-removebg-preview-350x350.png"
                                alt="Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-bold text-gray-800">لوحة التحكم</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 lg:hidden">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Scrollable Nav Area */}
                <nav className="h-[calc(100vh-80px)] overflow-y-auto px-4 py-6 admin-scrollbar">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const hasSubmenu = item.submenu && item.submenu.length > 0;
                            const isSubOpen = openSubmenu === item.title;
                            const isCurrent = item.href ? isActive(item.href) : false;

                            return (
                                <li key={item.title}>
                                    {hasSubmenu ? (
                                        // Dropdown Item
                                        <div>
                                            <button
                                                onClick={() => toggleSubmenu(item.title)}
                                                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isSubOpen
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon}
                                                    <span>{item.title}</span>
                                                </div>
                                                <FiChevronDown
                                                    className={`transition-transform ${isSubOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            {/* Submenu */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isSubOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <ul className="mr-8 space-y-1 border-r-2 border-gray-100 pr-2">
                                                    {item.submenu?.map((sub) => (
                                                        <li key={sub.href}>
                                                            <Link
                                                                href={sub.href}
                                                                className={`block rounded-md px-3 py-2 text-sm transition-colors ${isActive(sub.href)
                                                                        ? "bg-primary text-white shadow-md"
                                                                        : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                                                                    }`}
                                                            >
                                                                {sub.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        // Single Link Item
                                        <Link
                                            href={item.href || "#"}
                                            onClick={() => window.innerWidth < 1024 && onClose()} // Close on mobile click
                                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${isCurrent
                                                    ? "bg-primary text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
