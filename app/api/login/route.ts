// app/ api/ login/ route.js
import { signJwtAccessToken, signJwtRefreshToken } from '@/lib/jwt';
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { NextRequest } from 'next/server';
import { User } from '@prisma/client'; // Prisma에서 생성된 타입


interface LoginRequest {
  email: string;
  password: string;
}


export async function POST(request: NextRequest): Promise<Response> {
  const body:LoginRequest  = await request.json();

  const user: User | null = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  // 패스워드도 동일한지 확인
  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user;

    //토큰
    const accessToken: string = signJwtAccessToken(userWithoutPass);
    const refreshToken: string = signJwtRefreshToken(userWithoutPass); 

     // refreshToken을 HTTP-only 쿠키로 설정 : 클라이언트 측 JavaScript에서 접근할 수 없다 - 서버에서 해당 토큰을 처리해야 함 
     const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 HTTPS에서만 쿠키 전송
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일 유효 기간
      path: '/', // 쿠키가 모든 경로에서 사용되도록 설정
    };

    // HTTP 응답 헤더에서 **Set-Cookie**를 설정하여 **refreshToken**을 클라이언트의 브라우저에 HTTP-only 쿠키로 저장
    const headers = new Headers();
    headers.set('Set-Cookie', `refreshToken=${refreshToken}; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`);
    //refreshToken=abcdef12345; httpOnly=true; secure=true; maxAge=1209600000; path=/


    const result = {
      ...userWithoutPass,
      accessToken,
    };

    return new Response(JSON.stringify(result))
  } else return new Response(JSON.stringify(null))  
}