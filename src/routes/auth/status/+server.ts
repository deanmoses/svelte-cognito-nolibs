/**
 * Return the login status of the current user
 */

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import jwt_decode from 'jwt-decode';
import { getTokens } from '$lib/server/auth/authTokens';

export const GET: RequestHandler = async (request) => {
	const cookies = request.cookies;

	let user;

	// Get Cognito user ID token from cookie
	const rawIdToken = cookies.get('id_token');

	// If ID token exists, user is logged in
	if (rawIdToken) {
		// Parse ID token.  It's in JSON Web Token (JWT) format
		const idToken = jwt_decode<{ email: string; exp: number }>(rawIdToken);
		user = { email: idToken.email };
	}
	// If if no ID token, see if we have a refresh token
	else {
		// Get the Cognito refresh token from cookie
		const refreshToken = cookies.get('refresh_token');

		// If the refresh token doesn't exist, user is not logged in
		if (refreshToken) {
			try {
				// Try to update the tokens
				const updatedTokens = await getTokens({ refreshToken: refreshToken });

				// Update the cookie for the id token
				const idExpires = new Date();
				idExpires.setSeconds(idExpires.getSeconds() + updatedTokens.expires_in);
				cookies.set('id_token', updatedTokens.id_token, { path: '/', expires: idExpires });

				// And the locals
				const idToken = jwt_decode<{ email: string; exp: number }>(updatedTokens.id_token);
				user = { email: idToken.email };
			} catch (error) {
				// If the refresh token is invalid, treat user as not logged in
				console.log('Authentication status error: ' + error);
			}
		}
	}

	return json(user);
};
