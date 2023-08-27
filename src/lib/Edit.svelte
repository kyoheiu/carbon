<script lang="ts">
  import { state, reviewItem } from "./stores";
  import { get } from "svelte/store";
  import { toast, Toaster } from "svelte-french-toast";
  import { onDestroy } from "svelte";

  const ms = 2000;

  let edited = false;

  export const save = async () => {
    const s = get(state);
    const fileName = s.fileName;
    const newName = s.newName;
    if (fileName === "" && !newName) {
      toast.error("File name required.", {
        duration: 2000,
      });
      return;
    }
    const res = await fetch(`/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original: fileName,
        new: newName,
        content: s.content,
      }),
    });

    if (!res.ok) {
      const message = await res.text();
      toast.error(`Error occured: ${message}`, {
        duration: 2000,
      });
      return;
    }

    state.update((s) => {
      return {
        ...s,
        fileName: newName,
        content: s.content,
      };
    });

    toast.success("Saved.", {
      duration: 2000,
    });

    edited = false;
  };

  const detectChange = () => {
    edited = true;
  };

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      save();
    }
  };

  // const interval = setInterval(() => {
  //   const s = get(state);
  //   if (s.newName && edited) {
  //     save();
  //     edited = false;
  //   }
  // }, ms);

  // onDestroy(() => clearInterval(interval));
</script>

<Toaster />
<div class="mt-2 flex min-h-full flex-col items-center justify-center">
  <div class="mb-2 flex w-full items-center py-2">
    <input
      class="h-8 w-32 border border-further px-2 font-mono text-sm shadow-inner sm:w-64 md:w-96"
      bind:value={$state.newName}
      placeholder="file name"
      on:input={detectChange}
      on:keydown={(e) => keyDown(e)}
    />
    <button
      class="ml-auto mr-2 h-6 w-12 rounded border border-further bg-lightbuttontext px-2 py-1 text-xs font-semibold text-basecolor"
      on:click={reviewItem}
      title="back to view">View</button
    >
    {#if !$state.newName && !$state.content && !edited}
      <div class="h-6 w-16 rounded bg-further text-center text-xs">...</div>
    {:else if edited}
      <button
        class="relative h-6 w-16 rounded bg-basecolor px-1 py-1 text-xs font-semibold text-itembackground"
        on:click={save}
        title="click / tap to manually save"
      >
        Save
        <div class="absolute bottom-4 left-14 w-3 h-3 rounded-full bg-warning border-2 border-background" />
      </button>
    {:else}
      <button
        class="h-6 w-16 rounded bg-basecolor px-1 py-1 text-xs font-semibold text-lightbuttontext"
        title="click / tap to manually save"
      >
        Saved &#10003;
      </button>
    {/if}
  </div>
  <textarea
    class="h-120 w-64 flex-grow border border-further p-3 font-mono text-sm shadow-inner outline-none sm:h-144 sm:w-120 md:w-144"
    contenteditable="true"
    bind:value={$state.content}
    placeholder="Write here. Press <C-CR> to save."
    on:input={detectChange}
    on:keydown={(e) => keyDown(e)}
  />
</div>
