"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle, ArrowLeft, Github } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#111110] flex flex-col h-screen w-full overflow-hidden">
      
      {/* Grid texture bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: '48px 48px'
      }} />

      {/* Ambient glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#EDCE77]/30 via-amber-400/10 to-transparent blur-[100px]" />
      </div>

      {/* Go Home — Ghost Button */}
      <div className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Go home
        </Link>
      </div>

      {/* Center Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-14">
        <div className="w-full max-w-sm relative z-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Revio" className="w-8 h-8 rounded-md" />
            <span className="text-xl font-bold tracking-tight text-white">Revio</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Welcome to Revio
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[300px] mx-auto">
              Sign in or create an account to connect your repositories and start reviewing code.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 w-full p-3.5 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center gap-2.5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">Authentication failed: {error}</span>
            </div>
          )}

          {/* GitHub Sign In Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-zinc-100 text-[#111110] font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-[15px] shadow-lg shadow-white/5"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            <span>{isLoading ? "Connecting..." : "Continue with GitHub"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-zinc-600 uppercase tracking-wider font-medium">Secure OAuth</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-5 text-[11px] text-zinc-600 font-mono">
            <span className="flex items-center gap-1.5">🔒 E2E Encrypted</span>
            <span className="flex items-center gap-1.5">⚡ Instant Setup</span>
          </div>

        </div>
      </div>

      {/* Bottom legal line */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-[11px] text-zinc-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] bg-[#111110] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
