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
		class="flex sticky px-3 sm:px-0 z-50 top-0 h-12 w-full sm:w-120 md:w-144 items-center bg-itembackground"
	>
		<a class="no-underline font-semibold italic" href="/">carbon</a>
		&nbsp; &nbsp;
		{#if isRoot}
			<button
			on:click={createNew}
				title="add a new file"
				class="rounded no-underline bg-basecolor text-lightbuttontext px-2 py-1 text-sm font-semibold"
				>+New</button
			>
		{:else}
			<a
				href="/item"
				title="add a new file"
				class="rounded no-underline bg-background border text-basecolor border-baseborder px-2 py-1 text-sm font-semibold"
				>+New</a
			>
		{/if}
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="w-32 bg-background px-3 py-1 rounded" />
			</form>
		</div>
	</div>
</div>
