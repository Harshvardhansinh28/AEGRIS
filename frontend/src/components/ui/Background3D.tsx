'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { useTheme } from '@/contexts/ThemeContext';
import * as THREE from 'three';

/* Professional fintech: minimal 3D, warm palette only (Amber, Sandy, English Violet). No blue/purple. */

function SubtleGrid() {
  const gridRef = useRef<any>(null);
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.15) % 2 - 1;
    }
  });
  return (
    <Grid
      ref={gridRef}
      args={[20, 20]}
      cellSize={0.6}
      cellThickness={0.4}
      cellColor="#2a2a2a"
      sectionSize={4}
      sectionThickness={0.6}
      sectionColor="#3a3a3a"
      fadeDistance={22}
      fadeStrength={1}
      infiniteGrid
    />
  );
}

function WarmOrb({ position, color, scale = 0.5 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  );
}

function DarkScene() {
  return (
    <>
      <SubtleGrid />
      <WarmOrb position={[-4, 0, -6]} color="#F59E0B" scale={0.6} />
      <WarmOrb position={[3, 1, -8]} color="#EDB88B" scale={0.4} />
      <WarmOrb position={[0, -1, -7]} color="#6B5B73" scale={0.35} />
    </>
  );
}

function LightScene() {
  return (
    <>
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.3}
        cellColor="#e5e5e5"
        sectionSize={4}
        sectionThickness={0.5}
        sectionColor="#d4d4d4"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  );
}

export default function Background3D() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {theme === 'dark' ? <DarkScene /> : <LightScene />}
      </Canvas>
    </div>
  );
}
