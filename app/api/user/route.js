// app/api/user/route.js
import prisma from '../../../lib/prisma'

export async function POST(request) {
  console.log('Request received');
  const body = await request.json()
  console.log('Received body:', body);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
      name: body.name,
    },
  })

  // user 객체에서 password 값은 제외
  const { password, ...result } = user
  return new Response(JSON.stringify(result))
}