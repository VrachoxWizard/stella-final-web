import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "cms_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

type Secrets = { password?: string; secret?: string };

const envSecrets = (): Secrets => ({ password: process.env.ADMIN_PASSWORD, secret: process.env.SESSION_SECRET });

export function isAuthConfigured(secrets = envSecrets()) {
  return Boolean(secrets.password && secrets.secret && secrets.secret.length >= 16);
}

/** The signing key includes the password, so changing ADMIN_PASSWORD logs everyone out. */
function signingKey({ password, secret }: Secrets) {
  return createHash("sha256").update(`${secret}\0${password}`).digest();
}

function sign(payload: string, secrets: Secrets) {
  return createHmac("sha256", signingKey(secrets)).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function checkPassword(input: string, secrets = envSecrets()) {
  if (!isAuthConfigured(secrets)) return false;
  return safeEqual(input, secrets.password!);
}

export function createSessionToken(now = Date.now(), secrets = envSecrets()) {
  const expires = String(now + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, secrets)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now(), secrets = envSecrets()) {
  if (!token || !isAuthConfigured(secrets)) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < now) return false;
  return safeEqual(signature, sign(expires, secrets));
}
