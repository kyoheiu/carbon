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
			body: JSON.stringify({ file: item })
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
		class="p-4 w-60 max-w-sm drop-shadow-2xl"
		bind:this={dialog}
		on:close={() => (showModal = false)}
		on:click|self={() => dialog.close()}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<div class="mb-6 break-all">
				Are you sure to delete <b>{item}</b>?<br />
			</div>
			<div class="flex justify-between">
				<button class="font-semibold px-1" on:click={() => dialog.close()}>Cancel</button>
				<button
					class="font-semibold bg-warning px-2 py-1 text-itembackground"
					on:click={() => deleteItem()}>Delete</button
				>
			</div>
		</div>
	</dialog>
</div>
