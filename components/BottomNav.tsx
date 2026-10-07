"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { History, Info, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Identificar", icon: Sprout, match: (p: string) => p === "/" },
  {
    href: "/history",
    label: "Minhas plantas",
    icon: History,
    match: (p: string) => p.startsWith("/history") || p.startsWith("/analysis"),
  },
  { href: "/about", label: "Sobre", icon: Info, match: (p: string) => p.startsWith("/about") },
];

const noSubscribe = () => () => {};
// GestureEvent only exists in WebKit (Safari, and every browser on iOS).
const isWebKit = () => "GestureEvent" in window;

export function BottomNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => item.match(pathname));
  const webkit = useSyncExternalStore(noSubscribe, isWebKit, () => false);
  const types = webkit && pathname === "/" ? ["leave-home"] : undefined;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 pb-[var(--safe-bottom)]"
    >
      <div className="mx-auto mb-3 flex h-[var(--nav-h)] max-w-xl items-center px-4">
        <ul className="relative flex w-full items-center justify-around rounded-full border border-ink/[0.06] bg-card/80 px-2 py-2 shadow-[0_12px_32px_-16px_rgb(28_33_29/0.35)] backdrop-blur-xl">
          {/* One highlight that glides between tabs instead of each tab owning a background. */}
          {activeIndex >= 0 && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-2 left-2 flex w-[calc((100%-1rem)/3)] justify-center transition-transform duration-500 ease-[var(--ease-organic)] motion-reduce:transition-none"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            >
              <span className="mt-1.5 h-7 w-12 rounded-full bg-accent" />
            </span>
          )}
          {items.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href} className="relative flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  transitionTypes={types}
                  className={cn(
                    "pressable flex flex-col items-center gap-0.5 rounded-full py-1.5 text-[0.6875rem] font-medium tracking-wide transition-colors",
                    active ? "text-moss" : "text-ink-soft/70 hover:text-ink",
                  )}
                >
                  <span className="flex h-7 w-12 items-center justify-center">
                    <Icon
                      key={active ? "on" : "off"}
                      className={cn("size-[1.15rem]", active && "pop")}
                      strokeWidth={active ? 2 : 1.6}
                    />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
