import { connectToDb } from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    const { id } = params;

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Fetch creator info
    const creator = await User.findById(video.userId).select(
      "username avatar githubUsername email"
    );

    // Increment view count
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({
      video: video.toObject(),
      creator,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDb();

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}