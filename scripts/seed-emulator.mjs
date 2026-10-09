import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
const projectId = process.argv.includes('--test') ? 'demo-fit5032-test' : 'demo-fit5032'
initializeApp({ projectId })
const auth = getAuth()
for (const [email, role, uid] of [
  ['admin@library.test', 'admin', 'local-admin'],
  ['member@library.test', 'member', 'local-member'],
]) {
  try { await auth.getUser(uid) } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error
    await auth.createUser({ uid, email, password: 'Library123!', displayName: role === 'admin' ? 'Library Administrator' : 'Library Member' })
  }
  await auth.setCustomUserClaims(uid, { role })
}
const db = getFirestore()
for (const [id, isbn, name] of [
  ['sample-1984', 1984, '1984'], ['sample-mockingbird', 2001, 'To Kill a Mockingbird'], ['sample-classic', 900, 'A Classic Collection'],
]) {
  const ref = db.collection('books').doc(id)
  if (!(await ref.get()).exists) await ref.set({ isbn, name })
}
console.log('Local emulator accounts ready: admin@library.test / member@library.test; password: Library123!')
console.log('Seed books added only when missing. No cloud resources accessed.')
