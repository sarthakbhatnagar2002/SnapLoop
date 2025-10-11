import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const {username,email,password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error:"Email and Password are required"},
                {status: 400}
            )
        }

        await connectToDb()

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return NextResponse.json(
                {error: "Email already in use"},
                {status : 400}
            );
        }
        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return NextResponse.json(
                {error: "Username already in use"},
                {status : 400}
            );
        }

        await User.create({ 
            email,
            username,
            password
        })

        return NextResponse.json(
            {message: "User registered successfully"},
            {status:200}
        );

    } catch (error) {
        console.error("Registeration error" , error)
        return NextResponse.json(
            {error: "Failed to register User"},
            {status : 400}
        )
    }
}