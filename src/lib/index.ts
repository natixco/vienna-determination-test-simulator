export type Signal = 'color' | 'pedal' | 'sound';

export const TEST_MODE = {
  ADAPTIVE: 'adaptive',  // Speed adjusts based on performance
  ACTION: 'action',     // No time limit
  REACTION: 'reaction'  // Fixed time limit (current implementation)
} as const;

export type TestMode = typeof TEST_MODE[keyof typeof TEST_MODE];

export const SPEED = {
  SLOW: 'slow',
  MEDIUM: 'medium',
  FAST: 'fast',
} as const;

export type Speed = typeof SPEED[keyof typeof SPEED];

export const COLORS = [
  'red',
  'blue',
  'white',
  'green',
  'yellow',
];

export const PEDALS = [
  'left',
  'right',
];

export const SOUNDS = [
  'soundDeep',
  'soundHigh',
];