# Cognito Svelte Server Side Auth

This is a test of using AWS Cognito to provide authentication to a Svelte app.

There are lots of ways to use Cognito.  This is a test of:
* __Cognito-hosted login screen__
	* Uses the Cognito-hosted login screen, rather than rolling my own custom login screen
* __No auth libs__
	* Not using any auth helper libs like Amplify or Auth.js
	* The only lib is a self-contained AWS-provided lib validate the JWT authentication tokens
* __Server-side auth callback__
	* The authentication callback from the Cognito-hosted login screen is handled via a Svelte server-side callback API, as opposed to handling the callback in the browser.  See next item as to why.
* __Authorization code grant type__ 
	* Cognito is set to use it's default "authorization code grant type", and not the grant type called "implicit grant type"
	* While implicit grants are easier and can be done browser-only, the authorization code grant type is inherently more secure and recommended as a replacement for implicit grant type for both web and mobile applications.  The implicit grant type is deprecated.  
	* This is a great article on Cognito and how to handle the authorization code grant type: https://dev.to/jinlianwang/user-authentication-through-authorization-code-grant-type-using-aws-cognito-1f93. 

A lot of the code has been adapted from this blog post:
https://kinderas.com/technology/23/07/21/implementing-login-and-authentication-for-sveltekit-using-aws-cognito

It has the following authentication-related server endpoints:
- `/auth/login`
	- Redirects user to a login page hosted by AWS Cognito
- `/auth/login_callback`
	- The login page hosted by AWS Cognito, once it authenticates the user, will send them here
	- It receives an authorization code from Cognito, and calls Cognito back to exchange that code for some tokens: 1) a short-lived ID token and 2) a longer-lived refresh token
- `/auth/status`
	- Returns the login status of client
	- If the short term ID token cookie has expired, it attempts to get a new one using the refresh token cookie
- `/auth/logout`
	- Redirects user to the AWS Cognito logout functionality

## Developing

Once you've installed dependencies with `npm install` or `pnpm install` or `yarn`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
