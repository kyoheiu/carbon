<script lang="ts">
	import ItemComponent from '$lib/ItemComponent.svelte';
	import type { PageData } from './$types';

	let showAll = false;

	export let data: PageData;

	const showAllData = async () => {
		showAll = true;
		const res = await fetch('/api/showall');
		data = await res.json();
	};
</script>

<svelte:head>
	<title>carbon</title>
</svelte:head>
{#if data.result.length > 0}
	{#each data.result as item}
		<ItemComponent {item} />
	{/each}
	{#if !showAll}
		<button
			class="mt-4 mb-4 border border-further bg-itembackground px-2 py-1 text-sm font-semibold text-basecolor"
			on:click={showAllData}
			title="show all">Show all</button
		>
	{:else}
		<div class="mt-8" />
	{/if}
{/if}
