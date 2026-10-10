import React from 'react';
import Link from 'next/link';

interface WordmarkProps {
  className?: string;
  showTagline?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent rounded-sm transition-opacity hover:opacity-90 ${className}`}
      aria-label="FRAME AI Marketplace Home"
    >
      {/* Film / GenAI Viewfinder Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded border border-zinc-700 bg-zinc-900/90 text-zinc-100 group-hover:border-zinc-500 transition-colors">
        {/* Subtle viewfinder corner marks */}
        <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-lime-accent" />
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-lime-accent" />
        {/* Central lens aperture / play glyph */}
        <span className="w-2.5 h-2.5 rounded-[1px] bg-white group-hover:bg-lime-accent transition-colors" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-[0.2em] uppercase text-white font-mono">
            FRAME
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-mono">
            Generative Filmmaking
          </span>
        )}
      </div>
    </Link>
  );
};

export default Wordmark;
