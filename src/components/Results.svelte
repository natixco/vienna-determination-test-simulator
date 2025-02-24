<script>
    import { loadResults } from "$lib/results/index.js";

    const results = loadResults();
</script>

{#if results.length > 0}
    <div class="flex flex-col gap-4">
        <h2 class="text-xl font-semibold">Previous results</h2>
        <div class="grid grid-cols-1 gap-4">
            {#each results.slice(-5).reverse() as result}
                <div class="bg-stone-200 p-4 rounded-sm border border-stone-400">
                    <div class="text-sm text-stone-600">
                        {new Date(result.timestamp).toLocaleString()}
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                        <div>
                            <div class="text-sm text-stone-600">Speed</div>
                            <div class="font-medium text-stone-900">{result.speed}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">Total</div>
                            <div class="font-medium text-stone-900">{result.total}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">Correct</div>
                            <div class="font-medium text-stone-900">{result.correct}</div>
                        </div>
                        <div>
                            <div class="text-sm text-stone-600">Avg Response</div>
                            <div class="font-medium text-stone-900">{result.averageResponseTime}ms</div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}