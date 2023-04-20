import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	const user = locals.user

	if (!user) {
		throw error(401, {
			message: 'You must be logged in to view this page'
		})
		// or
		// throw redirect(302, '/login');
	}

	return {
		user
	}
}) satisfies LayoutServerLoad
