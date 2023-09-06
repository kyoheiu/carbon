<script lang="ts">
	import type { ItemContent } from '$lib/types';
	import { marked } from 'marked';
	import DialogToDelete from '$lib/DialogToDelete.svelte';
	import { toast, Toaster } from 'svelte-french-toast';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let showMenu = false;
	let showModal = false;
	let edited = false;
	let detectScroll = 0;

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

	const toEdit = async () => {
		const scroll = window.scrollY;
		data.editing = true;
		await tick();
		const textarea = document.getElementById('textarea');
		if (textarea) {
			textarea.scrollTop = scroll;
		}
	};

	const toView = async () => {
		const textarea = document.getElementById('textarea');
		if (textarea) {
			const scroll = textarea.scrollTop;
			data.editing = false;
			await tick();
			window.scroll(0, scroll);
		}
	};

	afterNavigate(() => {
		newName = data.fileName;
	});
</script>

<svelte:window on:scroll={() => (detectScroll = window.scrollY)} />
<svelte:head>
	<title>{data.fileName} | carbon</title>
</svelte:head>
{#if data.err}
	<div class="p-4 text-center">
		File with this name does not exist: Possibly renamed.<br />
		<div class="mt-4"><a class="mt-4" href="/"> Go back home</a></div>
	</div>
{:else if data.editing}
	<Toaster />
	<div class="mt-2 flex min-h-full flex-col items-center justify-center">
		<div class="mb-2 flex w-full items-center py-2">
			<input
				class="h-8 w-32 border border-further px-2 font-mono shadow-inner sm:w-64 md:w-96"
				bind:value={newName}
				placeholder="file name"
				on:input={detectChange}
				on:keydown={(e) => keyDown(e)}
			/>
			<button
				class="ml-auto mr-2 py-1 w-12 border border-baseborder bg-lightbuttontext px-2 text-sm font-semibold text-basecolor"
				on:click={() => toView()}
				title="back to view">View</button
			>
			{#if !data.fileName && !data.content && !edited}
				<div class="py-1 w-16 bg-further text-center text-sm">...</div>
			{:else if edited}
				<button
					class="relative w-16 bg-basecolor px-1 py-1 text-sm font-semibold text-itembackground"
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
					class="w-16 bg-basecolor px-1 py-1 text-sm font-semibold text-lightbuttontext"
					title="click / tap to manually save"
				>
					Saved
				</button>
			{/if}
		</div>
		<textarea
			id="textarea"
			class="break-all h-120 w-64 flex-grow border border-further p-3 font-mono shadow-inner outline-none sm:h-144 sm:w-120 md:w-144"
			contenteditable="true"
			bind:value={data.content}
			placeholder="Write here. Press <C-CR> to save."
			on:input={detectChange}
			on:keydown={(e) => keyDown(e)}
		/>
	</div>
{:else}
	<div class="mt-4 flex justify-center">
		<div class="flex w-64 items-center justify-center px-1 pb-2 sm:w-120 md:w-144">
			<div class="grow break-all border-l-4 border-baseborder pl-2 font-mono leading-5">
				{data.fileName}
			</div>
			<button
				on:click={() => (data.editing = true)}
				class="ml-2 py-1 w-12 bg-basecolor px-2 text-sm font-semibold text-lightbuttontext"
				title="edit">Edit</button
			>
			<div class="relative ml-4">
				<button
					class="text-sm"
					on:click={() => {
						showMenu = !showMenu;
					}}>•••</button
				>
				{#if showMenu}
					<div
						class="z-50 border border-further flex flex-col items-end p-3 absolute right-0 top-8 bg-itembackground drop-shadow-xl"
					>
						<div>
							<a class="no-underline" href="/api/download?file={data.fileName}">Download</a>
						</div>
						<button class="text-warning mt-3" on:click={() => (showModal = true)} title="delete">
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
			class="relative mb-20 mt-2 w-64 flex-grow break-all bg-itembackground p-3 sm:w-120 md:w-144"
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
	{#if detectScroll > 60}
		<div class="absolute w-64 sm:w-120 md:w-144 flex justify-end px-2">
			<button
				transition:scale={{ duration: 150, delay: 50, opacity: 0, start: 0, easing: quintOut }}
				on:click={() => toEdit()}
				class="bottom-6 rounded-full w-12 h-12 bg-basecolor text-sm text-lightbuttontext font-semibold fixed z-90"
				>Edit</button
			>
		</div>
	{/if}
{/if}
