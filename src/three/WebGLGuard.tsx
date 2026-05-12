import { Component, ReactNode } from 'react';

/** Cheap synchronous probe for WebGL availability. Used to skip the
 *  R3F Canvas entirely in environments that don't ship it (WeChat
 *  webview on some Android devices, locked-down corporate browsers,
 *  iOS Lockdown Mode).
 *
 *  IMPORTANT: do NOT call canvas.getContext('webgl') here — that
 *  reserves a live WebGL context, which counts against the per-page
 *  cap (iOS Safari = 8). The main Stage Canvas + an extra probe was
 *  enough to push us over the limit and trigger ContextLost loops.
 *  We probe via the global constructor + a feature shape check only. */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as Window & {
    WebGL2RenderingContext?: unknown;
  };
  return (
    typeof window.WebGLRenderingContext !== 'undefined' ||
    typeof w.WebGL2RenderingContext !== 'undefined'
  );
}

/** Detect WeChat in-app browser / WeChat Mini-Program webview so we can
 *  point the user to a real browser. */
export function isWeChatWebview(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /MicroMessenger|wechatdevtools|miniProgram/i.test(ua);
}

type Props = {
  children: ReactNode;
  /** Rendered when WebGL is unavailable OR a child throws during render. */
  fallback: ReactNode;
};

type State = { hasError: boolean };

/** Wraps the R3F Canvas. Catches GL/GLB load errors so the whole UI
 *  doesn't crash to a white screen in unsupported environments. */
export class WebGLBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // Useful when debugging from the browser console in WeChat etc.
    // eslint-disable-next-line no-console
    console.warn('[WebGLBoundary] GL/GLB render failed', error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
