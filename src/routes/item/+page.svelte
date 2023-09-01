<script lang="ts">
	import type { ItemContent } from '$lib/types';
	import { marked } from 'marked';
	import DialogToDelete from '$lib/DialogToDelete.svelte';
	import { toast, Toaster } from 'svelte-french-toast';
	import { afterNavigate } from '$app/navigation';

	let showMenu = false;
	let showModal = false;
	let edited = false;

	export let data: ItemContent;

	let newName = data.fileName;

	export const save = async () => {
		if (newName === '') {
			toast.error('File name required.', {
				duration: 2000
			});
			return;
		}
		const res = await fetch(`/api/save`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				original: data.fileName,
				new: newName,
				content: data.content
			})
		});

		if (!res.ok) {
			const message = await res.text();
			toast.error(`Error occured: ${message}`, {
				duration: 2000
			});
			return;
		}

		toast.success('Saved.', {
			duration: 2000
		});

		data.fileName = newName;
		edited = false;
	};

	const detectChange = () => {
		edited = true;
	};

	const keyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && e.ctrlKey) {
			save();
		}
	};

	afterNavigate(() => {
		newName = data.fileName;
	})
</script>

<svelte:head>
	<title>{data.fileName} | carbon</title>
</svelte:head>
{#if data.err}
	<div class="p-4 text-sm text-center">
		File with this name does not exist: Possibly renamed.<br />
		<div class="mt-4"><a class="mt-4" href="/"> Go back home</a></div>
	</div>
{:else if data.editing}
	<Toaster />
	<div class="mt-2 flex min-h-full flex-col items-center justify-center">
		<div class="mb-2 flex w-full items-center py-2">
			<input
				class="h-8 w-32 border border-further px-2 font-mono text-sm shadow-inner sm:w-64 md:w-96"
				bind:value={newName}
				placeholder="file name"
				on:input={detectChange}
				on:keydown={(e) => keyDown(e)}
			/>
			<button
				class="ml-auto mr-2 h-6 w-12 border border-further bg-lightbuttontext px-2 py-1 text-xs font-semibold text-basecolor"
				on:click={() => (data.editing = false)}
				title="back to view">View</button
			>
			{#if !data.fileName && !data.content && !edited}
				<div class="h-6 w-16 bg-further text-center text-xs">...</div>
			{:else if edited}
				<button
					class="relative h-6 w-16 bg-basecolor px-1 py-1 text-xs font-semibold text-itembackground"
					on:click={save}
					title="click / tap to manually save"
				>
					Save
					<div
						class="rounded-full absolute bottom-4 left-14 w-3 h-3 bg-warning border-2 border-background"
					/>
				</button>
			{:else}
				<button
					class="h-6 w-16 bg-basecolor px-1 py-1 text-xs font-semibold text-lightbuttontext"
					title="click / tap to manually save"
				>
					Saved &#10003;
				</button>
			{/if}
		</div>
		<textarea
			class="break-all h-120 w-64 flex-grow border border-further p-3 font-mono text-sm shadow-inner outline-none sm:h-144 sm:w-120 md:w-144"
			contenteditable="true"
			bind:value={data.content}
			placeholder="Write here. Press <C-CR> to save."
			on:input={detectChange}
			on:keydown={(e) => keyDown(e)}
		/>
	</div>
{:else}
	<div class="mt-4 flex justify-center text-sm">
		<div class="flex w-64 items-center justify-center px-1 pb-2 sm:w-120 md:w-144">
			<div class="grow break-all border-l-4 border-baseborder pl-2 font-mono leading-5">
				{data.fileName}
			</div>
			<button
				on:click={() => (data.editing = true)}
				class="ml-2 h-6 w-12 bg-basecolor px-2 py-1 text-xs font-semibold text-lightbuttontext"
				title="edit">Edit</button
			>
			<div class="relative ml-4">
				<button
					class="text-xs"
					on:click={() => {
						showMenu = !showMenu;
					}}>•••</button
				>
				{#if showMenu}
					<div
						class="border border-further flex flex-col items-end p-3 absolute right-0 top-8 bg-itembackground drop-shadow-xl"
					>
						<div>
							<a class="text-sm no-underline" href="/api/download?fn={data.fileName}">Download</a>
						</div>
						<button
							class="text-sm text-warning mt-3"
							on:click={() => (showModal = true)}
							title="delete"
						>
							Delete
						</button>
					</div>
				{/if}
			</div>
		</div>
		<DialogToDelete bind:showModal item={data.fileName} />
	</div>

	<div class="flex min-h-full flex-col items-center">
		<div
			class="mb-6 mt-2 w-64 flex-grow break-all bg-itembackground p-3 font-mono text-sm sm:w-120 md:w-144"
		>
			{#if data.content.length === 0}
				<i>No contents.</i>
			{:else if data.fileName.split('.').pop() === 'md'}
				<!-- eslint-disable -->
				{@html marked.parse(data.content)}
			{:else}
				{#each data.content.split('\n') as line}
					{line}<br />
				{/each}
			{/if}
		</div>
	</div>
{/if}
