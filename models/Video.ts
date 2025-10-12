import mongoose, { Schema, model, models } from "mongoose";


export const video_dimensions = {
    width: 1080,
    height: 1920
} as const

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoURL: string;
    thumbnailURL: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality: number;
    }
};

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoURL: { type: String, required: true },
        thumbnailURL: { type: String, required: true },
        controls: { type: Boolean, default: true },
        transformation: {
            height: { type: Number, default: video_dimensions.height },
            width: { type: Number, default: video_dimensions.width },
            quality: { type: Number, min: 1, max: 100 },
        },
    },
    {
        timestamps: true
    }
)
const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video