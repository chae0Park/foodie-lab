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

/* signJwtAccessToken() 은 jwt.sign()을 통해 토큰을 리턴해준다. */

export function verifyJwf(token){
    try {
        const secret_key = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret_key);
        return decoded;

    } catch (error) {
        console.log('error detected whilst verifying token', error)
        return null;
    }
}