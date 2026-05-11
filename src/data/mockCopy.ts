// Organelle copy — single source of truth is copy.phase5.v2.json
// (authored by content engineer, 2026-05-11).
//
// v2 covers all 30 organelles (7 shared + 23 species-specific).
// Language contract: size / location / visibleInLM are EN (standard LM
// vocabulary); biologicalNotes / funFact are ZH-native for 中小学生 audience.
// Shared organelles carry a single canonical ZH narrative; per-cell
// context differences live in schema.tagline, not here.

import copyJson from './copy.phase5.v2.json';

export interface OrganelleMock {
  size: string;
  location: string;
  visibleInLM: string;
  biologicalNotes: string;
  funFact: string;
  accent?: string; // hex for the mini preview dot
}

// Cast through unknown — the JSON shape matches OrganelleMock exactly, but
// TS types the import as a wide structural type. Shape is enforced by
// content-engineer's schema v0.1 contract and the _meta.notes field
// contract pinned in SH-4.
const MOCK: Record<string, OrganelleMock> = (copyJson as {
  organelles: Record<string, OrganelleMock>;
}).organelles;

const DEFAULT: OrganelleMock = {
  size: '—',
  location: '—',
  visibleInLM: '—',
  biologicalNotes:
    '正文待补。This placeholder keeps the layout honest while copy is being written.',
  funFact: 'Fun fact coming soon.',
  accent: '#7c4dff',
};

export function getOrganelleMock(id: string | null | undefined): OrganelleMock {
  if (!id) return DEFAULT;
  return MOCK[id] ?? DEFAULT;
}

// Cell-level tips; used for the sticky note and stage subtitle chrome.
export const STAGE_TIP = `Tip: Drag to rotate
Scroll to zoom
Ctrl + drag to pan`;
