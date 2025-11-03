import Image from "next/image";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Play, Star, Code, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [imageError, setImageError] = useState(false);
  
  if (!video || !video._id) {
    return null;
  }

  const videoId = typeof video._id === "object" ? video._id.toString() : video._id;
  const thumbnailUrl = video.thumbnailURL;
  const title = video.title || "Untitled";
  const description = video.description || "";

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 hover:border-gray-600 transition-colors">
      {/* Video Thumbnail */}
      <Link href={`/videos/${videoId}`} className="block relative group">
        <div
          className="relative w-full overflow-hidden bg-gray-950"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Thumbnail Image */}
          {thumbnailUrl && !imageError ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
          )}
          
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-16 h-16 rounded-full bg-gray-800/90 border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-100 ml-0.5 fill-gray-100" />
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link
          href={`/videos/${videoId}`}
          className="block mb-2 group/title"
        >
          <h3 className="text-base font-semibold text-blue-400 group-hover/title:underline line-clamp-1">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {description || "No description provided"}
        </p>

        {/* Footer with stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-800 flex-wrap">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            <span>{video.repoStars || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <span>{video.repoLanguage || "N/A"}</span>
          </div>
          <div className="ml-auto text-xs">
            {video.createdAt 
              ? new Date(video.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })
              : "N/A"
            }
          </div>
        </div>
      </div>
    </div>
  );
}