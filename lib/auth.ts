import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'chave-secreta-parlamento-jovem-mococa-2026');

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { parliamentarian: true }
  });

  return user;
}
