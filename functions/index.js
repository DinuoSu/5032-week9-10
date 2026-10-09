const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.capitaliseBook = onDocumentCreated({
  document: "books/{bookId}",
  region: "us-central1",
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;
  const updates = {};
  for (const [field, value] of Object.entries(snapshot.data())) {
    if (typeof value === "string" && value !== value.toUpperCase()) {
      updates[field] = value.toUpperCase();
    }
  }
  if (Object.keys(updates).length) await snapshot.ref.update(updates);
});

exports.countBooks = onRequest({ region: "us-central1" }, (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "GET") {
      res.set("Allow", "GET");
      return res.status(405).send("Method not allowed");
    }
    try {
      const booksCollection = getFirestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;
      return res.status(200).json({ count });
    } catch (error) {
      console.error("Error counting books:", error.message);
      return res.status(500).send("Error counting books");
    }
  });
});
