import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  console.log("=== ImageKit Auth Route Called ===");
  
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    console.log("Private Key exists:", !!privateKey);
    console.log("Public Key exists:", !!publicKey);
    console.log("Public Key value:", publicKey);

    if (!privateKey || !publicKey) {
      console.error("Missing ImageKit credentials");
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 }
      );
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 2400;
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    const response = {
      authenticationParams: {
        token,
        expire,
        signature,
      },
      publicKey,
    };

    console.log("Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}