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
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Create Brief', href: '/briefs/new', icon: FilePlus2 },
  { label: 'My Shortlist', href: '/shortlist', icon: Bookmark },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Creator Studio', href: '/studio', icon: Sparkles },
];

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#233058] bg-[#0b1021]/95 backdrop-blur-xl shadow-card-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-10">
          <Wordmark showTagline={false} />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/discover'
                  ? pathname === '/discover' || pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
                    isActive
                      ? 'bg-[#182346] text-white font-bold border border-[#2d3e70] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#131b36]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-lime-accent' : 'text-slate-400')} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-lime-accent rounded-full animate-in fade-in duration-200" />
                  )}
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

        {/* Right: Prominent CTA & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/briefs/new"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-black hover:bg-[#b8e600] transition-all duration-150 shadow-glow-lime hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>+ Post Brief</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#131b36] border border-[#233058] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#233058] bg-[#0b1021] px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/discover'
                  ? pathname === '/discover' || pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-[#182346] text-white font-bold border border-[#2d3e70]'
                      : 'text-slate-300 hover:text-white hover:bg-[#131b36]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-lime-accent' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#233058]">
            <Link
              href="/briefs/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-black hover:bg-[#b8e600] transition-colors shadow-glow-lime"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>+ Post Brief</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
