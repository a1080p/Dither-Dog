"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-16 md:h-20 border-b border-white/10 bg-[#0a0a0b]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/apple-touch-icon.png"
            alt="Dither Dog logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-[3px]"
          />
          <span
            className="font-doto tracking-wide text-white text-base md:text-lg"
            style={{ fontWeight: 700 }}
          >
            DITHER DOG
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`dd-label rounded-md px-3 py-2 no-underline transition-colors ${
                  active ? "text-white" : "hover:text-white/80"
                }`}
                style={active ? { color: "var(--accent)" } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/workspace" className="dd-btn dd-btn-primary !py-2 !px-4 text-xs no-underline">
          Open Workspace
        </Link>
      </div>
    </header>
  );
}
