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
		} else if (e.key === 'Enter') {
			const el = <HTMLTextAreaElement>document.getElementById('textarea');
			if (el) {
				const cursorPos = el.selectionEnd;
				for (let i = cursorPos; i >= 0; i--) {
					const char = data.content[i];
					if (char === `\n`) {
						const firstChar = data.content[i + 1];
						const secondChar = data.content[i + 2];
						setListMarker(el, firstChar, secondChar, cursorPos);
						break;
					} else if (i === 0) {
						const firstChar = data.content[0];
						const secondChar = data.content[1];
						setListMarker(el, firstChar, secondChar, cursorPos);
						break;
					} else {
						continue;
					}
				}
			}
		}
	};

	const setListMarker = (
		el: HTMLTextAreaElement,
		firstChar: string,
		secondChar: string,
		cursorPos: number
	) => {
		if ((firstChar === '-' || firstChar === '+' || firstChar === '*') && secondChar === ' ') {
			console.log('Found list.');
			el.setRangeText(`${firstChar} `, cursorPos, cursorPos);
			setTimeout(() => {
				el.selectionStart = el.selectionEnd = cursorPos + 3;
			}, 1);
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

	const checkUnsaved = (e: BeforeUnloadEvent) => {
		if (edited) {
			e.preventDefault();
			return '';
		}
	};
</script>

<svelte:window on:scroll={() => (detectScroll = window.scrollY)} on:beforeunload={checkUnsaved} />
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
		<div class="mt-16 flex flex-col justify-center">
			<div class="flex h-12 items-center py-2 sm:w-120 md:w-144">
				<input
					class="input-filename"
					bind:value={newName}
					placeholder="file name"
					on:input={detectChange}
					on:keydown={(e) => keyDown(e)}
				/>
				<button
					class="variant-filled-secondary chip ml-4 mr-2 w-12"
					on:click={() => toView()}
					title="back to view">View</button
				>
				{#if edited}
					<button
						class="variant-filled-warning chip w-16"
						on:click={save}
						title="click / tap to manually save"
					>
						Save
					</button>
				{:else}
					<span class="variant-filled-tertiary chip w-16"> Saved </span>
				{/if}
			</div>
			<textarea
				id="textarea"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
				class="textarea mb-8 mt-4 w-full whitespace-pre-wrap break-words p-4 font-mono outline-none sm:w-120 md:w-144"
				bind:value={data.content}
				placeholder="Write here. Press <Ctrl + Enter> to save."
				on:input={detectChange}
				on:keydown={(e) => keyDown(e)}
			/>
		</div>
	</main>
{:else}
	<!-- view mode -->
	<main class="flex flex-col items-center">
		<Header />
		<div class="mb-20 mt-16 flex w-full flex-col items-center">
			<div class="mb-6 mt-2 flex h-12 w-full items-center px-3 sm:w-120 sm:px-0 md:w-144">
				<div class="view-header line-clamp-2 break-all font-mono text-xl leading-6">
					{data.fileName}
				</div>
				<button
					on:click={() => (data.editing = true)}
					class="variant-filled-primary chip ml-auto"
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
							class="absolute right-0 top-8 z-50 flex flex-col items-end rounded bg-surface-800 p-3 text-surface-50 drop-shadow-xl"
						>
							<div>
								<a class="no-underline" href="/api/download?file={data.fileName}">Download</a>
							</div>
							<button
								class="mt-3 text-warning-200"
								on:click={() => (showModal = true)}
								title="delete"
							>
								Delete
							</button>
						</div>
					{/if}
				</div>
			</div>
			<DialogToDelete bind:showModal item={data.fileName} hidden={false} reload={true} />

			<div
				id="content"
				class="prose prose-gray w-full break-words px-3 prose-h1:border-b prose-h1:border-surface-500
		        prose-h2:border-b
				prose-h2:border-surface-500
				prose-a:text-tertiary-700
				prose-ol:ml-3
				prose-ol:pl-2
				prose-ul:ml-3
				prose-ul:pl-2
				prose-table:table-fixed
				sm:w-120
				sm:px-0
				md:w-144
 "
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
			<div class="absolute flex w-full justify-end px-2 sm:w-120 md:w-144">
				<button
					transition:scale={{ duration: 200, delay: 50, opacity: 0, start: 0, easing: quintOut }}
					on:click={toEdit}
					class="text-lightbuttontext fixed bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-500 text-sm font-semibold shadow"
					><img class="h-5 w-5" src="edit.svg" alt="Edit" /></button
				>
			</div>
		{/if}
	</main>
{/if}
