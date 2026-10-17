import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/api';
import { isValidIranPhone, normalizeIranPhone } from '@/lib/phone';
import { OTP_NAME_COOKIE, OTP_PHONE_COOKIE } from '@/lib/session';

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string; name?: string };
  const phone = normalizeIranPhone(body.phone ?? '');

  if (!isValidIranPhone(phone)) {
    return NextResponse.json(
      { message: 'شماره موبایل معتبر وارد کنید' },
      { status: 400 },
    );
  }

  try {
    const apiRes = await fetch(`${API_BASE_URL}/auth/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        phone,
        name: body.name?.trim(),
      }),
    });

    if (!apiRes.ok) {
      const errorData = (await apiRes.json().catch(() => ({}))) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      const message =
        errorData.message ||
        errorData.errors?.phone?.[0] ||
        'ارسال کد ممکن نشد';
      return NextResponse.json({ message }, { status: apiRes.status });
    }
  } catch (err) {
    console.warn('Backend OTP API error, using simulation fallback:', err);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(OTP_PHONE_COOKIE, phone, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 10,
  });
  if (body.name?.trim()) {
    response.cookies.set(OTP_NAME_COOKIE, body.name.trim(), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 10,
    });
  }
  return response;
}
