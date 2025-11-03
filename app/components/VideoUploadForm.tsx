"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IKUpload } from "imagekitio-next";
import { Github, Upload, Loader } from "lucide-react";

const CATEGORIES = ["Web Dev", "Mobile", "ML/AI", "DevOps", "Game Dev", "Other"];

export default function VideoUploadForm() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubRepoUrl: "",
    demoUrl: "",
    category: "",
  });
  
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fetchingRepo, setFetchingRepo] = useState(false);
  const [error, setError] = useState("");
  const [repoInfo, setRepoInfo] = useState<{
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    topics: string[];
  } | null>(null);

  const authenticator = async () => {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data.authenticationParams;
  };

  const handleRepoUrlChange = (url: string) => {
    setFormData({ ...formData, githubRepoUrl: url });
    setRepoInfo(null); // Reset repo info when URL changes
  };

  const fetchRepoData = async () => {
    if (!formData.githubRepoUrl) {
      setError("Please enter a GitHub URL");
      return;
    }

    setFetchingRepo(true);
    setError("");

    try {
      const response = await fetch("/api/github/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: formData.githubRepoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repository data");
      }

      const data = await response.json();
      setRepoInfo({
        name: data.name,
        description: data.description,
        stars: data.stargazers_count,
        language: data.language,
        topics: data.topics,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repo data");
      setRepoInfo(null);
    } finally {
      setFetchingRepo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoURL || !thumbnailURL) {
      setError("Upload both video and thumbnail");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    setUploading(true);
    setError("");

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videoURL,
          thumbnailURL,
          userId: session?.user?.id,
          controls: true,
          // Include repo metadata if available
          ...(repoInfo && {
            repoName: repoInfo.name,
            repoDescription: repoInfo.description,
            repoStars: repoInfo.stars,
            repoLanguage: repoInfo.language,
            repoTopics: repoInfo.topics,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create video");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* GitHub Repo URL */}
        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">
            <Github className="inline w-4 h-4 mr-1" />
            GitHub URL *
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.githubRepoUrl}
              onChange={(e) => handleRepoUrlChange(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md focus:ring-1 focus:ring-[#58a6ff]"
              required
            />
            <button
              type="button"
              onClick={fetchRepoData}
              disabled={fetchingRepo || !formData.githubRepoUrl}
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              {fetchingRepo ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  Load Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Repo Info Display */}
        {repoInfo && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
            <p className="text-sm text-[#3fb950] mb-2">✓ Repository found</p>
            <div className="space-y-1 text-sm text-[#8b949e]">
              <p><strong className="text-[#c9d1d9]">{repoInfo.name}</strong></p>
              {repoInfo.description && (
                <p className="text-xs">{repoInfo.description}</p>
              )}
              <p>⭐ {repoInfo.stars} stars • {repoInfo.language || "N/A"}</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">
            Live Demo URL (optional)
          </label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
            placeholder="https://myproject.com"
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md focus:ring-1 focus:ring-[#58a6ff]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder={repoInfo?.name || "Project name"}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md focus:ring-1 focus:ring-[#58a6ff]"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder={repoInfo?.description || "What does it do?"}
            rows={3}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md focus:ring-1 focus:ring-[#58a6ff] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md focus:ring-1 focus:ring-[#58a6ff]"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">Video *</label>
          <IKUpload
            onSuccess={(res) => setVideoURL(res.url)}
            authenticator={authenticator}
            className="w-full text-sm text-[#c9d1d9] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#238636] file:text-white"
            accept="video/*"
          />
          {videoURL && <p className="text-xs text-[#3fb950] mt-1">✓ Uploaded</p>}
        </div>

        <div>
          <label className="block text-sm text-[#c9d1d9] mb-1.5">Thumbnail *</label>
          <IKUpload
            onSuccess={(res) => setThumbnailURL(res.url)}
            authenticator={authenticator}
            className="w-full text-sm text-[#c9d1d9] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#238636] file:text-white"
            accept="image/*"
          />
          {thumbnailURL && <p className="text-xs text-[#3fb950] mt-1">✓ Uploaded</p>}
        </div>

        {error && <p className="text-sm text-[#ff7b72]">{error}</p>}

        <button
          type="submit"
          disabled={uploading || !videoURL || !thumbnailURL || !formData.category}
          className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] text-white py-2.5 rounded-md disabled:cursor-not-allowed font-medium"
        >
          {uploading ? "Creating..." : "Create Showcase"}
        </button>
      </form>
    </div>
  );
}