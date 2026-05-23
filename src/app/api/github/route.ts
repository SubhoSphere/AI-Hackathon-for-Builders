import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repoUrl = searchParams.get('repoUrl');
  const prNumber = searchParams.get('prNumber');

  if (!repoUrl) {
    return NextResponse.json(
      { error: 'Missing repoUrl query parameter' },
      { status: 400 }
    );
  }

  // 1. Parse the repoUrl to extract 'owner' and 'repo'
  // Matches URLs like https://github.com/owner/repo or github.com/owner/repo
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\/|$)/);
  if (!match) {
    return NextResponse.json(
      { error: 'Invalid repoUrl format. Expected e.g. https://github.com/owner/repo' },
      { status: 400 }
    );
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, ''); // Clean up trailing .git if present

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn("GITHUB_TOKEN is not set in environment variables.");
  }

  try {
    if (!prNumber) {
      // 2. Fetch all open PRs
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`;
      
      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('GitHub API rate limit exceeded or access forbidden');
        }
        if (response.status === 404) {
          throw new Error('Repository not found. Ensure it is public or token has access.');
        }
        throw new Error(`GitHub API returned status: ${response.status}`);
      }

      const prs = await response.json();

      // Return clean JSON array containing only the requested fields
      const cleanedPRs = prs.map((pr: any) => ({
        id: pr.id,
        title: pr.title,
        number: pr.number,
        state: pr.state,
        author: {
          username: pr.user?.login,
          avatarUrl: pr.user?.avatar_url,
        }
      }));

      return NextResponse.json(cleanedPRs);

    } else {
      // 3. Fetch raw git diff text for specific PR
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
      
      // We must include the specific Accept header for diff
      const diffHeaders = {
        ...headers,
        'Accept': 'application/vnd.github.v3.diff'
      };

      const response = await fetch(apiUrl, { headers: diffHeaders });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('GitHub API rate limit exceeded or access forbidden');
        }
        if (response.status === 404) {
          throw new Error('Pull request or repository not found.');
        }
        throw new Error(`GitHub API returned status: ${response.status}`);
      }

      const diffText = await response.text();

      // Return the raw diff string nested inside a clean JSON object
      return NextResponse.json({ diff: diffText });
    }
  } catch (error: any) {
    console.error('Error fetching from GitHub API:', error);
    
    // Determine status code based on error message
    const status = error.message.includes('not found') || error.message.includes('format') ? 400 : 500;
    
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status }
    );
  }
}
