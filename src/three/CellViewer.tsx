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
import { CELL_MODEL_URL } from './assetRegistry';

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

      {/* fallback=null so startTransition can keep the previous cell on screen
          while the new GLB loads, instead of flashing a placeholder ball. */}
      <Suspense fallback={null}>
        {/* observe is intentionally OFF — on mobile the container can resize
            mid-frame (toolbar collapse, keyboard, etc.) and a live refit
            jerks the camera, reading as a flicker. Reset View bumps the
            key to trigger a manual refit when the user asks. */}
        <Bounds fit clip margin={0.62} key={resetNonce}>
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

// Prefetch hints for drei's loader cache. Pull paths from the registry so
// the BASE_URL prefix is applied consistently in all environments.
for (const url of Object.values(CELL_MODEL_URL)) {
  useGLTF.preload(url);
}
