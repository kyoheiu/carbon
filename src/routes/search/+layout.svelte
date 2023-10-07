<script>
	import '../../app.css';
	import Header from '$lib/Header.svelte';
</script>

<main class="flex min-h-screen flex-col items-center">
	<Header />
	<slot />
</main>
