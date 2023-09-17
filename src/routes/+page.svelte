<script lang="ts">
	import Menu from "$lib/components/auth/menu.svelte";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte Cognito Test" />
</svelte:head>

<section>
	<h1>Auth Demo</h1>
	<Menu />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
