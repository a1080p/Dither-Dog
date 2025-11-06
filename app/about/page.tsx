import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-8">
      <div className="max-w-3xl w-full glass-panel rounded-3xl p-12 relative">
        {/* Back Button - Top Right */}
        <Link
          href="/"
          className="absolute top-6 right-6 flex items-center justify-center glass-button-primary text-white font-bold rounded-2xl hover:scale-110 transition-transform duration-300"
          style={{ width: '4rem', height: '4rem' }}
          title="Back to Image Processor"
        >
          <span style={{ fontSize: '2.5rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</span>
        </Link>

        <h1 className="text-5xl font-black text-white mb-8 tracking-tight">
          About <span className="text-[#ff6b35]">Dither Dog</span>
        </h1>

        <div className="space-y-6 text-white/90 text-lg leading-relaxed">
          <p>
            <strong className="text-white">Dither Dog</strong> is a modern web-based image processing application specializing in dithering effects and artistic image transformations.
          </p>

          <p>
            Built with cutting-edge web technologies including Next.js 15, React 19, and TypeScript, Dither Dog provides real-time image processing entirely in your browser with no server uploads required.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Multiple dithering algorithms including Floyd-Steinberg, Bayer matrices, and artistic patterns</li>
            <li>Extensive color palette options from classic black & white to retro gaming palettes</li>
            <li>Real-time image adjustments with brightness, contrast, and blur controls</li>
            <li>Edge detection and threshold effects</li>
            <li>Preset configurations for quick artistic styles</li>
            <li>Pan and zoom controls for detailed viewing</li>
            <li>Download processed images instantly</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Privacy</h2>
          <p>
            All image processing happens locally in your browser. Your images are never uploaded to any server, ensuring complete privacy and security.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Open Source</h2>
          <p>
            Dither Dog is open source and available on{' '}
            <a
              href="https://github.com/a1080p/Dither-Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6b35] hover:text-[#ff8555] underline font-semibold"
            >
              GitHub
            </a>
            . Contributions and feedback are welcome!
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 glass-button-primary text-white text-lg font-bold rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            Start Processing Images
          </Link>
        </div>
      </div>
    </div>
  );
}
