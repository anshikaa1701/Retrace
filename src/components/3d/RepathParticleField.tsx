import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RepathParticleFieldProps {
  count?: number;
  phase?: 'ambient' | 'core' | 'passport' | 'materials' | 'converge';
  accentColor?: string;
}

export const RepathParticleField: React.FC<RepathParticleFieldProps> = ({
  count = 6000,
  phase = 'ambient',
  accentColor = '#F59E0B'
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);

  // Determine particle density based on device memory/screen
  const particleCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.min(count, 2500);
    }
    return count;
  }, [count]);

  // Generate initial particle positions, original anchors, speeds, and colors
  const [positions, initialPositions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initPos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);

    const baseColor = new THREE.Color(accentColor);
    const cyanColor = new THREE.Color('#06B6D4');
    const emeraldColor = new THREE.Color('#10B981');
    const dimColor = new THREE.Color('#404040');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Spherical distribution with layered shell depth
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      initPos[i3] = x;
      initPos[i3 + 1] = y;
      initPos[i3 + 2] = z;

      // Color variation: mostly charcoal/dim with intentional amber/cyan/emerald accents
      const rand = Math.random();
      let chosenColor = dimColor;
      if (rand > 0.85) {
        chosenColor = baseColor;
      } else if (rand > 0.75) {
        chosenColor = emeraldColor;
      } else if (rand > 0.68) {
        chosenColor = cyanColor;
      }

      col[i3] = chosenColor.r;
      col[i3 + 1] = chosenColor.g;
      col[i3 + 2] = chosenColor.b;

      sca[i] = Math.random() * 1.8 + 0.6;
    }

    return [pos, initPos, col, sca];
  }, [particleCount, accentColor]);

  // High performance frame loop (runs on GPU render clock without React state re-renders)
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();
    const mouse = state.pointer;

    // Subtle overall field rotation
    pointsRef.current.rotation.y += delta * 0.08;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      -mouse.y * 0.25,
      delta * 2
    );
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(
      pointsRef.current.rotation.z,
      mouse.x * 0.2,
      delta * 2
    );

    // Calculate phase modifiers
    let radiusScale = 1.0;
    if (phase === 'core') radiusScale = 0.65;
    if (phase === 'passport') radiusScale = 1.1;
    if (phase === 'materials') radiusScale = 1.6;
    if (phase === 'converge') radiusScale = 0.35;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const ox = initialPositions[i3] * radiusScale;
      const oy = initialPositions[i3 + 1] * radiusScale;
      const oz = initialPositions[i3 + 2] * radiusScale;

      // Gentle procedural harmonic floating
      const wave = Math.sin(time * 0.8 + i * 0.1) * 0.08;
      const cosWave = Math.cos(time * 0.6 + i * 0.1) * 0.08;

      posArr[i3] = THREE.MathUtils.lerp(posArr[i3], ox + wave, delta * 1.5);
      posArr[i3 + 1] = THREE.MathUtils.lerp(posArr[i3 + 1], oy + cosWave, delta * 1.5);
      posArr[i3 + 2] = THREE.MathUtils.lerp(posArr[i3 + 2], oz, delta * 1.5);
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
