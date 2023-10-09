<script lang='ts'>
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/auth';

	let isAuth = false;
	let email:string|undefined;

	onMount(async () => {
		let user = await isAuthenticated();
		isAuth = !!(user?.email);
		if (isAuth) {
			email = user?.email;
		}
	});
</script>

<main>
	{#if isAuth}
		<p>Logged in as {email}</p>
		<a href="/auth/logout">Sign out</a>
	{:else}
		<a href="/auth/login">Sign in</a>
	{/if}
</main>
