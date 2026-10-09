const { test } = require('node:test');
const assert = require('node:assert/strict');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
initializeApp({ projectId: 'demo-fit5032' });
const db = getFirestore();

test('a new book has its text fields capitalised by the Firestore function', async () => {
  const ref = db.collection('books').doc(`function-test-${Date.now()}`);
  try {
    await ref.set({ name: 'a tale of two cities', isbn: 4201, description: 'a classic novel' });
    let record;
    for (let attempt = 0; attempt < 30; attempt++) {
      record = (await ref.get()).data();
      if (record.name === 'A TALE OF TWO CITIES') break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.equal(record.name, 'A TALE OF TWO CITIES');
    assert.equal(record.description, 'A CLASSIC NOVEL');
    assert.equal(record.isbn, 4201);
  } finally {
    await ref.delete();
    await db.terminate();
  }
});
