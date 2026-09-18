'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return { h: Number.isNaN(h) ? 0 : h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const WHEEL_SIZE = 130;

export default function ColorWheelPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [hsl, setHsl] = useState(() => hexToHsl(value));
  const [isDragging, setIsDragging] = useState(false);
  const [hexInput, setHexInput] = useState(value);

  // Sync from external value changes (e.g. preset applied) while not actively dragging
  useEffect(() => {
    if (!isDragging) {
      setHsl(hexToHsl(value));
      setHexInput(value);
    }
  }, [value, isDragging]);

  const updateFromPointer = useCallback((clientX: number, clientY: number, lightness: number) => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const radius = Math.min(rect.width, rect.height) / 2;
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / radius);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const newHsl = { h: angle, s: dist * 100, l: lightness };
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const point = 'touches' in e ? e.touches[0] : e;
    updateFromPointer(point.clientX, point.clientY, hsl.l);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const point = 'touches' in e ? e.touches[0] : e;
      if (!point) return;
      updateFromPointer(point.clientX, point.clientY, hsl.l);
    };
    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, hsl.l, updateFromPointer]);

  const handleLightnessChange = (l: number) => {
    const newHsl = { ...hsl, l };
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexInput(hex);
    onChange(hex);
  };

  const handleHexBlur = () => {
    const cleaned = hexInput.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(cleaned)) {
      const hex = cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
      setHsl(hexToHsl(hex));
      setHexInput(hex);
      onChange(hex);
    } else {
      setHexInput(value);
    }
  };

  // Pointer dot position on the wheel
  const radiusFrac = hsl.s / 100;
  const angleRad = (hsl.h * Math.PI) / 180;
  const dotX = WHEEL_SIZE / 2 + Math.cos(angleRad) * radiusFrac * (WHEEL_SIZE / 2);
  const dotY = WHEEL_SIZE / 2 + Math.sin(angleRad) * radiusFrac * (WHEEL_SIZE / 2);

  const currentHex = hslToHex(hsl.h, hsl.s, hsl.l);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <label className="text-xs font-bold text-white text-center">{label}</label>

      <div
        ref={wheelRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
          borderRadius: '50%',
          position: 'relative',
          cursor: 'crosshair',
          touchAction: 'none',
          background: `radial-gradient(circle, hsl(0,0%,${hsl.l}%) 0%, transparent 72%),
            conic-gradient(from 0deg,
              hsl(0,100%,${hsl.l}%), hsl(60,100%,${hsl.l}%), hsl(120,100%,${hsl.l}%),
              hsl(180,100%,${hsl.l}%), hsl(240,100%,${hsl.l}%), hsl(300,100%,${hsl.l}%), hsl(360,100%,${hsl.l}%))`,
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: dotX,
            top: dotY,
            width: '0.85rem',
            height: '0.85rem',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            background: currentHex,
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={hsl.l}
        onChange={(e) => handleLightnessChange(Number(e.target.value))}
        style={{
          width: `${WHEEL_SIZE}px`,
          background: `linear-gradient(to right, #000, hsl(${hsl.h},${hsl.s}%,50%), #fff)`,
        }}
        className="h-2 rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <div
          style={{
            width: '1.1rem',
            height: '1.1rem',
            flexShrink: 0,
            background: currentHex,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={handleHexBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          style={{ width: '5rem' }}
          className="text-xs font-mono font-bold text-white glass-input px-2 py-1 rounded-none text-center cursor-text"
        />
      </div>
    </div>
  );
}
