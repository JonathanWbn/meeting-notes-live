import { set } from '@upstash/redis'
import { NextResponse } from 'next/server'
import randomstring from 'randomstring'

export async function middleware(req) {
  console.log(req.nextUrl.pathname)
  if (req.nextUrl.pathname === '/') {
    const id = randomstring.generate(7)
    console.log('setting now')
    await set(id, '')
    console.log('setting done')

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
