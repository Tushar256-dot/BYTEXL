'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import ToolBadge from '@/components/ui/ToolBadge';
import { toolFilterOptions } from '@/lib/mock-data';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateBriefPage() {
  const [title, setTitle] = useState('');
  const [deliverableType, setDeliverableType] = useState('commercial_spot');
  const [targetDuration, setTargetDuration] = useState('30s');
  const [selectedTools, setSelectedTools] = useState<string[]>(['Runway Gen-3', 'Flux.1']);
  const [budgetMin, setBudgetMin] = useState('3000');
  const [budgetMax, setBudgetMax] = useState('7500');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-4 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>

        <PageHeader
          title="Create Creative Brief"
          subtitle="Define production requirements, AI toolchain specifications, and commercial clearances to match with verified generative directors."
          breadcrumbs={[
            { label: 'Discover', href: '/' },
            { label: 'Create Brief' },
          ]}
        />
      </div>

      {isSubmitted ? (
        <div className="p-8 rounded-xl border border-zinc-800 bg-[#121215] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-lime-accent/20 border border-lime-accent/40 flex items-center justify-center mx-auto text-lime-accent">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Brief Created Successfully!</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Your brief &ldquo;{title}&rdquo; is ready. In Phase 4, our explainable rule-based matching engine will rank suitable directors.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover"
            >
              Browse Directors Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl border border-zinc-800 bg-[#121215] space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Ultra-Luxe Autumn Perfume Launch Spec"
              className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-lime-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Deliverable Type
              </label>
              <select
                value={deliverableType}
                onChange={(e) => setDeliverableType(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="commercial_spot">Commercial Spot (15-60s)</option>
                <option value="teaser">Brand Teaser</option>
                <option value="music_video">Music Video</option>
                <option value="concept_art">Concept Art & Animatic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Target Duration
              </label>
              <input
                type="text"
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
                placeholder="e.g., 30s"
                className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Estimated Budget (USD)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="Min ($)"
                className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none"
              />
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="Max ($)"
                className="w-full h-11 px-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Required AI Toolchain */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Preferred / Required Toolchain
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {toolFilterOptions.map((opt) => (
                <ToolBadge
                  key={opt.value}
                  tool={opt.label}
                  active={selectedTools.includes(opt.value)}
                  onClick={() => toggleTool(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Narrative Scope */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Creative Brief & Narrative Direction
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the desired aesthetic, pacing, moodboard reference, and clearance constraints..."
              className="w-full p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-lime-accent text-zinc-950 font-bold hover:bg-lime-hover transition-colors shadow-glow-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Submit Brief & Launch Matcher
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
