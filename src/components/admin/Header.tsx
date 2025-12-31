"use client";
import React from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";
import Image from "next/image";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                    <FiMenu size={24} />
                </button>

                {/* Search Bar - Optional cosmetic */}
                <div className="hidden items-center rounded-lg bg-gray-50 px-3 py-2 md:flex">
                    <FiSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="بحث..."
                        className="bg-transparent px-2 text-sm outline-none w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <button className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100">
                    <FiBell size={20} />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">أدمن النظام</p>
                        <p className="text-xs text-gray-500">مشرف عام</p>
                    </div>
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                        {/* Placeholder Avatar */}
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <span className="text-lg font-bold">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
