import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, Environment, useGLTF } from '@react-three/drei';
import { cellAccent, cellIcon } from '../data/cellIcons';
import { cellModelUrl, CELL_MODEL_URL } from './assetRegistry';

type Props = {
  id: string;
  /** Pixel size, or 'fill' to stretch to the parent box. */
  size?: number | 'fill';
  ringColor?: string;
  className?: string;
  /** 'circle' (default) → rounded-full pill thumb. 'square' → rounded-lg tile. */
  shape?: 'circle' | 'square';
  /** Override border; pass 'none' to drop the accent ring entirely. */
  border?: string | 'none';
  /** Skip the live GLB render. Use on mobile lists to avoid exceeding the
   *  per-page WebGL context limit (iOS Safari caps at 8). Falls back to the
   *  emoji icon path. */
  noCanvas?: boolean;
};

const SS_PREFIX = 'cell-thumb:v2:';

// Kick off GLB downloads before any thumb mounts — the 5–8 MB files dominate
// the cold path and we want them parsed by the time Capture starts counting.
for (const url of Object.values(CELL_MODEL_URL)) {
  useGLTF.preload(url);
}

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

export function CellThumb({
  id,
  size = 36,
  ringColor,
  className = '',
  shape = 'circle',
  border,
  noCanvas = false,
}: Props) {
  const url = noCanvas ? null : cellModelUrl(id);
  const [dataUrl, setDataUrl] = useState<string | null>(() => readCache(id));
  // useState's initializer only runs on the first mount — when `id` changes
  // (e.g. a CellThumb reused inside MicroscopeView as the selected cell flips),
  // we need to re-read the cache so we don't keep showing the old cell.
  useEffect(() => {
    setDataUrl(readCache(id));
  }, [id]);
  const ring = ringColor ?? `${cellAccent(id)}55`;
  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  const borderStyle =
    border === 'none' ? 'none' : border ?? `2px solid ${ring}`;
  const fill = size === 'fill';
  const boxStyle: React.CSSProperties = fill
    ? { width: '100%', height: '100%', border: borderStyle }
    : { width: size, height: size, border: borderStyle };

  // Cached snapshot wins regardless of noCanvas — it's a static img, no WebGL.
  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        className={`${radiusClass} bg-white shrink-0 object-cover ${className}`}
        style={boxStyle}
      />
    );
  }

  if (!url) {
    return (
      <span
        aria-hidden
        className={`${radiusClass} flex items-center justify-center bg-white shrink-0 ${className}`}
        style={{
          ...boxStyle,
          fontSize: fill ? undefined : (size as number) * 0.5,
        }}
      >
        {cellIcon(id)}
      </span>
    );
  }

  return (
    <div
      className={`${radiusClass} bg-white shrink-0 overflow-hidden relative ${className}`}
      style={boxStyle}
    >
      <Canvas
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
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
              <ThumbModel
                url={url}
                onCaptured={(d) => {
                  writeCache(id, d);
                  setDataUrl(d);
                }}
              />
            </Center>
          </Bounds>
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function ThumbModel({
  url,
  onCaptured,
}: {
  url: string;
  onCaptured: (dataUrl: string) => void;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  // Capture lives inside Suspense — it only mounts after GLB is parsed.
  return (
    <>
      <primitive object={cloned} />
      <Capture onCaptured={onCaptured} />
    </>
  );
}

/**
 * After the GLB has mounted, wait a few frames for textures to upload and
 * Bounds to settle the fit pass, then grab the back buffer. Reject mostly-
 * transparent captures (means we fired too early).
 */
function Capture({ onCaptured }: { onCaptured: (dataUrl: string) => void }) {
  const { gl } = useThree();
  const framesRef = useRef(0);
  const doneRef = useRef(false);
  const attemptsRef = useRef(0);

  useFrame(() => {
    if (doneRef.current) return;
    framesRef.current += 1;
    // ~16 frames ≈ 260ms — enough for one Bounds fit + texture upload after
    // the GLB has finished parsing.
    if (framesRef.current < 16) return;

    try {
      const canvas = gl.domElement as HTMLCanvasElement;
      if (!isMostlyOpaque(canvas)) {
        // Try again a few frames later — model may still be settling.
        framesRef.current = 8;
        attemptsRef.current += 1;
        if (attemptsRef.current > 8) {
          // Give up rather than spinning forever on a broken context.
          doneRef.current = true;
        }
        return;
      }
      doneRef.current = true;
      const d = canvas.toDataURL('image/png');
      onCaptured(d);
    } catch {
      doneRef.current = true;
    }
  });

  return null;
}

/** Sample a 16×16 grid; bail if fewer than 5% of samples are opaque. */
function isMostlyOpaque(canvas: HTMLCanvasElement): boolean {
  // Use a tiny offscreen 2D copy so we can read pixels without
  // perturbing the WebGL pipeline.
  const probe = document.createElement('canvas');
  probe.width = 16;
  probe.height = 16;
  const ctx = probe.getContext('2d');
  if (!ctx) return true; // assume ok if we can't probe
  ctx.drawImage(canvas, 0, 0, 16, 16);
  const data = ctx.getImageData(0, 0, 16, 16).data;
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) {
    if ((data[i] ?? 0) > 20) opaque += 1;
  }
  return opaque / (data.length / 4) > 0.05;
}
