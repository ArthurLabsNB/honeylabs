"use client";
import { useEffect } from 'react';
import { setupTracing } from '@/lib/tracing';

export default function TracingInit() {
  useEffect(() => {
    void setupTracing();
  }, []);
  return null;
}
