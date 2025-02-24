<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { COLORS, PEDALS, type Signal, SOUNDS, SPEED } from '$lib';
  import { type ControlId, type ControlOptions, loadControls } from '$lib/controls';
  import Button from '../../components/Button.svelte';

  const speed = page.url.searchParams.get('speed') ?? SPEED.SLOW;
  const controls = loadControls();
  const intervalTimeout = getIntervalTimeout(speed);
  const topCircles = Array.from({ length: 5 }, (_, i) => i);
  const bottomCircles = Array.from({ length: 5 }, (_, i) => i + 5);

  let soundDeepAudio = $state<HTMLAudioElement>();
  let soundHighAudio = $state<HTMLAudioElement>();

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
    responseTimes: number[];
  }>({ total: 0, correct: 0, responseTimes: [] });

  let signalStartTime = $state<number>();

  if (browser) {
    start();
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

  function getIntervalTimeout(speed: string): number {
    const timeouts = {
      [SPEED.SLOW]: 3000,
      [SPEED.MEDIUM]: 2000,
      [SPEED.FAST]: 1000
    };
    return timeouts[speed] ?? 3000;
  }

  function getColorClass(): string {
    return COLOR_CLASSES[activeColor as any] ?? '';
  }

  function start(): void {
    score = { total: 0, correct: 0, responseTimes: [] };
    signalStartTime = undefined;

    soundDeepAudio = new Audio(`/sounds/soundDeep.wav`);
    soundHighAudio = new Audio(`/sounds/soundHigh.wav`);

    intervalId = setInterval(() => {
      // 75% chance for color
      // 12.5% chance for pedal
      // 12.5% chance for sound
      const signalType = getRandomNumber(8, previousSignalType);
      const normalizedSignalType = signalType >= 3 ? 0 : signalType;
      previousSignalType = normalizedSignalType;

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
            soundDeepAudio!.play();
          } else {
            soundHighAudio!.play();
          }
          break;
      }
    }, intervalTimeout);
  }

  function stop(): void {
    clearInterval(intervalId);
    intervalId = undefined;

    activeSignal = undefined;
    activeColor = undefined;
    activeCircleIndex = undefined;
    activePedal = undefined;

    previousSignalType = undefined;
    previousColor = undefined;
    previousPedal = undefined;
    previousSound = undefined;
  }

  function onWindowKeydown(event: KeyboardEvent) {
    const control = Object.entries(controls).find(([_, options]) => options.code === event.code) as [ControlId, ControlOptions] | undefined;
    if (!control || !activeSignal || !signalStartTime) {
      return;
    }

    const [controlId] = control;

    const isCorrect =
      (activeSignal === 'color' && ((controlId === 'colorRed' && activeColor === 'red') ||
        (controlId === 'colorBlue' && activeColor === 'blue') ||
        (controlId === 'colorGreen' && activeColor === 'green') ||
        (controlId === 'colorYellow' && activeColor === 'yellow') ||
        (controlId === 'colorWhite' && activeColor === 'white'))) ||
      (activeSignal === 'pedal' && ((controlId === 'pedalLeft' && activePedal === 'left') ||
        (controlId === 'pedalRight' && activePedal === 'right'))) ||
      (activeSignal === 'sound' && ((controlId === 'soundDeep' && activeSound === 'soundDeep') ||
        (controlId === 'soundHigh' && activeSound === 'soundHigh')));


    if (isCorrect) {
      score.correct++;
      score.responseTimes.push(Date.now() - signalStartTime);
    }

    signalStartTime = undefined;
  }

  function getAverageResponseTime(): number {
    if (score.responseTimes.length === 0) {
      return 0;
    }

    const sum = score.responseTimes.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / score.responseTimes.length);
  }
</script>

<svelte:head>
    <title>Vienna Test System simulator</title>
</svelte:head>

<svelte:window onkeydown={onWindowKeydown}/>

{#if intervalId}
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
                    'size-30 border border-stone-900 rounded-full',
                    activeSignal === 'pedal' && activePedal === side ? 'bg-white' : 'bg-stone-900'
                  ]}></div>
            {/each}
        </div>
    </div>

    <Button label="Stop" size="base" onClick={() => stop()}/>
{:else}
    <div class="text-lg space-y-2">
        <div>Total: {score.total}</div>
        <div>Correct: {score.correct}</div>
        <div>Average Response Time: {getAverageResponseTime()}ms</div>
    </div>
{/if}

