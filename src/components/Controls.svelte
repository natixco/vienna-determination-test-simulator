<script lang="ts">
  import { type ControlId, type ControlOptions, loadControls, saveControls } from '$lib/controls';

  const controlLabels: Record<string, string> = {
    soundDeep: 'Deep tone (boop)',
    soundHigh: 'High tone (beep)',
    red: 'Red',
    blue: 'Blue',
    white: 'White',
    green: 'Green',
    yellow: 'Yellow',
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
                <p>{controlLabels[control[0]]}</p>
                <div class="flex flex-row items-center gap-4">
                    <p>{control[1].key}</p>
                    {#if editingControlId === control[0]}
                        <button class="py-1 px-4 bg-stone-900 text-stone-50 rounded-sm font-medium text-sm cursor-pointer tracking-wider"
                                onclick={() => cancelEdit()}>
                            Cancel edit
                        </button>
                    {:else}
                        <button class="py-1 px-4 bg-stone-900 text-stone-50 rounded-sm font-medium text-sm cursor-pointer tracking-wider"
                                onclick={() => startEdit(control[0])}>
                            Edit
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
