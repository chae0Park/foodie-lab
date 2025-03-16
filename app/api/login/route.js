// app/ api/ signin/ route.js
import { signJwtAccessToken } from '@/lib/jwt';
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'


export async function POST(request) {
  const body = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      // 입력받은 username 과 테이블 email 컬럼 값이 같은 데이터 추출
      email: body.email,
    },
  });

  // 패스워드도 동일한지 확인
  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user

    //토큰
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
      ...userWithoutPass,
      accessToken,
    };

    return new Response(JSON.stringify(result))
  } else return new Response(JSON.stringify(null))  
}