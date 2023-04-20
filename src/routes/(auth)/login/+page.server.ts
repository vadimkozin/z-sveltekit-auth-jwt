import type { PageServerLoad, Actions } from './$types'
import { redirect, fail } from '@sveltejs/kit'
import { loginUser } from '$lib/user.model'
import { MAX_AGE } from '$env/static/private'

export const load: PageServerLoad = (event) => {
	const user = event.locals.user

	if (user) {
		throw redirect(302, '/guarded')
	}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData())

		if (!formData.email || !formData.password) {
			return fail(400, {
				error: 'Missing email or password'
			})
		}

		const { email, password } = formData as { email: string; password: string }

		const { error, token } = await loginUser(email, password)

		if (error) {
			return fail(401, {
				error
			})
		}

		// Set the cookie
		event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: Number(MAX_AGE) // see the file .env
		})

		throw redirect(302, '/guarded')
	}
}
