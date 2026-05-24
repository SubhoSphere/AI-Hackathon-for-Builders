import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#0a0a09] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Revio" className="w-7 h-7 rounded-md" />
              <span className="text-lg font-bold tracking-tight text-white">Revio</span>
            </Link>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-[220px]">
              Autonomous AI-powered code reviews for modern engineering teams.
            </p>
            <div className="flex items-center gap-2 text-emerald-500/90 text-[12px] font-medium mt-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              All Systems Operational
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Product</span>
            <a href="#features" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Features</a>
            <a href="#agents" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">AI Agents</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Integrations</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Pricing</a>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Resources</span>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Documentation</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">API Reference</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Changelog</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">GitHub</a>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Legal</span>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Privacy Policy</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Terms of Service</a>
            <a href="#" className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors w-fit">Security</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-600">
          <span>&copy; {new Date().getFullYear()} Revio. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>[⚡ Gemini 2.5 Infrastructure]</span>
            <span>[🔒 E2E Encrypted]</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
