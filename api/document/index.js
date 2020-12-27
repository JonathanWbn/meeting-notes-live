import { connectToDatabase } from "../../db";

export default async function handle(req, res) {
  switch (req.method) {
    case "GET": {
      const db = await connectToDatabase();
      const documentsCollection = await db.collection("documents");
      const documentsCount = await documentsCollection.countDocuments();

      res.send(documentsCount);

      // create new document
      // redirect to new URL based on document id
    }
  }
}
