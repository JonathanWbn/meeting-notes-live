import { NextResponse } from 'next/server'
import randomstring from 'randomstring'
import upstash from '@upstash/redis'

const redis = upstash(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
)

export async function middleware(req) {
  console.log(req.nextUrl.pathname)
  if (req.nextUrl.pathname === '/') {
    const id = randomstring.generate(7)
    await redis.set(id, '')

    const response = NextResponse.redirect(`/${id}`)

    response.headers.set(
      'Set-Cookie',
      `is-author-${id}=true; Expires=Wed, 21 Oct 3000 07:28:00 GMT; Path=/`
    )

    return response
  }

  return NextResponse.next()
}
