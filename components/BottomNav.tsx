"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Info, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Identificar", icon: Sprout, match: (p: string) => p === "/" },
  {
    href: "/history",
    label: "Histórico",
    icon: History,
    match: (p: string) => p.startsWith("/history") || p.startsWith("/analysis"),
  },
  { href: "/about", label: "Sobre", icon: Info, match: (p: string) => p.startsWith("/about") },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 pb-[var(--safe-bottom)]"
    >
      <div className="mx-auto mb-3 flex h-[var(--nav-h)] max-w-xl items-center px-4">
        <ul className="flex w-full items-center justify-around rounded-full border border-ink/[0.06] bg-card/80 px-2 py-2 shadow-[0_12px_32px_-16px_rgb(28_33_29/0.35)] backdrop-blur-xl">
          {items.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "pressable flex flex-col items-center gap-0.5 rounded-full py-1.5 text-[0.6875rem] font-medium tracking-wide transition-colors",
                    active ? "text-moss" : "text-ink-soft/70 hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-300",
                      active && "bg-accent",
                    )}
                  >
                    <Icon className="size-[1.15rem]" strokeWidth={active ? 2 : 1.6} />
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
