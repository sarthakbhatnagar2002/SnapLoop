"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IKUpload } from "imagekitio-next";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const authenticator = async () => {
    const response = await fetch("/api/auth/imagekit");
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

    router.push("/videos");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Video</span>
        </label>
        <IKUpload
          onSuccess={(res) => setVideoURL(res.filePath)}
          authenticator={authenticator}
          className="file-input file-input-bordered"
          accept="video/*"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Thumbnail</span>
        </label>
        <IKUpload
          onSuccess={(res) => setThumbnailURL(res.filePath)}
          authenticator={authenticator}
          className="file-input file-input-bordered"
          accept="image/*"
        />
      </div>

      <button
        type="submit"
        disabled={uploading || !videoURL || !thumbnailURL}
        className="btn btn-primary w-full"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  );
}