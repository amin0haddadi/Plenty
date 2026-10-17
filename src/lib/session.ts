const SESSION_COOKIE = 'plenty_session';
const OTP_PHONE_COOKIE = 'plenty_otp_phone';
const OTP_NAME_COOKIE = 'plenty_otp_name';
const OTP_CODE = '12345';

type SessionUser = {
  id?: number;
  name: string;
  phone: string;
  token?: string;
};

function encodeSession(user: SessionUser) {
  return JSON.stringify(user);
}

function decodeSession(value: string | undefined | null): SessionUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as SessionUser;
    if (!parsed.phone || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export {
  decodeSession,
  encodeSession,
  OTP_CODE,
  OTP_NAME_COOKIE,
  OTP_PHONE_COOKIE,
  SESSION_COOKIE,
};
export type { SessionUser };
