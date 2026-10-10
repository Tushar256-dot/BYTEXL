import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/navigation/TopNav';

export const metadata: Metadata = {
  title: 'FRAME — AI Filmmaker & Generative Content Marketplace',
  description:
    'Curated marketplace connecting forward-thinking brands with top-tier AI filmmakers, animators, and generative content directors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-lime-accent/30 selection:text-white">
        {/* Top persistent application shell navigation */}
        <TopNav />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-zinc-800/80 bg-[#09090b] py-8 text-zinc-500 text-xs font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-accent" />
              <span className="text-zinc-300 font-bold uppercase tracking-widest">FRAME</span>
              <span>— AI-Native Production Marketplace</span>
            </div>

            <div className="flex items-center gap-6 text-zinc-400">
              <span className="hover:text-zinc-300 transition-colors">Vetted Workflows</span>
              <span className="hover:text-zinc-300 transition-colors">Commercial Clearance</span>
              <span className="hover:text-zinc-300 transition-colors">Prompt Architecture</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
