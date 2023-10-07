<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
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
<main class="flex min-h-screen flex-col items-center">
	<Header />
	{#if data.result.length > 0}
		{#each data.result as item}
			<ItemComponent {item} />
		{/each}
		{#if data.hasMany && !showAll}
			<button
				class="rounded mt-4 mb-4 border border-further bg-background px-2 py-1 text-sm font-semibold text-basecolor"
				on:click={showAllData}
				title="show all">Show all</button
			>
		{:else}
			<div class="mt-8" />
		{/if}
	{/if}
</main>
