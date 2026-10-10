'use client';

import React, { useState } from 'react';
import { Creator } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  FilePlus2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface InviteToProjectDialogProps {
  isOpen: boolean;
  creator: Creator;
  onClose: () => void;
  onSuccess: (briefTitle: string) => void;
}

export const sampleBriefs = [
  {
    id: 'brief-1',
    title: 'Aura Nocturna — Luxury Fragrance Spec',
    deliverableType: 'Commercial Spot (30s)',
    budgetRange: '$5,000 - $7,500',
    deadline: 'Nov 12, 2026',
    estimatedDays: 4,
  },
  {
    id: 'brief-2',
    title: 'Exo-Terra 2088 — Sci-Fi Worldbuilding Teaser',
    deliverableType: 'Brand Teaser (45s)',
    budgetRange: '$4,000 - $6,000',
    deadline: 'Nov 20, 2026',
    estimatedDays: 5,
  },
  {
    id: 'brief-custom',
    title: '+ Create New Custom Creative Brief',
    deliverableType: 'Custom Scope',
    budgetRange: 'Negotiable',
    deadline: 'Flexible',
    estimatedDays: 3,
  },
];

export const InviteToProjectDialog: React.FC<InviteToProjectDialogProps> = ({
  isOpen,
  creator,
  onClose,
  onSuccess,
}) => {
  const [selectedBriefId, setSelectedBriefId] = useState<string>(sampleBriefs[0].id);
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentBrief =
    sampleBriefs.find((b) => b.id === selectedBriefId) || sampleBriefs[0];
  const estimatedDays = creator.turnaroundDaysAverage || currentBrief.estimatedDays || 4;
  const dayRate = creator.dayRateUSD || 1200;
  const estimatedProjectTotal = estimatedDays * dayRate;

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(currentBrief.title);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-dialog-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#121215] text-zinc-100 shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141418]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-accent/20 border border-lime-accent/40 flex items-center justify-center text-lime-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="invite-dialog-title" className="text-base font-bold text-white font-sans">
                Invite to Creative Project
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Directing collaboration with {creator.displayName} (@{creator.handle})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendInvitation} className="p-6 space-y-5">
          {/* 1. Brief Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
              Select Project Brief
            </label>
            <div className="space-y-2">
              {sampleBriefs.map((brief) => {
                const isSelected = selectedBriefId === brief.id;
                return (
                  <div
                    key={brief.id}
                    onClick={() => setSelectedBriefId(brief.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-lime-accent bg-zinc-900/90 shadow-glow-lime/20'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">{brief.title}</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {brief.deliverableType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-zinc-400">
                      <span>Budget: {brief.budgetRange}</span>
                      <span>•</span>
                      <span>Target: {brief.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Rate & Estimated Production Budget Breakdown */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#16161b] space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Creator Day Rate:</span>
              <strong className="text-white">{formatCurrency(dayRate)}/day</strong>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Estimated Production Time:</span>
              <strong className="text-white">{estimatedDays} days (Average)</strong>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm">
              <span className="font-semibold text-zinc-300">Indicative Project Total:</span>
              <strong className="text-lime-accent font-bold font-mono">
                {formatCurrency(estimatedProjectTotal)}
              </strong>
            </div>
          </div>

          {/* 3. Personalized Brief Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
              Invitation Note / Milestone Requirements
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. We love your luxury fluid work. We would like to initiate preliminary concept animatics next week..."
              className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-lime-accent"
            />
          </div>

          <div className="p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>
              Inviting reserves preliminary production review. Payment milestones are only authorized upon mutual contract sign-off.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover shadow-glow-lime transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <span>Send Project Invite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteToProjectDialog;
