<script lang="ts">
	import { afterNavigate } from '$app/navigation';

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

<div class="sticky z-50 top-0 flex w-full flex-col items-center bg-itembackground text-sm shadow">
	<div class="flex h-12 w-64 items-center pt-2 sm:w-120 md:w-144">
		<a class="no-underline" href="/"><img class="ml-1" src="logo.png" alt="carbon" width="60" /></a>
		&nbsp; &nbsp;
		{#if isRoot}
			<a
				href="/item"
				title="add a new file"
				class="no-underline h-6 bg-basecolor text-lightbuttontext px-2 py-1 text-xs font-semibold"
				>+New</a
			>
		{:else}
			<a
				href="/item"
				title="add a new file"
				class="no-underline h-6 bg-itembackground border text-basecolor border-baseborder px-2 py-1 text-xs font-semibold"
				>+New</a
			>
		{/if}
		&nbsp; &nbsp;
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="w-32 bg-background px-3 py-1" />
			</form>
		</div>
	</div>
</div>
