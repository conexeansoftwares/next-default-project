import config from '@/config/env';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(config.jwtSecret);

// Duração do token e cookie em segundos (4 horas)
const TOKEN_DURATION = 4 * 60 * 60;

async function createTokenAndSetCookie(payload: object) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_DURATION;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(SECRET_KEY);

  cookies().set({
    name: config.jwtTokenName,
    value: token,
    httpOnly: false,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_DURATION,
    path: '/',
  });

  return token;
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

function getSessionToken() {
  return cookies().get(config.jwtTokenName)?.value;
}

function getTokenName() {
  return config.jwtTokenName;
}

export const auth = {
  createTokenAndSetCookie,
  verifyToken,
  getSessionToken,
  getTokenName,
};
