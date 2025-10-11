"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IKUpload } from "imagekitio-next";
import { Upload, CheckCircle, Film, Image } from "lucide-react";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const router = useRouter();

  const authenticator = async () => {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data.authenticationParams;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        videoURL,
        thumbnailURL,
        controls: true,
      }),
    });

    router.push("/");
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video"
            rows={4}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Film className="inline w-4 h-4 mr-2" />
            Video File
          </label>
          <div className="relative">
            <IKUpload
              onSuccess={(res) => {
                setVideoURL(res.filePath);
                setUploadingVideo(false);
              }}
              onUploadStart={() => setUploadingVideo(true)}
              authenticator={authenticator}
              className="file-input file-input-bordered w-full bg-gray-700 border-gray-600 text-white"
              accept="video/*"
            />
            {uploadingVideo && (
              <div className="absolute right-3 top-3">
                <span className="loading loading-spinner loading-sm text-blue-500"></span>
              </div>
            )}
            {videoURL && !uploadingVideo && (
              <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Video uploaded
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Image className="inline w-4 h-4 mr-2" />
            Thumbnail
          </label>
          <div className="relative">
            <IKUpload
              onSuccess={(res) => {
                setThumbnailURL(res.filePath);
                setUploadingThumbnail(false);
              }}
              onUploadStart={() => setUploadingThumbnail(true)}
              authenticator={authenticator}
              className="file-input file-input-bordered w-full bg-gray-700 border-gray-600 text-white"
              accept="image/*"
            />
            {uploadingThumbnail && (
              <div className="absolute right-3 top-3">
                <span className="loading loading-spinner loading-sm text-blue-500"></span>
              </div>
            )}
            {thumbnailURL && !uploadingThumbnail && (
              <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Thumbnail uploaded
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !videoURL || !thumbnailURL || uploadingVideo || uploadingThumbnail}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}