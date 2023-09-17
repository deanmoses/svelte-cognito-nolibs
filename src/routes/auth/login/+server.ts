/*
    Redirect to login page hosted by AWS Cognito.

    We *could* avoid this redirect by hard-coding the URL to the 
    Cognito-hosted login page into the client, but doing it 
    server-side allows us to periodically rotate the Cognito app client 
    credentials, which is generally required for security compliance,
    without the need to release a new version of client (even though 
    web application does not need installation, it still require a 
    change to its client artifacts on server side).
*/

import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getLoginUrl } from '$lib/server/auth/authUriHelpers';

export const GET: RequestHandler = async () => {
    throw redirect(302, getLoginUrl());
};