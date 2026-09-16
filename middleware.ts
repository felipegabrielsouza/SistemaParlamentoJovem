import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'chave-secreta-parlamento-jovem-mococa-2026');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  
  const isAuthPage = pathname.startsWith('/login');
  const isAdminPage = pathname.startsWith('/admin');
  const isParlamentarPage = pathname.startsWith('/parlamentar');

  let payload = null;
  if (token) {
    try {
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch (err) {}
  }

  // Se não estiver logado e tentar acessar área restrita
  if (!payload && (isAdminPage || isParlamentarPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se já estiver logado e acessar login ou home, redirecionar para dashboard correto
  if (payload && (isAuthPage || pathname === '/')) {
    if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    if (payload.role === 'PARLAMENTAR') return NextResponse.redirect(new URL('/parlamentar', request.url));
  }

  // Controle de permissão de rotas
  if (isAdminPage && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/parlamentar', request.url));
  }

  if (isParlamentarPage && payload?.role !== 'PARLAMENTAR') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
