"use client";

import React, { useEffect, useState } from 'react';
import { Smoke } from '@/components/ui/shadcn-io/smoke';

interface InteractiveSmokeProps {
  children?: React.ReactNode;
  className?: string;
}

export function InteractiveSmoke({ children, className }: InteractiveSmokeProps) {
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0.05]);
  const [windStrength, setWindStrength] = useState<[number, number, number]>([0.01, 0.01, 0.01]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const rotationX = (y - 0.5) * 0.08;
      const rotationY = (x - 0.5) * 0.08;
      const rotationZ = 0.03;

      setRotation([rotationX, rotationY, rotationZ]);

      const windX = (x - 0.5) * 0.015;
      const windY = (y - 0.5) * 0.015;
      const windZ = 0.008;

      setWindStrength([windX, windY, windZ]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={className}>
      <Smoke
        density={50}
        color="#808080"
        opacity={0.25}
        enableRotation={true}
        rotation={rotation}
        enableWind={true}
        windStrength={windStrength}
        enableTurbulence={true}
        turbulenceStrength={[0.015, 0.015, 0.015]}
        useSimpleScene={true}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
