"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Upload, LogOut, LogIn } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-white hover:text-blue-400 transition"
          >
            Video AI
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/upload"
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-sm btn-ghost"
                  >
                    {session.user?.email?.split("@")[0]}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-gray-800 rounded-lg shadow-xl w-52 p-2 mt-2"
                  >
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="text-red-400 hover:bg-gray-700 gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="btn btn-sm btn-primary gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}