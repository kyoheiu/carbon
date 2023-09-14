<script lang="ts">
	import '../../app.css';
	import type { ItemContent } from '$lib/types';
	import { marked } from 'marked';
	import DialogToDelete from '$lib/DialogToDelete.svelte';
	import { toast, Toaster } from 'svelte-french-toast';
	import { afterNavigate } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import renderMathInElement from 'katex/contrib/auto-render';
	import Header from '$lib/Header.svelte';

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
		renderMath();
	};

	const renderMath = () => {
		const el = document.getElementById('content');
		if (el) {
			renderMathInElement(el, {
				// customised options
				// • auto-render specific keys, e.g.:
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '$', right: '$', display: false },
					{ left: '\\(', right: '\\)', display: false },
					{ left: '\\[', right: '\\]', display: true }
				],
				// • rendering keys, e.g.:
				throwOnError: false
			});
		}
	};

	onMount(() => {
		renderMath();
	});

	afterNavigate(() => {
		newName = data.fileName;
	});
</script>

<svelte:window on:scroll={() => (detectScroll = window.scrollY)} />
<svelte:document on:load={renderMath} />
<svelte:head>
	<title>{data.fileName} | carbon</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>

{#if data.err}
	<!-- file name not found. -->
	<main class="flex min-h-screen flex-col items-center">
		<Header />
		<div class="p-4 text-center">
			File with this name does not exist: Possibly renamed.<br />
			<div class="mt-4"><a class="mt-4" href="/"> Go back home</a></div>
		</div>
	</main>
{:else if data.editing}
	<!-- edit mode -->
	<main class=" bg-itembackground flex min-h-screen flex-col items-center">
		<Header />
		<Toaster />
		<div class="mt-4 flex flex-col justify-center">
			<div
				class="h-12 w-full px-3 sm:px-0 sm:w-120 md:w-144 flex bg-itembackground items-center py-2"
			>
				<input
					class="input-filename"
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
					<div class="rounded py-1 w-16 bg-further text-center text-sm">Save</div>
				{:else if edited}
					<button
						class="relative w-16 bg-basecolor px-1 py-1 text-sm font-semibold text-itembackground"
						on:click={save}
						title="click / tap to manually save"
					>
						Save
						<div
							class="rounded-full absolute bottom-4 left-12 w-3 h-3 bg-warning border-2 border-background"
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
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
				class="rounded mb-8 mt-4 whitespace-pre-wrap break-words w-full p-3 bg-background font-mono outline-none sm:w-120 md:w-144"
				bind:value={data.content}
				placeholder="Write here. Press <Ctrl + Enter> to save."
				on:input={detectChange}
				on:keydown={(e) => keyDown(e)}
			/>
		</div>
	</main>
{:else}
	<!-- view mode -->
	<main class="flex min-h-screen flex-col items-center">
		<Header />
		<div class="mt-4 flex justify-center">
			<div class="h-12 w-full px-3 sm:px-0 sm:w-120 md:w-144 flex bg-background items-center py-2">
				<div class="text-xl view-header font-mono break-all leading-5 line-clamp-2">
					{data.fileName}
				</div>
				<button
					on:click={() => (data.editing = true)}
					class="ml-4 sm:ml-auto py-1 w-12 bg-basecolor px-2 text-sm font-semibold text-lightbuttontext"
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
							class="rounded z-50 border border-further flex flex-col items-end p-3 absolute right-0 top-8 bg-background drop-shadow-xl"
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

		<div id="content" class="flex min-h-full flex-col items-center">
			<div
				class="relative view mb-24 mt-4 w-full px-3 sm:px-0 flex-grow break-words sm:w-120 md:w-144"
			>
				{#if data.content.length === 0}
					<i>No contents.</i>
				{:else if data.fileName.split('.').pop() === 'md'}
					<!-- eslint-disable -->
					{@html marked.parse(data.content)}
				{:else}
					<span class="whitespace-pre-wrap">{data.content}</span>
				{/if}
			</div>
		</div>
		{#if detectScroll > 60}
			<div class="absolute w-full sm:w-120 md:w-144 flex justify-end px-2">
				<button
					transition:scale={{ duration: 200, delay: 50, opacity: 0, start: 0, easing: quintOut }}
					on:click={toEdit}
					class="bottom-6 rounded-full w-12 h-12 bg-basecolor text-sm text-lightbuttontext font-semibold fixed shadow"
					><img src="edit.svg" alt="Edit" /></button
				>
			</div>
		{/if}
	</main>
{/if}
