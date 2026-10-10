'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import CreatorCard from '@/components/cards/CreatorCard';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { mockCreators } from '@/lib/data/creators';
import { useShortlist } from '@/lib/hooks/useShortlist';
import { Creator } from '@/types';
import { Bookmark, FilePlus2, Sparkles, ArrowRight } from 'lucide-react';

export default function ShortlistPage() {
  const { shortlistedIds, toggleShortlist } = useShortlist(['creator-3']);
  const [invitingCreator, setInvitingCreator] = useState<Creator | null>(null);

  const shortlistedCreators = mockCreators.filter((c) =>
    shortlistedIds.includes(c.id)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="My Shortlisted Directors"
        subtitle="Bookmarked generative AI directors and visualists saved for upcoming client campaigns and brief invitations."
        breadcrumbs={[
          { label: 'Discover', href: '/discover' },
          { label: 'My Shortlist' },
        ]}
        actions={
          shortlistedCreators.length > 0 ? (
            <Link
              href="/briefs/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Invite All to New Brief</span>
            </Link>
          ) : undefined
        }
      />

      {shortlistedCreators.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>
              Showing {shortlistedCreators.length} bookmarked {shortlistedCreators.length === 1 ? 'director' : 'directors'}
            </span>
            <Link
              href="/discover"
              className="text-lime-accent hover:underline flex items-center gap-1"
            >
              <span>Explore more creators</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isShortlisted={true}
                onToggleShortlist={toggleShortlist}
                onInvite={(c) => setInvitingCreator(c)}
              />
            ))}
          </section>
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="Your Shortlist is Empty"
          description="You haven't bookmarked any AI filmmakers yet. Browse the Discover directory to evaluate generative workflows and save directors matching your brief."
          actionLabel="Explore Creators"
          onAction={() => (window.location.href = '/discover')}
        />
      )}

      {invitingCreator && (
        <ConfirmationDialog
          isOpen={Boolean(invitingCreator)}
          onClose={() => setInvitingCreator(null)}
          onConfirm={() => {
            alert(`Project brief invitation sent to ${invitingCreator.displayName}`);
            setInvitingCreator(null);
          }}
          title={`Invite ${invitingCreator.displayName} to Brief?`}
          description={`Send an invitation to collaborate on an upcoming project brief. Day rate: $${invitingCreator.dayRateUSD}/day.`}
          confirmLabel="Send Invite"
          variant="lime"
        />
      )}
    </div>
  );
}
