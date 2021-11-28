import { set } from '@upstash/redis'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  if (req.nextUrl.pathname === '/') {
    const id = makeid(10)

    await set(id, '')

    const response = NextResponse.redirect(
      `${req.headers.get('x-forwarded-proto')}://${req.headers.get(
        'x-forwarded-host'
      )}/${id}`
    )

    response.headers.set(
      'Set-Cookie',
      `is-author-${id}=true; Expires=Wed, 21 Oct 3000 07:28:00 GMT; Path=/`
    )

    return response
  }

  return
}

function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
