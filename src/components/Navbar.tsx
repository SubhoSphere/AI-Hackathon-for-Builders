"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#111110]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Revio" className="w-7 h-7 rounded-md" />
          <span className="text-lg font-bold tracking-tight text-white">Revio</span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-zinc-400">
          <a href="/#features" className="hover:text-white transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          {status === "authenticated" && (
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="text-sm font-medium text-white border border-white/15 hover:bg-white/[0.06] px-5 py-1.5 rounded-full transition-all active:scale-95"
            >
              Sign In
            </Link>
          )}

          {status === "authenticated" && session?.user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full">
                <img src={session.user.image || ""} alt="" className="w-6 h-6 rounded-full border border-white/10" />
                <span className="text-sm font-medium text-zinc-300 truncate max-w-[100px]">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 hover:bg-white/5 rounded-lg active:scale-95"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
