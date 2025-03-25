// app/api/auth/refresh-token/route.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export async function POST(req) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: 'Refresh token is required' }), { status: 400 });
  }

  try {
    // 리프레시 토큰을 검증
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // 새 액세스 토큰 발급
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET,
      { expiresIn: '15m' } // 15분 만료
    );

    return new Response(JSON.stringify({ accessToken }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), { status: 401 });
  }
}
