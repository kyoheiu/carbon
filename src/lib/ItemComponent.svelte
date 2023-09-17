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

<div class="mt-1 sm:mt-4 rounded flex h-24 items-center bg-background w-full sm:w-120 md:w-144">
	<div class="mx-2 flex flex-col items-start">
		<div class="w-full sm:w-72 md:w-96 overflow-ellipsis line-clamp-1 break-all">
			<a
				class="no-underline font-mono text-lg hover:text-hovertitle hover:font-semibold"
				href="/item?file={encodeURIComponent(encode(item.name))}"
				>{item.name}
			</a>
		</div>
		{#if item.desc}
			<div class="mt-3 w-full overflow-ellipsis line-clamp-1 text-desc sm:w-72 md:w-96">
				{item.desc}
			</div>
		{:else}
			<div class="mt-3 w-full truncate italic text-desc sm:w-72 md:w-96">No contents.</div>
		{/if}
	</div>
	<span class="hidden sm:inline ml-2 w-12 text-right text-sm text-subtle sm:w-20"
		>{toDuration(item.modified)}</span
	>
	<button
		class="text-xs ml-4 mr-2 hidden w-12 border border-further px-1 py-1 text-warning sm:inline"
		on:click={() => (item.showModal = true)}
		title="delete"
	>
		Delete
	</button>
	<DialogToDelete bind:showModal={item.showModal} item={item.name} />
</div>
