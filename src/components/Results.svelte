<script lang="ts">
  import { loadResults } from '$lib/results/index.js';
  import { t } from '$lib/translations';

  const results = loadResults();

  function getSpeedLabel(speed: string): string {
    const labels: Record<string, string> = {
      slow: $t('SPEED.SLOW'),
      medium: $t('SPEED.MEDIUM'),
      fast: $t('SPEED.FAST')
    }
    return labels[speed];
  }
</script>

{#if results.length > 0}
    <div class="flex flex-col gap-4 w-full">
        <div class="grid grid-cols-1 gap-4">
            {#each results.reverse() as result}
                <div class="bg-stone-200 p-4 rounded-md border border-stone-400 flex flex-col gap-6">
                    <div class="text-sm text-stone-600">
                        {new Date(result.timestamp).toLocaleString()}
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.SPEED')}</div>
                            <div class="font-medium text-stone-900">{getSpeedLabel(result.speed)}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.TOTAL')}</div>
                            <div class="font-medium text-stone-900">{result.total ?? 0}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.CORRECT')}</div>
                            <div class="font-medium text-stone-900">{result.correct ?? 0}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.INCORRECT')}</div>
                            <div class="font-medium text-stone-900">{result.incorrect ?? 0}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.OMITTED')}</div>
                            <div class="font-medium text-stone-900">{result.omitted ?? 0}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">{$t('RESULTS.RESPONSE_TIMES')}</div>
                            <div class="font-medium text-stone-900">
                                {result.averageResponseTime ?? 0}ms / {result.medianResponseTime ?? 0}ms
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <div class="flex flex-col items-center justify-center text-center py-10">
        <p class="text-stone-900">No test results yet. Complete a test to see your performance history here.</p>
    </div>
{/if}