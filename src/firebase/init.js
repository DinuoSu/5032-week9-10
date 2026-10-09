import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

export const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'false'
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-fit5032'
const app = initializeApp({
  projectId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
})
export const auth = getAuth(app)
export const db = getFirestore(app)
if (useEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
export default db
