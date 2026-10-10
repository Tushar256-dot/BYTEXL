'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PortfolioItem, WorkflowStage } from '@/types';
import ToolBadge from '@/components/ui/ToolBadge';
import {
  X,
  Play,
  Pause,
  Layers,
  ShieldCheck,
  Scale,
  Sparkles,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  Maximize2,
  FileText,
  Workflow,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PortfolioDetailDialogProps {
  item: PortfolioItem | null;
  creatorName?: string;
  onClose: () => void;
}

export const PortfolioDetailDialog: React.FC<PortfolioDetailDialogProps> = ({
  item,
  creatorName,
  onClose,
}) => {
  const [isPlayingAnimatic, setIsPlayingAnimatic] = useState(false);
  const [currentFramePercent, setCurrentFramePercent] = useState(35);

  if (!item) return null;

  const isCommercial = item.commercialRightsStatus === 'commercial_cleared';
  const isReviewed = item.verificationStatus === 'evidence_reviewed';
  const isPending = item.verificationStatus === 'verification_pending';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-dialog-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#121215] text-zinc-100 shadow-2xl z-10 space-y-6">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-[#121215]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-violet-950/60 text-violet-300 border border-violet-800/60">
              {item.category}
            </span>
            {creatorName && (
              <span className="text-xs font-mono text-zinc-400">
                by <strong className="text-zinc-200">{creatorName}</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
            aria-label="Close portfolio modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 space-y-6 pb-6">
          {/* 1. Media Preview with Transparent Video/Animatic Chrome */}
          <div className="space-y-2">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black group">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 900px"
                className={cn(
                  'object-cover transition-transform duration-700',
                  isPlayingAnimatic && 'scale-105 filter brightness-105'
                )}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

              {/* Clear editorial notice: Never claim static image is a real playable MP4 */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md border border-zinc-700/80 text-zinc-300">
                  <Film className="w-3 h-3 text-lime-accent" />
                  <span>Keyframe Sequence (Animatic Preview)</span>
                </span>
                {item.outputFormat && (
                  <span className="hidden sm:inline-flex px-2 py-1 rounded-md text-[10px] font-mono bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-400">
                    {item.outputFormat}
                  </span>
                )}
              </div>

              {/* Central Interactive Play / Pause Animatic Simulator Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlayingAnimatic(!isPlayingAnimatic)}
                  className="p-4 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700 text-white hover:scale-110 hover:border-lime-accent hover:text-lime-accent transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent shadow-2xl"
                  aria-label={isPlayingAnimatic ? 'Pause animatic sequence' : 'Play animatic sequence'}
                >
                  {isPlayingAnimatic ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Video Player Scrubber & Timecode Controls */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 z-10">
                <button
                  type="button"
                  onClick={() => setIsPlayingAnimatic(!isPlayingAnimatic)}
                  className="hover:text-white focus:outline-none"
                >
                  {isPlayingAnimatic ? 'PAUSE' : 'PLAY'}
                </button>

                <div
                  className="flex-1 h-1.5 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    setCurrentFramePercent(Math.round(percent));
                  }}
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={currentFramePercent}
                  aria-label="Animatic frame scrubber"
                >
                  <div
                    className="h-full bg-lime-accent rounded-full transition-all"
                    style={{ width: `${currentFramePercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 shrink-0">
                  <span>00:{String(Math.round((currentFramePercent / 100) * (item.durationSeconds || 30))).padStart(2, '0')}</span>
                  <span>/</span>
                  <span>00:{String(item.durationSeconds || 30).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-zinc-500 italic px-1">
              * Note: High-bitrate final master is archived in secure client delivery bucket. Interactive preview above demonstrates keyframe progression.
            </p>
          </div>

          {/* 2. Title, Description, and Formats */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 id="portfolio-dialog-title" className="text-xl sm:text-2xl font-bold text-white font-sans">
                {item.title}
              </h2>
              {item.client && (
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 self-start sm:self-auto">
                  Client: {item.client}
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {item.description}
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Aspect Ratio: <strong className="text-white">{item.aspectRatio}</strong>
              </span>
              {item.durationSeconds && (
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Duration: <strong className="text-white">{item.durationSeconds}s</strong>
                </span>
              )}
              {item.outputFormat && (
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Master Format: <strong className="text-white">{item.outputFormat}</strong>
                </span>
              )}
            </div>
          </div>

          {/* 3. AI Production Workflow Sequence (4 Phases) */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-lime-accent" />
                <span>Audited AI Production Workflow</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                4-Stage Pipeline Sequence
              </span>
            </div>

            <div className="space-y-3">
              {(item.workflowStages || []).map((stage) => (
                <div
                  key={stage.stageNumber}
                  className="p-4 rounded-xl border border-zinc-800/90 bg-zinc-900/50 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-zinc-800 text-zinc-200 text-xs font-mono font-bold">
                        {stage.stageNumber}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white">
                        {stage.stageName}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded border',
                        stage.evidenceType === 'reviewed_node_graph'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      )}
                    >
                      {stage.evidenceType === 'reviewed_node_graph'
                        ? 'Node Tree Verified'
                        : 'Creator Reported'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-mono pl-7 leading-relaxed">
                    {stage.methodology}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pl-7 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500">Tools:</span>
                    {stage.toolsUsed.map((tool) => (
                      <ToolBadge key={tool} tool={tool} isVerified={stage.evidenceType === 'reviewed_node_graph'} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Skills & Tools Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            {/* Tools Used */}
            <div className="p-4 rounded-xl border border-zinc-800/90 bg-zinc-900/40 space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-lime-accent" />
                <span>AI Models & Post Software</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(item.toolsUsed || [item.primaryModel]).map((t) => (
                  <ToolBadge key={t} tool={t} isVerified size="sm" />
                ))}
              </div>
            </div>

            {/* Skills Demonstrated */}
            <div className="p-4 rounded-xl border border-zinc-800/90 bg-zinc-900/40 space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Skills Demonstrated</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(item.skillsDemonstrated || ['Prompt Architecture', 'Motion Synthesis']).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Trust, Commercial Clearance & Licensing */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-[#15151a] space-y-3.5 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Commercial Clearance & Licensing Terms</span>
              </h4>

              <span
                className={cn(
                  'px-2.5 py-0.5 rounded text-[11px] font-mono border font-medium',
                  isCommercial
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                )}
              >
                {isCommercial ? 'Full Commercial Clearance' : item.commercialRightsStatus}
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {item.licensingDetails ||
                'Cleared for commercial distribution according to platform terms.'}
            </p>

            {/* Verification Status & Evidence */}
            <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Audit Status:</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-semibold',
                    isReviewed
                      ? 'bg-lime-accent/20 text-lime-accent border border-lime-accent/30'
                      : isPending
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/50'
                      : 'bg-zinc-800 text-zinc-400'
                  )}
                >
                  {isReviewed
                    ? 'Evidence Reviewed & Approved'
                    : isPending
                    ? 'Verification Pending'
                    : 'Creator-Reported'}
                </span>
              </div>

              {item.verificationEvidence && (
                <span className="text-zinc-400 text-[11px] truncate max-w-sm">
                  {item.verificationEvidence}
                </span>
              )}
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <Info className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>
                Demonstration Notice: Verification evidence and licensing statuses shown are illustrative demo models for hackathon evaluation.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 border-t border-zinc-800/90 bg-[#121215]/95 backdrop-blur-md">
          <span className="text-xs font-mono text-zinc-500">
            FRAME AI Workflow Inspector
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-zinc-100 text-zinc-950 font-bold hover:bg-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailDialog;
