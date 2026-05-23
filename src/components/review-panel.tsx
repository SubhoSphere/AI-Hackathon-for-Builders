import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, ShieldAlert, AlertTriangle, Lightbulb, Activity, FileCode2, TerminalSquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ReviewComment {
  file: string;
  line: number;
  category: 'SECURITY' | 'PERFORMANCE' | 'BUG' | 'CODE_SMELL';
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  title: string;
  description: string;
  fix: string;
}

interface ReviewPanelProps {
  repoUrl: string;
  prNumber: number;
  onBack: () => void;
}

export function ReviewPanel({ repoUrl, prNumber, onBack }: ReviewPanelProps) {
  const [diffText, setDiffText] = useState<string | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<Set<number>>(new Set());

  useEffect(() => {
    let isMounted = true;
    async function performAnalysis() {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Fetch diff
        const diffRes = await fetch(`/api/github?repoUrl=${encodeURIComponent(repoUrl)}&prNumber=${prNumber}`);
        const diffData = await diffRes.json();
        
        if (!diffRes.ok) throw new Error(diffData.error || "Failed to fetch PR diff");
        
        const rawDiff = diffData.diff;
        if (isMounted) setDiffText(rawDiff);

        // 2. Fetch AI Review
        const reviewRes = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diff: rawDiff })
        });
        const reviewData = await reviewRes.json();
        
        if (!reviewRes.ok) throw new Error(reviewData.error || "AI Review failed");
        
        if (isMounted) setComments(reviewData);

      } catch (err: any) {
        if (isMounted) setError(err.message || "An unexpected error occurred during analysis.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    
    performAnalysis();
    return () => { isMounted = false; };
  }, [repoUrl, prNumber]);

  const handleApplyFix = (index: number) => {
    setAppliedFixes(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Calculations
  const criticalCount = comments.filter(c => c.severity === 'CRITICAL').length;
  const warningCount = comments.filter(c => c.severity === 'WARNING').length;
  const suggestionCount = comments.filter(c => c.severity === 'SUGGESTION').length;
  // Score starts at 100, drops 15 for CRITICAL, 5 for WARNING
  const healthScore = Math.max(0, 100 - (criticalCount * 15) - (warningCount * 5));

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };
      case 'WARNING': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle };
      case 'SUGGESTION': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Lightbulb };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: AlertTriangle };
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header Analytics */}
      <header className="flex-none border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl z-20 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TerminalSquare className="w-5 h-5 text-indigo-400" />
                AI Review Arena
                <span className="text-slate-500 text-sm font-mono ml-2 border border-white/10 px-2 py-0.5 rounded-md bg-white/5">PR #{prNumber}</span>
              </h2>
            </div>
          </div>

          {!isLoading && !error && (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-5 text-sm font-medium border border-zinc-800 bg-black/20 rounded-lg px-4 py-1.5">
                <span className="flex items-center gap-1.5 text-red-400"><ShieldAlert className="w-4 h-4"/> {criticalCount}</span>
                <span className="flex items-center gap-1.5 text-amber-400"><AlertTriangle className="w-4 h-4"/> {warningCount}</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><Lightbulb className="w-4 h-4"/> {suggestionCount}</span>
              </div>
              <div className="h-6 w-px bg-zinc-800"></div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Health Score</span>
                <div className="flex items-center gap-2">
                  <Activity className={`w-5 h-5 ${healthScore > 80 ? 'text-emerald-400' : healthScore > 50 ? 'text-amber-400' : 'text-red-400'}`} />
                  <span className={`text-2xl font-bold tracking-tight ${healthScore > 80 ? 'text-emerald-400' : healthScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {healthScore}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
            <div className="flex items-center gap-5 text-indigo-400 mb-8 border border-indigo-500/20 bg-indigo-500/5 px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-500/10">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="h-8 w-px bg-indigo-500/20"></div>
              <h3 className="text-xl font-mono animate-pulse tracking-tight text-indigo-100">AI Agent Analyzing Code Topology...</h3>
            </div>
            <div className="w-96 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full bg-indigo-500 w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-zinc-950">
            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl max-w-lg text-center shadow-2xl shadow-red-500/10">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-200 mb-3">Analysis Failed</h3>
              <p className="text-red-300/80 leading-relaxed">{error}</p>
              <button onClick={onBack} className="mt-6 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm transition-colors text-white">Return to Dashboard</button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full max-w-[1800px] mx-auto divide-x divide-zinc-800/80">
            
            {/* Left Pane: Git Diff view */}
            <div className="w-1/2 h-full flex flex-col bg-[#0d1117]">
              <div className="flex-none px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2 text-sm font-medium text-slate-400 shadow-sm z-10">
                <FileCode2 className="w-4 h-4" />
                Raw Diff View
              </div>
              <div className="flex-1 overflow-auto p-5 custom-scrollbar relative">
                <pre className="text-[13px] font-mono leading-relaxed whitespace-pre-wrap break-all text-slate-300">
                  <code dangerouslySetInnerHTML={{ __html: highlightDiff(diffText || "") }}></code>
                </pre>
              </div>
            </div>

            {/* Right Pane: AI Review Feed */}
            <div className="w-1/2 h-full flex flex-col bg-zinc-950">
              <div className="flex-none px-5 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-sm font-medium text-slate-400 shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Security & Performance Feed
                </div>
                <span className="bg-zinc-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">{comments.length} Findings</span>
              </div>
              
              <div className="flex-1 overflow-auto p-6 space-y-6 custom-scrollbar bg-zinc-950/40">
                {comments.length === 0 ? (
                  <div className="text-center py-32 opacity-80 flex flex-col items-center">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Perfect Score!</h4>
                    <p className="text-slate-400 text-lg">The AI Agent found zero security flaws or bugs in this PR.</p>
                  </div>
                ) : (
                  comments.map((comment, idx) => {
                    const cfg = getSeverityConfig(comment.severity);
                    const Icon = cfg.icon;
                    const isApplied = appliedFixes.has(idx);

                    return (
                      <div key={idx} className={`bg-[#121214] border ${cfg.border} rounded-2xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-300 hover:border-indigo-500/30 group`}>
                        {/* Card Header */}
                        <div className={`px-5 py-3 ${cfg.bg} border-b ${cfg.border} flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${cfg.color}`} />
                            <span className={`text-xs font-bold tracking-widest uppercase ${cfg.color}`}>
                              {comment.severity} • {comment.category}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-400 bg-black/40 border border-white/5 px-2.5 py-1 rounded-md shadow-inner">
                            {comment.file} <span className="text-indigo-400 font-bold ml-1">:{comment.line}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-slate-100 mb-3 leading-snug group-hover:text-indigo-200 transition-colors">{comment.title}</h4>
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {comment.description}
                          </p>

                          {/* Code Block Fix */}
                          <div className="bg-[#0a0a0c] border border-zinc-800/80 rounded-xl overflow-hidden mb-6 shadow-inner">
                            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Fix</span>
                              <span className="text-indigo-400/50 font-mono text-xs">AI Generated</span>
                            </div>
                            <div className="p-4 overflow-x-auto text-sm font-mono text-emerald-300">
                              <ReactMarkdown
                                components={{
                                  pre: ({node, ...props}) => <pre className="m-0" {...props} />,
                                  code: ({node, ...props}) => <code className="bg-transparent text-emerald-300 font-mono" {...props} />
                                }}
                              >
                                {comment.fix}
                              </ReactMarkdown>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleApplyFix(idx)}
                            disabled={isApplied}
                            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                              isApplied 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                : "bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white shadow-lg"
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-5 h-5" />
                                Fix Applied Successfully
                              </>
                            ) : (
                              "Apply Fix to Codebase"
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple diff highlighter helper
function highlightDiff(diff: string) {
  return diff.split('\n').map(line => {
    if (line.startsWith('+')) return `<span class="text-emerald-400 bg-emerald-500/10 block px-4 border-l-2 border-emerald-500">${escapeHtml(line)}</span>`;
    if (line.startsWith('-')) return `<span class="text-red-400 bg-red-500/10 block px-4 border-l-2 border-red-500">${escapeHtml(line)}</span>`;
    if (line.startsWith('@@')) return `<span class="text-indigo-400 font-bold block px-4 py-2 bg-indigo-500/5 mt-4 border-y border-indigo-500/10">${escapeHtml(line)}</span>`;
    return `<span class="block px-4 text-slate-400/80">${escapeHtml(line)}</span>`;
  }).join('');
}

function escapeHtml(unsafe: string) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
