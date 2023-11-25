<script lang="ts">
	import ItemComponent from './ItemComponent.svelte';
	import type { Item } from './types';

	export let items: Item[];
</script>

<div class="sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 space-y-4 items-baseline">
	{#each items as item}
		<ItemComponent {item} />
	{/each}
</div>
