<script lang="ts">
	import type { Item } from '$lib/types';
	import ItemComponent from '$lib/ItemComponent.svelte';
	import Items from '$lib/Items.svelte';

	interface PageData {
		result: Item[];
		query: string;
	}

	export let data: PageData;
</script>

<div class="mt-16" />
<div class="mb-4">Query: {data.query}</div>
{#if data.result}
	<Items items={data.result} />
{/if}
