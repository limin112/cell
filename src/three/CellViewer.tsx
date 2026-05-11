import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  useGLTF,
  Center,
  Bounds,
} from '@react-three/drei';
import type { Group } from 'three';

type Props = {
  /** Full path under /public, e.g. "/models/plant-cell.glb" */
  url: string;
  /** Accent color for lighting rim */
  accent?: string;
  /** Auto-rotate the model (idle animation). */
  autoRotate?: boolean;
  /** Signals from Stage to reset orbit controls. */
  resetNonce?: number;
};

/** 3D viewer for a cell GLB.
 *
 * Frames the model with <Bounds> on first load so it fills the viewport
 * regardless of source scale / pivot.
 */
export function CellViewer({
  url,
  accent = '#7c4dff',
  autoRotate = true,
  resetNonce = 0,
}: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      // 45° three-quarter view (elevated + rotated) instead of dead-on side.
      camera={{ position: [2.2, 2.2, 2.2], fov: 38, near: 0.05, far: 50 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      {/* Lights — soft studio look, accent rim for the selected cell */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#fdf8ec', '#8a9a5b', 0.35]} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color={accent} />

      <Suspense fallback={<LoadingPlaceholder accent={accent} />}>
        <Bounds fit clip observe margin={0.62} key={resetNonce}>
          <Center>
            <RotatingModel url={url} spinning={autoRotate} />
          </Center>
        </Bounds>
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={8}
        rotateSpeed={0.7}
      />
    </Canvas>
  );
}

function RotatingModel({ url, spinning }: { url: string; spinning: boolean }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(url);

  // Clone so repeated mounts / multiple viewers don't mutate cached material.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, dt) => {
    if (!spinning || !ref.current) return;
    ref.current.rotation.y += dt * 0.25;
  });

  useEffect(() => () => useGLTF.clear(url), [url]);

  return (
    <group ref={ref}>
      <primitive object={cloned} />
    </group>
  );
}

function LoadingPlaceholder({ accent }: { accent: string }) {
  return (
    <mesh>
      <sphereGeometry args={[0.9, 32, 32]} />
      <meshStandardMaterial color={accent} roughness={0.6} metalness={0.05} />
    </mesh>
  );
}

// Prefetch hints for drei's loader cache (registered cells only).
useGLTF.preload('/models/plant-cell.glb');
useGLTF.preload('/models/animal-cell.glb');
useGLTF.preload('/models/neuron.glb');
useGLTF.preload('/models/white-blood-cell.glb');
useGLTF.preload('/models/muscle-cell.glb');
