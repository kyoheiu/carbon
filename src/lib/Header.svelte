<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { encode } from 'js-base64';

	const createNew = async () => {
		const res = await fetch('/api/create', {
			method: 'POST'
		});
		const j = await res.json();
		window.location.assign(`item?file=${encodeURIComponent(encode(j.name))}&editing=true`);
	};
</script>

<div class="p-2 fixed z-50 h-12 top-0 w-full backdrop-blur">
	<div class="flex items-center">
		<a class="no-underline text-surface-500 font-extrabold pt-1" href="/">carbon</a>
		&nbsp; &nbsp;
		<button on:click={createNew} title="add a new file" class="chip variant-filled-surface"
			>+New</button
		>
		<div class="ml-auto">
			<form id="search" action="/search">
				<input name="q" placeholder="Search" class="input rounded px-2 w-32" />
			</form>
		</div>
	</div>
</div>
