import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Code2 } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="space-y-6">
      {/* Video Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoComponent key={video._id?.toString()} video={video} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-[#161b22] border border-[#30363d] rounded-lg">
          <Code2 className="w-12 h-12 text-[#6e7681] mb-4" />
          <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">No projects yet</h3>
          <p className="text-[#8b949e] text-sm text-center max-w-sm">
            Be the first to showcase your work
          </p>
        </div>
      )}
    </div>
  );
}