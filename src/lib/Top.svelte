<script lang="ts">
  import ItemComponent from "./ItemComponent.svelte";
  import { state, seeMoreItem, DEFAULT_LIST_NUMBER } from "./stores";
</script>

<div class="flex flex-col items-center">
  {#if $state.queryFixed}
    <div class="mt-4">Query: {$state.queryFixed}</div>
  {/if}
</div>
<div class="flex flex-col items-center">
  {#if $state.items.length > DEFAULT_LIST_NUMBER && !$state.queryFixed && !$state.showAll}
    <button
      class="mb-4 rounded border border-further bg-itembackground px-2 py-1 text-xs font-semibold text-basecolor"
      on:click={seeMoreItem}
      title="show all">Show all</button
    >
  {/if}
</div>
