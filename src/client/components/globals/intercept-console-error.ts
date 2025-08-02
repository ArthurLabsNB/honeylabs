"use client";

import { error as logError } from '@lib/logger';

const originalConsoleError = console.error;

console.error = (...args: any[]) => {
  logError(...args);
};

export function restoreConsoleError() {
  console.error = originalConsoleError;
}
