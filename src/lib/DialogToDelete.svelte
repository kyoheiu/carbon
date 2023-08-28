<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';

	export let showModal: boolean;
	export let item: string;
	let dialog: HTMLDialogElement;

	const deleteItem = async () => {
		const res = await fetch('/api/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ fn: item })
		});
		if (!res.ok) {
			dialog.close();
			const message = await res.text();
			toast.error(`Error occured: ${message}`, {
				duration: 2000
			});
			return;
		}
		dialog.close();
		window.location.assign('/');
	};

	$: if (dialog && showModal) dialog.showModal();
</script>

<Toaster />
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<div class="m-auto">
	<dialog
		class="w-7/8 max-w-sm drop-shadow-2xl"
		bind:this={dialog}
		on:close={() => (showModal = false)}
		on:click|self={() => dialog.close()}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<div class="mb-2 break-all p-2">
				Are you sure to delete <b>{item}</b>?<br />
			</div>
			<hr class="text-border my-4" />
			<!-- svelte-ignore a11y-autofocus -->
			<div class="flex justify-between">
				<button class="px-1 text-sm" on:click={() => dialog.close()}>Cancel</button>
				<button
					class="rounded bg-warning px-2 py-1 text-sm text-itembackground"
					on:click={() => deleteItem()}>Delete</button
				>
			</div>
		</div>
	</dialog>
</div>
