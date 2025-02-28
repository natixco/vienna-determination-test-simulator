import { browser } from '$app/environment';

export type Result = {
  timestamp: number;
  total: number;
  correct: number;
  incorrect: number;
  averageResponseTime: number;
  speed: string;
}

const LOCAL_STORAGE_KEY = 'results';

export function loadResults(): Result[] {
  if (!browser) {
    return [];
  }

  const serializedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!serializedResults) {
    return [];
  }

  return JSON.parse(serializedResults) as Result[];
}

export function saveResult(result: Result): void {
  const results = loadResults();
  results.push(result);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
}