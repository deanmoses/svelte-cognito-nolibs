import { PUBLIC_COGNITO_BASE_URI, PUBLIC_COGNITO_CALLBACK_URI, PUBLIC_COGNITO_CLIENT_ID } from '$env/static/public';

/**
 * URL of the Cognito-hosted login page
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/login-endpoint.html
 */
export function getSignInUrl(): string {
	const url = new URL("/login", PUBLIC_COGNITO_BASE_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("client_id", PUBLIC_COGNITO_CLIENT_ID);
	url.searchParams.set("redirect_uri", getRedirectUrl());
	url.searchParams.set("scope", "email openid phone");
	return url.toString();
}

/**
 * URL to which Cognito is to return the user after they sign in via the Cognito-hosted login page.
 * Must be identical to an Allowed Callback URL configured in Cognito, inlucluding trailing slash.
 */
export function getRedirectUrl(): string {
	return new URL(PUBLIC_COGNITO_CALLBACK_URI).toString();
}

/**
 * URL of the Cognito-hosted logout functionality.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html
 */
export function getSignOutUrl(): string {
	const url = new URL("/logout", PUBLIC_COGNITO_BASE_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("client_id", PUBLIC_COGNITO_CLIENT_ID);
	url.searchParams.set("redirect_uri", getRedirectUrl());
	return url.toString();
}