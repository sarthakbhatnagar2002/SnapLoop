"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Video, Github, Calendar, User, ExternalLink } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoURL: string;
  thumbnailURL: string;
  githubRepoUrl: string;
  demoUrl?: string;
  category: string;
  createdAt: string;
}

interface UserProfile {
  username: string;
  githubUsername?: string;
  avatar?: string;
  email?: string;
  createdAt: string;
  videoCount: number;
}

interface ProfileProps {
  username: string;
}

export default function Profile({ username }: ProfileProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const isOwnProfile = session?.user?.username === username || session?.user?.name === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${username}`);
      
      if (!response.ok) {
        throw new Error("Profile not found");
      }
      const data = await response.json();
      setProfile(data.user);
      setVideos(data.videos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Profile Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.username}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-25 h-25 rounded-full bg-gray-800 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-3">
                {profile.username}
              </h1>
              
              <div className="flex gap-4 text-sm text-gray-400 mb-3">
                {profile.githubUsername && (
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <Github className="w-4 h-4" />
                    @{profile.githubUsername}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>

              <div className="text-white">
                <span className="font-bold">{profile.videoCount}</span>
                <span className="text-gray-400 ml-1">Videos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Projects</h2>
          {isOwnProfile && (
            <Link
              href="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Link Repository
            </Link>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <h3 className="text-lg text-gray-400 mb-2">No videos yet</h3>
            <p className="text-gray-500">
              {isOwnProfile 
                ? "Upload your first video to get started!" 
                : "This user hasn't uploaded any videos yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <Link
                key={video._id}
                href={`/video/${video._id}`}
                className="bg-gray-900 rounded border border-gray-800 hover:border-gray-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] bg-gray-800">
                  <Image
                    src={video.thumbnailURL}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-800 rounded">
                      {video.category}
                    </span>
                    <span>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}