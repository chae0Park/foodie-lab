// app/api/auth/refresh-token/route.js
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.SECRET_KEY as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

interface RefreshTokenPayload {
    userId: string,
    iat: number,
    exp: number
}

interface AccessTokenPayload {
  userId: string
}

export async function POST(req: NextRequest): Promise<Response> {
  const { refreshToken }: { refreshToken?: string } = await req.json();

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: 'Refresh token is required' }), { status: 400 });
  }

  try {
    // 리프레시 토큰을 검증
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

    // 새 액세스 토큰 발급
    const accessToken = jwt.sign(
      { userId: decoded.userId } as AccessTokenPayload,
      JWT_SECRET,
      { expiresIn: '15m' } // 15분 만료
    );

    return new Response(JSON.stringify({ accessToken }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), { status: 401 });
  }
}
