"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { Github, Code2, Sparkles } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#c9d1d9] mb-6 leading-tight">
            Bring your GitHub projects
            <br />
            <span className="text-[#58a6ff]">to life with video</span>
          </h1>
          
          <p className="text-xl text-[#8b949e] mb-8 max-w-2xl mx-auto">
            Share video demonstrations of your code, help others understand your work,
            and discover amazing projects from developers worldwide.
          </p>

          <div className="flex items-center justify-center gap-4">
            {session ? (
              <Link 
                href="/upload" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-md transition-colors"
              >
                <Code2 className="w-5 h-5" />
                Showcase a project
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-md transition-colors"
                >
                  <Github className="w-5 h-5" />
                  Sign in with GitHub
                </Link>
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] font-semibold rounded-md transition-colors"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <p className="text-sm text-[#8b949e] mt-6">
            {videos.length} project {videos.length === 1 ? 'showcase' : 'showcases'} · Join the community
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#21262d] mb-12"></div>

        {/* Videos Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#c9d1d9]">
              Discover New Projects
            </h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24">
              <div className="w-8 h-8 border-2 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin mb-4"></div>
              <p className="text-[#8b949e]">Loading projects...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-24 bg-[#161b22] border border-[#30363d] rounded-lg">
              <Github className="w-12 h-12 text-[#6e7681] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">No projects yet</h3>
              <p className="text-[#8b949e] mb-6">Be the first to showcase your work</p>
              {session && (
                <Link 
                  href="/upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  Get started
                </Link>
              )}
            </div>
          ) : (
            <VideoFeed videos={videos} />
          )}
        </div>
      </div>
    </div>
  );
}