<script lang="ts">
	import type { Item } from '$lib/types';
	import ItemComponent from '$lib/ItemComponent.svelte';
	import type { PageData } from './$types';

	interface pageData {
		result: Item[];
		query: string;
	}

	export let data: PageData;
</script>

<div class="mt-4">Query: {data.query}</div>
{#if data.result}
	{#each data.result as item}
		<ItemComponent {item} />
	{/each}
{/if}
