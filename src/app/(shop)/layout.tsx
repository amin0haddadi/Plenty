import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BottomNav } from "@/components/layout/bottom-nav";
import { PhoneFrame } from "@/components/layout/phone-frame";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const session = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/welcome");

  return (
    <PhoneFrame className="bg-cream" footer={<BottomNav />}>
      {children}
    </PhoneFrame>
  );
}
