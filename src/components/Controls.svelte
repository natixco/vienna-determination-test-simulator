<script lang="ts">
  import { type ControlId, loadControls, saveControls } from '$lib/controls';

  const controlLabels: Record<string, string> = {
    soundDeep: 'Deep sound (boop)',
    soundHigh: 'High sound (beep)',
    red: 'Red',
    blue: 'Blue',
    white: 'White',
    green: 'Green',
    yellow: 'Yellow',
    pedalLeft: 'Left pedal',
    pedalRight: 'Right pedal',
  };
  let controls = $state<Record<ControlId, { key: string; code: string; }>>(loadControls());

  initializeControls();

  function initializeControls() {
    controls = loadControls();
  }

  function onWindowKeydown(event: KeyboardEvent) {
    console.log(event)
    if (setKeybindingActive) {
      (controls as any)[setKeybindingActive] = { key: event.key, code: event.code };
      setKeybindingActive = undefined;
      saveControls(controls);
    }
  }

  let setKeybindingActive = $state<undefined | string>(undefined);

  function setKeybinding(controlKey: string) {
    if (setKeybindingActive) {
      setKeybindingActive = undefined;
      return;
    }

    setKeybindingActive = controlKey;
  }
</script>

<svelte:window onkeydown={onWindowKeydown}/>

<div class="flex flex-col items-center justify-center gap-20 w-full">
    <div class="flex flex-row items-center justify-between w-full">
        <div class="size-20 border border-stone-900 bg-stone-900"></div>
        <div class="size-20 border border-stone-900 bg-red-500 rounded-full"></div>
        <div class="size-20 border border-stone-900 bg-blue-500 rounded-full"></div>
        <div class="size-20 border border-stone-900 bg-white"></div>
    </div>
    <div class="flex flex-row items-center justify-between w-full px-30">
        <div class="size-20 border border-stone-900 bg-white rounded-full"></div>
        <div class="size-20 border border-stone-900 bg-green-500 rounded-full"></div>
        <div class="size-20 border border-stone-900 bg-yellow-500 rounded-full"></div>
    </div>
</div>

<h1>{setKeybindingActive}</h1>
<div class="flex flex-col gap-2 w-full">
    {#each Object.entries(controls) as control}
        <div class="flex flex-row items-center justify-between w-full p-4 rounded-sm border border-stone-400">
            <p>{controlLabels[control[0]]}</p>
            <div class="flex flex-row items-center gap-4">
                <p>{control[1].key}</p>
                <button class="py-1 px-4 bg-stone-900 text-stone-50 rounded-sm font-medium text-sm cursor-pointer tracking-wider"
                        onclick={() => setKeybinding(control[0])}>
                    Edit
                </button>
            </div>
        </div>
    {/each}
</div>