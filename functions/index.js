const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.countBooks = onRequest({ region: "us-central1" }, (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "GET") {
      res.set("Allow", "GET");
      return res.status(405).send("Method not allowed");
    }
    try {
      const booksCollection = admin.firestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;
      return res.status(200).json({ count });
    } catch (error) {
      console.error("Error counting books:", error.message);
      return res.status(500).send("Error counting books");
    }
  });
});
