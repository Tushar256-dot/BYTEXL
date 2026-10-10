'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Briefcase, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage() {
  const sampleProjects = [
    {
      id: 'proj-1',
      title: 'Aura Nocturna Commercial',
      creator: 'Elena Rostova',
      stage: 'In Production',
      budget: '$5,000',
      deadline: 'Oct 24, 2026',
      statusColor: 'text-lime-accent',
    },
    {
      id: 'proj-2',
      title: 'Orbital Ring Flythrough',
      creator: 'Kai Takahashi',
      stage: 'Under Review',
      budget: '$4,200',
      deadline: 'Nov 02, 2026',
      statusColor: 'text-violet-400',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Active Projects & Engagements"
        subtitle="Track creator milestones, deliverables, model clearance certifications, and revisions in real-time."
        breadcrumbs={[
          { label: 'Discover', href: '/' },
          { label: 'Projects' },
        ]}
      />

      <div className="space-y-4">
        {sampleProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl border border-zinc-800 bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-lime-accent">
                  {proj.stage}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400 font-mono">with {proj.creator}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{proj.title}</h3>
              <p className="text-xs text-zinc-500 font-mono">
                Agreed Budget: {proj.budget} | Delivery: {proj.deadline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                Milestone 2/4
              </span>
              <button
                type="button"
                onClick={() => alert(`Reviewing deliverables for ${proj.title}`)}
                className="px-3.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-zinc-100 text-zinc-950 font-bold hover:bg-white"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
