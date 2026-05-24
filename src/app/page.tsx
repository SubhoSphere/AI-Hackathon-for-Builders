"use client";

import React, { useState, useEffect } from "react";
import { Search, FolderGit2, AlertCircle, Loader2, GitPullRequest, ChevronRight, FolderGit2Icon, Lock, Unlock, LogOut, CheckCircle2 } from "lucide-react";
import { ReviewPanel } from "@/components/review-panel";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

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

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: { login: string };
}

function DashboardContent() {
  const { data: session, status } = useSession();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState("");

  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [isFetchingPRs, setIsFetchingPRs] = useState(false);
  const [prError, setPrError] = useState<string | null>(null);

  const [selectedPrNumber, setSelectedPrNumber] = useState<number | null>(null);

  // Automatically fetch user repositories upon successful OAuth login
  useEffect(() => {
    if (status === "authenticated") {
      fetchRepositories();
    }
  }, [status]);

  const fetchRepositories = async () => {
    setIsFetchingRepos(true);
    try {
      const response = await fetch('/api/repositories');
      if (response.ok) {
        const data = await response.json();
        setRepositories(data);
        if (data.length > 0) {
          // Pre-select the top recently updated repository automatically
          setSelectedRepoUrl(`https://github.com/${data[0].full_name}`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const fetchPullRequests = async () => {
    if (!selectedRepoUrl.trim()) {
      setPrError("Please select a valid GitHub repository.");
      return;
    }

    setIsFetchingPRs(true);
    setPrError(null);
    setPullRequests([]);

    try {
      const response = await fetch(`/api/github?repoUrl=${encodeURIComponent(selectedRepoUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch pull requests");
      }

      setPullRequests(data);
    } catch (err: any) {
      setPrError(err.message || "An unexpected error occurred");
    } finally {
      setIsFetchingPRs(false);
    }
  };

  // State 4: Review Arena Panel Injection
  if (selectedPrNumber && selectedRepoUrl) {
    return (
      <ReviewPanel
        repoUrl={selectedRepoUrl}
        prNumber={selectedPrNumber}
        onBack={() => setSelectedPrNumber(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Universal Header */}
      <header className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-indigo-400">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-inner">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Code Auditor</h1>
        </div>

        {status === "authenticated" && session?.user && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full shadow-inner">
              <img src={session.user.image || ""} alt="Avatar" className="w-7 h-7 rounded-full border border-white/20" />
              <span className="text-sm font-medium text-slate-200">{session.user.name}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* State 1: Logged Out Landing Experience */}
        {status === "unauthenticated" && (
          <div className="flex flex-col items-center text-center mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-5 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 mb-8 inline-block shadow-2xl shadow-indigo-500/20">
              <FolderGit2 className="w-16 h-16 text-indigo-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Secure Code Reviews.<br />Powered by AI.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Automate your pull request audits instantly. Connect your GitHub account to scan for vulnerabilities, performance bottlenecks, and code smells before merging.
            </p>
            <button
              onClick={() => signIn('github')}
              className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 text-zinc-950 font-bold rounded-2xl transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 text-lg"
            >
              <FolderGit2Icon className="w-6 h-6" />
              Authenticate via GitHub Secure OAuth
            </button>
          </div>
        )}

        {/* Status indicator for initial loading chunk */}
        {status === "loading" && (
          <div className="flex justify-center items-center mt-32">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}

        {/* State 2: Logged In & Repository Selector Workflow */}
        {status === "authenticated" && (
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-3 max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Select a Repository
              </h2>
              <p className="text-slate-400 text-lg">
                Choose a repository below to analyze its open pull requests.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-2 shadow-2xl shadow-black/50">
              {isFetchingRepos ? (
                <div className="p-8 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-slate-400 font-medium animate-pulse">Syncing your GitHub repositories...</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-3 p-2">
                  <div className="relative w-full flex-1">
                    <select
                      value={selectedRepoUrl}
                      onChange={(e) => setSelectedRepoUrl(e.target.value)}
                      className="w-full appearance-none bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-slate-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-inner"
                    >
                      {repositories.length === 0 && <option value="">No repositories found...</option>}
                      {repositories.map(repo => (
                        <option key={repo.id} value={`https://github.com/${repo.full_name}`}>
                          {repo.owner.login} / {repo.name}
                        </option>
                      ))}
                    </select>
                    {/* Visual adornment for select */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <Search className="w-5 h-5" />
                    </div>
                  </div>

                  <button
                    onClick={fetchPullRequests}
                    disabled={isFetchingPRs || !selectedRepoUrl}
                    className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                  >
                    {isFetchingPRs ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitPullRequest className="w-5 h-5" />}
                    Scan Pull Requests
                  </button>
                </div>
              )}
            </div>

            {/* Selected Repo Access Level Banner */}
            {!isFetchingRepos && repositories.length > 0 && selectedRepoUrl && (
              <div className="max-w-2xl mx-auto mt-6 flex justify-center">
                {(() => {
                  const activeRepo = repositories.find(r => `https://github.com/${r.full_name}` === selectedRepoUrl);
                  if (!activeRepo) return null;
                  return (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-400">
                      {activeRepo.private ? (
                        <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md font-medium"><Lock className="w-3.5 h-3.5" /> Private Repo</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md font-medium"><Unlock className="w-3.5 h-3.5" /> Public Repo</span>
                      )}
                      <span className="mx-2 w-1 h-1 rounded-full bg-slate-600" />
                      <span>{activeRepo.full_name}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </section>
        )}

        {/* PR Error State Alert */}
        {prError && status === "authenticated" && (
          <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h4 className="text-red-200 font-medium">Failed to fetch pull requests</h4>
              <p className="text-red-300/80 text-sm">{prError}</p>
            </div>
          </div>
        )}

        {/* State 3: High-Fidelity Loading Skeletons for PRs */}
        {isFetchingPRs && status === "authenticated" && (
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

        {/* Zero PRs State / Clean Codebase */}
        {!isFetchingPRs && !prError && pullRequests.length === 0 && selectedRepoUrl && status === "authenticated" && (
          <div className="text-center py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-zinc-900/30">
            <div className="p-4 bg-white/5 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/70 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200">No Active Pull Requests</h3>
            <p className="text-slate-500 max-w-md mt-3 text-center">
              We couldn't find any open pull requests for this repository. The codebase is completely clean!
            </p>
          </div>
        )}

        {/* PR Grid Feed */}
        {!isFetchingPRs && pullRequests.length > 0 && status === "authenticated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-8">
            {pullRequests.map((pr) => (
              <div
                key={pr.id}
                className="group bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden"
              >
                {/* Micro-animation gradient sweep */}
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
                  onClick={() => setSelectedPrNumber(pr.number)}
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

/**
 * Ensures strict client-side context distribution for NextAuth
 */
export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}
