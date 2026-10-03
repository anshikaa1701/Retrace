import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const WORDS_TO_TYPE = [
  'REPAIR',
  'RESELL',
  'RECOVER',
  'RECYCLE',
  'NEXT PATH'
];

interface KeycapData {
  char: string;
  x: number;
  z: number;
  width?: number;
}

// 4-row sculpted mechanical keyboard key matrix
const KEYBOARD_LAYOUT: KeycapData[] = [
  // Row 1
  { char: 'Q', x: -3.6, z: -1.2 },
  { char: 'W', x: -2.8, z: -1.2 },
  { char: 'E', x: -2.0, z: -1.2 },
  { char: 'R', x: -1.2, z: -1.2 },
  { char: 'T', x: -0.4, z: -1.2 },
  { char: 'Y', x: 0.4, z: -1.2 },
  { char: 'U', x: 1.2, z: -1.2 },
  { char: 'I', x: 2.0, z: -1.2 },
  { char: 'O', x: 2.8, z: -1.2 },
  { char: 'P', x: 3.6, z: -1.2 },

  // Row 2
  { char: 'A', x: -3.3, z: -0.4 },
  { char: 'S', x: -2.5, z: -0.4 },
  { char: 'D', x: -1.7, z: -0.4 },
  { char: 'F', x: -0.9, z: -0.4 },
  { char: 'G', x: -0.1, z: -0.4 },
  { char: 'H', x: 0.7, z: -0.4 },
  { char: 'J', x: 1.5, z: -0.4 },
  { char: 'K', x: 2.3, z: -0.4 },
  { char: 'L', x: 3.1, z: -0.4 },

  // Row 3
  { char: 'Z', x: -2.9, z: 0.4 },
  { char: 'X', x: -2.1, z: 0.4 },
  { char: 'C', x: -1.3, z: 0.4 },
  { char: 'V', x: -0.5, z: 0.4 },
  { char: 'B', x: 0.3, z: 0.4 },
  { char: 'N', x: 1.1, z: 0.4 },
  { char: 'M', x: 1.9, z: 0.4 },

  // Row 4: Spacebar
  { char: 'SPACE', x: 0, z: 1.2, width: 3.8 }
];

export const KeyboardScene: React.FC = () => {
  const keyboardRef = useRef<THREE.Group | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeChar, setActiveChar] = useState<string>('');
  const [typedBuffer, setTypedBuffer] = useState('');

  // Automated typing loop that cycles through REPAIR -> RESELL -> RECOVER -> RECYCLE -> NEXT PATH
  useEffect(() => {
    let charIndex = 0;
    let wordIndex = 0;
    let forward = true;

    const interval = setInterval(() => {
      const targetWord = WORDS_TO_TYPE[wordIndex];

      if (forward) {
        if (charIndex < targetWord.length) {
          const nextChar = targetWord[charIndex];
          setActiveChar(nextChar === ' ' ? 'SPACE' : nextChar);
          setTypedBuffer(targetWord.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Pause at completed word
          forward = false;
          setActiveChar('');
        }
      } else {
        // Switch to next word
        wordIndex = (wordIndex + 1) % WORDS_TO_TYPE.length;
        setCurrentWordIndex(wordIndex);
        setTypedBuffer('');
        charIndex = 0;
        forward = true;
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (!keyboardRef.current) return;
    const pointer = state.pointer;

    // Perspective tilt with mouse position
    keyboardRef.current.rotation.x = THREE.MathUtils.lerp(
      keyboardRef.current.rotation.x,
      0.65 - pointer.y * 0.18,
      delta * 3
    );
    keyboardRef.current.rotation.y = THREE.MathUtils.lerp(
      keyboardRef.current.rotation.y,
      pointer.x * 0.22,
      delta * 3
    );
  });

  return (
    <group ref={keyboardRef} position={[0, -0.6, 0]}>
      {/* Keyboard Case Backplate */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[8.8, 0.35, 4.4]} />
        <meshStandardMaterial
          color="#121218"
          roughness={0.4}
          metalness={0.85}
        />
      </mesh>

      {/* Case Bevel Outline */}
      <lineSegments position={[0, -0.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(8.8, 0.35, 4.4)]} />
        <lineBasicMaterial color="#F59E0B" transparent opacity={0.35} />
      </lineSegments>

      {/* Individual 3D Mechanical Keycaps */}
      {KEYBOARD_LAYOUT.map((key) => {
        const isDepressed = activeChar === key.char;
        const width = key.width || 0.72;

        return (
          <group key={key.char} position={[key.x, 0, key.z]}>
            <mesh position={[0, isDepressed ? -0.1 : 0, 0]}>
              <boxGeometry args={[width, 0.3, 0.72]} />
              <meshStandardMaterial
                color={isDepressed ? '#F59E0B' : '#1c1c24'}
                emissive={isDepressed ? '#D97706' : '#000000'}
                emissiveIntensity={isDepressed ? 0.75 : 0}
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>

            {/* Keycap Legend Text */}
            <Text
              position={[0, (isDepressed ? -0.1 : 0) + 0.16, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={key.char === 'SPACE' ? 0.18 : 0.22}
              color={isDepressed ? '#000000' : '#E4E4E7'}
              anchorX="center"
              anchorY="middle"
            >
              {key.char === 'SPACE' ? 'RETRACE' : key.char}
            </Text>
          </group>
        );
      })}

      {/* Floating Holographic Buffer Display above Keyboard */}
      <group position={[0, 1.4, -1.8]}>
        <Text
          fontSize={0.45}
          color="#F59E0B"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {typedBuffer || 'RETRACE'}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.16}
          color="#06B6D4"
          anchorX="center"
          anchorY="middle"
        >
          LIFECYCLE TRANSFORMATION SEQUENCER
        </Text>
      </group>
    </group>
  );
};
