"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Video, LogOut, User, Github, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-gray-300 transition-colors"
          >
            <img src="/Logo.png" alt="Logo" className="w-10 h-10" />
            <span>CodeCast</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-3 py-1.5 bg-gray-900 rounded-md border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.username || session.user.name || "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-300">
                      {session.user?.username || session.user?.name || session.user?.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1">
                      <Link
                        href={`/profile/${session.user?.username || session.user?.name}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <a
                        href={`https://github.com/${session.user?.username || session.user?.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>View GitHub</span>
                      </a>
                      <hr className="my-1 border-gray-800" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-md transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                Sign in with GitHub
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}