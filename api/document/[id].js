import { connectToDatabase } from '../../db'

export default async function handle(req, res) {
  const { body, query, method } = req

  const db = await connectToDatabase()
  const documentsCollection = await db.collection('documents')

  switch (method) {
    case 'GET': {
      const document = await documentsCollection.findOne({ id: query.id })

      res.json(document)
      break
    }
    case 'POST': {
      await documentsCollection.findOneAndUpdate(
        { id: query.id },
        { $set: { text: JSON.parse(body).text } }
      )

      res.status(201).end()
    }
  }
}
