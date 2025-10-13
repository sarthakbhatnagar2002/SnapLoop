import Link from "next/link";
import {Video, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#30363d] bg-[#0d1117] mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Branding */}
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#58a6ff]" />
            <span className="text-[#c9d1d9] font-semibold">GitTube</span>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-[#8b949e] hover:text-[#58a6ff] transition">
              Home
            </Link>
            <Link href="/upload" className="text-[#8b949e] hover:text-[#58a6ff] transition">
              Upload
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8b949e] hover:text-[#58a6ff] transition"
            >
              GitHub
            </a>
          </div>

          {/* Right - Copyright */}
          <div className="text-sm text-[#8b949e]">
            © 2025 GitTube
          </div>
        </div>
      </div>
    </footer>
  );
}