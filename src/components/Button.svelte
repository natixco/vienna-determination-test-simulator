<script lang="ts">
  let { label, onClick, size } = $props<{
    label: string;
    onClick?: () => void;
    size: 'sm' | 'base';
  }>();
</script>

<button onclick={() => onClick()}
        class={[
            'bg-stone-900 text-stone-50 rounded-sm font-medium text-sm cursor-pointer tracking-wider',
            {
                'h-10 px-10 ': size === 'base',
                'py-1 px-4': size === 'sm',
            }
        ]}>
    {label}
</button>