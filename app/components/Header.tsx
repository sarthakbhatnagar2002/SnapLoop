"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Video, LogOut, User, Github } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-gray-300 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span>GitTube</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                {/* User Info with Avatar */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-900 rounded-md border border-gray-800 hover:border-gray-700 transition-colors">
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
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800 rounded-md transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
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