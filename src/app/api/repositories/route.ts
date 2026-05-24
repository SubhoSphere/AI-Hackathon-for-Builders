import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // 1. Identify the current logged-in developer session securely via NextAuth
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized access: No valid session found." }, { status: 401 });
    }

    // 2. Extract the custom OAuth token we intercepted during login
    const accessToken = session.accessToken;

    // 3. Initiate Server-to-Server request to the official GitHub API endpoint
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        // 4. Inject the developer's unique access token into the Authorization header
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.error("GitHub API routing error:", await response.text());
      return NextResponse.json(
        { error: `GitHub API error fetching repositories: ${response.status}` },
        { status: response.status }
      );
    }

    const repos = await response.json();

    // 5. Structure & Optimize: Map and extract only essential properties to reduce payload size
    const optimizedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      owner: {
        login: repo.owner?.login,
      },
    }));

    // 6. Return a pristine 200 JSON payload response
    return NextResponse.json(optimizedRepos, { status: 200 });

  } catch (error: any) {
    console.error("Critical error in /api/repositories route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
