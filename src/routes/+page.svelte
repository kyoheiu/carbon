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
	<div class="mt-16" />
	{#if data.result.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-6">
			{#each data.result as item}
				<ItemComponent {item} />
			{/each}
		</div>
		{#if data.hasMany && !showAll}
			<button class="chip variant-filled-secondary my-4" on:click={showAllData} title="show all"
				>Show all</button
			>
		{:else}
			<div class="mt-8" />
		{/if}
	{/if}
</main>
