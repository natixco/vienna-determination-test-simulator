<script lang="ts">
  import { type ControlId, type ControlOptions, loadControls, saveControls } from '$lib/controls';
  import Button from './Button.svelte';

  const controlLabels: Record<ControlId, string> = {
    soundDeep: 'Deep tone (boop)',
    soundHigh: 'High tone (beep)',
    colorRed: 'Red',
    colorBlue: 'Blue',
    colorWhite: 'White',
    colorGreen: 'Green',
    colorYellow: 'Yellow',
    pedalLeft: 'Left pedal',
    pedalRight: 'Right pedal',
  };

  let controls = $state<Record<ControlId, { key: string; code: string; }>>(loadControls());
  let editingControlId = $state<undefined | ControlId>(undefined);

  function onWindowKeydown(event: KeyboardEvent) {
    if (!editingControlId) {
      return;
    }

    const controlWithSameKey = Object.entries(controls)
                                     .filter(([id, _]) => id !== editingControlId)
                                     .find(([_, options]) => options.code === event.code);
    if (controlWithSameKey) {
      return;
    }

    controls[editingControlId] = { key: event.key, code: event.code };
    editingControlId = undefined;
    saveControls(controls);
  }

  function startEdit(controlId: ControlId) {
    editingControlId = controlId;
  }

  function cancelEdit() {
    editingControlId = undefined;
  }

  function getControlsWithType() {
    return Object.entries(controls) as [ControlId, ControlOptions][];
  }

  function playSound(controlId: ControlId) {
    const audio = new Audio(`/sounds/${controlId as string}.wav`);
    audio.play();
  }
</script>

<svelte:window onkeydown={onWindowKeydown}/>

<div class="flex flex-col gap-2 w-full">
    {#if editingControlId}
        <div class="flex flex-col items-center w-full">
            <p class="text-lg">
                Press any key to set the keybinding for <span class="font-bold">{controlLabels[editingControlId]}</span>.
            </p>
        </div>
    {/if}
    <div class="flex flex-col gap-2 w-full">
        {#each getControlsWithType() as control}
            <div class="flex flex-row items-center justify-between w-full p-4 rounded-sm border border-stone-400">
                <div class="flex flex-row items-center gap-4">
                    <p>{controlLabels[control[0]]}</p>
                    {#if control[0] === 'soundDeep' || control[0] === 'soundHigh'}
                        <button class="cursor-pointer hover:scale-[1.1] transition-all"
                                onclick={() => playSound(control[0])} aria-label=".">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                            </svg>
                        </button>
                    {/if}
                </div>
                <div class="flex flex-row items-center gap-4">
                    <p>{control[1].key}</p>
                    {#if editingControlId === control[0]}
                        <Button label="Cancel edit" size="sm" onClick={() => cancelEdit()}/>
                    {:else}
                        <Button label="Edit" size="sm" onClick={() => startEdit(control[0])}/>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
