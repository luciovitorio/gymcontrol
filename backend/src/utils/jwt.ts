import { SignJWT, jwtVerify } from "jose";
import { config } from "@/configs/app.config.js";

const accessSecret = new TextEncoder().encode(config.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(
  config.JWT_REFRESH_SECRET ?? config.JWT_SECRET
);

type TokenKind = "access" | "refresh";

async function signToken(userId: number, kind: TokenKind) {
  const isAccess = kind === "access";
  const secret = isAccess ? accessSecret : refreshSecret;
  const exp = isAccess ? config.JWT_EXPIRES_IN : config.REFRESH_EXPIRES_IN;
  const aud = isAccess ? "access" : "refresh";

  return new SignJWT({ sub: userId.toString(), aud, iss: "gymcontrol" })
    .setProtectedHeader({ alg: "HS256", typ: isAccess ? "JWT" : "Refresh" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function createTokens(userId: number) {
  const [accessToken, refreshToken] = await Promise.all([
    signToken(userId, "access"),
    signToken(userId, "refresh"),
  ]);
  return { accessToken, refreshToken };
}

async function verify(kind: TokenKind, token: string) {
  try {
    const secret = kind === "access" ? accessSecret : refreshSecret;
    const { payload } = await jwtVerify(token, secret, {
      issuer: "gymcontrol",
      audience: kind,
    });
    if (!payload.sub) return null;
    return { userId: Number(payload.sub) };
  } catch {
    return null;
  }
}

export const verifyToken = (token: string) => verify("access", token);
export const verifyRefreshToken = (token: string) => verify("refresh", token);
