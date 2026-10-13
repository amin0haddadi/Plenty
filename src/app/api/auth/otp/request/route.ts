import { NextResponse } from 'next/server';

import { isValidIranPhone, normalizeIranPhone } from '@/lib/phone';
import { OTP_NAME_COOKIE, OTP_PHONE_COOKIE } from '@/lib/session';

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string; name?: string };
  const phone = normalizeIranPhone(body.phone ?? '');

  if (!isValidIranPhone(phone)) {
    return NextResponse.json({ message: 'شماره موبایل معتبر وارد کنید' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(OTP_PHONE_COOKIE, phone, { httpOnly: true, path: '/', maxAge: 60 * 10 });
  if (body.name?.trim()) {
    response.cookies.set(OTP_NAME_COOKIE, body.name.trim(), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 10,
    });
  }
  return response;
}
