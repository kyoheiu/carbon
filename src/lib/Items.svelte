<script lang="ts">
	import ItemComponent from './ItemComponent.svelte';
	import type { Item } from './types';

	export let items: Item[];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-6">
	{#each items as item}
		<ItemComponent {item} />
	{/each}
</div>
