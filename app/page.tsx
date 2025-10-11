// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { Upload } from "lucide-react";

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Videos</h1>
            <p className="text-gray-400">{videos.length} videos available</p>
          </div>
          <Link 
            href="/upload" 
            className="btn btn-primary gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <VideoFeed videos={videos} />
        )}
      </div>
    </div>
  );
}