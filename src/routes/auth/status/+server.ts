/**
	Return the login status of the current user

	This handles checking authentication status with AWS Cognito.

	Adapted from https://kinderas.com/technology/23/07/21/implementing-login-and-authentication-for-sveltekit-using-aws-cognito
*/

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getTokensFromCognito } from '$lib/server/auth/authTokens';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async (request) => {
	const cookies = request.cookies;

	let user;

	// Get the short-lived Cognito user ID token from cookie
	const rawIdToken = cookies.get('id_token');

	// If ID token exists, user is logged in
	if (rawIdToken) {
		// Parse and validate the ID token
		const idToken = await verifyToken(rawIdToken);
		user = { email: idToken.email };
	}
	// If if no short-lived Cognito ID token, see if we have a longer-lived Cognito refresh token
	else {
		// Get the Cognito refresh token from cookie
		const refreshToken = cookies.get('refresh_token');

		// If the refresh token doesn't exist, user is not logged in
		// If the refresh token DOES exist, try to get a new short-lived ID token
		if (refreshToken) {
			try {
				// Try to update the tokens
				const updatedTokens = await getTokensFromCognito({ refreshToken: refreshToken });

				// Update the cookie for the id token
				const idExpires = new Date();
				idExpires.setSeconds(idExpires.getSeconds() + updatedTokens.expires_in);
				cookies.set('id_token', updatedTokens.id_token, { path: '/', expires: idExpires });

				// Get user out of new ID token
				const idToken = await verifyToken(updatedTokens.id_token);
				user = { email: idToken.email };
			} catch (error) {
				// If the refresh token is invalid, treat user as not logged in
				console.log('Authentication status error: ' + error);
			}
		}
	}

	return json(user);
};

/**
 * Verify the JWT token
 */
async function verifyToken(token: string): { email: string; exp: number } {
	const jwtVerifier = CognitoJwtVerifier.create({
		userPoolId: COGNITO_USER_POOL_ID,
		tokenUse: 'id',
		clientId: COGNITO_CLIENT_ID
	});
	try {
		const payload = await jwtVerifier.verify(token);
		return payload;
	} catch {
		console.log('Token not valid!');
	}
}