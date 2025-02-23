import { browser } from '$app/environment';

export type ControlId =
  | 'soundDeep'
  | 'soundHigh'
  | 'red'
  | 'blue'
  | 'white'
  | 'green'
  | 'yellow'
  | 'pedalLeft'
  | 'pedalRight';

export type ControlOptions = {
  key: string;
  code: string;
}

export type Controls = Record<ControlId, ControlOptions>;

const LOCAL_STORAGE_KEY = 'controls';
export const DEFAULT_CONTROLS: Controls = {
  'soundDeep': { key: 'ő', code: 'BracketLeft' },
  'soundHigh': { key: 'ő', code: 'BracketRight' },
  'red': { key: 'ő', code: 'KeyR' },
  'blue': { key: 'ő', code: 'KeyU' },
  'white': { key: 'ő', code: 'KeyD' },
  'green': { key: 'ő', code: 'KeyG' },
  'yellow': { key: 'ő', code: 'KeyJ' },
  'pedalLeft': { key: 'ő', code: 'ArrowLeft' },
  'pedalRight': { key: 'ő', code: 'ArrowRight' },
};

export function loadControls() {
  if (!browser) {
    return {...DEFAULT_CONTROLS};
  }

  const serializedControls = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!serializedControls) {
    saveControls();
    return { ...DEFAULT_CONTROLS };
  }

  return JSON.parse(serializedControls);
}

export function saveControls(controls?: Controls) {
  if (!browser) {
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(controls ?? DEFAULT_CONTROLS));
}
