import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email?: string;
    password?: string;
    username: string;
    githubId?: string;
    githubUsername?: string;
    avatar?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { 
            type: String, 
            unique: true,
            sparse: true 
        },
        username: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String 
        },
        githubId: {
            type: String,
            unique: true,
            sparse: true 
        },
        githubUsername: {
            type: String
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Only hash password if it exists and is modified
userSchema.pre('save', async function (next) {
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model<IUser>("User", userSchema)

export default User