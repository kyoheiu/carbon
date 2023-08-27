<script lang="ts">
  import type { Item } from "$lib/stores";
  import Header from "$lib/Header.svelte";
	import ItemComponent from "$lib/ItemComponent.svelte";
	import type { PageData } from "./$types";
  
  interface pageData {
    result: Item[]
  }

  export let data: PageData; 
</script>

<main class="flex min-h-screen flex-col items-center">
  <Header />
  <div class="grow">
    {#each data.result as item}
    <ItemComponent {item} />
    {/each}
    </div>
</main>
