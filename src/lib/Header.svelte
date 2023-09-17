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

<div class="w-full bg-itembackground flex justify-center">
	<div
		class="flex sticky px-3 sm:px-0 z-50 top-0 h-12 w-full sm:w-120 md:w-144 items-center bg-itembackground"
	>
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
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="w-32 bg-background px-3 py-1 rounded" />
			</form>
		</div>
	</div>
</div>
