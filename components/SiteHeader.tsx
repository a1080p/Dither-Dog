"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-16 md:h-20 border-b border-white/10 bg-[#0a0a0b]/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/apple-touch-icon.png"
            alt="Dither Dog logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-none"
          />
          <span
            className="font-doto tracking-wide text-white text-base md:text-lg"
            style={{ fontWeight: 700 }}
          >
            DITHER DOG
          </span>
        </Link>

        {/* Absolutely centered so it stays in the exact same spot on every
            page, regardless of whether the right-hand CTA is rendered. */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-none border border-white/12 px-1 py-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`dd-label flex items-center gap-2 rounded-none px-3 py-2 no-underline transition-colors ${
                  active ? "text-white" : "hover:text-white/80"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 shrink-0" style={{ background: "var(--accent)" }} />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {pathname !== "/workspace" && (
          <Link href="/workspace" className="dd-btn dd-btn-primary !py-2 !px-4 text-xs no-underline">
            Open Workspace
            <span className="h-1.5 w-1.5 shrink-0" style={{ background: "#0a0a0b" }} />
          </Link>
        )}
      </div>
    </header>
  );
}
