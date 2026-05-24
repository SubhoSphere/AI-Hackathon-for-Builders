import { App } from "@octokit/app";

/**
 * Helper to initialize the GitHub App client matrix.
 */
function getGitHubApp(): App {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error("CRITICAL: Missing GITHUB_APP_ID or GITHUB_PRIVATE_KEY environment variables.");
  }

  // Handle newlines correctly in case private key is passed via standard .env string (e.g., matching Vercel's multi-line env logic)
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  return new App({
    appId: appId,
    privateKey: formattedPrivateKey,
  });
}

/**
 * 1. Fetches the raw text diff of a pull request using the authenticated installation client.
 */
export async function fetchPullRequestDiff(
  owner: string,
  repo: string,
  prNumber: number,
  installationId: number
): Promise<string> {
  try {
    const app = getGitHubApp();
    const octokit = await app.getInstallationOctokit(installationId);

    // Execute raw request against the PR endpoint with custom Media Type header to stream the diff
    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner,
      repo,
      pull_number: prNumber,
      headers: {
        accept: "application/vnd.github.v3.diff",
      },
    });

    // The data payload is heavily typed as an object natively, but the diff header forces it to return raw string text
    return response.data as unknown as string;
  } catch (error: any) {
    console.error(`Failed to fetch PR diff for ${owner}/${repo}#${prNumber}:`, error.message);
    throw new Error(`GitHub App Authorization/Fetch Error (Diff Payload): ${error.message}`);
  }
}

/**
 * 2. Posts an array of structured AI comments directly to the GitHub Pull Request as an automated review.
 */
export async function postInlineReviewComments(
  owner: string,
  repo: string,
  prNumber: number,
  installationId: number,
  comments: any[]
): Promise<void> {
  try {
    if (!comments || comments.length === 0) {
      console.log(`No findings to post for ${owner}/${repo}#${prNumber}.`);
      return;
    }

    const app = getGitHubApp();
    const octokit = await app.getInstallationOctokit(installationId);

    // Map the incoming AI metadata array into the official GitHub Multi-line Review Comments endpoint schema
    const githubComments = comments.map((c) => ({
      path: c.file,
      line: Number(c.line),
      side: "RIGHT" as const,
      body: `### 🚨 [AI AUDIT: ${c.category}] ${c.title}\n\n**Severity:** \`${c.severity}\`\n\n**Issue Details:**\n${c.description}\n\n**Recommended Automated Patch:**\n\`\`\`\n${c.fix}\n\`\`\``,
    }));

    // Check if there are any CRITICAL level findings to determine the final review disposition
    const hasCritical = comments.some(c => c.severity === "CRITICAL");
    const eventStatus = hasCritical ? "REQUEST_CHANGES" : "COMMENT";

    // Execute the POST request to inject the inline reviews into the PR
    await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      owner,
      repo,
      pull_number: prNumber,
      event: eventStatus,
      comments: githubComments,
    });

    console.log(`✅ Automated Review injected successfully: ${githubComments.length} comments posted to ${owner}/${repo}#${prNumber} [Status: ${eventStatus}]`);
  } catch (error: any) {
    console.error(`Failed to push inline review payload to ${owner}/${repo}#${prNumber}:`, error.message);
    throw new Error(`GitHub App Authorization/Post Error (Review Injection): ${error.message}`);
  }
}
