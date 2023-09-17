# Cognito Svelte Server Side Auth

This is a test of using AWS Cognito to provide authentication to a Svelte app.

There's lots of ways to integrate Cognito.  This is a test of:
 * Using the Cognito-hosted login screen
 * Not using any auth helper libs like Amplify
 * The authentication callback from the Cognito-hosted login screen is handled via a Svelte server-side callback API.  I'd prefer to use a client-side callback so that I can serve a static SPA app...

It follows this blog post:
https://kinderas.com/technology/23/07/21/implementing-login-and-authentication-for-sveltekit-using-aws-cognito

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
