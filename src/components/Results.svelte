<script lang="ts">
  import { loadResults } from '$lib/results/index.js';
  import { t } from '$lib/translations';

  const results = loadResults();
    const speedLabels: Record<string, string> = {
      slow: $t('SPEED.SLOW'),
      medium: $t('SPEED.MEDIUM'),
      fast: $t('SPEED.FAST')
    };
</script>

{#if results.length > 0}
    <div class="flex flex-col gap-4">
        <h2 class="text-xl font-semibold">{$t('RESULTS.TITLE')}</h2>
        <div class="grid grid-cols-1 gap-4">
            {#each results.reverse() as result}
                <div class="bg-stone-200 p-4 rounded-sm border border-stone-400">
                    <div class="text-sm text-stone-600">
                        {new Date(result.timestamp).toLocaleString()}
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.SPEED')}</div>
                            <div class="font-medium text-stone-900">{speedLabels[result.speed]}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.TOTAL')}</div>
                            <div class="font-medium text-stone-900">{result.total}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.CORRECT')}</div>
                            <div class="font-medium text-stone-900">{result.correct}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.AVG_RESPONSE')}</div>
                            <div class="font-medium text-stone-900">{result.averageResponseTime}ms</div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}