import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Play, Star, GitFork, Code } from "lucide-react";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 hover:border-gray-600 transition-colors">
      {/* Video Thumbnail */}
      <Link href={`/videos/${video._id}`} className="block relative group">
        <div
          className="relative w-full overflow-hidden bg-gray-950"
          style={{ aspectRatio: "16/9" }}
        >
          <IKVideo
            path={video.videoURL}
            transformation={[
              {
                width: "1920",
                height: "1080",
              },
            ]}
            controls={false}
            className="w-full h-full object-cover"
          />
          
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
          href={`/videos/${video._id}`}
          className="block mb-2 group/title"
        >
          <h3 className="text-base font-semibold text-blue-400 group-hover/title:underline line-clamp-1">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {video.description}
        </p>

        {/* Footer with stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-800">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            <span>0</span>
            {/* will add github stars to repo */}
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <span>JavaScript</span> 
            {/* will be adding github username  */}
          </div>
          <div className="ml-auto text-xs">
            2 days ago
            {/* will add when the repo was created */}
          </div>
        </div>
      </div>
    </div>
  );
}