<script lang="ts">
  import DialogToDelete from "./DialogToDelete.svelte";
  import Top from "./Top.svelte";
  import { Page, addItem, editItem, searchItem, state } from "./stores";

  let showModal = false;
</script>

<div
  class="sticky z-0 top-0 flex w-full flex-col items-center bg-itembackground text-sm shadow"
>
  <div class="flex h-12 w-64 items-baseline pt-2 sm:w-120 md:w-144">
    <a class=" no-underline" href="/">miles</a>
    &nbsp; &nbsp;
    {#if $state.page === Page.Top}
      <button
        on:click={addItem}
        title="add a new file"
        class="h-6 rounded bg-basecolor px-2 py-1 text-xs font-semibold text-lightbuttontext"
        >+New</button
      >
    {:else}
      <button
        on:click={addItem}
        title="add a new file"
        class="h-6 rounded border border-further bg-lightbuttontext px-2 py-1 text-xs font-semibold text-basecolor"
        >+New</button
      >
    {/if}
    &nbsp; &nbsp;
    <div class="ml-auto">
      <input
        name="search"
        placeholder="Search"
        class="w-32 rounded-full bg-background px-3 py-1"
        bind:value={$state.query}
        on:keydown={(e) => e.key === "Enter" && searchItem()}
      />
    </div>
  </div>
</div>
