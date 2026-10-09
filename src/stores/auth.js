import { ref, computed } from 'vue'
import { onIdTokenChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/init.js'

export const demoAuthenticated = ref(false)
export const currentUser = ref(null)
export const role = ref(null)
export const sessionError = ref(null)
export const isAuthenticated = computed(() => demoAuthenticated.value || !!currentUser.value)
export const isAdmin = computed(() => !!currentUser.value && role.value === 'admin')
let resolveReady
export const authReady = new Promise(resolve => { resolveReady = resolve })
let sessionVersion = 0
async function applySession(user) {
  const version = ++sessionVersion
  let nextRole = null
  if (user) nextRole = (await user.getIdTokenResult()).claims.role === 'admin' ? 'admin' : 'member'
  if (version !== sessionVersion) return
  currentUser.value = user
  role.value = nextRole
  sessionError.value = null
  console.info('Current user:', user ? { uid: user.uid, email: user.email, role: nextRole } : null)
}
onIdTokenChanged(auth, async user => {
  try { await applySession(user) } catch (error) {
    currentUser.value = null; role.value = null; sessionError.value = error.message
  } finally { resolveReady() }
}, error => { sessionError.value = error.message; resolveReady() })

export function loginDemo(username, password) {
  const valid = username === 'student' && password === 'Library123!'
  demoAuthenticated.value = valid
  return valid
}
export async function register(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password)
  await applySession(result.user)
  return result.user
}
export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password)
  await applySession(result.user)
  return result.user
}
export async function logout() {
  await signOut(auth)
  demoAuthenticated.value = false
  await applySession(null)
}
export function authMessage(error) {
  const messages = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/network-request-failed': 'Cannot connect to Firebase. Check that the emulators are running.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  }
  return messages[error.code] || 'Authentication failed. Please try again.'
}
