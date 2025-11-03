// GitHub API helper to fetch repo metadata
export interface GitHubRepoData {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}

export async function fetchGitHubRepoData(
  repoUrl: string
): Promise<GitHubRepoData | null> {
  try {
    // Extract owner and repo from URL
    // Supports: https://github.com/owner/repo or https://github.com/owner/repo.git
    const match = repoUrl.match(
      /github\.com\/([^\s/]+)\/([^\s/.]+)(?:\.git)?$/i
    );

    if (!match) {
      console.error("Invalid GitHub URL format");
      return null;
    }

    const [, owner, repo] = match;

    // Fetch from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: process.env.GITHUB_TOKEN
          ? {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }
          : undefined,
      }
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.statusText}`);
      return null;
    }

    const data: any = await response.json();

    return {
      name: data.name,
      description: data.description,
      stargazers_count: data.stargazers_count,
      language: data.language,
      topics: data.topics || [],
    };
  } catch (error) {
    console.error("Error fetching GitHub repo data:", error);
    return null;
  }
}