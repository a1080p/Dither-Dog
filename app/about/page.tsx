import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gradient-dark relative" style={{ height: '100vh', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4rem 2rem 12rem 2rem' }}>
      {/* Back Button - Top Right */}
      <Link
        href="/"
        className="glass-button-primary text-white font-bold rounded-xl hover:scale-110 transition-transform duration-300 no-underline"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          width: '3rem',
          height: '3rem',
          textDecoration: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Back to Image Processor"
      >
        <span style={{ fontSize: '1.75rem', lineHeight: '1', display: 'block', marginTop: '-0.25rem' }}>←</span>
      </Link>

      <div
        className="max-w-4xl w-full glass-panel rounded-3xl relative"
        style={{ padding: '2rem 2.5rem 8rem 2.5rem' }}
      >
        <h1
          className="text-5xl font-black text-white tracking-tight"
          style={{ marginBottom: '1.5rem' }}
        >
          About <span className="text-[#ff6b35]">Dither Dog</span>
        </h1>

        <div style={{ lineHeight: '1.8' }}>
          <p
            className="text-white/90 text-lg"
            style={{ marginBottom: '1rem' }}
          >
            <strong className="text-white">Dither Dog</strong> is a modern web-based image processing application specializing in dithering effects and artistic image transformations.
          </p>

          <p
            className="text-white/90 text-lg"
            style={{ marginBottom: '1.5rem' }}
          >
            Built with cutting-edge web technologies including Next.js 15, React 19, and TypeScript, Dither Dog provides real-time image processing entirely in your browser with no server uploads required.
          </p>

          {/* Features Section with Image */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h2
                className="text-2xl font-bold text-white"
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
                <li style={{ marginBottom: '0.5rem' }}>Real-time image adjustments with brightness, contrast, and blur controls</li>
                <li style={{ marginBottom: '0.5rem' }}>Edge detection and threshold effects</li>
                <li style={{ marginBottom: '0.5rem' }}>Preset configurations for quick artistic styles</li>
                <li style={{ marginBottom: '0.5rem' }}>Pan and zoom controls for detailed viewing</li>
                <li style={{ marginBottom: '0.5rem' }}>Download processed images instantly</li>
              </ul>
            </div>
            <div style={{ flexShrink: 0, width: '300px', marginTop: '30px' }}>
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
            className="text-2xl font-bold text-white"
            style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
          >
            Privacy
          </h2>
          <p
            className="text-white/90 text-lg"
            style={{ marginBottom: '1.5rem' }}
          >
            All image processing happens locally in your browser. Your images are never uploaded to any server, ensuring complete privacy and security.
          </p>

          <h2
            className="text-2xl font-bold text-white"
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
              className="text-[#ff6b35] hover:text-[#ff8555] font-semibold"
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
            href="/"
            className="inline-block glass-button-primary text-white font-bold rounded-3xl hover:scale-105 transition-transform duration-300"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.125rem',
              textDecoration: 'none'
            }}
          >
            Start Dithering
          </Link>
        </div>
      </div>
    </div>
  );
}
