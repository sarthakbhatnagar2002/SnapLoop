import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch videos"
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                {
                    error: "Session not found"
                },
                { status: 401 }
            )
        }

        await connectToDb()
        const body: IVideo = await request.json()

        if (
            !body.title ||
            !body.description ||
            !body.videoURL ||
            !body.thumbnailURL
        ) {
            return NextResponse.json(
                {
                    error: "Missing values"
                },
                { status: 401 }
            );
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                width: 1920,  
                height: 1080,
                quality: body.transformation?.quality ?? 100
            },
        };
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)

    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to create Video"
            },
            { status: 500 }
        );
    }
}