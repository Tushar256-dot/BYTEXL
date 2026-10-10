'use client';

import React from 'react';
import { FilterOption } from '@/types';
import { cn } from '@/lib/utils';

export interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  pillVariant?: 'default' | 'lime' | 'violet';
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  multiSelect = true,
  className,
  pillVariant = 'default',
}) => {
  const handleToggle = (value: string) => {
    if (multiSelect) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      if (selectedValues.includes(value)) {
        onChange([]);
      } else {
        onChange([value]);
      }
    }
  };

  const activeStyles = {
    default: 'bg-zinc-100 text-zinc-950 font-medium border-white',
    lime: 'bg-lime-accent text-zinc-950 font-semibold border-lime-accent',
    violet: 'bg-violet-600 text-white font-medium border-violet-500',
  }[pillVariant];

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        {selectedValues.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
          >
            Clear ({selectedValues.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              aria-pressed={isSelected}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all',
                'border focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent',
                isSelected
                  ? activeStyles
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
              )}
            >
              <span>{option.label}</span>
              {typeof option.count === 'number' && (
                <span
                  className={cn(
                    'text-[10px] px-1 py-0.2 rounded',
                    isSelected ? 'bg-black/20 text-zinc-900' : 'text-zinc-500'
                  )}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterGroup;
