<script lang="ts">
	import type { PageData } from "../../$types";
	export let data: PageData;
</script>

<svelte:head>
	<title>Authenticated Route</title>
</svelte:head>

<section>
	<h1>Protected route</h1>
	<h2>you should only be here if you're logged in</h2>
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
