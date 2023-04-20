// add...
import type { Actions } from './$types'
import { redirect } from '@sveltejs/kit'

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('AuthorizationToken')

		throw redirect(302, '/login')
	}
}
