import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Glitchy 404 number */}
      <div className="relative mb-8 select-none">
        <span className="text-[10rem] sm:text-[14rem] font-black tracking-tighter leading-none text-zinc-800/60">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-black tracking-tighter leading-none bg-gradient-to-b from-zinc-500/40 to-zinc-700/20 bg-clip-text text-transparent translate-x-1 -translate-y-1">
          404
        </span>
      </div>

      {/* Terminal-style error block */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 max-w-md w-full mb-10 backdrop-blur-sm shadow-2xl relative z-10">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[11px] font-mono text-zinc-500">revio — error.log</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          <p className="text-zinc-500">
            <span className="text-emerald-400/80">$</span> GET /unknown-route
          </p>
          <p className="text-red-400/80">
            Error: Route not found in application manifest.
          </p>
          <p className="text-zinc-600">
            The page you are looking for doesn&apos;t exist or has been moved to a different endpoint.
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="relative z-10 flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
