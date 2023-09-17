<script>
	import { onMount } from 'svelte';

	let user;

	onMount(async () => {
        const response = await fetch(`/auth/status`);
		const data = await response.json();
        user = data;
	});
</script>

<main>
    {#if user?.email}
		<p>Logged in as {user.email}</p>
        <a href="/auth/logout">Sign out</a>
	{:else}
		<a href="/auth/login">Sign in</a>
	{/if}
</main>
