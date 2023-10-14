<script lang="ts">
	import type { Item } from './types';
	import DialogToDelete from './DialogToDelete.svelte';
	import moment from 'moment';
	import { encode } from 'js-base64';

	const toDuration = (time: number) => {
		return moment.unix(time).fromNow(true);
	};

	export let item: Item;
	let hidden = false;
</script>

{#if !hidden}
<div class="mt-1 flex h-24 items-center w-full sm:w-120 md:w-144 border-b border-hr">
	<div class="mr-2 ml-2 sm:ml-0 flex flex-col items-start">
		<div class="w-full sm:w-72 md:w-96 overflow-ellipsis line-clamp-1 break-all">
			<a
				class="no-underline font-mono text-lg text-hovertitle font-semibold"
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
		class="rounded text-xs ml-4 mr-2 sm:mr-0 hidden w-12 border border-further px-1 py-1 text-warning sm:inline"
		on:click={() => (item.showModal = true)}
		title="delete"
	>
		Delete
	</button>
	<DialogToDelete bind:showModal={item.showModal} bind:hidden={hidden} item={item.name} reload={false} />
</div>
{:else}
<span class="hidden" />
{/if}
