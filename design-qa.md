# CashLift landing page design QA

- Source visual truth: `/Users/pauliusrimgaila/.codex/generated_images/019fcc66-a00d-7c71-b8a4-8f63fc3cfc0d/exec-5b8b4e49-7326-4509-8afd-95f168b8e507.png`
- Implementation capture: `/Users/pauliusrimgaila/.codex/visualizations/2026/08/04/019fcc66-a00d-7c71-b8a4-8f63fc3cfc0d/cashlift-design-options/implementation-option-4-initial.png`
- Source pixels: 864 x 1821
- Implementation pixels: 2533 x 6545 full-page browser capture
- CSS viewport: 1440 x 1024 requested for the desktop comparison
- Density normalization: no resampling; the source is a proportion reference rather than a 1:1 browser-density capture
- State: desktop landing page at the hero and first pinned decision; Collect and Approve overlap state also measured during scrolling

## Full-view comparison evidence

The source and implementation captures were opened together in one comparison input. The implementation preserves the existing hero hierarchy and copy, moves the real dashboard slightly backward with a restrained perspective, and carries the same dark shell, cyan emphasis, pale paper surfaces, compact progress rail, FAQ, and horizontal final CTA into the rendered page.

The in-app browser's full-page capture repeats sticky regions while stitching the page. This is a capture artifact, not duplicated DOM. The browser DOM contains one hero, one decision region, three decision articles, one FAQ, and one final CTA.

## Focused region comparison evidence

The hero and first paper sheet were readable in both captures and checked for typography, spacing, color, screenshot crop, border, shadow, and copy. At scroll position 2200, browser geometry confirmed the intended stack: Collect at 96px, Approve at 112px, and Cut approaching at 958px. This produces the 16px paper edge between pinned sheets shown by the selected direction.

## Required fidelity surfaces

- Fonts and typography: Geist and Geist Mono remain in use. Heading scale, line height, weight, and wrapping follow the selected composition without changing the original hero copy.
- Spacing and layout rhythm: the hero retains its original breathing room. Decision sheets use the source's wide paper proportions, strong internal dividers, and incremental sticky offsets. Mobile removes sticky positioning and keeps a normal reading order.
- Colors and visual tokens: the implementation uses CashLift's existing shell, cyan, warning, green, and magenta tokens plus explicit reusable paper surface tokens.
- Image quality and asset fidelity: all product visuals are existing high-resolution CashLift screenshots rendered through `next/image`; no placeholder or code-drawn replacement assets were introduced.
- Copy and content: monetary values, priority, owner, titles, and explanations are derived from the validated Studio Nova demo dataset. FAQ copy distinguishes the read-only demo from unverified production integrations.

## Findings

No actionable P0, P1, or P2 fidelity issues remain.

## Interaction and responsive verification

- The three desktop sheets use CSS sticky positioning and overlap in the Collect, Approve, Cut order.
- Reduced-motion mode removes the sticky effect and restores a normal vertical stack.
- The requested mobile viewport rendered without horizontal overflow; decision articles resolve to static positioning.
- The first FAQ answer expands and becomes visible.
- Both visible demo CTAs route to `/demo/workspace`.
- Browser console errors and warnings: none.

## Comparison history

- Iteration 1: no actionable P0, P1, or P2 differences were found in the combined source/implementation comparison, so no visual fix loop was required.

## Follow-up polish

- P3: the progress rail is intentionally descriptive rather than JavaScript-driven; the active context is carried by the paper pinned at the top.

final result: passed

## Selected centered hero treatment — 2026-08-05

- Source visual truth: `/Users/pauliusrimgaila/.codex/generated_images/019fcc66-a00d-7c71-b8a4-8f63fc3cfc0d/exec-a4c4b351-8b02-4be2-8176-a8dd9c1f03a4.png`
- Intended implementation: three centered heading rows — white, cyan, green — followed by the existing `Open live demo` action and a centered dashboard screenshot with a 5-degree X-axis perspective.

### Verification limitation

The in-app browser still blocks `http://localhost:3000/`, so this revised hero could not be captured and compared against the selected mock. Formatting, TypeScript, and focused homepage tests pass. The image preserves the existing priority and high fetch priority configuration.

final result: blocked

## Revised dark modular decision stack — 2026-08-05

- Source visual truth: `/Users/pauliusrimgaila/.codex/generated_images/019fcc66-a00d-7c71-b8a4-8f63fc3cfc0d/exec-0599b05b-661d-4c4f-858d-622d17b65f50.png`
- Source pixels: 1520 x 1034
- Intended implementation state: desktop decision-story stack, preserving existing CashLift decision copy and its three dashboard screenshots.

### Implemented fidelity surfaces

- Surface and stacking: replaced the pale sheets with rounded dark CashLift panels, retained the existing cyan, amber, and magenta top-edge progression, and reduced the sticky inter-card distance from 20svh to 16svh.
- Dashboard imagery: each card now places its existing CashLift dashboard screenshot prominently on the right, using the current navy and cyan product palette rather than a replacement asset.
- Information hierarchy: moved the stage, context, action, and explanation into the left column; impact, urgency, and owner remain in the footer row.
- Responsive behavior: the existing `lg:sticky` and `motion-reduce` fallbacks remain unchanged, so smaller and reduced-motion layouts continue to read as a normal vertical sequence.

### Verification limitation

The in-app browser rejected navigation to `http://localhost:3000/` under its URL policy, so no live visual comparison or browser console check could be captured for this iteration. TypeScript, formatting, and focused component tests pass; Fallow still reports three pre-existing repository-wide health thresholds unrelated to these files.

final result: unverified (live browser visual QA blocked by URL policy)

## Selected timeline rail QA — 2026-08-05

- Source visual truth: `/Users/pauliusrimgaila/.codex/generated_images/019fcc66-a00d-7c71-b8a4-8f63fc3cfc0d/exec-82a79873-b58d-4ef7-9636-e89322da5135.png`
- Implementation capture: in-app Browser capture of `http://localhost:3000/` in this task
- Viewport: 1369 x 520 CSS px
- State: desktop decision-story rail beside a sticky paper card
- Density normalization: source is a 2048 x 768 generated visual; implementation capture uses the same 2.67:1 viewport ratio without resampling.

### Full-view comparison evidence

The selected mock and the browser-rendered rail were opened in the same task. The implementation matches the selected vertical composition: a filled cyan `01` node, outlined `02` and `03` nodes, cyan connecting line, monospaced numerals, and readable stage labels on the dark shell.

### Focused rail comparison evidence

The browser capture confirms that the rail is vertically aligned with the paper card, the active node has a cyan fill and restrained glow, and inactive nodes remain readable at the desktop viewport. No focused image-asset comparison was needed: this component uses existing typography and product tokens, with no new raster or icon assets.

### Required fidelity surfaces

- Fonts and typography: the existing Geist Mono numerals and Geist stage labels retain the selected mock’s editorial, technical hierarchy.
- Spacing and layout rhythm: the 9rem rail column gives the nodes and labels enough room without crowding the decision card.
- Colors and visual tokens: active and inactive nodes use the existing cyan primary and shell token family; the visible active state is not communicated by color alone because of the filled-versus-outlined shape change.
- Image quality and asset fidelity: no image assets were added or replaced.
- Copy and content: the three labels remain the current decision categories: Collect, Approve, and Cut.

### Findings

No actionable P0, P1, or P2 differences remain for the selected static visual direction.

The browser console had no errors. Next.js emitted an existing development-only LCP warning for the vendor screenshot after the viewport was positioned on the final decision card; it is unrelated to the progress rail.

### Comparison history

- Iteration 1: replaced the text-only rail with the selected node-and-line composition, then captured the desktop result at the target viewport. No further visual correction was required.

### Follow-up polish

- P3: the highlighted node stays on the first stage, matching the selected mock. It can be connected to scroll position in a later interaction pass if that behavior is desired.

final result: passed

## Current selected hero verification — 2026-08-05

The current implementation follows the selected three-row white, cyan, and green heading treatment while preserving the existing `Open live demo` CTA. A direct in-app browser capture remains blocked by the localhost URL policy, so visual QA cannot truthfully pass.

final result: blocked
