import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductCoreProps {
  interactive?: boolean;
}

export const ProductCore: React.FC<ProductCoreProps> = ({ interactive = true }) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const shellOuterRef = useRef<THREE.Mesh | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const dataNodesRef = useRef<THREE.Points | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // Smooth subtle idle rotation
    groupRef.current.rotation.y += delta * 0.35;

    // Cursor influence on orientation with spring-like easing
    if (interactive) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.45,
        delta * 2.5
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        pointer.x * 0.35,
        delta * 2
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        pointer.y * 0.25,
        delta * 2
      );
    }

    // Pulsing inner silicon/data core
    if (coreMeshRef.current) {
      const pulse = 1 + Math.sin(time * 2.4) * 0.05;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    // Counter-rotating orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.25;
    }

    // Orbiting data nodes
    if (dataNodesRef.current) {
      dataNodesRef.current.rotation.y = -time * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient and directional lighting for metallic/glass shading */}
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={2.2} color="#F59E0B" />
      <pointLight position={[-3, -2, -2]} intensity={1.5} color="#06B6D4" />

      {/* 1. Internal Digital Silicon Core (Glowing Amber & Emerald) */}
      <mesh ref={coreMeshRef}>
        <octahedronGeometry args={[0.65, 2]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* 2. Abstract Geometric Product Form: Rounded Chamfered Monolith */}
      <mesh ref={shellOuterRef}>
        <boxGeometry args={[1.5, 2.2, 0.28]} />
        <meshPhysicalMaterial
          color="#18181F"
          metalness={0.92}
          roughness={0.18}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 3. Translucent Floating Screen / Sensor Glass Layer */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[1.38, 2.05, 0.04]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          transmission={0.85}
          opacity={0.35}
          transparent
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* 4. Fine Metallic Structural Chassis Edge Ring */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 2.2, 0.28)]} />
        <lineBasicMaterial color="#F59E0B" transparent opacity={0.4} />
      </lineSegments>

      {/* 5. Orbital Lifecycle Path Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.45} />
      </mesh>

      {/* 6. Orbital Lifecycle Path Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.1, 0.012, 16, 100]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
