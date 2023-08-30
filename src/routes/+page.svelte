<script lang="ts">
	import { DEFAULT_LIST_NUMBER } from '$lib/types';
	import ItemComponent from '$lib/ItemComponent.svelte';
	import type { PageData } from './$types';

	let showAll = false;

	export let data: PageData;
</script>

<svelte:head>
	<title>carbon</title>
</svelte:head>
{#each showAll ? data.result : data.result.slice(0, DEFAULT_LIST_NUMBER) as item}
	<ItemComponent {item} />
{/each}
{#if !showAll}
	<button
		class="mt-4 mb-4 border border-further bg-itembackground px-2 py-1 text-xs font-semibold text-basecolor"
		on:click={() => (showAll = true)}
		title="show all">Show all</button
	>
{/if}
