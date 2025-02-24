<script lang="ts">
  import { locales, setLocale } from '$lib/translations';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  function switchLanguage(newLocale: string) {
    const url = new URL(window.location.href);
    const currentPath = url.pathname.split('/').filter(Boolean);

    if (currentPath[0] === page.params.lang) {
      currentPath.shift();
    }

    url.pathname = `/${newLocale}${currentPath.length ? '/' + currentPath.join('/') : ''}`;
    goto(url);
    setLocale(newLocale);
  }
</script>

<div class="flex gap-2">
    {#each locales.get() as loc}
        <button class={[
                'px-2 py-1 rounded-sm font-medium text-sm tracking-wider cursor-pointer',
                page.params.lang === loc
                    ? 'bg-stone-900 text-stone-50'
                    : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
            ]}
            onclick={() => switchLanguage(loc)}>
            {loc.toUpperCase()}
        </button>
    {/each}
</div> 