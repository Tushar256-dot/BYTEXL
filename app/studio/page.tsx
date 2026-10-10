'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import VerificationBadge from '@/components/ui/VerificationBadge';
import ToolBadge from '@/components/ui/ToolBadge';
import { Sparkles, ShieldCheck, Upload, Layers, CheckCircle2 } from 'lucide-react';

export default function CreatorStudioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Studio"
        subtitle="Manage your generative production portfolio, submit workflow node-graphs for platform verification, and certify commercial model licenses."
        breadcrumbs={[
          { label: 'Discover', href: '/' },
          { label: 'Creator Studio' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Commercial Clearance</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Verify model checkpoints, LoRA training datasets, and commercial commercial licensing rights.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certified Account</span>
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Workflow Verification</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Submit ComfyUI JSON workflows or screen recordings to elevate tools from self-reported to verified.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => alert('Workflow submission modal opens here in upcoming phase')}
              className="px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider bg-zinc-800 text-zinc-200 hover:text-white"
            >
              Upload Node Graph
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Add Portfolio Spec</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Upload new video deliverables with model metadata and multi-pass pipeline logs.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => alert('Add Spec modal opens here in upcoming phase')}
              className="px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider bg-zinc-800 text-zinc-200 hover:text-white"
            >
              + New Case Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
