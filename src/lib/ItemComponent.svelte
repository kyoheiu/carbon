<script lang="ts">
	import type { Item } from './types';
	import DialogToDelete from './DialogToDelete.svelte';
	import moment from 'moment';
	import { encode } from 'js-base64';

	const toDuration = (time: number) => {
		return moment.unix(time).fromNow();
	};

	export let item: Item;
	let hidden = false;
</script>

{#if !hidden}
	<div class="card w-60 bg-surface-100 p-4">
		<div class="w-full overflow-ellipsis line-clamp-1 break-all mb-4">
			<a
				class="no-underline text-lg text-tertiary-700 font-semibold"
				title={item.desc}
				href="/item?file={encodeURIComponent(encode(item.name))}"
				>{item.name}
			</a>
		</div>
		<div class="flex justify-between items-end">
			<span class="text-sm text-surface-500">{toDuration(item.modified)}</span>
			<button
				class="chip variant-outline-error font-normal"
				on:click={() => (item.showModal = true)}
				title="delete"
			>
				Delete
			</button>
		</div>
		<DialogToDelete bind:showModal={item.showModal} bind:hidden item={item.name} reload={false} />
	</div>
{:else}
	<span class="hidden" />
{/if}
