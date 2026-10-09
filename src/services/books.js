import { collection, addDoc, getDocs, query, where, orderBy, limit as queryLimit, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/init.js'

export function validateBook({ isbn, name }) {
  const number = typeof isbn === 'string' && /^\d+$/.test(isbn.trim()) ? Number(isbn.trim()) : isbn
  if (!Number.isSafeInteger(number) || number <= 0) throw new Error('ISBN must be a positive whole number.')
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 200) throw new Error('Book name must contain 1–200 characters.')
  return { isbn: number, name: name.trim() }
}
export async function addBook(book) {
  const record = await addDoc(collection(db, 'books'), validateBook(book))
  return record.id
}
export async function listBooks({ minimumIsbn = 1000, limit = 10 } = {}) {
  if (!Number.isSafeInteger(minimumIsbn) || minimumIsbn < 0) throw new Error('Minimum ISBN must be a non-negative whole number.')
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Query limit must be between 1 and 100.')
  const booksQuery = query(collection(db, 'books'), where('isbn', '>', minimumIsbn), orderBy('isbn', 'asc'), queryLimit(limit))
  const snapshot = await getDocs(booksQuery)
  return snapshot.docs.map(record => ({ ...record.data(), id: record.id }))
}
export async function updateBook(id, book) { await updateDoc(doc(db, 'books', id), validateBook(book)) }
export async function deleteBook(id) { await deleteDoc(doc(db, 'books', id)) }
export function bookError(error) {
  if (error.code === 'permission-denied') return 'Your account does not have permission for this operation.'
  if (error.code === 'unavailable') return 'Cannot connect to Firestore. Check that the emulators are running.'
  return error.message || 'Could not complete the book operation. Please try again.'
}
