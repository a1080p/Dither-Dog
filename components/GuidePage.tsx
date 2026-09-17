import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CornerMarks } from "@/components/CornerMarks";

export function GuidePage({
  eyebrow,
  title,
  accentWord,
  children,
}: {
  eyebrow: string;
  title: string;
  accentWord?: string;
  children: React.ReactNode;
}) {
  const parts = accentWord ? title.split(accentWord) : [title];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div
        className="flex items-start justify-center"
        style={{ padding: "4rem 1rem 8rem 1rem" }}
      >
        <article
          className="w-full glass-panel relative"
          style={{ maxWidth: "48rem", padding: "1.5rem 1.5rem 6rem 1.5rem" }}
        >
          <CornerMarks />
          <div className="dd-label mb-4" style={{ color: "var(--accent)" }}>
            {eyebrow}
          </div>
          <div
            className="content-wrapper"
            style={{ padding: "2rem 2.5rem 8rem 2.5rem" }}
          >
            <h1
              className="font-doto text-4xl md:text-5xl text-white tracking-tight"
              style={{ marginBottom: "1.5rem", fontWeight: 800 }}
            >
              {accentWord ? (
                <>
                  {parts[0]}
                  <span style={{ color: "var(--accent)" }}>{accentWord}</span>
                  {parts[1]}
                </>
              ) : (
                title
              )}
            </h1>

            <div
              className="text-white/90 text-lg"
              style={{ lineHeight: "1.8" }}
            >
              {children}
            </div>

            <div
              className="border-t border-white/10 text-center"
              style={{ marginTop: "3rem", paddingTop: "1.5rem" }}
            >
              <Link href="/workspace" className="dd-btn dd-btn-primary no-underline">
                Try It In The Workspace
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function GuideH2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-subheader text-2xl font-bold text-white"
      style={{ marginTop: "2rem", marginBottom: "0.75rem" }}
    >
      {children}
    </h2>
  );
}

export function GuideP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white/90 text-lg" style={{ marginBottom: "1rem" }}>
      {children}
    </p>
  );
}
