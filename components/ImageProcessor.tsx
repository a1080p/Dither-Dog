'use client';

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
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
];

export default function ImageProcessor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const scrollPosRef = useRef(0);

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        if (sourceCanvasRef.current) {
          const ctx = sourceCanvasRef.current.getContext('2d');
          if (ctx) {
            sourceCanvasRef.current.width = img.width;
            sourceCanvasRef.current.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // Restore scroll position immediately after any render
  useLayoutEffect(() => {
    if (sidebarRef.current && scrollPosRef.current > 0) {
      sidebarRef.current.scrollTop = scrollPosRef.current;
    }
  });

  useEffect(() => {
    if (!image || !sourceCanvasRef.current || !canvasRef.current) return;

    const processAsync = async () => {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 0));

      const sourceCtx = sourceCanvasRef.current?.getContext('2d');
      const ctx = canvasRef.current?.getContext('2d');

      if (!sourceCtx || !ctx) return;

      const sourceImageData = sourceCtx.getImageData(
        0,
        0,
        sourceCanvasRef.current!.width,
        sourceCanvasRef.current!.height
      );

      const processed = processImage(sourceImageData, params);

      canvasRef.current!.width = image.width;
      canvasRef.current!.height = image.height;
      ctx.putImageData(processed, 0, 0);

      setIsProcessing(false);
    };

    processAsync();
  }, [image, params]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageLoad(file);
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
    if (file && file.type.startsWith('image/')) {
      handleImageLoad(file);
    }
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
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
      <div style={{ marginBottom: '0.5rem', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="glass-panel" style={{
          padding: '0.75rem',
          borderRadius: '1rem'
        }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.375rem' }}>
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
              className="h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#ff6b35]"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-dark overflow-hidden relative">
      <aside ref={sidebarRef} className="w-[24rem] min-w-[24rem] max-w-[24rem] glass-sidebar flex flex-col overflow-y-auto flex-shrink-0 relative z-10">
        <div className="py-4 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />

          <div style={{ paddingLeft: '90px', paddingRight: '90px', paddingTop: '16px' }}>
            <label
              htmlFor="file-input"
              className="block w-full px-4 py-5 glass-button-primary text-white text-lg font-bold rounded-3xl cursor-pointer text-center shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 tracking-wide"
            >
              {image ? 'Change Image' : 'Load Image'}
            </label>
          </div>

          <div style={{ height: '1rem' }}></div>

          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <label className="block text-xs font-bold text-white mb-2">
              Dithering Presets
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                if (e.target.value && e.target.value !== 'Custom') {
                  applyPreset(e.target.value);
                }
              }}
              className="w-full px-8 py-8 text-sm glass-input text-white font-semibold rounded-xl focus:outline-none"
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

          <div style={{ height: '1rem' }}></div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-50" style={{ marginLeft: '20px', marginRight: '20px' }}></div>
          <div style={{ height: '1rem' }}></div>

          <div className="space-y-3">
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <label className="block text-xs font-bold text-white mb-2">
                Effect type
              </label>
              <select
                value={params.effect}
                onChange={(e) => updateParam('effect', e.target.value as ProcessingParams['effect'])}
                className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded-xl focus:outline-none"
              >
                <option value="none">None</option>
                <option value="dithering">Dithering</option>
                <option value="threshold">Threshold</option>
                <option value="edge-detect">Edge Detection</option>
              </select>
            </div>

            <div style={{ height: '1rem' }}></div>

            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <label className="block text-xs font-bold text-white mb-2">
                Color palette
              </label>
              <select
                value={params.colorPalette}
                onChange={(e) => updateParam('colorPalette', e.target.value as ColorPalette)}
                className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded-xl focus:outline-none"
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

            <div style={{ height: '1rem' }}></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ marginLeft: '20px', marginRight: '20px' }}></div>
            <div style={{ height: '1rem' }}></div>

            {params.effect === 'dithering' && (
              <>
                <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                  <label className="block text-xs font-bold text-white mb-2">
                    Dithering algorithm
                  </label>
                  <select
                    value={params.ditheringAlgorithm}
                    onChange={(e) => updateParam('ditheringAlgorithm', e.target.value as DitheringAlgorithm)}
                    className="w-full px-3 py-2 text-sm glass-input text-white font-semibold rounded-xl focus:outline-none"
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
                <div style={{ height: '1rem' }}></div>
              </>
            )}

            <div style={{ height: '1rem' }}></div>
            <div className="h-px bg-white/30" style={{ marginLeft: '20px', marginRight: '20px' }}></div>
            <div style={{ height: '1rem' }}></div>

            <SliderControl
              label="Brightness"
              value={params.brightness}
              onChange={(v) => updateParam('brightness', v)}
              min={-255}
              max={255}
              step={1}
            />

            <SliderControl
              label="Contrast"
              value={params.contrast}
              onChange={(v) => updateParam('contrast', v)}
              min={-255}
              max={255}
              step={1}
            />

            {params.effect === 'threshold' && (
              <>
                <div className="h-px bg-[#ff6b35]" style={{ marginLeft: '20px', marginRight: '20px' }}></div>
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

            {params.effect === 'dithering' && (
              <>
                <div className="h-px bg-[#ff6b35]" style={{ marginLeft: '20px', marginRight: '20px' }}></div>

                <SliderControl
                  label="Effect scale"
                  value={params.effectScale}
                  onChange={(v) => updateParam('effectScale', v)}
                  min={0.1}
                  max={5}
                  step={0.1}
                />

                <SliderControl
                  label="Effect size"
                  value={params.effectSize}
                  onChange={(v) => updateParam('effectSize', v)}
                  min={1}
                  max={64}
                  step={1}
                />

                {/* Invert Button */}
                <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => updateParam('invert', !params.invert)}
                    className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                      params.invert
                        ? 'glass-button-primary text-white'
                        : 'glass-panel text-white/60 hover:text-white'
                    }`}
                  >
                    {params.invert ? 'Invert: On' : 'Invert: Off'}
                  </button>
                </div>

                <SliderControl
                  label="Dither contrast"
                  value={params.ditherContrast}
                  onChange={(v) => updateParam('ditherContrast', v)}
                  min={50}
                  max={500}
                  step={5}
                />

                <SliderControl
                  label="Luminance threshold"
                  value={params.luminanceThreshold}
                  onChange={(v) => updateParam('luminanceThreshold', v)}
                  min={0}
                  max={255}
                  step={1}
                />

                <SliderControl
                  label="Blur"
                  value={params.blur}
                  onChange={(v) => updateParam('blur', v)}
                  min={0}
                  max={20}
                  step={0.5}
                />

                <SliderControl
                  label="Depth"
                  value={params.depth}
                  onChange={(v) => updateParam('depth', v)}
                  min={2}
                  max={100}
                  step={1}
                />
              </>
            )}
          </div>
        </div>

        {image && (
          <div className="mt-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div className="glass-panel py-5 px-6 space-y-4 rounded-2xl">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 font-semibold">Width</span>
                  <span className="font-mono font-bold text-white">{image.width}px</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 font-semibold">Height</span>
                  <span className="font-mono font-bold text-white">{image.height}px</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 font-semibold">Status</span>
                  <span className={`font-bold ${isProcessing ? 'text-white' : 'text-white'}`}>
                    {isProcessing ? 'Processing...' : 'Ready'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="w-full px-6 py-3 glass-button-primary text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Export Image
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden overscroll-none z-10">
        {!image ? (
          <div
            className="text-center p-16 transition-all duration-300 rounded-3xl"
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
            <svg
              className="mx-auto h-32 w-32 text-white/40 mb-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                opacity: isDragOver ? 0.7 : 1,
                transform: isDragOver ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-white/60 text-xl font-bold mb-12 tracking-wide">
              {isDragOver ? 'Drop Image Here' : 'Load An Image To Start Or Drag & Drop'}
            </p>
            <label
              htmlFor="file-input"
              className="inline-block glass-button-primary text-white text-2xl font-bold rounded-3xl cursor-pointer text-center shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300"
              style={{ letterSpacing: '0rem', paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            >
              Choose Image
            </label>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent">
            <div
              className="flex-1 flex items-center justify-center w-full overflow-hidden cursor-grab active:cursor-grabbing bg-transparent"
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
                className="glass-panel rounded-3xl p-6"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  display: 'inline-block'
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="rounded-2xl block"
                  style={{
                    maxWidth: 'calc(100vw - 30rem)',
                    maxHeight: 'calc(100vh - 16rem)',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
            </div>

            {/* Zoom and Fullscreen Controls */}
            <div className="flex items-center justify-center gap-5" style={{ marginTop: '0rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                className="flex items-center justify-center glass-button-primary text-white font-bold rounded-2xl"
                style={{ width: '4rem', height: '4rem' }}
                title="Zoom In"
              >
                <span style={{ fontSize: '3rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#43;</span>
              </button>

              <button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                className="flex items-center justify-center glass-button-primary text-white font-bold rounded-2xl"
                style={{ width: '4rem', height: '4rem' }}
                title="Zoom Out"
              >
                <span style={{ fontSize: '3rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8722;</span>
              </button>

              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="flex items-center justify-center glass-button-primary text-white font-bold rounded-2xl"
                style={{ width: '4rem', height: '4rem' }}
                title="Reset View"
              >
                <span style={{ fontSize: '2.5rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⟲</span>
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
                className="flex items-center justify-center glass-button-primary text-white font-bold rounded-2xl"
                style={{ width: '4rem', height: '4rem' }}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <span style={{ fontSize: '2.5rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊞</span>
              </button>
            </div>
          </div>
        )}
        <canvas ref={sourceCanvasRef} className="hidden" />
      </main>
    </div>
  );
}
