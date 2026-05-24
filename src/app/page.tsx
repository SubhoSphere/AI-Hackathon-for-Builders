"use client";

import React from "react";
import { GitPullRequest, ArrowRight, ShieldCheck, Zap, Code2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { status } = useSession();

  return (
    <div className="w-full min-h-screen font-sans selection:bg-indigo-500/30">

      {/* Hero Section — Full Width, h-screen */}
      <div className="relative flex flex-col items-center justify-center text-center h-screen w-full overflow-hidden">

        {/* Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Subtle radial ambient glow */}
        <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] pointer-events-none opacity-30">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EDCE77]/20 via-amber-400/10 to-transparent blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

          {/* Announcement Pill */}
          <a href="#features" className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-colors mb-10 backdrop-blur-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EDCE77] text-[#1a1a18] px-2 py-0.5 rounded">New</span>
            <span className="text-[13px] text-zinc-400">Autonomous AI reviews on every push</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Massive Title */}
          <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mb-6">
            A code review tool that<br />works like a{' '}
            <span className="inline-block bg-[#EDCE77]/15 text-[#EDCE77] px-4 py-1 rounded-xl border border-[#EDCE77]/20">
              Staff Engineer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-[17px] max-w-xl mx-auto leading-relaxed mb-10">
            Connect your GitHub repositories and get instant AI-powered security audits, performance analysis, and clean code patches on every pull request.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href={status === "authenticated" ? "/dashboard" : "/login"}
              className="bg-white hover:bg-zinc-100 text-[#111110] font-semibold px-7 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center gap-2 text-[15px] shadow-lg shadow-white/5"
            >
              {status === "authenticated" ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-300 font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center gap-2 text-[15px]"
            >
              <GitPullRequest className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Bottom fade-out gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111110] to-transparent pointer-events-none z-20" />
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 w-full max-w-5xl mx-auto min-h-screen flex flex-col justify-center py-24 px-6">
        <div className="text-center mb-16">
          <span className="text-[12px] font-semibold uppercase tracking-widest text-[#EDCE77] mb-3 block">How It Works</span>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Powered by Specialized AI Agents</h3>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">Three autonomous engines working in parallel to deliver enterprise-grade code intelligence on every pull request.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

          {/* Card 1 — SecOps */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 group hover:border-white/[0.12] transition-all duration-300 text-left">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-[16px] font-semibold text-white mb-2">SecOps Specialist</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Auditing line changes for OWASP vulnerabilities, credential exposures, and code injection hazards.
              </p>
            </div>
          </div>

          {/* Card 2 — Performance */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 group hover:border-white/[0.12] transition-all duration-300 text-left">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-[16px] font-semibold text-white mb-2">Performance Architect</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Detecting runtime anomalies, memory bottlenecks, and optimizing processing complexity algorithms.
              </p>
            </div>
          </div>

          {/* Card 3 — CleanCode */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 group hover:border-white/[0.12] transition-all duration-300 text-left">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-[16px] font-semibold text-white mb-2">CleanCode Linter</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Inspecting architectural compliance rules and supplying production-ready code patches instantly.
              </p>
            </div>
          </div>

        </div>

        {/* System Stat Bar */}
        <div className="w-full flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-16 pt-8 border-t border-white/[0.04] text-[11px] font-mono tracking-widest text-zinc-600">
          <span>[🔒 END-TO-END CRYO AUTH]</span>
          <span>[⚡ GEMINI 2.5 INFRASTRUCTURE]</span>
          <span>[📁 PRIVATE REPO VISIBILITY]</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 w-full max-w-5xl mx-auto min-h-screen flex flex-col justify-center py-24 px-6 border-t border-white/[0.04]">
        <div className="text-center mb-24">
          <span className="text-[12px] font-semibold uppercase tracking-widest text-[#EDCE77] mb-3 block">Workflow</span>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Seamless Integration</h3>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">From PR creation to code deployment, Revio works completely autonomously.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/[0.08]" />

          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#111110] border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-xl shadow-black/40">
              <span className="text-3xl font-light text-zinc-500">01</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Connect Repo</h4>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
              Authenticate with GitHub and select the specific repositories you want Revio to monitor.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#111110] border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-xl shadow-black/40">
              <span className="text-3xl font-light text-zinc-500">02</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Open a PR</h4>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
              Your developers open pull requests just like they normally do. No extra steps or webhooks required.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#111110] border border-[#EDCE77]/30 flex items-center justify-center mb-8 relative z-10 shadow-[0_0_30px_rgba(237,206,119,0.15)]">
              <span className="text-3xl font-bold text-[#EDCE77]">03</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Instant Review</h4>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
              Our agents automatically audit the code and inject intelligent feedback directly into GitHub.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
