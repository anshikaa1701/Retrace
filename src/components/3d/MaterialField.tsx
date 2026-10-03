import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const MATERIALS = [
  { name: 'ALUMINIUM 6000', color: '#CBD5E1', count: 400, radius: 1.8, speed: 0.6 },
  { name: 'OPTICAL GLASS', color: '#38BDF8', count: 350, radius: 2.3, speed: 0.45 },
  { name: 'COPPER BUSBARS', color: '#F97316', count: 300, radius: 2.7, speed: 0.7 },
  { name: 'LITHIUM COBALT', color: '#10B981', count: 400, radius: 3.2, speed: 0.55 },
  { name: 'RECYCLED POLYMERS', color: '#A855F7', count: 300, radius: 3.6, speed: 0.4 }
];

export const MaterialField: React.FC = () => {
  const fieldGroupRef = useRef<THREE.Group | null>(null);

  // Pre-generate particle clusters for each discrete material category
  const materialClusters = useMemo(() => {
    return MATERIALS.map((mat) => {
      const pos = new Float32Array(mat.count * 3);
      for (let i = 0; i < mat.count; i++) {
        const i3 = i * 3;
        const theta = (i / mat.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const r = mat.radius + (Math.random() - 0.5) * 0.35;
        const y = (Math.random() - 0.5) * 0.7;

        pos[i3] = Math.cos(theta) * r;
        pos[i3 + 1] = y;
        pos[i3 + 2] = Math.sin(theta) * r;
      }
      return { ...mat, positions: pos };
    });
  }, []);

  useFrame((state, delta) => {
    if (!fieldGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // Responsive camera tilt
    fieldGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      fieldGroupRef.current.rotation.x,
      0.5 - pointer.y * 0.2,
      delta * 2
    );
    fieldGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      fieldGroupRef.current.rotation.y,
      time * 0.12 + pointer.x * 0.25,
      delta * 2
    );
  });

  return (
    <group ref={fieldGroupRef}>
      {/* Central Fragmented Core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.4}
          metalness={0.9}
          wireframe
        />
      </mesh>

      {/* Orbiting Concentric Material Streams */}
      {materialClusters.map((cluster) => (
        <group key={cluster.name}>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[cluster.positions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.045}
              color={cluster.color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

          {/* Floating Category Label Tag */}
          <Text
            position={[cluster.radius, 0.4, 0]}
            fontSize={0.12}
            color={cluster.color}
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {cluster.name}
          </Text>
        </group>
      ))}
    </group>
  );
};
