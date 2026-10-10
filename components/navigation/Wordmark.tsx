import React from 'react';
import Link from 'next/link';

interface WordmarkProps {
  className?: string;
  showTagline?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link
      href="/discover"
      className={`group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent rounded-lg transition-opacity hover:opacity-95 ${className}`}
      aria-label="Kampus.VC AI Marketplace Home"
    >
      {/* Brand Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-lime-accent/40 bg-[#131b36] text-white shadow-glow-lime/20 group-hover:border-lime-accent transition-colors">
        <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-lime-accent" />
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-lime-accent" />
        <span className="w-3 h-3 rounded bg-lime-accent" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black tracking-tight text-white font-sans">
            Kampus<span className="text-lime-accent">.VC</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-lime-accent/10 text-lime-accent border border-lime-accent/30 font-bold">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
            AI Creator Marketplace
          </span>
        )}
      </div>
    </Link>
  );
};

export default Wordmark;
