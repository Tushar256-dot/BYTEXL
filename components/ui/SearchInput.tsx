'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search creators by style, workflow (e.g., Runway, ComfyUI), or niche...',
  onClear,
  className,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search
        className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-zinc-300"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search"
        className={cn(
          'w-full h-11 pl-10 pr-16 bg-zinc-900/90 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500',
          'transition-all duration-150',
          'hover:border-zinc-700 focus:border-zinc-600 focus:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-lime-accent/50'
        )}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-accent"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-800/80 border border-zinc-700/60 rounded">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
