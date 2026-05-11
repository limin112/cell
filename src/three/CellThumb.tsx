import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, Environment, useGLTF } from '@react-three/drei';
import { cellAccent, cellIcon } from '../data/cellIcons';
import { cellModelUrl } from './assetRegistry';

/** 80px default; caller can bump for CompareCells. */
type Props = {
  id: string;
  size?: number;
  /** Accent ring + bg */
  ringColor?: string;
  className?: string;
};

const SS_PREFIX = 'cell-thumb:v1:';

function readCache(id: string): string | null {
  try {
    return sessionStorage.getItem(SS_PREFIX + id);
  } catch {
    return null;
  }
}

function writeCache(id: string, url: string) {
  try {
    sessionStorage.setItem(SS_PREFIX + id, url);
  } catch {
    /* storage full or disabled — fine, we just miss the cache */
  }
}

/**
 * Thumbnail for a cell. Renders GLB once into a tiny offscreen Canvas,
 * grabs the raw WebGL buffer via toDataURL(), then swaps to <img>.
 */
export function CellThumb({
  id,
  size = 36,
  ringColor,
  className = '',
}: Props) {
  const url = cellModelUrl(id);
  const [dataUrl, setDataUrl] = useState<string | null>(() => readCache(id));
  const ring = ringColor ?? `${cellAccent(id)}55`;

  // No GLB registered → emoji fallback (keeps old visual behavior)
  if (!url) {
    return (
      <span
        aria-hidden
        className={`rounded-full flex items-center justify-center bg-white shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          border: `2px solid ${ring}`,
          fontSize: size * 0.5,
        }}
      >
        {cellIcon(id)}
      </span>
    );
  }

  // Cached snapshot → just show it.
  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        className={`rounded-full bg-white shrink-0 object-cover ${className}`}
        style={{
          width: size,
          height: size,
          border: `2px solid ${ring}`,
        }}
      />
    );
  }

  // Cold thumb: render once, capture, then swap.
  return (
    <div
      className={`rounded-full bg-white shrink-0 overflow-hidden relative ${className}`}
      style={{
        width: size,
        height: size,
        border: `2px solid ${ring}`,
      }}
    >
      <Canvas
        dpr={1}
        frameloop="always"
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
          powerPreference: 'low-power',
        }}
        camera={{ position: [2.2, 2.2, 2.2], fov: 38 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#fdf8ec', '#8a9a5b', 0.35]} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
            <Center>
              <ThumbModel url={url} />
            </Center>
          </Bounds>
          <Environment preset="studio" />
        </Suspense>
        <Capture
          id={id}
          onCaptured={(d) => {
            writeCache(id, d);
            setDataUrl(d);
          }}
        />
      </Canvas>
    </div>
  );
}

function ThumbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

/**
 * After the scene has settled (a few frames of stable render), grab the
 * canvas's back-buffer and hand it up.
 */
function Capture({
  id: _id,
  onCaptured,
}: {
  id: string;
  onCaptured: (dataUrl: string) => void;
}) {
  const { gl } = useThree();
  const framesRef = useRef(0);
  const doneRef = useRef(false);

  useFrame(() => {
    if (doneRef.current) return;
    framesRef.current += 1;
    // 6 frames ≈ 100ms at 60fps — enough for GLB textures to be uploaded
    // and Bounds to settle its fit pass.
    if (framesRef.current < 6) return;
    doneRef.current = true;
    try {
      const canvas = gl.domElement as HTMLCanvasElement;
      const d = canvas.toDataURL('image/png');
      onCaptured(d);
    } catch {
      /* toDataURL can throw if context is lost; we retry next mount */
    }
  });

  // Kick a re-render bump at first mount (avoid stuck frameloop on static scene)
  useEffect(() => {
    const t = setTimeout(() => {
      framesRef.current = Math.max(framesRef.current, 3);
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return null;
}
