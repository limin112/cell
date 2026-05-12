import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  useGLTF,
  Center,
  Bounds,
} from '@react-three/drei';
import type { Group, Mesh } from 'three';

type Props = {
  /** Full path under /public, e.g. "/models/plant-cell.glb" */
  url: string;
  /** Accent color for lighting rim */
  accent?: string;
  /** Auto-rotate the model (idle animation). */
  autoRotate?: boolean;
  /** Signals from Stage to reset orbit controls. */
  resetNonce?: number;
  /** Bounds margin override — smaller = tighter fit (more zoomed in).
   *  Portrait viewports want a smaller value because the auto-fit reserves
   *  whitespace on the long axis. */
  margin?: number;
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
  margin = 0.62,
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

      {/* fallback is a soft pulsing bubble in the cell's accent color so
          the user sees *something* the moment the Canvas mounts, instead
          of a blank scene while a multi-MB GLB downloads. Swap is
          seamless because both sit at the same world origin. */}
      <Suspense fallback={<PlaceholderBubble color={accent} />}>
        {/* observe is intentionally OFF — on mobile the container can resize
            mid-frame (toolbar collapse, keyboard, etc.) and a live refit
            jerks the camera, reading as a flicker. Reset View bumps the
            key to trigger a manual refit when the user asks. */}
        <Bounds fit clip margin={margin} key={resetNonce}>
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

/** Pulsing watercolor bubble shown while the real GLB streams in.
 *  Lives inside Suspense fallback so it appears the instant Canvas mounts. */
function PlaceholderBubble({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.006;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.05);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.9, 48, 48]} />
      <meshStandardMaterial
        color={color}
        roughness={0.65}
        metalness={0.05}
        emissive={color}
        emissiveIntensity={0.18}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// NOTE: We intentionally do NOT call useGLTF.preload here.
// Eagerly fetching + decoding 5 × multi-MB GLBs at startup cost ~80–120MB
// of JS heap before the user clicked anything — enough for WeChat /
// X5 webview on low-RAM Androids to kill the page. We now lazy-load on
// first cell selection only.
