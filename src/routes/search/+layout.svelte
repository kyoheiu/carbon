<script>
	import '../../app.css';
	import Header from '$lib/Header.svelte';
</script>

<main class="bg-itembackground flex min-h-screen flex-col items-center">
	<Header />
	<slot />
</main>
