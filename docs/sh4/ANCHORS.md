# SH-4 DOM anchors (reproducible literal assertions)

Run: `cd cell-architecture-studio && npm ci && npm run dev` then navigate.
All assertions are grep-able in the live DOM. Puppeteer script used for
original verification is in `docs/sh4/_shot_proper.mjs` (removed; anchors
below are the durable artifact).

## A1 — Cell order in LEFT CELL TYPES list

```
query: button texts in section containing "CELL TYPES"
assert: first 7 buttons text begins, in this order, with:
  Plant Cell / Animal Cell / Neuron / White Blood Cell /
  Epithelial Cell / Bacterial Cell / Muscle Fiber
```

## A2 — Default stage title on cold load

```
url: http://localhost:4173/ (no interaction)
query: document.querySelector('main h2').textContent
assert: === "Plant Cell"
```

## A3 — Cell click → Stage title + RightPanel organelle (real-copy examples)

After clicking a LEFT-column button:

| click                | main h2       | RightPanel first .font-serif |
|----------------------|---------------|------------------------------|
| "White Blood Cell"   | White Blood Cell | Lobed Nucleus             |
| "Neuron"             | Neuron        | Soma (Cell Body)             |
| "Bacterial Cell"     | Bacterial Cell| Nucleoid                     |

Bacterial is the **placeholder reverse-verify target**: its biologicalNotes
text starts with "Biological notes will be filled in during the content
phase."

## A4 — TopBar nav "disabled" class contract

```
query: div.pointer-events-none inside <header> containing "Explore life"
assert: contains 4 NavItems with text
  Gallery / Library / Notebooks / Settings
  each wrapped in .pointer-events-none (so browser click does nothing)
```

## A5 — Hand-filled coverage (Phase 5 placeholder inversion)

These 7 organelle ids have real mock copy in
`src/data/mockCopy.ts`. Click-path to verify each:

- `nucleus`                → Plant / Animal / Neuron / Epithelial
- `mitochondrion`          → Plant / Animal / White Blood / Epithelial / Muscle
- `lysosome`               → Animal / White Blood
- `axon`                   → Neuron
- `cell-membrane`          → Animal / White Blood / Epithelial
- `endoplasmic-reticulum`  → Animal
- `golgi-apparatus`        → Animal

Anywhere else (all of Bacterial; Neuron non-{axon,nucleus}; Muscle
non-mitochondrion) → RightPanel biologicalNotes starts with
`"Biological notes will be filled in during the content phase."`

(Neuron has both `axon` and `nucleus` hand-filled — corrected after PM
nit; earlier draft only listed axon.)
