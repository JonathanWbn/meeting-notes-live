import randomstring from "randomstring";

import { connectToDatabase } from "../../db";

export default async function handle(req, res) {
  switch (req.method) {
    case "GET": {
      const db = await connectToDatabase();
      const documentsCollection = await db.collection("documents");

      // create new document
      const id = randomstring.generate(7);
      const document = await documentsCollection.insertOne({
        id,
        createdAt: Date.now(),
        text: "",
      });

      // redirect to new URL based on document id
      res.writeHead(301, { Location: `https://meetingnotes.live/${id}` });
      res.end();
    }
  }
}
