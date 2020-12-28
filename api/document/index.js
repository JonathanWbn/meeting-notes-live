import randomstring from "randomstring";

import { connectToDatabase } from "../../db";

export default async function handle(req, res) {
  switch (req.method) {
    case "GET": {
      const db = await connectToDatabase();
      const documentsCollection = await db.collection("documents");

      const id = randomstring.generate(7);
      await documentsCollection.insertOne({
        id,
        createdAt: Date.now(),
        text: "",
      });

      res.writeHead(301, {
        Location: `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}/${id}`,
        "Set-Cookie": `is-author-${id}=true; Expires=Wed, 21 Oct 3000 07:28:00 GMT; Path=/`,
      });
      res.end();
    }
  }
}
