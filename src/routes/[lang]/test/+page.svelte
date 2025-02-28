<script lang="ts">
  import { locale } from '$lib/translations';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { COLORS, PEDALS, type Signal, SOUNDS, SPEED, type Speed, TEST_MODE, type TestMode } from '$lib';
  import { type ControlId, type ControlOptions, loadControls } from '$lib/controls';
  import Button from '../../../components/Button.svelte';
  import { saveResult } from '$lib/results';
  import { goto } from '$app/navigation';
  import { Howl } from 'howler';

  const speed = (page.url.searchParams.get('speed') ?? SPEED.SLOW) as Speed;
  const mode = (page.url.searchParams.get('mode') ?? TEST_MODE.REACTION) as TestMode;
  const duration = parseInt(page.url.searchParams.get('duration') ?? '2', 10);
  const controls = loadControls();
  const intervalTimeout = getIntervalTimeout(speed);
  const topCircles = Array.from({ length: 5 }, (_, i) => i);
  const bottomCircles = Array.from({ length: 5 }, (_, i) => i + 5);

  let deepSound: Howl;
  let highSound: Howl;

  let intervalId = $state<number>();

  let activeSignal = $state<Signal>();
  let activeColor = $state<string>();
  let activeCircleIndex = $state<number>();
  let activePedal = $state<string>();
  let activeSound = $state<string>();

  let previousSignalType = $state<number>();
  let previousColor = $state<string>();
  let previousPedal = $state<string>();
  let previousSound = $state<string>();

  const COLOR_CLASSES: Record<string, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    white: 'bg-white',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500'
  };

  let score = $state<{
    total: number;
    correct: number;
    incorrect: number;
    omitted: number;
    responseTimes: number[];
  }>({ total: 0, correct: 0, incorrect: 0, omitted: 0, responseTimes: [] });
  let pressedAnyKey = $state(false);
  let signalStartTime = $state<number>();

  let timeLeft = $state(mode === TEST_MODE.REACTION ? duration * 60 : Infinity);
  let timerInterval = $state<number>();
  let adaptiveIntervalTimeout = $state<number>(intervalTimeout);

  if (browser) {
    deepSound = new Howl({
      src: ['/sounds/soundDeep.wav'],
      preload: true,
      volume: 1.0
    });

    highSound = new Howl({
      src: ['/sounds/soundHigh.wav'],
      preload: true,
      volume: 1.0
    });

    start();
    if (mode === TEST_MODE.REACTION) {
      startTimer();
    }
  }

  function getRandomNumber(max: number, exclude?: number): number {
    let result;
    do {
      result = Math.floor(Math.random() * max);
    } while (result === exclude);
    return result;
  }

  function getRandomArrayElement<T>(array: T[], previous?: T): T {
    const index = getRandomNumber(array.length);
    if (array[index] === previous) {
      return getRandomArrayElement(array, previous);
    }

    return array[index];
  }

  function getIntervalTimeout(speed: Speed): number {
    const timeouts: Record<Speed, number> = {
      [SPEED.SLOW]: 3000,
      [SPEED.MEDIUM]: 2000,
      [SPEED.FAST]: 1000
    };
    return timeouts[speed];
  }

  function getColorClass(): string {
    return COLOR_CLASSES[activeColor as any] ?? '';
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        stop();
      }
    }, 1000);
  }

  function start(): void {
    score = { total: 0, correct: 0, incorrect: 0, omitted: 0, responseTimes: [] };
    signalStartTime = undefined;
    intervalId = setInterval(generateSignal, intervalTimeout);
  }

  function stop(): void {
    if (!pressedAnyKey && signalStartTime) {
      score.total--;
    }

    clearInterval(intervalId);
    clearInterval(timerInterval);
    intervalId = undefined;
    timerInterval = undefined;

    deepSound?.stop();
    highSound?.stop();

    activeSignal = undefined;
    activeColor = undefined;
    activeCircleIndex = undefined;
    activePedal = undefined;

    previousSignalType = undefined;
    previousColor = undefined;
    previousPedal = undefined;
    previousSound = undefined;

    if (score.total > 0) {
      saveResult({
        timestamp: Date.now(),
        total: score.total,
        correct: score.correct,
        incorrect: score.incorrect,
        omitted: score.omitted,
        averageResponseTime: getAverageResponseTime(),
        medianResponseTime: getMedianResponseTime(),
        speed
      });
    }

    const url = new URL(window.location.href);
    url.pathname = locale.get();
    goto(url);
  }

  function onWindowKeydown(event: KeyboardEvent) {
    if (pressedAnyKey) {
      return;
    }

    const control = Object.entries(controls).find(([_, options]) => options.code === event.code) as [ControlId, ControlOptions] | undefined;
    if (!control || !activeSignal || !signalStartTime) {
      return;
    }

    pressedAnyKey = true;
    const [controlId] = control;
    const isCorrect = checkCorrectResponse(controlId);

    if (isCorrect) {
      score.correct++;
      score.responseTimes.push(Date.now() - signalStartTime);
    } else {
      score.incorrect++;
    }

    adjustSpeed(isCorrect);
    signalStartTime = undefined;
  }

  function generateSignal() {
    if (!pressedAnyKey && signalStartTime) {
      score.omitted++;
    }

    // 75% chance for color
    // 12.5% chance for pedal
    // 12.5% chance for sound
    const signalType = getRandomNumber(8, previousSignalType);
    const normalizedSignalType = signalType >= 3 ? 0 : signalType;
    previousSignalType = normalizedSignalType;

    pressedAnyKey = false;
    signalStartTime = Date.now();
    score.total++;

    switch (normalizedSignalType) {
      case 0:
        activeSignal = 'color';
        activeColor = getRandomArrayElement(COLORS, previousColor);
        previousColor = activeColor;
        activeCircleIndex = getRandomNumber(10);
        break;

      case 1:
        activeSignal = 'pedal';
        activePedal = getRandomArrayElement(PEDALS, previousPedal);
        previousPedal = activePedal;
        break;

      case 2:
        activeSignal = 'sound';
        const sound = getRandomArrayElement(SOUNDS, previousSound);
        activeSound = sound;
        previousSound = sound;

        if (sound === 'soundDeep') {
          deepSound.play();
        } else {
          highSound.play();
        }
        break;
    }
  }

  function adjustSpeed(isCorrect: boolean) {
    if (mode !== TEST_MODE.ADAPTIVE) {
      return;
    }

    if (isCorrect) {
      adaptiveIntervalTimeout = Math.max(500, adaptiveIntervalTimeout - 100);
    } else {
      adaptiveIntervalTimeout = Math.min(3000, adaptiveIntervalTimeout + 200);
    }

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = setInterval(generateSignal, adaptiveIntervalTimeout);
    }
  }

  function getAverageResponseTime(): number {
    if (score.responseTimes.length === 0) {
      return 0;
    }

    const sum = score.responseTimes.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / score.responseTimes.length);
  }

  function getMedianResponseTime(): number {
    if (score.responseTimes.length === 0) {
      return 0;
    }

    const sorted = [...score.responseTimes].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
      ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
      : sorted[middle];
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function checkCorrectResponse(controlId: ControlId): boolean {
    return (activeSignal === 'color' && ((controlId === 'colorRed' && activeColor === 'red') ||
        (controlId === 'colorBlue' && activeColor === 'blue') ||
        (controlId === 'colorGreen' && activeColor === 'green') ||
        (controlId === 'colorYellow' && activeColor === 'yellow') ||
        (controlId === 'colorWhite' && activeColor === 'white'))) ||
      (activeSignal === 'pedal' && ((controlId === 'pedalLeft' && activePedal === 'left') ||
        (controlId === 'pedalRight' && activePedal === 'right'))) ||
      (activeSignal === 'sound' && ((controlId === 'soundDeep' && activeSound === 'soundDeep') ||
        (controlId === 'soundHigh' && activeSound === 'soundHigh')));
  }
</script>

<svelte:head>
    <title>Vienna Determination Test Simulator</title>
</svelte:head>

<svelte:window onkeydown={onWindowKeydown}/>

<div class="min-h-screen flex flex-col items-center justify-center w-full">
    {#if mode === TEST_MODE.REACTION}
        <div class="absolute top-4 right-4 text-2xl font-mono">
            {formatTime(timeLeft)}
        </div>
    {/if}

    <div class="flex flex-col items-center justify-center gap-15 w-full">
        <div class="flex flex-col items-center justify-center gap-5 w-full">
            {#each [topCircles, bottomCircles] as row}
                <div class="flex flex-row items-center justify-between w-full">
                    {#each row as index}
                        <div class={[
              'size-26 border border-stone-900 rounded-full',
              activeCircleIndex === index && activeSignal === 'color' ? getColorClass() : 'bg-stone-900'
            ]}></div>
                    {/each}
                </div>
            {/each}
        </div>

        <div class="flex flex-row items-center justify-between w-full">
            {#each ['left', 'right'] as side}
                <div class={[
                    'w-20 h-40 border border-stone-900 rounded-sm',
                    activeSignal === 'pedal' && activePedal === side ? 'bg-white' : 'bg-stone-900'
                  ]}></div>
            {/each}
        </div>
    </div>

    <div class="mt-40">
        <Button label="Stop" size="base" onClick={() => stop()}/>
    </div>

</div>

