<script lang="ts">
</script>

<div class="sticky z-0 top-0 flex w-full flex-col items-center bg-itembackground text-sm shadow">
	<div class="flex h-12 w-64 items-baseline pt-2 sm:w-120 md:w-144">
		<a class=" no-underline" href="/">name</a>
		&nbsp; &nbsp;
		<a
			href="/item"
			title="add a new file"
			class="no-underline h-6 rounded bg-basecolor px-2 py-1 text-xs font-semibold text-lightbuttontext"
			>+New</a
		>
		&nbsp; &nbsp;
		<div class="ml-auto">
			<form action="/search">
				<input name="q" placeholder="Search" class="w-32 rounded-full bg-background px-3 py-1" />
			</form>
		</div>
	</div>
</div>
