# 全局风格锚 (Style Anchor v2) — 所有 prompt 复用

> **Style Anchor v2** — Vibrant semi-realistic scientific illustration, painterly textures, **BOLD VOLUMETRIC 3D-sculpted forms** (every element reads as a solid sculpted mass with strong chiaroscuro shading, NOT flat drawing, NOT thin wisp, NOT delicate line art). Rich polychromatic palette — **at least 4 distinct saturated hues per subject** (no monochromatic single-family fills). Interior parts should be **full, generous, plump**, each a distinct 3D volume easy to read as separate sculpted shapes. Textbook-illustrative but colorful — think a contemporary children's science picture book painted by a skilled illustrator. Soft even directionless studio lighting with visible volumetric shading that emphasizes roundness and depth. Plain warm off-white paper-textured background. Single isolated subject, no text, no labels, no arrows, no scale bar.

---

## 资产映射

**7 整细胞**：`plant-cell` / `animal-cell` / `neuron` / `white-blood-cell` / `epithelial-cell` / `bacterial-cell` / `muscle-cell`

**29 唯一细胞器 prompt**：`shared:true` 的 6 个（`nucleus` / `mitochondrion` / `cell-membrane` / `endoplasmic-reticulum` / `golgi-apparatus` / `lysosome`）一份资产多细胞复用；`shared:false` 共 24 个，`multi-nuclei` 砍掉由 `nucleus` 实例化 → 实际出 23 个，合计 29。

**命名**：GPT image 2 出图按 `{asset-id}.png`；Tripo3D 出 GLB 按 `{asset-id}.glb`。

---

## 整细胞 prompt ×7

### 1. `plant-cell` — 植物细胞

> [Style Anchor v2]
>
> A single isolated plant cell, three-quarter cross-section cutaway showing its interior, overall rounded-rectangular shape with softly angled corners.
>
> BOLD VOLUMETRIC structure with chunky internal organelles clearly sculpted in 3D:
> - Outer cell wall: thick olive-green fibrous shell with visible cellulose layer depth (not thin line), gold highlights along top
> - Plasma membrane: thin translucent lavender-pink ribbon just inside the wall
> - Central vacuole: large plump translucent pale-aqua bubble filling ~55% of the interior, with subtle lilac/teal iridescent sheen
> - 4–6 chloroplasts: plump oval emerald-green forms with visible dark-green stacked grana inside, highlight edges in lime-gold
> - 1 nucleus: prominent rounded deep violet-magenta sphere with darker nucleolus, slight pearlescent surface
> - 4–6 mitochondria: bean-shaped chunky coral-orange with teal cristae accents
> - Cytoplasm: warm cream translucent base with subtle pink tint
>
> Polychromatic palette: olive-green + emerald + violet + coral + teal + cream — at least 6 hues visible, each organelle a sculpted 3D volume.
>
> Aspect ratio 16:9. Subject fills ~85% of frame, horizontal orientation.

### 2. `animal-cell` — 动物细胞

> [Style Anchor v2]
>
> A single isolated generic animal cell, three-quarter cross-section cutaway, rounded blob-like irregular shape (not perfectly spherical, no rigid wall).
>
> BOLD VOLUMETRIC internal organelles clearly sculpted in 3D:
> - Outer plasma membrane: flexible slightly undulating boundary in soft violet-pink with gold-pearlescent sheen
> - Central nucleus: large plump deep magenta-purple sphere with darker nucleolus, pearlescent surface
> - 5–7 mitochondria: chunky coral-orange bean shapes with teal cristae accents
> - Rough ER: stacked plump lavender ribbons studded with bright coral ribosome dots
> - Golgi: stack of 5 rich golden-amber pancake sacs with magenta vesicles budding off
> - 3–4 lysosomes: round terracotta spheres with electric-blue internal specks
> - Cytoplasm: pale rose-cream translucent fill
>
> Polychromatic palette: violet + magenta + coral + teal + gold + terracotta + cream — 7+ hues visible, each organelle sculpted and distinct.
>
> Aspect ratio 1:1. Subject fills ~80% of frame.

### 3. `neuron` — 神经元

> [Style Anchor v2]
>
> A single isolated neuron shown in three-quarter perspective. Soma (rounded cell body) on the left with visible nucleus inside. Multiple branching dendrites fanning outward from the soma like a bold tree canopy. Long tapered axon extending right, wrapped in segmented chunky myelin sheath (pearlescent cream-white tubular coating with clear gaps — nodes of Ranvier). Axon terminates right in a branched cluster of plump rounded synaptic terminals.
>
> BOLD VOLUMETRIC: soma is a full sphere, dendrites are thick rounded branches (NOT thin lines), myelin segments are plump chunky barrels, synaptic terminals are pronounced round buds.
>
> Polychromatic palette:
> - Soma membrane: violet-pink with gold-lavender iridescence
> - Nucleus inside soma: deep magenta with darker core
> - Dendrites: cool lavender-grey with coral highlights on tips and magenta spine buds
> - Axon core: pale lavender-grey with electric-blue nodes of Ranvier
> - Myelin sheath: pearlescent cream with iridescent gold-pink shimmer
> - Synaptic terminals: warm coral spheres with teal and magenta accent rings
>
> Polychromatic palette: violet-pink + magenta + lavender-grey + coral + electric-blue + cream + gold + teal — 8 hues across the neuron, each region a sculpted 3D volume.
>
> Aspect ratio 16:9. Subject fills ~85% of frame.

### 4. `white-blood-cell` — 白细胞

> [Style Anchor v2]
>
> A single isolated white blood cell (neutrophil type), three-quarter cross-section cutaway. Outer boundary is an irregular undulating membrane with one or two pseudopod-like protrusions reaching outward, clearly deformable and motile.
>
> BOLD VOLUMETRIC interior:
> - Outer membrane: pearlescent cream-white with gold and lilac iridescence, chunky 3D undulations
> - Multi-lobed nucleus: 3–4 plump rounded deep-magenta lobes connected in a curved chain, each lobe a clearly sculpted sphere
> - Scattered granules: 15–20 BRIGHT MEDIUM-SIZED SPHERES (marble size, not tiny dots) in mixed electric-blue, hot-magenta, coral-red, gold, and lime-green — packed densely throughout the cytoplasm
> - 4–5 chunky coral mitochondria with teal accents
> - 3–4 round terracotta lysosomes with violet specks
> - Cytoplasm: translucent peach-cream base
>
> Polychromatic palette: cream + magenta + coral + gold + teal + electric-blue + lime — 7+ hues. Interior reads as a bag of colorful marbles.
>
> Aspect ratio 1:1. Subject fills ~80% of frame.

### 5. `epithelial-cell` — 上皮细胞（柱状）

> [Style Anchor v2]
>
> A single isolated columnar epithelial cell, three-quarter cross-section cutaway. Shape is tall column (clearly taller than wide, ~2.5:1 height ratio), flat bottom, brush-covered top.
>
> BOLD VOLUMETRIC:
> - Apical microvilli: dense forest of plump rounded finger-like protrusions rising from the top (NOT thin bristles — each microvillus is a pronounced sculpted tube) in lavender-pink with gold tips and teal valley shadows
> - Plasma membrane: violet-pink outline
> - Nucleus: large oval deep-magenta sphere in lower third
> - 6–8 chunky coral mitochondria between nucleus and apical surface, with teal cristae accents
> - Rough ER: stacked lavender ribbons with coral ribosome dots
> - Side walls: hints of tight-junction ridges (amber) and desmosomes (gold discs)
> - Cytoplasm: pale cream-rose translucent
>
> Polychromatic palette: lavender + magenta + coral + gold + teal + amber + cream — 7+ hues.
>
> Aspect ratio 3:4 (vertical). Subject fills ~75% of frame.

### 6. `bacterial-cell` — 细菌细胞（杆状）

> [Style Anchor v2]
>
> A single isolated rod-shaped bacterial cell, three-quarter cross-section cutaway. Cylindrical rod with clearly rounded ends (bacillus morphology).
>
> BOLD VOLUMETRIC layered exterior + chunky interior features:
> - Capsule: translucent gelatinous outer layer, warm cream with gold-pink iridescence, visible as a distinct plump wrap
> - Cell wall: thick olive-green mesh layer beneath capsule with visible peptidoglycan texture
> - Plasma membrane: thin lavender-pink strip beneath the wall
> - Nucleoid region: loose plump coiled DNA cloud in dusty lilac with magenta accent streaks, clearly visible through the cross-section
> - Scattered ribosomes: 20–25 SMALL-MEDIUM BRIGHT SPHERES in mixed terracotta, electric-blue, gold, and hot-magenta — dense throughout cytoplasm
> - 1 prominent flagellum: long plump helically curled filament in pearlescent lavender-gold, extending from one rounded end
> - Cytoplasm: warm cream-rose translucent
>
> Polychromatic palette: cream + olive + lilac + magenta + gold + electric-blue + terracotta — 7+ hues.
>
> Aspect ratio 16:9. Subject fills ~85% of frame, horizontal.

### 7. `muscle-cell` — 肌纤维（骨骼肌）

> [Style Anchor v2]
>
> A single isolated skeletal muscle fiber shown in three-quarter perspective, partial cutaway along one flank to expose interior. Long cylindrical tube, elongated 4–5× longer than wide.
>
> BOLD VOLUMETRIC striped interior:
> - Sarcolemma (outer membrane): smooth plump violet-pink tube with gold-iridescent sheen
> - Myofibrils visible through cutaway: multiple parallel cylindrical bundles running the length, each with prominent banded striping (sarcomere pattern) alternating warm-terracotta + pale-cream + deep plum-purple bands with visible dark Z-lines
> - 4–6 elongated oval nuclei in deep magenta, lined along the interior near the sarcolemma on one side
> - Packed chunky coral mitochondria between myofibrils (lots of them — muscle is energy-hungry), with teal cristae accents
> - Sarcoplasmic reticulum: lacy lavender-gold meshwork wrapping around myofibrils, visible in cross-section
>
> Polychromatic palette: violet-pink + terracotta + plum + magenta + coral + teal + gold + lavender — 8 hues. The striped pattern is the visual identity.
>
> Aspect ratio 16:9. Subject fills ~85% of frame, horizontal.
