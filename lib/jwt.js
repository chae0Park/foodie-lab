// lib/jwt.js
import jwt from "jsonwebtoken";


const DEFAULT_SIGN_OPTION = {
  expiresIn: "1h",
};

export function signJwtAccessToken(payload, options = DEFAULT_SIGN_OPTION) {
  const secret_key = process.env.SECRET_KEY;
  if (!secret_key) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }
  const token = jwt.sign(payload, secret_key, options);
  return token;
}

/* signJwtAccessToken() 은 jwt.sign()을 통해 토큰을 리턴해준다. - api/login/route.js에서 사용 */


// refreshToken 생성 함수
export function signJwtRefreshToken(payload, options = { expiresIn: '14d' }) {
  const secret_key = process.env.REFRESH_TOKEN_SECRET; // 별도의 키로 관리하는 것이 좋습니다.
  if (!secret_key) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
  }
  const token = jwt.sign(payload, secret_key, options); // 긴 만료 시간을 설정합니다.
  return token;
}


export function verifyJwf(token){
    try {
        const secretKey = process.env.SECRET_KEY; 
        if (!secretKey) {
          throw new Error("SECRET_KEY is not defined in the environment variables");
        }
        const decoded = jwt.verify(token, secretKey);
        return decoded;

    } catch (error) {
        console.log('error detected whilst verifying token', error)
        return null;
    }
}