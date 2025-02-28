<script lang="ts">
  import { locale, t } from '$lib/translations';
  import { goto, pushState } from '$app/navigation';
  import { page } from '$app/state';
  import { SPEED, TEST_MODE, type TestMode } from '$lib';
  import Button from './Button.svelte';

  const speeds = [SPEED.SLOW, SPEED.MEDIUM, SPEED.FAST];
  const modes = [TEST_MODE.ADAPTIVE, TEST_MODE.ACTION, TEST_MODE.REACTION];

  let showSpeedNotSelectedError = $state(false);
  let selectedSpeed = $state(page.url.searchParams.get('speed') ?? SPEED.SLOW);
  let selectedMode = $state<TestMode>(page.url.searchParams.get('mode') as TestMode ?? TEST_MODE.REACTION);
  let durationMinutes = $state(2);

  function selectSpeed(speed: string) {
    selectedSpeed = speed;
    showSpeedNotSelectedError = false;

    const url = new URL(window.location.href);
    url.searchParams.set('speed', selectedSpeed);
    pushState(url, {});
  }

  function selectMode(mode: TestMode) {
    selectedMode = mode;
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    pushState(url, {});
  }

  function tryStart() {
    if (!selectedSpeed || !selectedSpeed.length) {
      showSpeedNotSelectedError = true;
      return;
    }

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

<div class="flex flex-col items-center gap-4">
    <div class="flex flex-col items-center gap-2 w-full max-w-2xl">
        <p class="tracking-wide font-medium">
            {$t('TEST_MODE.TITLE')}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {#each modes as mode}
                <button
                        class={[
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

    {#if selectedMode === TEST_MODE.REACTION}
        <div class="flex items-center gap-2">
            <input
                    type="number"
                    min="1"
                    max="60"
                    bind:value={durationMinutes}
                    class="w-20 h-10 px-2 border border-stone-400 rounded-sm outline-none"
            />
            <span class="text-sm text-stone-600">{$t('GAME_CONTROLS.DURATION_MINUTES')}</span>
        </div>
    {/if}

    <p class="tracking-wide font-medium">
        {$t('GAME_CONTROLS.INSTRUCTIONS')}
    </p>

    {#if showSpeedNotSelectedError}
        <p>
            {$t('GAME_CONTROLS.SPEED_NOT_SELECTED_ERROR')}
        </p>
    {/if}

    <div class="grid grid-cols-3 grid-rows-1 gap-4">
        {#each speeds as speed}
            <button class={[
                'border-2 bg-stone-50 rounded-md h-12 px-6 flex items-center justify-center transition-all cursor-pointer',
                selectedSpeed === speed 
                    ? 'border-stone-900 bg-stone-100 shadow-md' 
                    : 'border-stone-300 hover:border-stone-500'
            ]}
                    onclick={() => selectSpeed(speed)}>
                <span class={[
                    'font-medium text-sm tracking-wider',
                    selectedSpeed === speed ? 'text-stone-900' : 'text-stone-600'
                ]}>
                    {getSpeedLabel(speed)}
                </span>
            </button>
        {/each}
    </div>

    <Button label="Start" size="base" onClick={() => tryStart()}/>
</div> 