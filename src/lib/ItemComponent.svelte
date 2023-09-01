<script lang="ts">
	import type { Item } from './types';
	import DialogToDelete from './DialogToDelete.svelte';
	import moment from 'moment';
	import { encode } from 'js-base64';

	const toDuration = (time: number) => {
		return moment.unix(time).fromNow(true);
	};

	export let item: Item;
</script>

<div class="mt-4 flex flex-col items-center">
	<div class="flex h-20 w-64 items-center bg-itembackground px-2 shadow sm:w-120 md:w-144">
		<div class="ml-2 flex flex-col items-start">
			<a
				href="/item?fn={encodeURIComponent(encode(item.name))}"
				class="w-40 cursor-pointer truncate text-left text-sm underline hover:text-hovertitle sm:w-72 sm:text-base md:w-96"
				>{item.name}</a
			>
			{#if item.desc}
				<div class="mt-2 w-40 truncate text-sm text-desc sm:w-72 md:w-96">
					{item.desc}
				</div>
			{:else}
				<div class="mt-2 w-40 truncate text-sm italic text-desc sm:w-72 md:w-96">No contents.</div>
			{/if}
		</div>
		<span class="ml-2 w-12 text-right text-xs text-subtle sm:w-20">{toDuration(item.modified)}</span
		>
		<button
			class="ml-4 mr-2 hidden w-12 border border-further px-1 py-1 text-xs text-warning sm:inline"
			on:click={() => (item.showModal = true)}
			title="delete"
		>
			Delete
		</button>
		<DialogToDelete bind:showModal={item.showModal} item={item.name} />
	</div>
</div>
