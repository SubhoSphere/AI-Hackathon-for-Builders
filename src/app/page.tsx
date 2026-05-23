"use client";

import React, { useState } from "react";
import { Search, FolderGit2, AlertCircle, Loader2, GitPullRequest, ChevronRight } from "lucide-react";
import { ReviewPanel } from "@/components/review-panel";

interface PullRequest {
  id: number;
  title: string;
  number: number;
  state: string;
  author: {
    username: string;
    avatarUrl: string;
  };
}

export default function Dashboard() {
  const [repoUrl, setRepoUrl] = useState("");
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrNumber, setSelectedPrNumber] = useState<number | null>(null);

  const fetchPullRequests = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPullRequests([]);

    try {
      const response = await fetch(`/api/github?repoUrl=${encodeURIComponent(repoUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch pull requests");
      }

      setPullRequests(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = (prNumber: number) => {
    setSelectedPrNumber(prNumber);
  };

  if (selectedPrNumber) {
    return (
      <ReviewPanel 
        repoUrl={repoUrl} 
        prNumber={selectedPrNumber} 
        onBack={() => setSelectedPrNumber(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-indigo-400">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Code Auditor</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Search Section */}
        <section className="mb-16">
          <div className="flex flex-col gap-3 max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Analyze Pull Requests Instantly
            </h2>
            <p className="text-slate-400 text-lg">
              Paste a public GitHub repository link below to pull active PRs and run deep AI security audits.
            </p>
          </div>

          <div className="relative flex items-center w-full max-w-2xl mx-auto group">
            <div className="absolute left-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPullRequests()}
              className="w-full pl-14 pr-40 py-5 bg-zinc-900 border border-white/10 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-inner text-lg"
            />
            <button
              onClick={fetchPullRequests}
              disabled={isLoading}
              className="absolute right-3 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? "Fetching" : "Fetch PRs"}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h4 className="text-red-200 font-medium">Failed to fetch repository</h4>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-xl shadow-black/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-24 h-3 rounded bg-white/10" />
                    <div className="w-16 h-3 rounded bg-white/10" />
                  </div>
                </div>
                <div className="w-full h-5 rounded bg-white/10 mt-3" />
                <div className="w-3/4 h-5 rounded bg-white/10" />
                <div className="w-full h-12 rounded-xl bg-white/5 mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Zero State / Instructions */}
        {!isLoading && !error && pullRequests.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-zinc-900/30">
            <div className="p-4 bg-white/5 rounded-full mb-6">
              <GitPullRequest className="w-12 h-12 text-slate-500 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200">No Active Pull Requests</h3>
            <p className="text-slate-500 max-w-md mt-3 text-center">
              {repoUrl
                ? "We couldn't find any open pull requests for this repository. Try another one!"
                : "Enter a public GitHub repository URL in the search bar above to fetch open PRs and start your security audit."}
            </p>
          </div>
        )}

        {/* PR Grid */}
        {!isLoading && pullRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-8">
            {pullRequests.map((pr) => (
              <div
                key={pr.id}
                className="group bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden"
              >
                {/* Subtle gradient background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      Open
                    </span>
                    <span className="text-slate-400 text-sm font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      #{pr.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-100 mb-5 line-clamp-2 leading-snug group-hover:text-indigo-200 transition-colors">
                    {pr.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-8">
                    <img
                      src={pr.author.avatarUrl}
                      alt={pr.author.username}
                      className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700/50"
                    />
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                      {pr.author.username}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAnalyze(pr.number)}
                  className="relative z-10 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 rounded-xl text-sm font-semibold transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/25"
                >
                  Analyze Code Changes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
