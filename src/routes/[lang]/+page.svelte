<script lang="ts">
  import { t } from '$lib/translations/index.js';
  import Instructions from '../../components/Instructions.svelte';
  import PseudoSignalControls from '../../components/PseudoSignalControls.svelte';
  import TestSettings from '../../components/TestSettings.svelte';
  import Results from '../../components/Results.svelte';
  import Keybindings from '../../components/Keybindings.svelte';
  import LanguageSwitcher from '../../components/LanguageSwitcher.svelte';
</script>

<svelte:head>
    <title>{$t('TITLE')}</title>
</svelte:head>

<div class="flex flex-row items-center justify-between w-full">
    <h1 class="text-zinc-900 font-bold text-2xl my-10">
        {$t('TITLE')}
    </h1>
    <LanguageSwitcher/>
</div>

<div class="flex flex-col gap-20 pb-10">
    <Instructions/>
    <PseudoSignalControls/>
    <TestSettings/>
    <Results/>
    <Keybindings/>
</div>
