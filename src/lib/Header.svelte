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

<div class="sticky z-50 top-0 flex w-full flex-col items-center bg-itembackground">
	<div class="flex h-12 w-full px-3 sm:px-0 items-center py-2 sm:w-120 md:w-144">
		<a class="no-underline font-semibold italic" href="/">carbon</a>
		&nbsp; &nbsp;
		{#if isRoot}
			<a
				href="/item"
				title="add a new file"
				class="rounded no-underline bg-basecolor text-lightbuttontext px-2 py-1 text-sm font-semibold"
				>+New</a
			>
		{:else}
			<a
				href="/item"
				title="add a new file"
				class="rounded no-underline bg-background border text-basecolor border-baseborder px-2 py-1 text-sm font-semibold"
				>+New</a
			>
		{/if}
		&nbsp; &nbsp;
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="w-32 bg-background px-3 py-1 rounded" />
			</form>
		</div>
	</div>
</div>
