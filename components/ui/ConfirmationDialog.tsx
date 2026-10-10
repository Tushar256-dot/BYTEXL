'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, X } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'neutral' | 'lime';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'neutral',
  isLoading = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmBtnStyles = {
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    neutral: 'bg-zinc-100 hover:bg-white text-zinc-950 font-medium',
    lime: 'bg-lime-accent hover:bg-lime-hover text-zinc-950 font-semibold',
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className={cn(
          'relative w-full max-w-md p-6 rounded-xl border border-zinc-800 bg-[#121215] text-zinc-100 shadow-2xl',
          'z-10 animate-in zoom-in-95 duration-150'
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-accent"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={cn(
              'p-2.5 rounded-lg shrink-0 border',
              variant === 'danger'
                ? 'bg-red-950/40 border-red-800/60 text-red-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            )}
          >
            {variant === 'danger' ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <Info className="w-5 h-5 text-lime-accent" />
            )}
          </div>
          <div>
            <h3 id="dialog-title" className="text-base font-semibold text-white">
              {title}
            </h3>
            <p id="dialog-description" className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
              confirmBtnStyles,
              isLoading && 'opacity-60 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
