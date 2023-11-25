<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import ItemComponent from '$lib/ItemComponent.svelte';
	import type { PageData } from './$types';
	import Items from '$lib/Items.svelte';

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
<main class="flex flex-col items-center">
	<Header />
	<div class="mt-16" />
	{#if data.result.length > 0}
		<Items items={data.result} />
		{#if data.hasMany && !showAll}
			<button class="chip variant-filled-secondary my-4" on:click={showAllData} title="show all"
				>Show all</button
			>
		{:else}
			<div class="mt-8" />
		{/if}
	{/if}
</main>
