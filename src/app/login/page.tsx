"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FolderGit2, FolderGitIcon, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    // Add callbackUrl so NextAuth knows where to return after a successful login
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6 shadow-inner">
            <FolderGit2 className="w-10 h-10 text-indigo-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 mb-8 text-sm max-w-[280px]">
            Sign in to securely connect your repositories and start auditing your code.
          </p>

          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-100 text-zinc-950 font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FolderGitIcon className="w-5 h-5" />
            )}
            <span>{isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
