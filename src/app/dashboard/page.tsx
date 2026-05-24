"use client";

import React, { useState, useEffect } from "react";
import { Search, FolderGit2, Loader2, Lock, Globe, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: { login: string };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <div className="w-full min-h-screen font-sans selection:bg-indigo-500/30">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  <img src="/github.png" alt="GitHub" className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">No repositories found matching &quot;{searchQuery}&quot;</p>
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
                          <img src="/github.png" alt="GitHub" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
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

            {/* Footer */}
            {!isFetchingRepos && (
              <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-950/50 flex justify-between items-center text-[11px] font-mono text-zinc-500">
                <span>Workspace Connected</span>
                <span>Showing {filteredRepos.length} of {repositories.length} total repositories</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
