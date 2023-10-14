<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { encode } from 'js-base64';

	const createNew = async () => {
		const res = await fetch("/api/create", {
			method: "POST"
		});
		const j = await res.json();
		window.location.assign(`item?file=${encodeURIComponent(encode(j.name))}&editing=true`)
	}

	let isRoot = true;
	afterNavigate(() => {
		let form: HTMLFormElement | null = document.forms[0];
		if (form) {
			form.reset();
		}
		if (window.location.pathname !== '/') {
			isRoot = false;
		} else {
			isRoot = true;
		}
	});
</script>

<div class="w-full bg-itembackground flex justify-center">
	<div
		class="px-2 sm:px-0 flex sticky z-50 top-0 h-12 w-full sm:w-120 md:w-144 items-center bg-itembackground"
	>
		<a class="no-underline font-bold italic" href="/">carbon</a>
		&nbsp; &nbsp;
		{#if isRoot}
			<button
			on:click={createNew}
				title="add a new file"
				class="rounded no-underline bg-basecolor text-lightbuttontext px-2 pt-1 text-sm font-semibold"
				>+New</button
			>
		{:else}
			<a
				href="/item"
				title="add a new file"
				class="rounded no-underline bg-background border text-basecolor border-baseborder px-2 pt-1 text-sm font-semibold"
				>+New</a
			>
		{/if}
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="w-32 h-8 px-3 rounded border border-hr" />
			</form>
		</div>
	</div>
</div>
