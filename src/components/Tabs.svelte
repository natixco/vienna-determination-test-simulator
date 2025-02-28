<script lang="ts">
  let { tabs, activeTab, onTabChange } = $props<{
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
  }>();
</script>

<div class="flex gap-2 p-2 border border-stone-300 rounded-md bg-stone-200 mb-4">
    {#each tabs as tab}
        <button class={[
                'flex-1 px-4 py-1.5 rounded-md transition-colors cursor-pointer font-medium',
                activeTab === tab.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-transparent text-stone-900 hover:bg-stone-300'
            ]}
                onclick={() => onTabChange(tab.id)}
        >
            {tab.label}
        </button>
    {/each}
</div> 