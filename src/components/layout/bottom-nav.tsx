"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuClipboardList, LuHouse, LuLayoutGrid, LuShoppingBag, LuUser } from "react-icons/lu";

import { formatNumber } from "@/lib/format";
import { useShop } from "@/lib/local-shop";

const tabs = [
  { href: "/", label: "خانه", icon: LuHouse },
  { href: "/categories", label: "دسته‌ها", icon: LuLayoutGrid },
  { href: "/cart", label: "سبد", icon: LuShoppingBag },
  { href: "/orders", label: "سفارش‌ها", icon: LuClipboardList },
  { href: "/account", label: "حساب", icon: LuUser },
] as const;

function tabIndex(pathname: string) {
  return tabs.findIndex((tab) =>
    tab.href === "/"
      ? pathname === "/"
      : pathname === tab.href || pathname.startsWith(`${tab.href}/`),
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const index = tabIndex(pathname);
  const shop = useShop();
  const cartCount = shop.cart.length;

  return (
    <nav className="sticky bottom-3 mx-4 mb-4 overflow-hidden rounded-4xl border border-white border-2 border-line bg-gray-100 shadow-lg">
      {index >= 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 w-1/5 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${index * -100}%)`,
            backgroundImage:
              "radial-gradient(ellipse 80% 130% at 50% -8%, color-mix(in srgb, var(--fresh) 42%, white) 0%, transparent 60%)",
          }}
        >
          <span className="absolute inset-x-0 top-0 h-[3px] w-[40%] bg-leaf mx-auto" />
        </span>
      ) : null}
      <div className="relative grid grid-cols-5">
        {tabs.map((tab, tabPosition) => {
          const active = tabPosition === index;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs transition-all duration-800 ${
                active ? "font-semibold text-leaf scale-110" : "text-muted"
              }`}
            >
              <span className="relative">
                <tab.icon className="size-5" aria-hidden />
                {tab.href === "/cart" && cartCount > 0 ? (
                  <span className="absolute bottom-0 left-0 flex h-4 min-w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-leaf px-1 text-[10px] leading-none font-bold text-white">
                    {formatNumber(cartCount)}
                  </span>
                ) : null}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
