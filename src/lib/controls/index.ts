import { browser } from '$app/environment';

export type ControlId =
  | 'soundDeep'
  | 'soundHigh'
  | 'colorRed'
  | 'colorBlue'
  | 'colorWhite'
  | 'colorGreen'
  | 'colorYellow'
  | 'pedalLeft'
  | 'pedalRight';

export type ControlOptions = {
  key: string;
  code: string;
}

export type Controls = Record<ControlId, ControlOptions>;

const LOCAL_STORAGE_KEY = 'controls';
export const DEFAULT_CONTROLS: Controls = {
  'soundDeep': { key: '0', code: 'BracketLeft' },
  'soundHigh': { key: '1', code: 'BracketRight' },
  'colorRed': { key: 'r', code: 'KeyR' },
  'colorBlue': { key: 'b', code: 'KeyB' },
  'colorWhite': { key: 'w', code: 'KeyW' },
  'colorGreen': { key: 'g', code: 'KeyG' },
  'colorYellow': { key: 'y', code: 'KeyZ' },
  'pedalLeft': { key: 'ArrowLeft', code: 'ArrowLeft' },
  'pedalRight': { key: 'ArrowRight', code: 'ArrowRight' },
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

  return JSON.parse(serializedControls) as Controls;
}

export function saveControls(controls?: Controls) {
  if (!browser) {
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(controls ?? DEFAULT_CONTROLS));
}
