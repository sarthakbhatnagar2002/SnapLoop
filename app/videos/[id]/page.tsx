"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IKVideo } from "imagekitio-next";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Star,
  Code2,
  Eye,
  Heart,
  Calendar,
  ExternalLink,
  User,
  MessageCircle,
} from "lucide-react";
import { IVideo } from "@/models/Video";
import { IUser } from "@/models/User";

interface VideoDetailResponse {
  video: IVideo & { views?: number; likes?: number };
  creator: IUser;
}

export default function VideoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const [data, setData] = useState<VideoDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchVideoDetails();
  }, [params.id]);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${params.id}`);

      if (!response.ok) {
        throw new Error("Video not found");
      }

      const videoData = await response.json();
      setData(videoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session) {
      alert("Please sign in to like videos");
      return;
    }

    try {
      const response = await fetch(`/api/videos/${params.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setLiked(!liked);
        // Refetch to update count
        fetchVideoDetails();
      }
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8b949e]">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#c9d1d9] mb-2">
            Video Not Found
          </h2>
          <p className="text-[#8b949e] mb-6">{error}</p>
          <Link href="/" className="text-[#58a6ff] hover:text-[#79c0ff]">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { video, creator } = data;
  const createdDate = new Date(video.createdAt || "");

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="text-[#58a6ff] hover:text-[#79c0ff] text-sm mb-6 inline-flex items-center gap-1"
        >
          ← Back
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                <IKVideo
                  path={video.videoURL}
                  controls
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Video Title & Stats */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#c9d1d9]">
                {video.title}
              </h1>

              {/* Stats Row */}
              <div className="flex items-center gap-6 text-sm text-[#8b949e] pb-4 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{video.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{video.likes || 0} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{createdDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  liked
                    ? "bg-[#da3633] text-white"
                    : "bg-[#238636] hover:bg-[#2ea043] text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </button>
            </div>

            {/* Description */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-3">
                Description
              </h2>
              <p className="text-[#8b949e] whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {/* Repo Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-4 flex items-center gap-2">
                <Github className="w-5 h-5" />
                Repository
              </h2>

              <div className="space-y-4">
                {/* Repo Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <a
                      href={video.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#58a6ff] hover:text-[#79c0ff] font-mono text-sm flex items-center gap-1"
                    >
                      {video.githubRepoUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Repo Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#21262d]">
                  {video.repoStars !== undefined && (
                    <div>
                      <div className="flex items-center gap-1 text-[#8b949e] text-sm mb-1">
                        <Star className="w-4 h-4" />
                        Stars
                      </div>
                      <p className="text-[#c9d1d9] font-semibold">
                        {video.repoStars}
                      </p>
                    </div>
                  )}

                  {video.repoLanguage && (
                    <div>
                      <div className="flex items-center gap-1 text-[#8b949e] text-sm mb-1">
                        <Code2 className="w-4 h-4" />
                        Language
                      </div>
                      <p className="text-[#c9d1d9] font-semibold">
                        {video.repoLanguage}
                      </p>
                    </div>
                  )}

                  {video.category && (
                    <div>
                      <div className="text-[#8b949e] text-sm mb-1">Category</div>
                      <p className="text-[#c9d1d9] font-semibold">
                        {video.category}
                      </p>
                    </div>
                  )}
                </div>

                {video.repoDescription && (
                  <div className="pt-4 border-t border-[#21262d]">
                    <p className="text-[#8b949e] text-sm">{video.repoDescription}</p>
                  </div>
                )}

                {video.repoTopics && video.repoTopics.length > 0 && (
                  <div className="pt-4 border-t border-[#21262d]">
                    <div className="text-[#8b949e] text-sm mb-2">Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {video.repoTopics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {video.demoUrl && (
                  <a
                    href={video.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm rounded-md transition-colors"
                  >
                    Visit Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Creator Info */}
          <div className="space-y-6">
            {/* Creator Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-4">
                Creator
              </h2>

              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                {creator.avatar ? (
                  <Image
                    src={creator.avatar}
                    alt={creator.username}
                    width={80}
                    height={80}
                    className="rounded-full mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-[#6e7681]" />
                  </div>
                )}

                {/* Username */}
                <Link
                  href={`/profile/${creator.username}`}
                  className="text-[#c9d1d9] hover:text-[#58a6ff] font-semibold text-lg"
                >
                  {creator.username}
                </Link>

                {/* GitHub Link */}
                {creator.githubUsername && (
                  <a
                    href={`https://github.com/${creator.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:text-[#79c0ff] text-sm mt-2 flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    @{creator.githubUsername}
                  </a>
                )}

                {/* Follow Button */}
                {session?.user?.id !== creator._id && (
                  <button className="mt-4 w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors text-sm">
                    Follow
                  </button>
                )}

                {/* Edit Button (own profile) */}
                {session?.user?.id === creator._id && (
                  <Link
                    href={`/profile/${creator.username}/edit`}
                    className="mt-4 w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors text-sm text-center"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[#8b949e] mb-3">
                QUICK STATS
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Category</span>
                  <span className="text-[#c9d1d9] font-medium">
                    {video.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Uploaded</span>
                  <span className="text-[#c9d1d9] font-medium">
                    {createdDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}