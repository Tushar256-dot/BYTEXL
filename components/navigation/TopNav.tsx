'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from './Wordmark';
import { cn } from '@/lib/utils';
import {
  Compass,
  FilePlus2,
  Bookmark,
  Briefcase,
  Sparkles,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const navItems: NavItem[] = [
  { label: 'Discover', href: '/', icon: Compass },
  { label: 'Create Brief', href: '/briefs/new', icon: FilePlus2 },
  { label: 'My Shortlist', href: '/shortlist', icon: Bookmark },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Creator Studio', href: '/studio', icon: Sparkles },
];

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Wordmark showTagline={false} />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
                    isActive
                      ? 'bg-zinc-800 text-white font-medium border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-lime-accent' : 'text-zinc-500')} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-700 text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick Action & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/briefs/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>+ Post Brief</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0c0c0e] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-lime-accent' : 'text-zinc-500')} />
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-zinc-800">
            <Link
              href="/briefs/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors"
            >
              <span>+ Post Brief</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
