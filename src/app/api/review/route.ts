import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Interface matching the required output
export interface ReviewComment {
  file: string;
  line: number;
  category: 'SECURITY' | 'PERFORMANCE' | 'BUG' | 'CODE_SMELL';
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  title: string;
  description: string;
  fix: string;
}

// Initialize the Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in environment variables' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { diff } = body;

    if (!diff || typeof diff !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "diff" string in request body' },
        { status: 400 }
      );
    }

    // Initialize the model
    // Using gemini-1.5-flash to ensure high rate limits and max compatibility on the free tier
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an elite Staff Security and Software Engineer. Your task is to perform a rigorous code review on the provided Git diff.
Focus on identifying security vulnerabilities, performance bottlenecks, logical bugs, and code smells.
Analyze the changes carefully.

You MUST return your response as a valid JSON array of objects. Do NOT wrap your response in markdown formatting like \`\`\`json. Return ONLY the raw JSON array.

Each object in the array must strictly match this exact JSON schema (based on a TypeScript interface):
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "file": { "type": "string", "description": "The specific file path" },
      "line": { "type": "number", "description": "The exact line number where the issue exists in the new code" },
      "category": { "type": "string", "enum": ["SECURITY", "PERFORMANCE", "BUG", "CODE_SMELL"] },
      "severity": { "type": "string", "enum": ["CRITICAL", "WARNING", "SUGGESTION"] },
      "title": { "type": "string", "description": "Short headline of the issue" },
      "description": { "type": "string", "description": "Detailed explanation of the threat or issue" },
      "fix": { "type": "string", "description": "Markdown code block showing how to rewrite the code safely" }
    },
    "required": ["file", "line", "category", "severity", "title", "description", "fix"]
  }
}

If no issues are found, return an empty array: []`,
      generationConfig: {
        // Enforce JSON output at the API level to guarantee structure
        responseMimeType: "application/json",
      }
    });

    // Generate the review
    const result = await model.generateContent(diff);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model still includes it despite instructions
    const cleanedText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

    // Parse the JSON strictly
    let parsedReview: ReviewComment[] = [];
    try {
      parsedReview = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON:', cleanedText);
      throw new Error('AI returned an invalid JSON response format');
    }

    // Ensure it's an array
    if (!Array.isArray(parsedReview)) {
      throw new Error('AI response was not an array');
    }

    return NextResponse.json(parsedReview, { status: 200 });

  } catch (error: any) {
    console.error('Error during AI review generation:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error during review process' },
      { status: 500 }
    );
  }
}
