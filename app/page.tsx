// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { Upload, Video, Sparkles } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section with Upload CTA */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Share Your Videos
                  </h1>
                </div>
                <p className="text-gray-300 text-lg mb-2">
                  Upload, share, and discover amazing content powered by AI
                </p>
                <p className="text-gray-400 text-sm">
                  {videos.length} videos in our collection
                </p>
              </div>
              
              <Link 
                href="/upload" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-3"
              >
                <Upload className="w-6 h-6 group-hover:animate-bounce" />
                <span>Upload Video</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Explore Videos</h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-gray-400 text-lg">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
              <Video className="w-16 h-16 text-gray-600" />
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-2">No videos yet</p>
                <p className="text-gray-500 text-sm">Be the first to upload!</p>
              </div>
            </div>
          ) : (
            <VideoFeed videos={videos} />
          )}
        </div>
      </div>
    </div>
  );
}