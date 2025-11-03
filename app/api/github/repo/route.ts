import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepoData } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const repoData = await fetchGitHubRepoData(repoUrl);

    if (!repoData) {
      return NextResponse.json(
        { error: "Failed to fetch repository data. Check the URL and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(repoData);
  } catch (error) {
    console.error("Error in GitHub repo endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository data" },
      { status: 500 }
    );
  }
}