import type { PageServerLoad } from './$types';
import { getSignInUrl } from '$lib/auth/authUriHelpers';

export const load = (async ({ locals }) => {
	const signInUrl = getSignInUrl();

	return {
		signInUrl,
		email: locals.user?.email
	};
}) satisfies PageServerLoad;