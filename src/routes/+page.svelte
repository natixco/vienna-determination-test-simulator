<script lang="ts">
  import Instructions from '../components/Instructions.svelte';
  import PseudoSignalControls from '../components/PseudoSignalControls.svelte';
  import GameControls from '../components/GameControls.svelte';
  import Results from '../components/Results.svelte';
  import Keybindings from '../components/Keybindings.svelte';
</script>

<svelte:head>
    <title>Vienna Determination Test</title>
</svelte:head>

<h1 class="text-zinc-900 font-bold text-2xl my-10">
    Vienna Determination Test
</h1>

<div class="flex flex-col gap-20 pb-10">
    <Instructions/>
    <PseudoSignalControls/>
    <GameControls/>
    <Results/>
    <Keybindings/>
</div>
