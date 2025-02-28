<script lang="ts">
  import { locale, t } from '$lib/translations';
  import { goto, pushState } from '$app/navigation';
  import { page } from '$app/state';
  import { SPEED, TEST_MODE, type TestMode } from '$lib';
  import Button from './Button.svelte';

  const speeds = [SPEED.SLOW, SPEED.MEDIUM, SPEED.FAST];
  const modes = [TEST_MODE.ADAPTIVE, TEST_MODE.ACTION, TEST_MODE.REACTION];

  let selectedSpeed = $state(page.url.searchParams.get('speed') ?? SPEED.SLOW);
  let selectedMode = $state<TestMode>(page.url.searchParams.get('mode') as TestMode ?? TEST_MODE.REACTION);
  let durationMinutes = $state(parseInt(page.url.searchParams.get('duration') ?? '2', 10));

  function updateSearchParams(params: Record<string, string | undefined>): void {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    pushState(url, {});
  }

  function selectSpeed(speed: string): void {
    selectedSpeed = speed;
    updateSearchParams({ speed });
  }

  function selectMode(mode: TestMode): void {
    selectedMode = mode;
    updateSearchParams({
      mode,
      duration: mode === TEST_MODE.REACTION ? durationMinutes.toString() : undefined
    });
  }

  function updateDuration(minutes: number): void {
    durationMinutes = minutes;
    if (selectedMode === TEST_MODE.REACTION) {
      updateSearchParams({ duration: minutes.toString() });
    }
  }

  function start(): void {
    const url = new URL(window.location.href);
    url.pathname = `${locale.get()}/test`;
    url.searchParams.set('speed', selectedSpeed);
    url.searchParams.set('mode', selectedMode);
    if (selectedMode === TEST_MODE.REACTION) {
      url.searchParams.set('duration', durationMinutes.toString());
    } else {
      url.searchParams.delete('duration');
    }
    goto(url);
  }

  function getSpeedLabel(speed: string): string {
    const labels: Record<string, string> = {
      slow: $t('SPEED.SLOW'),
      medium: $t('SPEED.MEDIUM'),
      fast: $t('SPEED.FAST')
    }
    return labels[speed];
  }
</script>

<div class="flex flex-col items-center gap-8">
    <div class="text-center">
        <h2 class="text-xl font-semibold mb-2">
            {$t('GAME_CONTROLS.INSTRUCTIONS')}
        </h2>
    </div>

    <div class="flex flex-col items-center gap-2 w-full max-w-2xl">
        <p class="tracking-wide font-medium">
            {$t('TEST_MODE.TITLE')}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {#each modes as mode}
                <button class={[
                            'border-2 bg-stone-50 rounded-md p-4 flex flex-col items-center gap-2 transition-all cursor-pointer',
                            selectedMode === mode
                                ? 'border-stone-900 bg-stone-100 shadow-md'
                                : 'border-stone-300 hover:border-stone-500'
                        ]}
                        onclick={() => selectMode(mode)}
                >
                    <span class={[
                        'font-medium text-base tracking-wider',
                        selectedMode === mode ? 'text-stone-900' : 'text-stone-600'
                    ]}>
                        {$t(`TEST_MODE.${mode.toUpperCase()}_SHORT`)}
                    </span>
                    <span class="text-sm text-stone-600 text-center">
                        {$t(`TEST_MODE.${mode.toUpperCase()}_DESC`)}
                    </span>
                </button>
            {/each}
        </div>
    </div>

    <div class="flex flex-col items-center gap-2 w-full max-w-2xl">
        <p class="tracking-wide font-medium">
            {$t('SPEED.TITLE')}
        </p>
        <div class="grid grid-cols-3 grid-rows-1 gap-4 w-full">
            {#each speeds as speed}
                <button class={[
                            'border-2 bg-stone-50 rounded-md h-12 px-6 flex items-center justify-center transition-all cursor-pointer',
                            selectedSpeed === speed
                                ? 'border-stone-900 bg-stone-100 shadow-md'
                                : 'border-stone-300 hover:border-stone-500'
                        ]}
                        onclick={() => selectSpeed(speed)}
                >
                    <span class={[
                        'font-medium text-sm tracking-wider',
                        selectedSpeed === speed ? 'text-stone-900' : 'text-stone-600'
                    ]}>
                        {getSpeedLabel(speed)}
                    </span>
                </button>
            {/each}
        </div>
    </div>

    {#if selectedMode === TEST_MODE.REACTION}
        <div class="flex flex-col items-center gap-2">
            <p class="tracking-wide font-medium">
                {$t('GAME_CONTROLS.DURATION_TITLE')}
            </p>
            <div class="flex items-center justify-center gap-2">
                <input type="number"
                       min="1"
                       max="60"
                       value={durationMinutes}
                       oninput={e => updateDuration(e.currentTarget.valueAsNumber)}
                       class="w-16 h-10 px-2 border-2 border-stone-300 rounded-md outline-none text-center bg-stone-50 focus:border-stone-500"
                />
                <span class="text-sm text-stone-600">{$t('GAME_CONTROLS.DURATION_MINUTES')}</span>
            </div>
        </div>
    {/if}

    <!-- Start Button -->
    <Button label="Start" size="base" onClick={() => start()}/>
</div> 