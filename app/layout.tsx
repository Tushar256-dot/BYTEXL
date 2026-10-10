import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/navigation/TopNav';

export const metadata: Metadata = {
  title: 'Kampus.VC — AI Filmmaker & Generative Content Marketplace',
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
      <body className="min-h-screen bg-[#0b1021] text-slate-100 flex flex-col font-sans selection:bg-lime-accent/30 selection:text-white">
        {/* Top persistent application shell navigation */}
        <TopNav />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-[#233058] bg-[#0b1021] py-8 text-slate-400 text-xs font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-accent animate-pulse" />
              <span className="text-white font-black uppercase tracking-widest text-sm">KAMPUS.VC</span>
              <span>— AI-Native Creator Marketplace</span>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <span className="hover:text-white transition-colors">Vetted Workflows</span>
              <span className="hover:text-white transition-colors">Commercial Clearance</span>
              <span className="hover:text-white transition-colors">Prompt Architecture</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
