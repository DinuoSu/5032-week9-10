import { beforeEach, describe, expect, it } from 'vitest'
import router from '../router/index.js'
import { loginDemo, logout, demoAuthenticated } from '../stores/auth.js'

beforeEach(async () => { await logout(); await router.push('/') })
describe('Week 5 route access', () => {
  it('redirects an unauthenticated direct About visit to login with the intended destination', async () => {
    await router.push('/about')
    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/about')
  })
  it('rejects bad credentials and admits a correct demo login, then revokes access on logout', async () => {
    expect(loginDemo('student', 'wrong')).toBe(false)
    expect(demoAuthenticated.value).toBe(false)
    expect(loginDemo('student', 'Library123!')).toBe(true)
    await router.push('/about')
    expect(router.currentRoute.value.path).toBe('/about')
    await logout()
    await router.push('/')
    await router.push('/about')
    expect(router.currentRoute.value.path).toBe('/login')
  })
  it('does not let the local demo login substitute for a Firebase identity on book routes', async () => {
    loginDemo('student', 'Library123!')
    await router.push('/addbook')
    expect(router.currentRoute.value.path).toBe('/FireLogin')
  })
})
