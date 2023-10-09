/**
 * @returns User if logged in, else undefined
 */
export async function isAuthenticated(): Promise<User|undefined> {
	// if there's an auth cookie it means the user is either logged in or was once logged in
	if (hasAuthCookie()) {
		// check to see if they're still logged in
		const response = await fetch(`/auth/status`);
		const data = await response.json();
		const user: User = data;
		const isAuth = !!(user?.email);
		if (isAuth) {
			return user;
		}
	}

	return;
}

export function hasAuthCookie(): boolean {
    return !!getCookie('was_authenticated');
}

export type User = {
	email: string;
}

function getCookie(name: string): string|null {
	const nameLenPlus = (name.length + 1);
	return document.cookie
		.split(';')
		.map(c => c.trim())
		.filter(cookie => {
			return cookie.substring(0, nameLenPlus) === `${name}=`;
		})
		.map(cookie => {
			return decodeURIComponent(cookie.substring(nameLenPlus));
		})[0] || null;
}