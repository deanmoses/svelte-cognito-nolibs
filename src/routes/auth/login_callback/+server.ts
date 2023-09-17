import type { RequestHandler } from './$types';
import { getTokensFromCognito } from '$lib/server/auth/authTokens';
import { error, redirect } from '@sveltejs/kit';

/**
 * Handle the authentication callback from Cognito, after the user 
 * has signed in via the Cognito-hosted login UI.
 * 
 * Adapted from https://kinderas.com/technology/23/07/21/implementing-login-and-authentication-for-sveltekit-using-aws-cognito
 * 
 * This stores the refresh token as a cookie.  
 * You might have heard that it's a bad idea to a store refresh token
 * locally on the user's machine. This is true, unless you have a 
 * revocation strategy, as Cognito does.  Refresh tokens can be 
 * invalidated at any point in Cognito (via the api or by logging the 
 * user out), And, with short lived access and id tokens the refresh 
 * token will be validated by Cognito whenever new access and id tokens 
 * are requested.
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	// Cognito passes a one-time authorization code via a query param called `code`
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(500, 'No code provided');
	}

	// Exchange the one-time code for a set of longer-lived auth tokens
	// id token: short lived
	// refresh token: longer lived
	let tokens = null;
	try {
		tokens = await getTokensFromCognito({ code });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}

	// Store the id token and the refresh token in cookies
	if (tokens && tokens.access_token && tokens.id_token && tokens.refresh_token) {
		// Set the expire time for the refresh token
		// This is set in the Cognito console to 30 days by default
		// so we'll use 29 days here.
		// When the refresh token expires, the user will
		// have to log in again
		const refreshExpire = new Date();
		refreshExpire.setDate(refreshExpire.getDate() + 29);
		cookies.set('refresh_token', tokens.refresh_token, {
			path: '/',
			expires: refreshExpire
		});

		// Get the expire time for the id token
		// and set a cookie.
		const idExpires = new Date();
		idExpires.setSeconds(idExpires.getSeconds() + tokens.expires_in);
		cookies.set('id_token', tokens.id_token, { path: '/', expires: idExpires });

		console.log('User is authenticated.  ID token expires at ' + idExpires.toString());

		// Redirect back to the home page
		throw redirect(307, '/');
	} else {
		return new Response(JSON.stringify(tokens), { status: 500 });
	}
};
