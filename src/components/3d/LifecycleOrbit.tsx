import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const LIFECYCLE_STAGES = [
  { label: 'PURCHASED', sub: 'Mint & Passport ID', color: '#F59E0B' },
  { label: 'USED', sub: 'Wear & Sensor Logs', color: '#A1A1AA' },
  { label: 'MAINTAINED', sub: 'Thermal & Battery Sync', color: '#06B6D4' },
  { label: 'REPAIRED', sub: 'Verified Component Swap', color: '#10B981' },
  { label: 'RESOLD', sub: 'Ownership Escrow', color: '#06B6D4' },
  { label: 'SECOND LIFE', sub: 'Extended Utility +3Y', color: '#10B981' },
  { label: 'RECOVERED', sub: 'Raw Element Harvest', color: '#A855F7' },
  { label: 'RECYCLED', sub: 'Closed-Loop Smelting', color: '#14B8A6' }
];

export const LifecycleOrbit: React.FC = () => {
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const energyParticleRef = useRef<THREE.Mesh | null>(null);

  const orbitRadius = 3.2;

  // Node positions on 3D elliptical orbit
  const stageNodes = useMemo(() => {
    return LIFECYCLE_STAGES.map((stage, idx) => {
      const angle = (idx / LIFECYCLE_STAGES.length) * Math.PI * 2;
      return {
        ...stage,
        x: Math.cos(angle) * orbitRadius,
        y: Math.sin(angle * 2) * 0.4,
        z: Math.sin(angle) * orbitRadius,
        angle
      };
    });
  }, [orbitRadius]);

  // Elliptical Curve for the continuous energy tube
  const curvePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle * 2) * 0.4,
        Math.sin(angle) * orbitRadius
      ));
    }
    return points;
  }, [orbitRadius]);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    return new THREE.TubeGeometry(curve, 100, 0.025, 8, true);
  }, [curvePoints]);

  useFrame((state, delta) => {
    if (!orbitGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // Slow ambient rotation of orbit
    orbitGroupRef.current.rotation.y += delta * 0.15;
    orbitGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      orbitGroupRef.current.rotation.x,
      0.45 - pointer.y * 0.15,
      delta * 2
    );

    // Traveling Energy Particle moving along the orbit
    if (energyParticleRef.current) {
      const currentAngle = (time * 0.65) % (Math.PI * 2);
      energyParticleRef.current.position.x = Math.cos(currentAngle) * orbitRadius;
      energyParticleRef.current.position.y = Math.sin(currentAngle * 2) * 0.4;
      energyParticleRef.current.position.z = Math.sin(currentAngle) * orbitRadius;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      {/* 1. Continuous Orbital Flow Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.35}
          wireframe={false}
        />
      </mesh>

      {/* 2. High-energy traveling pulse particle */}
      <mesh ref={energyParticleRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#F59E0B" />
        <pointLight color="#F59E0B" intensity={3} distance={1.5} />
      </mesh>

      {/* 3. Lifecycle Stage Nodes */}
      {stageNodes.map((node, i) => (
        <group key={node.label} position={[node.x, node.y, node.z]}>
          {/* Node sphere */}
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Surrounding Node Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.01, 8, 32]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.6} />
          </mesh>

          {/* Spatial Label */}
          <Text
            position={[0, 0.28, 0]}
            fontSize={0.16}
            color="#FFFFFF"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {node.label}
          </Text>

          {/* Subtext description */}
          <Text
            position={[0, 0.12, 0]}
            fontSize={0.09}
            color={node.color}
            anchorX="center"
            anchorY="top"
          >
            {node.sub}
          </Text>
        </group>
      ))}

      {/* Center ReTrace Product Core Hologram */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 2]} />
        <meshPhysicalMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};
