import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchPullRequestDiff, postInlineReviewComments } from "@/lib/github-bot";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Background Orchestration Task
 * Non-blocking execution to prevent GitHub webhook gateway timeouts.
 */
async function runAIReviewPipeline(owner: string, repo: string, prNumber: number, installationId: number) {
  try {
    console.log(`\n[Pipeline] ⚙️ Fetching raw diff for ${owner}/${repo}#${prNumber}...`);
    let diff = await fetchPullRequestDiff(owner, repo, prNumber, installationId);

    // Enforce 8000 character limit to respect free-tier constraints and context window bounds
    if (diff.length > 8000) {
      console.log(`[Pipeline] ⚠️ Diff too large (${diff.length} chars). Truncating to 8000 to protect AI context limits.`);
      diff = diff.substring(0, 8000);
    }

    if (!diff.trim()) {
      console.log(`[Pipeline] 🟢 Diff is empty. Nothing to review.`);
      return;
    }

    console.log(`[Pipeline] 🧠 Triggering Gemini AI Evaluation Matrix...`);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are an elite Staff Security and Software Engineer. Your task is to perform a rigorous code review on the provided Git diff.
Focus on identifying security vulnerabilities, performance bottlenecks, logical bugs, and code smells.

You MUST return your response as a valid JSON array of objects. Do NOT wrap your response in markdown formatting like \`\`\`json. Return ONLY the raw JSON array.

Each object in the array must strictly match this exact JSON schema:
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "file": { "type": "string" },
      "line": { "type": "number" },
      "category": { "type": "string", "enum": ["SECURITY", "PERFORMANCE", "BUG", "CODE_SMELL"] },
      "severity": { "type": "string", "enum": ["CRITICAL", "WARNING", "SUGGESTION"] },
      "title": { "type": "string" },
      "description": { "type": "string" },
      "fix": { "type": "string" }
    },
    "required": ["file", "line", "category", "severity", "title", "description", "fix"]
  }
}

If no issues are found, return an empty array: []`,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(diff);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsedReview = JSON.parse(cleanedText);

    if (!Array.isArray(parsedReview)) {
      throw new Error('AI response was not an array structure.');
    }

    console.log(`[Pipeline] ✨ AI review completed. Found ${parsedReview.length} anomalies.`);
    
    // Step 4: Push structured markdown feedback to GitHub
    console.log(`[Pipeline] 🚀 Injecting feedback into GitHub PR...`);
    await postInlineReviewComments(owner, repo, prNumber, installationId, parsedReview);
    console.log(`[Pipeline] ✅ Complete.`);

  } catch (error: any) {
    console.error(`\n[Pipeline Error] ❌ AI Review pipeline failed for ${owner}/${repo}#${prNumber}:`, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing GITHUB_WEBHOOK_SECRET environment variable");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // 1. Signature Verification Security
    const signature = req.headers.get("x-hub-signature-256");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 401 });
    }

    // Read the incoming request body as raw text for signature computation
    const rawBody = await req.text();

    // Compute secure SHA256 HMAC hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const computedSignature = `sha256=${hmac.digest("hex")}`;

    // Convert strings to buffers for timingSafeEqual
    const signatureBuffer = Buffer.from(signature);
    const computedSignatureBuffer = Buffer.from(computedSignature);

    // Compare hashes securely to prevent timing attacks
    if (
      signatureBuffer.length !== computedSignatureBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, computedSignatureBuffer)
    ) {
      console.error("GitHub webhook signature verification failed. Intrusion attempt or invalid secret.");
      return NextResponse.json({ error: "Unauthorized: Signature mismatch" }, { status: 401 });
    }

    // 2. Event Parsing and Extraction
    const eventType = req.headers.get("x-github-event");
    const body = JSON.parse(rawBody);

    // We only care about the pull_request event type
    if (eventType !== "pull_request") {
      return NextResponse.json(
        { received: true, ignored: true, reason: `Ignored event type: ${eventType}` },
        { status: 200 }
      );
    }

    const { action, pull_request, repository, installation } = body;

    // We only want to run our core pipeline if the action is exactly 'opened' or 'synchronize'
    if (action !== "opened" && action !== "synchronize") {
      return NextResponse.json(
        { received: true, ignored: true, reason: `Ignored PR action: ${action}` },
        { status: 200 }
      );
    }

    // 3. Metadata Structuring
    const repoOwner = repository?.owner?.login;
    const repoName = repository?.name;
    const prNumber = pull_request?.number;
    const installationId = installation?.id;

    // Console log these parameters inside a clear terminal banner
    console.log("\n==================================================");
    console.log("🛡️  GITHUB WEBHOOK: AI REVIEW PIPELINE TRIGGERED 🛡️");
    console.log("==================================================");
    console.log(`Action:          ${action}`);
    console.log(`Repository:      ${repoOwner}/${repoName}`);
    console.log(`PR Number:       #${prNumber}`);
    console.log(`Installation ID: ${installationId || "None"}`);
    console.log("==================================================\n");

    // 4. Background execution of the AI pipeline
    if (repoOwner && repoName && prNumber && installationId) {
      // Initiate background promise without awaiting to return 200 OK immediately
      runAIReviewPipeline(repoOwner, repoName, prNumber, installationId);
    } else {
      console.error("Missing required metadata for AI pipeline execution.");
    }

    // 5. Response Protocol
    return NextResponse.json({ received: true, action }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error processing webhook" },
      { status: 500 }
    );
  }
}
