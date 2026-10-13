import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  encodeSession,
  OTP_CODE,
  OTP_NAME_COOKIE,
  OTP_PHONE_COOKIE,
  SESSION_COOKIE,
} from '@/lib/session';

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const jar = await cookies();
  const phone = jar.get(OTP_PHONE_COOKIE)?.value;
  const name = jar.get(OTP_NAME_COOKIE)?.value || 'کاربر پلنتی';

  if (!phone) {
    return NextResponse.json(
      { message: 'ابتدا شماره موبایل را وارد کنید' },
      { status: 400 },
    );
  }

  if ((body.code ?? '').trim() !== OTP_CODE) {
    return NextResponse.json(
      { message: 'کد تأیید نادرست است' },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, encodeSession({ name, phone }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
  response.cookies.delete(OTP_PHONE_COOKIE);
  response.cookies.delete(OTP_NAME_COOKIE);
  return response;
}
