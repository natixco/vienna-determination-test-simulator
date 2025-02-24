<script lang="ts">
  import Controls from '../components/Controls.svelte';
  import { goto, pushState } from '$app/navigation';
  import { page } from '$app/state';
  import Instructions from '../components/Instructions.svelte';
  import PseudoControls from '../components/PseudoControls.svelte';
  import { SPEED } from '$lib';
  import Button from '../components/Button.svelte';
  import Results from '../components/Results.svelte';

  const speeds = [SPEED.SLOW, SPEED.MEDIUM, SPEED.FAST];
  let showSpeedNotSelectedError = $state(false);
  let selectedSpeed = $state(page.url.searchParams.get('speed'));

  function selectSpeed(speed: string) {
    selectedSpeed = speed;
    showSpeedNotSelectedError = false;

    const url = new URL(window.location.href);
    url.searchParams.set('speed', selectedSpeed);
    pushState(url, {});
  }

  function tryStart() {
    if (!selectedSpeed || !selectedSpeed.length) {
      showSpeedNotSelectedError = true;
      return;
    }

    const url = new URL(window.location.href);
    url.pathname = 'test';
    goto(url);
  }
</script>

<svelte:head>
    <title>Vienna Determination Test Simulator</title>
</svelte:head>

<h1 class="text-zinc-900 font-bold text-2xl my-10">
    Vienna Determination Test Simulator
</h1>

<div class="flex flex-col gap-20 pb-10">
    <Instructions/>
    <PseudoControls/>

    <div class="flex flex-col items-center gap-4">
        <p class="tracking-wide font-medium">
            Select speed and press Start
        </p>

        {#if showSpeedNotSelectedError}
            <p>You need to select a speed, before you can start the test.</p>
        {/if}

        <div class="grid grid-cols-3 grid-rows-1 gap-4">
            {#each speeds as speed}
                <button class={[
                'border border-stone-400 bg-stone-50 rounded-sm h-10 px-10 w-full flex flex-col items-center justify-center ring-2 hover:border-stone-900 cursor-pointer',
                selectedSpeed === speed ? 'ring-stone-900' : 'ring-transparent'
            ]}
                        onclick={() => selectSpeed(speed)}>
                <span class="font-medium text-sm tracking-wider">
                    {speed}
                </span>
                </button>
            {/each}
        </div>
        <Button label="Start" size="base" onClick={() => tryStart()}/>
    </div>

    <Results/>
    <Controls/>
</div>
