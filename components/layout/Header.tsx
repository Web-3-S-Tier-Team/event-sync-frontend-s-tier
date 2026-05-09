"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">EventSync</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Accueil
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="bg-red-500 rounded-full h-2 w-2 animate-pulse"></div>
              <span>Live détecté automatiquement</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}