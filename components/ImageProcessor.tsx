'use client';

import { useRef, useState, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import NextImage from 'next/image';
import { parseGIF, decompressFrames } from 'gifuct-js';
import { processImage, type ProcessingParams, type DitheringAlgorithm, type ColorPalette } from '@/lib/imageProcessing';

type Preset = {
  name: string;
  params: Partial<ProcessingParams>;
};

const presets: Preset[] = [
  {
    name: 'Classic Newspaper',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'floyd-steinberg',
      colorPalette: 'black-white',
      ditherContrast: 140,
      effectScale: 1,
      effectSize: 1,
      brightness: 10,
      contrast: 20,
      blur: 0,
      depth: 50,
      invert: false,
    }
  },
  {
    name: 'Retro Game Boy',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'bayer-8x8',
      colorPalette: 'gameboy',
      ditherContrast: 110,
      effectScale: 1.2,
      effectSize: 2,
      brightness: 5,
      contrast: 15,
      blur: 0,
      depth: 25,
      invert: false,
    }
  },
  {
    name: 'Neon Dreams',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'halftone-dots',
      colorPalette: 'hot-pink-cyan',
      ditherContrast: 150,
      effectScale: 1.8,
      effectSize: 8,
      brightness: 15,
      contrast: 30,
      blur: 0.5,
      depth: 40,
      invert: false,
    }
  },
  {
    name: 'Vintage Poster',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'crosshatch',
      colorPalette: 'teal-orange',
      ditherContrast: 160,
      effectScale: 1.5,
      effectSize: 6,
      brightness: 5,
      contrast: 25,
      blur: 0,
      depth: 35,
      invert: false,
    }
  },
  {
    name: 'Old Terminal',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'bayer-8x8',
      colorPalette: 'green-terminal',
      ditherContrast: 130,
      effectScale: 1.3,
      effectSize: 3,
      brightness: -5,
      contrast: 20,
      blur: 0,
      depth: 30,
      invert: false,
    }
  },
  {
    name: 'Sunset Comic',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'stipple',
      colorPalette: 'sunset-red',
      ditherContrast: 145,
      effectScale: 1.6,
      effectSize: 12,
      brightness: 10,
      contrast: 25,
      blur: 0,
      depth: 45,
      invert: false,
    }
  },
  {
    name: 'Electric Pop Art',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'newspaper',
      colorPalette: 'electric-blue',
      ditherContrast: 170,
      effectScale: 1.4,
      effectSize: 10,
      brightness: 20,
      contrast: 40,
      blur: 0,
      depth: 50,
      invert: false,
    }
  },
  {
    name: 'Sepia Memories',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'jarvis-judice-ninke',
      colorPalette: 'sepia',
      ditherContrast: 100,
      effectScale: 1,
      effectSize: 1,
      brightness: 0,
      contrast: 10,
      blur: 1,
      depth: 40,
      invert: false,
    }
  },
  {
    name: 'Forest Lines',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'horizontal-lines',
      colorPalette: 'forest-green',
      ditherContrast: 135,
      effectScale: 1.5,
      effectSize: 5,
      brightness: 0,
      contrast: 20,
      blur: 0,
      depth: 40,
      invert: false,
    }
  },
  {
    name: 'Purple Matrix',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'grid-pattern',
      colorPalette: 'lime-purple',
      ditherContrast: 150,
      effectScale: 2,
      effectSize: 10,
      brightness: 10,
      contrast: 30,
      blur: 0,
      depth: 55,
      invert: false,
    }
  },
  {
    name: 'Blue Noise Pro',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'blue-noise',
      colorPalette: 'black-white',
      ditherContrast: 120,
      effectScale: 1,
      effectSize: 1,
      brightness: 5,
      contrast: 15,
      blur: 0,
      depth: 50,
      invert: false,
    }
  },
  {
    name: 'Print Halftone',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'clustered-dot',
      colorPalette: 'cyan-magenta',
      ditherContrast: 135,
      effectScale: 1.4,
      effectSize: 3,
      brightness: 10,
      contrast: 25,
      blur: 0,
      depth: 45,
      invert: false,
    }
  },
  {
    name: 'Static TV',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'white-noise',
      colorPalette: 'black-white',
      ditherContrast: 155,
      effectScale: 1,
      effectSize: 1,
      brightness: 0,
      contrast: 30,
      blur: 0.5,
      depth: 50,
      invert: false,
    }
  },
  {
    name: 'Organic Curves',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'riemersma',
      colorPalette: 'burgundy-cream',
      ditherContrast: 125,
      effectScale: 1.2,
      effectSize: 1,
      brightness: 5,
      contrast: 20,
      blur: 0,
      depth: 42,
      invert: false,
    }
  },
  {
    name: 'Adaptive Dream',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'variable-error',
      colorPalette: 'lavender-sage',
      ditherContrast: 115,
      effectScale: 1.1,
      effectSize: 2,
      brightness: 8,
      contrast: 18,
      blur: 0.5,
      depth: 38,
      invert: false,
    }
  },
  {
    name: 'Pixel Rot',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'bayer-2x2',
      colorPalette: 'commodore64',
      ditherContrast: 190,
      effectScale: 2,
      effectSize: 16,
      brightness: -10,
      contrast: 35,
      blur: 0,
      depth: 14,
      invert: false,
    }
  },
  {
    name: 'Broken Signal',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'random',
      colorPalette: 'red-black',
      ditherContrast: 185,
      effectScale: 1.8,
      effectSize: 14,
      brightness: 5,
      contrast: 30,
      blur: 0.3,
      depth: 16,
      invert: false,
    }
  },
  {
    name: 'Cheap Print',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'ordered',
      colorPalette: 'blue-white',
      ditherContrast: 165,
      effectScale: 1.9,
      effectSize: 15,
      brightness: 0,
      contrast: 25,
      blur: 0,
      depth: 18,
      invert: false,
    }
  },
  {
    name: 'Scanline Rot',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'vertical-lines',
      colorPalette: 'green-black',
      ditherContrast: 175,
      effectScale: 1.7,
      effectSize: 13,
      brightness: -5,
      contrast: 28,
      blur: 0,
      depth: 15,
      invert: false,
    }
  },
  {
    name: 'Doodle Spiral',
    params: {
      effect: 'dithering',
      ditheringAlgorithm: 'spiral',
      colorPalette: 'orange-blue',
      ditherContrast: 160,
      effectScale: 1.6,
      effectSize: 14,
      brightness: 10,
      contrast: 22,
      blur: 0.2,
      depth: 20,
      invert: false,
    }
  },
];

type MediaType = 'image' | 'video' | 'gif' | null;

const VIDEO_FRAME_DURATION = 1 / 30; // approximate single-frame step at 30fps

// Candidate MediaRecorder mime types per exportable video format, in
// preference order. Browser support for MP4 recording is inconsistent, so
// we only ever offer a format the current browser can actually produce.
const VIDEO_FORMAT_CANDIDATES: Record<'webm' | 'mp4', { label: string; extension: string; mimeTypes: string[] }> = {
  webm: {
    label: 'WebM (.webm)',
    extension: 'webm',
    mimeTypes: ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'],
  },
  mp4: {
    label: 'MP4 (.mp4)',
    extension: 'mp4',
    mimeTypes: ['video/mp4;codecs=avc1', 'video/mp4'],
  },
};

function getSupportedMimeType(candidates: string[]): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Decodes a GIF into fully-composited frames (handling each frame's disposal
// method) so they can be randomly accessed like video frames. The browser
// has no API for this — an <img>/<canvas> only ever shows the gif "playing",
// never a specific frame on demand.
function decodeGifFrames(arrayBuffer: ArrayBuffer): { frames: ImageData[]; delays: number[]; width: number; height: number } {
  const gif = parseGIF(arrayBuffer);
  const rawFrames = decompressFrames(gif, true);
  const width = gif.lsd.width;
  const height = gif.lsd.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const patchCanvas = document.createElement('canvas');
  const patchCtx = patchCanvas.getContext('2d')!;

  const frames: ImageData[] = [];
  const delays: number[] = [];
  let savedSnapshot: ImageData | null = null;
  let previousDisposal = 0;
  let previousDims: { top: number; left: number; width: number; height: number } | null = null;

  for (const frame of rawFrames) {
    // Apply the PREVIOUS frame's disposal before drawing this one
    if (previousDims) {
      if (previousDisposal === 2) {
        ctx.clearRect(previousDims.left, previousDims.top, previousDims.width, previousDims.height);
      } else if (previousDisposal === 3 && savedSnapshot) {
        ctx.putImageData(savedSnapshot, 0, 0);
      }
    }

    // If this frame will need a disposal-3 restore later, snapshot before drawing it
    if (frame.disposalType === 3) {
      savedSnapshot = ctx.getImageData(0, 0, width, height);
    }

    // Draw via a temp canvas so transparent pixels alpha-composite correctly
    // instead of punching a hole through putImageData's raw overwrite
    patchCanvas.width = frame.dims.width;
    patchCanvas.height = frame.dims.height;
    patchCtx.putImageData(new ImageData(Uint8ClampedArray.from(frame.patch), frame.dims.width, frame.dims.height), 0, 0);
    ctx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

    frames.push(ctx.getImageData(0, 0, width, height));
    delays.push(frame.delay > 0 ? frame.delay : 100); // GIF spec: 0 delay is conventionally treated as ~100ms

    previousDisposal = frame.disposalType;
    previousDims = frame.dims;
  }

  return { frames, delays, width, height };
}

export default function ImageProcessor() {
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [mediaDims, setMediaDims] = useState<{ width: number; height: number } | null>(null);
  const [frameVersion, setFrameVersion] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [gifFrameIndex, setGifFrameIndex] = useState(0);
  const [gifFrameCount, setGifFrameCount] = useState(0);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [imageExportFormat, setImageExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [videoExportFormat, setVideoExportFormat] = useState<'webm' | 'mp4'>('webm');
  const [params, setParams] = useState<ProcessingParams>({
    brightness: 0,
    contrast: 0,
    threshold: 128,
    ditherIntensity: 1,
    effect: 'none',
    ditheringAlgorithm: 'floyd-steinberg',
    invert: false,
    ditherContrast: 100,
    midtones: 100,
    highlights: 100,
    luminanceThreshold: 128,
    blur: 0,
    depth: 50,
    effectScale: 1,
    effectSize: 8,
    colorPalette: 'full-color',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Open by default for desktop
  const [isMobile, setIsMobile] = useState(false);

  const availableVideoFormats = useMemo(() => {
    return (Object.keys(VIDEO_FORMAT_CANDIDATES) as Array<'webm' | 'mp4'>).filter(
      (format) => getSupportedMimeType(VIDEO_FORMAT_CANDIDATES[format].mimeTypes) !== null
    );
  }, []);

  useEffect(() => {
    if (availableVideoFormats.length > 0 && !availableVideoFormats.includes(videoExportFormat)) {
      setVideoExportFormat(availableVideoFormats[0]);
    }
  }, [availableVideoFormats, videoExportFormat]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const scrollPosRef = useRef(0);
  const videoObjectUrlRef = useRef<string | null>(null);
  const gifFramesRef = useRef<ImageData[]>([]);
  const gifDelaysRef = useRef<number[]>([]);
  const gifIndexRef = useRef(0);
  const gifPlaybackTimeoutRef = useRef<number | null>(null);

  const hasMedia = mediaType !== null;

  const resetVideoElement = useCallback(() => {
    if (videoObjectUrlRef.current) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
      videoObjectUrlRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, []);

  const resetGifPlayback = useCallback(() => {
    if (gifPlaybackTimeoutRef.current !== null) {
      clearTimeout(gifPlaybackTimeoutRef.current);
      gifPlaybackTimeoutRef.current = null;
    }
    gifFramesRef.current = [];
    gifDelaysRef.current = [];
    gifIndexRef.current = 0;
    setIsGifPlaying(false);
    setGifFrameIndex(0);
    setGifFrameCount(0);
  }, []);

  const handleImageLoad = useCallback((file: File) => {
    resetVideoElement();
    resetGifPlayback();
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (sourceCanvasRef.current) {
          const ctx = sourceCanvasRef.current.getContext('2d');
          if (ctx) {
            sourceCanvasRef.current.width = img.width;
            sourceCanvasRef.current.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
        setMediaType('image');
        setMediaDims({ width: img.width, height: img.height });
        setFrameVersion((v) => v + 1);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [resetVideoElement, resetGifPlayback]);

  // Loads an image straight from a same-origin URL (e.g. the site logo) rather
  // than a File — used to seed the canvas when a preset is opened from a link.
  const loadImageFromUrl = useCallback((url: string) => {
    resetVideoElement();
    resetGifPlayback();
    const img = new Image();
    img.onload = () => {
      if (sourceCanvasRef.current) {
        const ctx = sourceCanvasRef.current.getContext('2d');
        if (ctx) {
          sourceCanvasRef.current.width = img.width;
          sourceCanvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      }
      setMediaType('image');
      setMediaDims({ width: img.width, height: img.height });
      setFrameVersion((v) => v + 1);
    };
    img.src = url;
  }, [resetVideoElement, resetGifPlayback]);

  const handleVideoLoad = useCallback((file: File) => {
    resetGifPlayback();
    if (videoObjectUrlRef.current) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    videoObjectUrlRef.current = url;
    setMediaDims(null);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setIsVideoPlaying(false);
    setMediaType('video');
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }
  }, [resetGifPlayback]);

  // Draw one decoded GIF frame into the source canvas
  const drawGifFrameToSource = useCallback((index: number) => {
    const source = sourceCanvasRef.current;
    const frame = gifFramesRef.current[index];
    if (!source || !frame) return;
    if (source.width !== frame.width || source.height !== frame.height) {
      source.width = frame.width;
      source.height = frame.height;
    }
    const ctx = source.getContext('2d');
    ctx?.putImageData(frame, 0, 0);
  }, []);

  // Central place to move to a given GIF frame: updates the index ref (used by
  // the playback loop), the index state (used by the UI), draws it, and
  // triggers reprocessing through the shared dithering pipeline.
  const setGifIndex = useCallback((index: number) => {
    const frames = gifFramesRef.current;
    if (frames.length === 0) return;
    const clamped = Math.max(0, Math.min(frames.length - 1, index));
    gifIndexRef.current = clamped;
    setGifFrameIndex(clamped);
    drawGifFrameToSource(clamped);
    setFrameVersion((v) => v + 1);
  }, [drawGifFrameToSource]);

  const pauseGifPlayback = useCallback(() => {
    if (gifPlaybackTimeoutRef.current !== null) {
      clearTimeout(gifPlaybackTimeoutRef.current);
      gifPlaybackTimeoutRef.current = null;
    }
    setIsGifPlaying(false);
  }, []);

  const toggleGifPlayback = useCallback(() => {
    if (gifPlaybackTimeoutRef.current !== null) {
      pauseGifPlayback();
      return;
    }
    setIsGifPlaying(true);
    const tick = () => {
      const frames = gifFramesRef.current;
      if (frames.length === 0) return;
      const next = (gifIndexRef.current + 1) % frames.length;
      setGifIndex(next);
      const delay = gifDelaysRef.current[next] ?? 100;
      gifPlaybackTimeoutRef.current = window.setTimeout(tick, delay);
    };
    const firstDelay = gifDelaysRef.current[gifIndexRef.current] ?? 100;
    gifPlaybackTimeoutRef.current = window.setTimeout(tick, firstDelay);
  }, [pauseGifPlayback, setGifIndex]);

  const stepGifFrame = useCallback((direction: 1 | -1) => {
    pauseGifPlayback();
    setGifIndex(gifIndexRef.current + direction);
  }, [pauseGifPlayback, setGifIndex]);

  const scrubGifTo = useCallback((index: number) => {
    pauseGifPlayback();
    setGifIndex(index);
  }, [pauseGifPlayback, setGifIndex]);

  const handleGifLoad = useCallback(async (file: File) => {
    resetVideoElement();
    resetGifPlayback();
    const arrayBuffer = await file.arrayBuffer();
    const { frames, delays, width, height } = decodeGifFrames(arrayBuffer);
    if (frames.length === 0) return;

    gifFramesRef.current = frames;
    gifDelaysRef.current = delays;
    gifIndexRef.current = 0;

    setMediaType('gif');
    setMediaDims({ width, height });
    setGifFrameCount(frames.length);
    setGifFrameIndex(0);
    drawGifFrameToSource(0);
    setFrameVersion((v) => v + 1);
  }, [resetVideoElement, resetGifPlayback, drawGifFrameToSource]);

  // Draw whatever the video element is currently showing into the source canvas
  const drawVideoFrameToSource = useCallback(() => {
    const video = videoRef.current;
    const source = sourceCanvasRef.current;
    if (!video || !source || video.videoWidth === 0) return;
    if (source.width !== video.videoWidth || source.height !== video.videoHeight) {
      source.width = video.videoWidth;
      source.height = video.videoHeight;
    }
    const ctx = source.getContext('2d');
    ctx?.drawImage(video, 0, 0);
  }, []);

  // Run the dithering pipeline on whatever is currently in the source canvas
  // and write it straight to the output canvas. Synchronous and side-effect
  // free (besides the canvas paint), so it's safe to call from a tight loop.
  const renderFrameToOutput = useCallback(() => {
    const source = sourceCanvasRef.current;
    const output = canvasRef.current;
    if (!source || !output || source.width === 0) return;
    const sourceCtx = source.getContext('2d');
    const outputCtx = output.getContext('2d');
    if (!sourceCtx || !outputCtx) return;

    const sourceImageData = sourceCtx.getImageData(0, 0, source.width, source.height);
    const processed = processImage(sourceImageData, params);

    if (output.width !== source.width || output.height !== source.height) {
      output.width = source.width;
      output.height = source.height;
    }
    outputCtx.putImageData(processed, 0, 0);
  }, [params]);

  const handleVideoLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setMediaDims({ width: video.videoWidth, height: video.videoHeight });
    setVideoDuration(video.duration);
    setVideoCurrentTime(0);
  }, []);

  // Fires once decoded data is buffered. Some browsers/codecs report this
  // before frame 0 is actually paintable via drawImage, so nudge the time
  // forward a hair to force a real decode + 'seeked' event before drawing.
  const handleVideoLoadedData = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(0.001, (video.duration || 0) / 2);
  }, []);

  // Fires after a scrub-seek settles on a frame
  const handleVideoSeeked = useCallback(() => {
    if (!videoRef.current) return;
    setVideoCurrentTime(videoRef.current.currentTime);
    drawVideoFrameToSource();
    setFrameVersion((v) => v + 1);
  }, [drawVideoFrameToSource]);

  // Fires continuously during normal playback
  const handleVideoTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setVideoCurrentTime(video.currentTime);
    if (!video.paused) {
      drawVideoFrameToSource();
      setFrameVersion((v) => v + 1);
    }
  }, [drawVideoFrameToSource]);

  const toggleVideoPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const stepVideoFrame = useCallback((direction: 1 | -1) => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    const next = Math.min(video.duration || 0, Math.max(0, video.currentTime + direction * VIDEO_FRAME_DURATION));
    video.currentTime = next;
  }, []);

  const scrubVideoTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setVideoCurrentTime(time);
    video.currentTime = time;
  }, []);

  const handleRenderVideo = useCallback(async () => {
    const video = videoRef.current;
    const output = canvasRef.current;
    if (!video || !output || mediaType !== 'video') return;

    const format = VIDEO_FORMAT_CANDIDATES[videoExportFormat];
    const mimeType = getSupportedMimeType(format.mimeTypes);

    if (!mimeType || typeof output.captureStream !== 'function') {
      alert('Rendering video isn\'t supported in this browser. Try Chrome, Edge, or Firefox on desktop.');
      return;
    }

    setIsRenderingVideo(true);
    setRenderProgress(0);

    video.pause();
    if (video.currentTime !== 0) {
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
        video.currentTime = 0;
      });
    }
    drawVideoFrameToSource();
    renderFrameToOutput();

    const stream = output.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const safeStop = () => {
      try {
        if (recorder.state !== 'inactive') recorder.stop();
      } catch {
        // already stopped
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dither-dog-${Date.now()}.${format.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRenderingVideo(false);
      setRenderProgress(0);
    };

    let rafId = 0;
    const step = () => {
      if (video.paused || video.ended) {
        safeStop();
        return;
      }
      drawVideoFrameToSource();
      renderFrameToOutput();
      setRenderProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
      rafId = requestAnimationFrame(step);
    };

    video.addEventListener('ended', safeStop, { once: true });

    recorder.start();
    try {
      await video.play();
    } catch {
      safeStop();
      setIsRenderingVideo(false);
      return;
    }
    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [mediaType, videoExportFormat, drawVideoFrameToSource, renderFrameToOutput]);

  const handleRenderGifVideo = useCallback(async () => {
    const output = canvasRef.current;
    const frames = gifFramesRef.current;
    const delays = gifDelaysRef.current;
    if (!output || frames.length === 0) return;

    const format = VIDEO_FORMAT_CANDIDATES[videoExportFormat];
    const mimeType = getSupportedMimeType(format.mimeTypes);

    if (!mimeType || typeof output.captureStream !== 'function') {
      alert('Rendering video isn\'t supported in this browser. Try Chrome, Edge, or Firefox on desktop.');
      return;
    }

    pauseGifPlayback();
    setIsRenderingVideo(true);
    setRenderProgress(0);

    setGifIndex(0);
    renderFrameToOutput();

    const stream = output.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const finished = new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dither-dog-${Date.now()}.${format.extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRenderingVideo(false);
        setRenderProgress(0);
        resolve();
      };
    });

    recorder.start();

    for (let i = 0; i < frames.length; i++) {
      setGifIndex(i);
      renderFrameToOutput();
      setRenderProgress(((i + 1) / frames.length) * 100);
      await new Promise((resolve) => setTimeout(resolve, delays[i] ?? 100));
    }

    recorder.stop();
    await finished;
  }, [videoExportFormat, pauseGifPlayback, setGifIndex, renderFrameToOutput]);

  // Revoke the object URL for any loaded video when it's replaced or unmounted
  useEffect(() => {
    return () => {
      if (videoObjectUrlRef.current) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
      }
      if (gifPlaybackTimeoutRef.current !== null) {
        clearTimeout(gifPlaybackTimeoutRef.current);
      }
    };
  }, []);

  // Restore scroll position immediately after any render
  useLayoutEffect(() => {
    if (sidebarRef.current && scrollPosRef.current > 0) {
      sidebarRef.current.scrollTop = scrollPosRef.current;
    }
  });

  // Track mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!mediaDims || !sourceCanvasRef.current || !canvasRef.current) return;

    const processAsync = async () => {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 0));
      renderFrameToOutput();
      setIsProcessing(false);
    };

    processAsync();
  }, [mediaDims, frameVersion, params, renderFrameToOutput]);

  const loadFile = useCallback((file: File) => {
    if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
      handleGifLoad(file);
    } else if (file.type.startsWith('video/')) {
      handleVideoLoad(file);
    } else if (file.type.startsWith('image/')) {
      handleImageLoad(file);
    }
  }, [handleGifLoad, handleVideoLoad, handleImageLoad]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const IMAGE_FORMATS: Record<'png' | 'jpeg' | 'webp', { mimeType: string; extension: string; quality?: number }> = {
    png: { mimeType: 'image/png', extension: 'png' },
    jpeg: { mimeType: 'image/jpeg', extension: 'jpg', quality: 0.92 },
    webp: { mimeType: 'image/webp', extension: 'webp', quality: 0.92 },
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    const { mimeType, extension, quality } = IMAGE_FORMATS[imageExportFormat];
    const filename = `dither-dog-${Date.now()}.${extension}`;

    // Try to use Share API first (works on mobile)
    if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const file = new File([blob], filename, { type: mimeType });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Dither Dog Image',
              text: 'Processed image from Dither Dog'
            });
          } else {
            // Fallback: convert to data URL and open
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);
          }
        } catch (err) {
          console.error('Share failed:', err);
          // Fallback to data URL download
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
          reader.readAsDataURL(blob);
        }
      }, mimeType, quality);
    }
    // Desktop fallback
    else {
      canvasRef.current.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, mimeType, quality);
    }
  };

  const updateParam = <K extends keyof ProcessingParams>(
    key: K,
    value: ProcessingParams[K]
  ) => {
    // Save scroll position before state update
    if (sidebarRef.current) {
      scrollPosRef.current = sidebarRef.current.scrollTop;
    }
    // Set to "Custom" when manually adjusting a slider
    if (selectedPreset !== '') {
      setSelectedPreset('Custom');
    }
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      setParams((prev) => ({ ...prev, ...preset.params }));
      setSelectedPreset(presetName);
    }
  };

  // Opening /workspace?preset=<name> (e.g. from a homepage preset card) loads
  // a stand-in test photo so the preset has something to preview.
  useEffect(() => {
    const presetName = new URLSearchParams(window.location.search).get('preset');
    if (presetName && presets.some((p) => p.name === presetName)) {
      loadImageFromUrl('/images/preset-test-photo.webp');
      applyPreset(presetName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slider component with drag-to-release behavior
  const SliderControl = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
  }) => {
    const [inputValue, setInputValue] = useState(value.toString());
    const [sliderValue, setSliderValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
      setInputValue(value.toString());
      if (!isDragging) {
        setSliderValue(value);
      }
    }, [value, isDragging]);

    // Handle mouse/touch release anywhere on document
    useEffect(() => {
      if (!isDragging) return;

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        onChange(sliderValue);
      };

      const handleGlobalTouchEnd = () => {
        setIsDragging(false);
        onChange(sliderValue);
      };

      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }, [isDragging, sliderValue, onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(max, Math.max(min, numValue));
        onChange(clampedValue);
        setInputValue(clampedValue.toString());
      } else {
        setInputValue(value.toString());
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleInputBlur();
        e.currentTarget.blur();
      }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setSliderValue(newValue);
      setInputValue(newValue.toString());
    };

    const handleSliderMouseDown = () => {
      setIsDragging(true);
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.currentTarget.select();
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.currentTarget.select();
    };

    // Capitalize only first letter
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

    // Calculate dynamic width based on input value length
    const inputWidth = Math.max(3, inputValue.length) * 0.6 + 2;

    return (
      <div style={{ padding: '0 2rem', marginBottom: '0.625rem' }}>
        <div className="glass-panel" style={{
          padding: '0.5rem',
          borderRadius: '1rem'
        }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.1875rem' }}>
            <label className="text-xs font-bold text-white text-left">
              {formattedLabel}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              style={{ width: `${inputWidth}rem` }}
              className="min-w-[3rem] text-xs font-mono font-bold text-white glass-input px-2 py-1 rounded-lg text-right cursor-text"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseDown={handleSliderMouseDown}
              onTouchStart={handleSliderMouseDown}
              onFocus={(e) => e.preventDefault()}
              style={{ width: 'calc(100% - 40px)', scrollMargin: '0' }}
              className="h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex md:flex-row flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-gradient-dark overflow-hidden md:overflow-auto relative">
      {/* Mobile Menu Toggle Button - Arrow on right edge of sidebar - Only visible on mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed z-[10000] glass-button-primary text-white font-bold rounded"
        style={{
          width: '2rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: isSidebarOpen ? '23.5rem' : '-0.5rem',
          top: 'calc(50% + 2rem)',
          transform: 'translateY(-50%)',
          transition: 'left 300ms'
        }}
        title={isSidebarOpen ? "Close Menu" : "Open Menu"}
      >
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{isSidebarOpen ? '←' : '→'}</span>
      </button>

      {/* Overlay for mobile when sidebar is open - Only on mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, collapsible on mobile */}
      <aside
        ref={sidebarRef}
        className={`w-[24rem] min-w-[24rem] max-w-[24rem] glass-sidebar flex flex-col overflow-y-auto flex-shrink-0 transition-transform duration-300
          md:!translate-x-0 md:relative md:z-5
          fixed left-0 top-16 h-[calc(100%-4rem)] md:top-0 md:h-full z-[9999] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div style={{ padding: '1rem 0' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />

          {/* Load Media Button */}
          <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
            <label
              htmlFor="file-input"
              className="block w-full px-4 py-5 glass-button-primary text-white text-base font-bold rounded cursor-pointer text-center shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 tracking-wide"
            >
              {hasMedia ? 'Change Media' : 'Load Image, GIF, or Video'}
            </label>
          </div>

          {/* Dithering Presets */}
          <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
            <label className="block text-xs font-bold text-white" style={{ marginBottom: '0.25rem' }}>
              Dithering Presets
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                if (e.target.value && e.target.value !== 'Custom') {
                  applyPreset(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded focus:outline-none"
            >
              <option value="">Select A Preset...</option>
              {selectedPreset === 'Custom' && <option value="Custom">Custom</option>}
              {presets.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Effect Type */}
          <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
            <label className="block text-xs font-bold text-white" style={{ marginBottom: '0.25rem' }}>
              Effect type
            </label>
            <select
              value={params.effect}
              onChange={(e) => updateParam('effect', e.target.value as ProcessingParams['effect'])}
              className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded focus:outline-none"
            >
              <option value="none">None</option>
              <option value="dithering">Dithering</option>
              <option value="threshold">Threshold</option>
              <option value="edge-detect">Edge Detection</option>
            </select>
          </div>

          {/* Invert Button */}
          <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
            <button
              onClick={() => updateParam('invert', !params.invert)}
              className={`w-full px-4 py-3 text-sm font-bold rounded transition-all duration-300 cursor-pointer active:scale-[0.97] ${
                params.invert
                  ? 'glass-button-primary text-white'
                  : 'glass-panel text-white/60 border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              {params.invert ? 'Invert: On' : 'Invert: Off'}
            </button>
          </div>

          {/* Color Palette */}
          <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
            <label className="block text-xs font-bold text-white" style={{ marginBottom: '0.25rem' }}>
              Color palette
            </label>
                  <select
                    value={params.colorPalette}
                    onChange={(e) => updateParam('colorPalette', e.target.value as ColorPalette)}
                    className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded focus:outline-none"
                  >
                    <option value="full-color">Full Color</option>
                    <optgroup label="Basic">
                      <option value="black-white">Black & White</option>
                      <option value="red-black">Red & Black</option>
                      <option value="blue-white">Blue & White</option>
                      <option value="green-black">Green & Black</option>
                    </optgroup>
                    <optgroup label="Retro">
                      <option value="sepia">Sepia</option>
                      <option value="gameboy">Game Boy</option>
                      <option value="commodore64">Commodore 64</option>
                      <option value="amber-crt">Amber CRT</option>
                      <option value="green-terminal">Green Terminal</option>
                    </optgroup>
                    <optgroup label="Neon">
                      <option value="cyan-magenta">Cyan & Magenta</option>
                      <option value="neon-pink">Neon Pink</option>
                      <option value="electric-blue">Electric Blue</option>
                      <option value="lime-purple">Lime & Purple</option>
                      <option value="hot-pink-cyan">Hot Pink & Cyan</option>
                    </optgroup>
                    <optgroup label="Vintage">
                      <option value="orange-blue">Orange & Blue</option>
                      <option value="purple-yellow">Purple & Yellow</option>
                      <option value="teal-orange">Teal & Orange</option>
                      <option value="burgundy-cream">Burgundy & Cream</option>
                    </optgroup>
                    <optgroup label="Nature">
                      <option value="forest-green">Forest Green</option>
                      <option value="ocean-blue">Ocean Blue</option>
                      <option value="sunset-red">Sunset Red</option>
                      <option value="lavender-sage">Lavender & Sage</option>
                    </optgroup>
            </select>
          </div>

          {/* Dithering Algorithm */}
          {params.effect === 'dithering' && (
            <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
              <label className="block text-xs font-bold text-white" style={{ marginBottom: '0.25rem' }}>
                Dithering algorithm
              </label>
                      <select
                        value={params.ditheringAlgorithm}
                        onChange={(e) => updateParam('ditheringAlgorithm', e.target.value as DitheringAlgorithm)}
                        className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded focus:outline-none"
                      >
                        <optgroup label="Error Diffusion">
                          <option value="floyd-steinberg">Floyd-Steinberg</option>
                          <option value="atkinson">Atkinson</option>
                          <option value="jarvis-judice-ninke">Jarvis-Judice-Ninke</option>
                          <option value="stucki">Stucki</option>
                          <option value="burkes">Burkes</option>
                          <option value="sierra">Sierra</option>
                          <option value="sierra-lite">Sierra-Lite</option>
                          <option value="two-row-sierra">Two-Row Sierra</option>
                          <option value="variable-error">Variable Error (Adaptive)</option>
                        </optgroup>
                        <optgroup label="Ordered Dither">
                          <option value="bayer-2x2">Bayer 2x2</option>
                          <option value="bayer-4x4">Bayer 4x4</option>
                          <option value="bayer-8x8">Bayer 8x8</option>
                          <option value="ordered">Ordered</option>
                          <option value="blue-noise">Blue Noise (High Quality)</option>
                          <option value="clustered-dot">Clustered Dot (Halftone)</option>
                        </optgroup>
                        <optgroup label="Artistic Patterns">
                          <option value="crosshatch">Crosshatch</option>
                          <option value="halftone-dots">Halftone Dots</option>
                          <option value="newspaper">Newspaper Print</option>
                          <option value="stipple">Stipple/Pointillism</option>
                          <option value="grid-pattern">Grid Pattern</option>
                          <option value="spiral">Spiral</option>
                        </optgroup>
                        <optgroup label="Line Patterns">
                          <option value="horizontal-lines">Horizontal Lines</option>
                          <option value="vertical-lines">Vertical Lines</option>
                          <option value="diagonal-lines">Diagonal Lines</option>
                        </optgroup>
                        <optgroup label="Noise & Random">
                          <option value="random">Random</option>
                          <option value="white-noise">White Noise</option>
                          <option value="noise-texture">Noise Texture</option>
                        </optgroup>
                        <optgroup label="Special Algorithms">
                          <option value="riemersma">Riemersma (Space-Filling)</option>
                        </optgroup>
                      </select>
            </div>
          )}

          <SliderControl
                  label="Brightness"
                  value={params.brightness}
                  onChange={(v) => updateParam('brightness', v)}
                  min={-50}
                  max={50}
                  step={1}
                />

          <SliderControl
            label="Contrast"
            value={params.contrast}
            onChange={(v) => updateParam('contrast', v)}
            min={-50}
            max={50}
            step={1}
          />

          {/* Threshold Section */}
          {params.effect === 'threshold' && (
            <>
              <SliderControl
                label="Threshold"
                value={params.threshold}
                onChange={(v) => updateParam('threshold', v)}
                min={0}
                max={255}
                step={1}
              />
            </>
          )}

          {/* Dithering Controls Section */}
          {params.effect === 'dithering' && (
            <>
              <SliderControl
                label="Effect scale"
                value={params.effectScale}
                onChange={(v) => updateParam('effectScale', v)}
                min={0.5}
                max={2}
                step={0.1}
              />

              <SliderControl
                label="Effect size"
                value={params.effectSize}
                onChange={(v) => updateParam('effectSize', v)}
                min={1}
                max={16}
                step={1}
              />

              <SliderControl
                label="Dither contrast"
                value={params.ditherContrast}
                onChange={(v) => updateParam('ditherContrast', v)}
                min={80}
                max={200}
                step={5}
              />

              <SliderControl
                label="Luminance threshold"
                value={params.luminanceThreshold}
                onChange={(v) => updateParam('luminanceThreshold', v)}
                min={64}
                max={192}
                step={1}
              />

              <SliderControl
                label="Blur"
                value={params.blur}
                onChange={(v) => updateParam('blur', v)}
                min={0}
                max={5}
                step={0.1}
              />

              <SliderControl
                label="Depth"
                value={params.depth}
                onChange={(v) => updateParam('depth', v)}
                min={10}
                max={70}
                step={1}
              />
            </>
          )}

          {/* Export Panel */}
          {hasMedia && (
            <div style={{ padding: '0 2rem', marginTop: '1rem' }}>
              <div className="glass-panel py-6 px-7 space-y-4 rounded">
                <div className="space-y-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-semibold">Width</span>
                    <span className="font-mono font-bold text-white">{mediaDims?.width ?? 0}px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-semibold">Height</span>
                    <span className="font-mono font-bold text-white">{mediaDims?.height ?? 0}px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-semibold">Status</span>
                    <span className="font-bold text-white">
                      {isRenderingVideo
                        ? `Rendering... ${Math.round(renderProgress)}%`
                        : isProcessing
                          ? 'Processing...'
                          : 'Ready'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-white/70">
                    {mediaType === 'video' || mediaType === 'gif' ? 'Frame format' : 'Format'}
                  </label>
                  <select
                    value={imageExportFormat}
                    onChange={(e) => setImageExportFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                    className="w-full px-3 py-2 text-xs glass-input text-white font-semibold rounded focus:outline-none"
                  >
                    <option value="png">PNG (.png)</option>
                    <option value="jpeg">JPEG (.jpg)</option>
                    <option value="webp">WebP (.webp)</option>
                  </select>
                </div>

                {(mediaType === 'video' || mediaType === 'gif') && availableVideoFormats.length > 0 && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-white/70">Video format</label>
                    <select
                      value={videoExportFormat}
                      onChange={(e) => setVideoExportFormat(e.target.value as 'webm' | 'mp4')}
                      className="w-full px-3 py-2 text-xs glass-input text-white font-semibold rounded focus:outline-none"
                    >
                      {availableVideoFormats.map((format) => (
                        <option key={format} value={format}>
                          {VIDEO_FORMAT_CANDIDATES[format].label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {mediaType === 'video' || mediaType === 'gif' ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleExport}
                      disabled={isProcessing || isRenderingVideo}
                      className="w-full px-6 py-3 glass-button-primary text-white text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Save Frame
                    </button>
                    <button
                      onClick={mediaType === 'video' ? handleRenderVideo : handleRenderGifVideo}
                      disabled={isProcessing || isRenderingVideo}
                      className="w-full px-6 py-3 glass-button text-white text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isRenderingVideo ? `Rendering ${Math.round(renderProgress)}%` : 'Render Video'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleExport}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 glass-button-primary text-white text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Export Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden overscroll-none z-10 w-full md:w-auto">
        {!hasMedia ? (
          <div
            className="text-center p-28 transition-all duration-300 rounded"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: isDragOver ? '3px dashed rgba(255, 107, 53, 0.8)' : '3px dashed transparent',
              background: isDragOver ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
              transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <NextImage
              src="/apple-touch-icon.png"
              alt="Dither Dog logo"
              width={64}
              height={64}
              className="mx-auto mb-8 rounded"
              style={{
                opacity: isDragOver ? 0.7 : 1,
                transform: isDragOver ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            />
            <p className="text-white/60 text-xl font-bold mb-12 tracking-wide">
              {isDragOver ? 'Drop It Here' : 'Load An Image, GIF, Or Video To Start Or Drag & Drop'}
            </p>
            <label
              htmlFor="file-input"
              className="inline-block glass-button-primary text-white text-lg font-bold rounded cursor-pointer text-center shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300"
              style={{ letterSpacing: '0rem', paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            >
              Choose File
            </label>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 bg-transparent">
            <div
              className="flex-1 flex items-center justify-center w-full overflow-hidden cursor-grab active:cursor-grabbing bg-transparent touch-pan-y"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  setPan({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                  });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div
                className="glass-panel rounded p-3 md:p-8"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  display: 'inline-block'
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="rounded-md block"
                  style={{
                    maxWidth: isMobile ? 'calc(100vw - 4rem)' : 'calc(100vw - 30rem)',
                    maxHeight: mediaType === 'video' || mediaType === 'gif' ? 'calc(100vh - 21rem)' : 'calc(100vh - 16rem)',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
            </div>

            {/* Timeline — scrub, step, and play/pause frame-by-frame (video or gif) */}
            {(mediaType === 'video' || mediaType === 'gif') && (
              <div
                className="glass-panel w-full rounded"
                style={{ maxWidth: '40rem', padding: '0.75rem 1.25rem', marginBottom: '0.75rem' }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => (mediaType === 'video' ? stepVideoFrame(-1) : stepGifFrame(-1))}
                    disabled={isRenderingVideo}
                    className="flex items-center justify-center glass-button-primary text-white font-bold rounded disabled:opacity-50"
                    style={{ width: '2.25rem', height: '2.25rem', flexShrink: 0 }}
                    title="Previous Frame"
                  >
                    <span style={{ fontSize: '0.9rem' }}>⏮</span>
                  </button>

                  <button
                    onClick={mediaType === 'video' ? toggleVideoPlayback : toggleGifPlayback}
                    disabled={isRenderingVideo}
                    className="flex items-center justify-center glass-button-primary text-white font-bold rounded disabled:opacity-50"
                    style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}
                    title={(mediaType === 'video' ? isVideoPlaying : isGifPlaying) ? 'Pause' : 'Play'}
                  >
                    <span style={{ fontSize: '1rem' }}>{(mediaType === 'video' ? isVideoPlaying : isGifPlaying) ? '⏸' : '▶'}</span>
                  </button>

                  <button
                    onClick={() => (mediaType === 'video' ? stepVideoFrame(1) : stepGifFrame(1))}
                    disabled={isRenderingVideo}
                    className="flex items-center justify-center glass-button-primary text-white font-bold rounded disabled:opacity-50"
                    style={{ width: '2.25rem', height: '2.25rem', flexShrink: 0 }}
                    title="Next Frame"
                  >
                    <span style={{ fontSize: '0.9rem' }}>⏭</span>
                  </button>

                  {mediaType === 'video' ? (
                    <input
                      type="range"
                      min={0}
                      max={videoDuration || 0}
                      step={VIDEO_FRAME_DURATION}
                      value={videoCurrentTime}
                      disabled={isRenderingVideo}
                      onChange={(e) => scrubVideoTo(Number(e.target.value))}
                      className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[var(--accent)] disabled:opacity-50"
                    />
                  ) : (
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, gifFrameCount - 1)}
                      step={1}
                      value={gifFrameIndex}
                      disabled={isRenderingVideo}
                      onChange={(e) => scrubGifTo(Number(e.target.value))}
                      className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[var(--accent)] disabled:opacity-50"
                    />
                  )}

                  <span
                    className="font-mono text-xs font-bold text-white/70"
                    style={{ minWidth: '5.5rem', textAlign: 'right', flexShrink: 0 }}
                  >
                    {mediaType === 'video'
                      ? `${formatTime(videoCurrentTime)} / ${formatTime(videoDuration)}`
                      : `${gifFrameIndex + 1} / ${gifFrameCount}`}
                  </span>
                </div>
              </div>
            )}

            {/* Zoom and Fullscreen Controls */}
            <div className="flex items-center justify-center gap-2 md:gap-3" style={{ marginTop: '0rem', marginBottom: isMobile ? '5rem' : '2rem' }}>
              <button
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                className="flex items-center justify-center glass-button-primary rounded font-bold text-white"
                style={{ width: isMobile ? '2.25rem' : '2.75rem', height: isMobile ? '2.25rem' : '2.75rem' }}
                title="Zoom In"
              >
                <span style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#43;</span>
              </button>

              <button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                className="flex items-center justify-center glass-button-primary rounded font-bold text-white"
                style={{ width: isMobile ? '2.25rem' : '2.75rem', height: isMobile ? '2.25rem' : '2.75rem' }}
                title="Zoom Out"
              >
                <span style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8722;</span>
              </button>

              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="flex items-center justify-center glass-button-primary rounded font-bold text-white"
                style={{ width: isMobile ? '2.25rem' : '2.75rem', height: isMobile ? '2.25rem' : '2.75rem' }}
                title="Reset View"
              >
                <span style={{ fontSize: isMobile ? '1.15rem' : '1.4rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⟲</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.documentElement;
                  if (!isFullscreen) {
                    if (elem.requestFullscreen) {
                      elem.requestFullscreen();
                    }
                  } else {
                    if (document.exitFullscreen) {
                      document.exitFullscreen();
                    }
                  }
                  setIsFullscreen(!isFullscreen);
                }}
                className="flex items-center justify-center glass-button-primary rounded font-bold text-white"
                style={{ width: isMobile ? '2.25rem' : '2.75rem', height: isMobile ? '2.25rem' : '2.75rem' }}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <svg
                  width={isMobile ? 16 : 19}
                  height={isMobile ? 16 : 19}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isFullscreen ? (
                    <>
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </>
                  ) : (
                    <>
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}
        <canvas ref={sourceCanvasRef} className="hidden" />
        <video
          ref={videoRef}
          className="hidden"
          muted
          playsInline
          onLoadedMetadata={handleVideoLoadedMetadata}
          onLoadedData={handleVideoLoadedData}
          onSeeked={handleVideoSeeked}
          onTimeUpdate={handleVideoTimeUpdate}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
        />
      </main>
    </div>
  );
}
