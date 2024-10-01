import config from '@/config/env';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(config.jwtSecret);

// Duração do token em segundos (4 horas)
const TOKEN_DURATION = 4 * 60 * 60;

async function createToken(payload: object) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_DURATION;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(SECRET_KEY);

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

function setSessionToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(config.jwtTokenName, token);
  }
}

function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(config.jwtTokenName);
  }
  return null;
}

function removeSessionToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(config.jwtTokenName);
  }
}

function getTokenName() {
  return config.jwtTokenName;
}

export const auth = {
  createToken,
  verifyToken,
  setSessionToken,
  getSessionToken,
  removeSessionToken,
  getTokenName,
};
