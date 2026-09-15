'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { CornerMarks } from '@/components/CornerMarks';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div
        className="flex items-start justify-center"
        style={{ padding: '4rem 1rem 8rem 1rem' }}
      >
      <div
        className="w-full glass-panel relative"
        style={{
          maxWidth: '64rem',
          padding: '1.5rem 1.5rem 6rem 1.5rem'
        }}
      >
        <CornerMarks />
        <div className="dd-label mb-4" style={{ color: 'var(--accent)' }}>{'// Project Info'}</div>
        <style jsx>{`
          @media (min-width: 768px) {
            .content-wrapper {
              padding: 2rem 2.5rem 8rem 2.5rem !important;
            }
          }

          @media (max-width: 767px) {
            .features-container {
              flex-direction: column !important;
            }

            .dog-image-container {
              width: 100% !important;
              max-width: 300px !important;
              margin: 1.5rem auto 0 auto !important;
            }

            h1 {
              font-size: 2.5rem !important;
            }
          }
        `}</style>

        <div className="content-wrapper" style={{ padding: '2rem 2.5rem 8rem 2.5rem' }}>
          <h1
            className="font-doto text-5xl text-white tracking-tight"
            style={{ marginBottom: '1.5rem', fontWeight: 800 }}
          >
            About <span style={{ color: 'var(--accent)' }}>Dither Dog</span>
          </h1>

          <div style={{ lineHeight: '1.8' }}>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1rem' }}
            >
              <strong className="text-white">Dither Dog</strong> is a modern web-based image, video, and GIF processing application specializing in dithering effects and artistic transformations.
            </p>

            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1.5rem' }}
            >
              Built with cutting-edge web technologies including Next.js 15, React 19, and TypeScript, Dither Dog provides real-time image, video, and GIF processing entirely in your browser with no server uploads required.
            </p>

            {/* Features Section with Image */}
            <div className="features-container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <h2
                  className="font-subheader text-2xl font-bold text-white"
                  style={{ marginBottom: '0.75rem' }}
                >
                  Features
                </h2>
                <ul
                  className="text-white/90 text-lg"
                  style={{
                    listStyleType: 'disc',
                    paddingLeft: '2rem',
                    lineHeight: '1.9'
                  }}
                >
                  <li style={{ marginBottom: '0.5rem' }}>Multiple dithering algorithms including Floyd-Steinberg, Bayer matrices, and artistic patterns</li>
                  <li style={{ marginBottom: '0.5rem' }}>Extensive color palette options from classic black & white to retro gaming palettes</li>
                  <li style={{ marginBottom: '0.5rem' }}>Real-time image, video, and GIF adjustments with brightness, contrast, and blur controls</li>
                  <li style={{ marginBottom: '0.5rem' }}>Edge detection and threshold effects</li>
                  <li style={{ marginBottom: '0.5rem' }}>Preset configurations for quick artistic styles</li>
                  <li style={{ marginBottom: '0.5rem' }}>Pan and zoom controls for detailed viewing</li>
                  <li style={{ marginBottom: '0.5rem' }}>Download processed images, videos, and GIFs instantly</li>
                </ul>
              </div>
              <div className="dog-image-container" style={{ flexShrink: 0, width: '300px', marginTop: '30px' }}>
                <Image
                  src="/DITHER DOG.png"
                  alt="Dithered Dog"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
                />
              </div>
            </div>

            <h2
              className="font-subheader text-2xl font-bold text-white"
              style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
            >
              Privacy
            </h2>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1.5rem' }}
            >
              All image, video, and GIF processing happens locally in your browser. Your files are never uploaded to any server, ensuring complete privacy and security.
            </p>

            <h2
              className="font-subheader text-2xl font-bold text-white"
              style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
            >
              Why It&apos;s Free
            </h2>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1rem' }}
            >
              I wanted this app to be free. Real dithering tools are often
              locked behind subscriptions or bundled into expensive creative
              suites, and I didn&apos;t think they should be — designers should
              be able to reach for something like this without having to pay
              for it first.
            </p>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1.5rem' }}
            >
              Building Dither Dog has also been a way for me to keep honing
              my own design craft: shipping a small, useful tool end to end,
              in public, for anyone to use. If it&apos;s been helpful to you
              and you&apos;d like to support future updates, you can{' '}
              <a
                href="https://buymeacoffee.com/GreattAidan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:opacity-80 font-semibold"
                style={{ textDecoration: 'underline' }}
              >
                buy me a coffee
              </a>
              .
            </p>

            <h2
              className="font-subheader text-2xl font-bold text-white"
              style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
            >
              Open Source
            </h2>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: '1.5rem' }}
            >
              Dither Dog is open source and available on{' '}
              <a
                href="https://github.com/a1080p/Dither-Dog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:opacity-80 font-semibold"
                style={{ textDecoration: 'underline' }}
              >
                GitHub
              </a>
              . Contributions and feedback are welcome!
            </p>
          </div>

          <div
            className="border-t border-white/10 text-center"
            style={{ marginTop: '2rem', paddingTop: '1.5rem' }}
          >
            <Link
              href="/workspace"
              className="dd-btn dd-btn-primary no-underline"
            >
              Start Dithering
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
