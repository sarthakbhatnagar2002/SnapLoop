import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Film, Sparkles } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      {videos.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">AI Powered</span>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div 
            key={video._id?.toString()} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <VideoComponent video={video} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50">
              <Film className="w-16 h-16 text-gray-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No videos yet</h3>
          <p className="text-gray-500 text-center max-w-sm">
            Start building your collection by uploading your first video
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}