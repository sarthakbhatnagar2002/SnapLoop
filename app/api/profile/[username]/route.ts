import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import Video from "@/models/Video";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectToDb();

    const { username } = await params;

    const user = await User.findOne({
      $or: [
        { username: username },
        { githubUsername: username }
      ]
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user's videos
    const videos = await Video.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      user: {
        username: user.username,
        githubUsername: user.githubUsername,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
        videoCount: videos.length
      },
      videos
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}