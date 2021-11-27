import { get, set } from '../../lib/redis'

export default async function handle(req, res) {
  const { body, query, method } = req

  switch (method) {
    case 'GET': {
      const document = await get(query.id)

      res.json(document)
      break
    }
    case 'POST': {
      await set(query.id, JSON.parse(body).text)

      res.status(201).end()
    }
  }
}
