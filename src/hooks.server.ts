/*
    Copied from https://kinderas.com/technology/23/07/21/implementing-login-and-authentication-for-sveltekit-using-aws-cognito

    This runs every time the SvelteKit server receives a request — whether that happens while the app is running, or during prerendering — and determines the response.

    We'll use the hook for several tasks:

    Read the id token cookie (if it is set) and parse it.
    Set the email address in the locals object, to make it available the load function for pages that have a server load function.
    For any route or page which requires the user to be logged in (this applies to anything under /protected in this example)
        Check if the id token still exists
        If not, get the refresh token
        If we have the refresh token, create a new id token and update to cookie
        If the refresh token does not exist, sign the user out and show the login page
*/

import type { Handle } from "@sveltejs/kit";
import jwt_decode from "jwt-decode";
import { getSignOutUrl } from "$lib/auth/authUriHelpers";
import { getTokens } from "$lib/auth/authTokens";
import { redirect } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
	// Try to get the id token from the cookie
	const rawIdToken = event.cookies.get("id_token");
	if (rawIdToken) {
		// If the id token exists, parse it and add it to the locals
		const idToken = jwt_decode<{ email: string; exp: number }>(rawIdToken);
		event.locals.user = { email: idToken.email };
	}

	// Handle protected routes
	if (event.url.pathname.startsWith("/protected")) {
		// If the user is not logged in (no id token)
		if (!event.locals.user) {
			// Get the refresh token
			const refreshToken = event.cookies.get("refresh_token");
			// if the refresh token doesn't exist
			if (!refreshToken) {
				// redirect to sign out and sign in again
				const signOutUrl = getSignOutUrl();
				throw redirect(307, signOutUrl);
			}

			try {
				// Try to update the tokens
				const updatedTokens = await getTokens({ refreshToken: refreshToken });
				// Update the cookie for the id token
				const idExpires = new Date();
				idExpires.setSeconds(idExpires.getSeconds() + updatedTokens.expires_in);
				event.cookies.set("id_token", updatedTokens.id_token, { path: "/", expires: idExpires });

				// And the locals
				const idToken = jwt_decode<{ email: string; exp: number }>(updatedTokens.id_token);
				event.locals.user = { email: idToken.email };
			} catch (error) {
				// If the refresh token is invalid
				// redirect to sign out and sign in again
				const signOutUrl = getSignOutUrl();
				throw redirect(307, signOutUrl);
			}

			// Carry on
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;