"use client";
import React, { useState } from "react";
// Import global styles for admin to ensure Tailwind works
import "./admin.css";
// We don't import the root layout's css to avoid conflict
import { Cairo } from "next/font/google";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <html lang="ar" dir="rtl">
            <body className={`${cairo.className} bg-gray-50`}>
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    {/* Main Content Info */}
                    <div className="flex flex-1 flex-col transition-all duration-300">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />

                        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
