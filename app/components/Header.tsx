"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Video, LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-all duration-300 group"
          >
            <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-all duration-300 group-hover:scale-110">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Video AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    {session.user?.email || session.user?.name || "User"}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login Button */}
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/register"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}