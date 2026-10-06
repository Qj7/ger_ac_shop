'use client';

import { useEffect } from 'react';
import { captureSource } from '@/lib/tracking';

export function SourceTracker() {
  useEffect(() => captureSource(), []);
  return null;
}
