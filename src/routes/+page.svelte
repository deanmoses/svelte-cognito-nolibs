<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte Cognito Test" />
</svelte:head>

<section>
	<h1>Auth Demo</h1>
	{#if data.email}
		<p>Logged in as {data.email}</p>
	{:else}
		<a href={data.signInUrl}>Sign in</a>
	{/if}
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
