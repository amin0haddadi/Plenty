export const SESSION_COOKIE = 'plenty_session';
export const OTP_PHONE_COOKIE = 'plenty_otp_phone';
export const OTP_NAME_COOKIE = 'plenty_otp_name';
export const OTP_CODE = '1234';

export type SessionUser = {
  name: string;
  phone: string;
};

export function encodeSession(user: SessionUser) {
  return JSON.stringify(user);
}

export function decodeSession(value: string | undefined | null): SessionUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as SessionUser;
    if (!parsed.phone || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}
