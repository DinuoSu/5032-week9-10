import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { initializeTestEnvironment, assertFails } from '@firebase/rules-unit-testing'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, doc, setDoc, updateDoc, deleteDoc, getDoc, terminate } from 'firebase/firestore'
import { addBook, listBooks, updateBook, deleteBook } from '../src/services/books.js'
import { auth, db } from '../src/firebase/init.js'

let env
beforeAll(async () => {
  expect(auth.app.options.projectId).toBe('demo-fit5032-test')
  env = await initializeTestEnvironment({ projectId: 'demo-fit5032-test', firestore: { host: '127.0.0.1', port: 8080, rules: await readFile('firestore.rules', 'utf8') } })
  await signInWithEmailAndPassword(auth, 'admin@library.test', 'Library123!')
})
afterAll(async () => { await signOut(auth); await terminate(db); await deleteApp(auth.app); await env.cleanup() })

describe('Week 7–8 real emulator workflow', () => {
  it('creates numeric ISBNs, filters at 1000, sorts, limits, updates and deletes', async () => {
    await env.clearFirestore()
    await addBook({ isbn: '900', name: ' Below threshold ' })
    const first = await addBook({ isbn: '1001', name: ' First book ' })
    const second = await addBook({ isbn: 1500, name: 'Second book' })
    await addBook({ isbn: 2000, name: 'Third book' })
    const found = await listBooks({ minimumIsbn: 1000, limit: 2 })
    expect(found.map(({ isbn, name }) => ({ isbn, name }))).toEqual([{ isbn: 1001, name: 'First book' }, { isbn: 1500, name: 'Second book' }])
    await updateBook(first, { isbn: 999, name: 'Moved below threshold' })
    expect((await listBooks({ minimumIsbn: 1000, limit: 10 })).map(book => book.isbn)).toEqual([1500, 2000])
    await deleteBook(second)
    expect((await listBooks({ minimumIsbn: 1000, limit: 10 })).map(book => book.isbn)).toEqual([2000])
  })
  it('rejects invalid book input without changing stored documents', async () => {
    await expect(addBook({ isbn: '', name: 'Missing isbn' })).rejects.toThrow(/ISBN/)
    await expect(addBook({ isbn: 0, name: 'Zero isbn' })).rejects.toThrow(/ISBN/)
    await expect(addBook({ isbn: 1.5, name: 'Fraction' })).rejects.toThrow(/ISBN/)
    await expect(addBook({ isbn: 1001, name: '  ' })).rejects.toThrow(/name/)
    await expect(listBooks({ limit: 0 })).rejects.toThrow(/limit/)
  })
  it('enforces member permissions in rules even when bypassing the UI', async () => {
    const memberDb = env.authenticatedContext('member-rule-test', { role: 'member' }).firestore()
    const adminDb = env.authenticatedContext('admin-rule-test', { role: 'admin' }).firestore()
    const ref = doc(adminDb, 'books', 'rule-test')
    await setDoc(ref, { isbn: 2500, name: 'Rule test' })
    expect((await getDoc(doc(memberDb, 'books', 'rule-test'))).data().name).toBe('Rule test')
    await assertFails(updateDoc(doc(memberDb, 'books', 'rule-test'), { name: 'Unauthorized' }))
    await assertFails(deleteDoc(doc(memberDb, 'books', 'rule-test')))
    await assertFails(setDoc(doc(memberDb, 'books', 'bad-input'), { isbn: '3000', name: 'Wrong type' }))
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'books', 'rule-test')))
    await deleteDoc(ref)
  })
  it('registers a member, rejects wrong passwords, restores claims and signs out', async () => {
    const app = initializeApp({ projectId: 'demo-fit5032-test', apiKey: 'demo-key' }, `integration-${Date.now()}`)
    const testAuth = getAuth(app)
    connectAuthEmulator(testAuth, 'http://127.0.0.1:9099', { disableWarnings: true })
    const email = `integration-${Date.now()}@library.test`
    try {
      const created = await createUserWithEmailAndPassword(testAuth, email, 'Library123!')
      expect(created.user.email).toBe(email)
      expect((await created.user.getIdTokenResult()).claims.role).not.toBe('admin')
      await signOut(testAuth)
      expect(testAuth.currentUser).toBe(null)
      await expect(signInWithEmailAndPassword(testAuth, email, 'wrong-password')).rejects.toThrow()
      const signed = await signInWithEmailAndPassword(testAuth, 'admin@library.test', 'Library123!')
      expect((await signed.user.getIdTokenResult()).claims.role).toBe('admin')
      await signOut(testAuth)
      expect(testAuth.currentUser).toBe(null)
    } finally { await deleteApp(app) }
  })
})
