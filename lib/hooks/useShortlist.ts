'use client';

import { useState, useEffect, useCallback } from 'react';

const SHORTLIST_STORAGE_KEY = 'frame_shortlist_ids_v1';

export function useShortlist(defaultIds: string[] = ['creator-3']) {
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(defaultIds);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setShortlistedIds(parsed);
        }
      } else {
        localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(defaultIds));
      }
    } catch (e) {
      console.warn('Could not read shortlist from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const toggleShortlist = useCallback((creatorId: string) => {
    setShortlistedIds((prev) => {
      const next = prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId];
      try {
        localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save shortlist to localStorage', e);
      }
      return next;
    });
  }, []);

  const isShortlisted = useCallback(
    (creatorId: string) => shortlistedIds.includes(creatorId),
    [shortlistedIds]
  );

  return { shortlistedIds, toggleShortlist, isShortlisted, isHydrated };
}
