"use client";

import React, { useState, useEffect } from "react";
import { Search, FolderGit2, AlertCircle, Loader2, GitPullRequest, ChevronRight, FolderGit2Icon, Lock, Unlock, LogOut, CheckCircle2, Globe, ArrowRight } from "lucide-react";
import { ReviewPanel } from "@/components/review-panel";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";



interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: { login: string };
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");



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
      }
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const filteredRepos = repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <Link
              href="/login"
              className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 text-zinc-950 font-bold rounded-2xl transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 text-lg"
            >
              <FolderGit2Icon className="w-6 h-6" />
              Authenticate via GitHub Secure OAuth
            </Link>
          </div>
        )}

        {/* Status indicator for initial loading chunk */}
        {status === "loading" && (
          <div className="flex justify-center items-center mt-32">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}

        {/* State 2: Logged In & High-Density Repository Workspace */}
        {status === "authenticated" && (
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto bg-zinc-900/40 rounded-xl border border-zinc-800 backdrop-blur-md overflow-hidden shadow-2xl">
              
              {/* High-Density Control Header Section */}
              <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Select Target Repository</h2>
                  <p className="text-sm text-zinc-400 mt-1">Choose a workspace to analyze pull requests.</p>
                </div>
                
                <div className="relative max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg leading-5 bg-zinc-950/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable Grid Row Viewport */}
              <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isFetchingRepos ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                    <p className="text-sm font-medium animate-pulse">Syncing GitHub Workspaces...</p>
                  </div>
                ) : filteredRepos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                    <FolderGit2 className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">No repositories found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/50">
                    {filteredRepos.map((repo) => (
                      <div 
                        key={repo.id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/40 transition-colors group"
                      >
                        <div className="flex items-center min-w-0 gap-4 flex-1 mr-6">
                          <div className="p-2 bg-zinc-800/50 rounded-md border border-zinc-700/50 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                              {repo.owner.login} / <span className="font-bold">{repo.name}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              {repo.private ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-400/10 rounded border border-amber-400/20">
                                  <Lock className="w-3 h-3" /> Private
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-800 rounded border border-zinc-700">
                                  <Globe className="w-3 h-3" /> Public
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            const url = `https://github.com/${repo.full_name}`;
                            router.push(`/pull-requests?repoUrl=${encodeURIComponent(url)}`);
                          }}
                          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 font-medium text-sm rounded-lg transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          Scan PRs
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Defensive Edge Case Feedback / Footer */}
              {!isFetchingRepos && (
                <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-950/50 flex justify-between items-center text-[11px] font-mono text-zinc-500">
                  <span>Workspace Connected</span>
                  <span>Showing {filteredRepos.length} of {repositories.length} total repositories</span>
                </div>
              )}
            </div>
          </section>
        )}


      </main>
    </div>
  );
}

/**
 * Ensures strict client-side context distribution for NextAuth
 */
export default function Dashboard() {
  return <DashboardContent />;
}
