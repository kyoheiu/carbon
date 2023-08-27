<script lang="ts">
  import { get } from "svelte/store";
  import { state, editItem } from "./stores";
  import Showdown from "showdown";
  import DialogToDelete from "./DialogToDelete.svelte";
  const converter = new Showdown.Converter();

  let showMenu = false;
  let showModal = false;

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
</script>

<div class="mt-4 flex justify-center text-sm">
  <div
    class="flex w-64 items-center justify-center px-1 pb-2 sm:w-120 md:w-144"
  >
    <div
      class="grow break-all border-l-4 border-baseborder pl-2 font-mono leading-5"
    >
      {$state.fileName}
    </div>
    <button
      class="ml-2 h-6 w-12 rounded bg-basecolor px-2 py-1 text-xs font-semibold text-lightbuttontext"
      on:click={editItem}
      title="edit">Edit</button
    >
    <div class="relative ml-4">
      <button
      class="text-xs"
        on:click={() => {
          showMenu = !showMenu;
        }}>•••</button
      >
      {#if showMenu}
        <div class=" flex flex-col items-end p-2 absolute right-0 top-8 rounded bg-itembackground drop-shadow-xl ">
          <div>
            <a
              class="text-sm no-underline"
              href="/item/download?item={$state.fileName}">Download</a
            >
          </div>
          <button
            class="text-sm text-warning mt-2"
            on:click={() => (showModal = true)}
            title="delete"
          >
            Delete
          </button>
        </div>
      {/if}
    </div>
  </div>
  <DialogToDelete bind:showModal item={$state.fileName} />
</div>

<div class="flex min-h-full flex-col items-center">
  <div
    class="mb-6 mt-2 w-64 flex-grow break-words rounded-md bg-itembackground p-3 font-mono text-sm sm:w-120 md:w-144"
  >
    {#if $state.content.length === 0}
      <i>No contents.</i>
    {:else if $state.fileName.split(".").pop() === "md"}
      {@html converter.makeHtml(get(state).content)}
    {:else}
      {#each $state.content.split("\n") as line}
        {line}<br />
      {/each}
    {/if}
  </div>
</div>
