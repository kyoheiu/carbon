<script lang="ts">
	import type { Item } from '$lib/types';
	import ItemComponent from '$lib/ItemComponent.svelte';

	interface PageData {
		result: Item[];
		query: string;
	}

	export let data: PageData;
</script>

<div class="mt-16" />
<div class="mb-4">Query: {data.query}</div>
{#if data.result}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		{#each data.result as item}
			<ItemComponent {item} />
		{/each}
	</div>
{/if}
