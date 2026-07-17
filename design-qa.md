# Auth transition design QA

## Evidence

- Source screenshot: `/var/folders/fk/jlsmzxq504984lg5_q5nl9d80000gn/T/codex-clipboard-9a1f211d-112b-43cf-81d8-c1c7b542918d.png`
- Glass source screenshot: `/var/folders/fk/jlsmzxq504984lg5_q5nl9d80000gn/T/codex-clipboard-a78dc59e-3c33-4cbe-b495-b3c3f236e200.png`
- Live reference: `https://dashboard.clerk.com/sign-in`
- Live glass reference: `https://www.framer.com/community/marketplace/components/glass-login/`
- Live glass capture: `/tmp/framer-glass-login-live.png`
- Left-travel screenshot: `/tmp/cashlift-auth-loop-left.png`
- Border-pause screenshot: `/tmp/cashlift-auth-loop-pause.png`
- Right-emergence screenshot: `/tmp/cashlift-auth-loop-emerge.png`
- Right-exit screenshot: `/tmp/cashlift-auth-loop-exit.png`
- Five-treatment comparison: `/tmp/cashlift-auth-five-continuous-variants.png`
- Brand-prism left travel: `/tmp/cashlift-auth-04e-prism-left.png`
- Brand-prism border pause: `/tmp/cashlift-auth-04e-prism-border-pause.png`
- Brand-prism right travel: `/tmp/cashlift-auth-04e-prism-right.png`
- Brand-prism end pause: `/tmp/cashlift-auth-04e-prism-end-pause.png`
- Adaptive 14-dot travel: `/tmp/cashlift-auth-04e-adaptive-revised.png`
- Adaptive focused crop: `/tmp/cashlift-auth-04e-adaptive-revised-focus.png`
- Final focused comparison: `/tmp/cashlift-auth-04e-reference-comparison-final.png`
- Final glass variants: `/tmp/cashlift-auth-five-glass-variants-final.png`
- Glass reference comparison: `/tmp/cashlift-glass-reference-comparison.png`
- Recommended glass implementation: `/tmp/cashlift-auth-05a-final-no-scroll.png`
- Lighter glass verification: `/tmp/cashlift-auth-05b-lighter-glass.png`
- Five-step transparency scale: `/tmp/cashlift-auth-glass-transparency-scale.png`
- Settled screenshot: `/tmp/cashlift-auth-settled-04a.png`
- Combined comparison: `/tmp/cashlift-auth-design-qa.png`
- Browser viewport: 1280 x 720
- Compared state: selected `04e` motion plus settled `05a` through `05e` glass materials
- Implemented route: `http://127.0.0.1:3016/login`
- Implementation viewport: 1488 x 1037
- Implementation state: real Clerk form loaded with the selected `05e` shell

## Full-view checks

- The auth cards remain centered and retain route-specific stable footprints before and after reveal: 392 x 438 for login and 392 x 522 for signup.
- The rails stop well inside the viewport and remain behind the card without overlapping form content.
- The layout has no footer and keeps focus on the authentication card.
- The header wordmark is reused directly from the CashLift marketing header.
- Historical glass variants used the CashLift finance-command image; the final production backdrop removes the image and outer frame so only the rails and animated dots remain.
- Glass cards now step from 90% to 50% opacity in exact 10-point increments, with secondary form surfaces matching each card.
- The implemented 05e card uses the selected 50% panel surface and matching 50% Clerk input/button surfaces.

## Focused comparison

- Reference geometry: one shallow bend and short flat rail adjacent to each side of the card.
- Implementation geometry: the same single-bend structure, with shorter outer segments and CashLift token colors.
- Motion: static rails with a continuous 14-dot loop that enters from the left, disappears at the card, pauses, and emerges from the right border.
- Dot treatment: smaller dots ramp from a faint teal tail through cyan to a blue-violet head; radius and opacity change subtly during travel.
- Transition: the skeleton and form share one fixed card shell, preventing layout jumps or flicker.

## Fidelity surfaces

- Fonts and typography: unchanged from the approved CashLift card; the dot reference contains no typography.
- Spacing and layout rhythm: focused crop confirms the dense trail follows the same flat-to-diagonal rhythm as the reference.
- Colors and tokens: the implementation uses CashLift `primary`, `primary-hover`, `primary-muted`, `signal`, and `violet` tokens; white was removed.
- Image quality and asset fidelity: the final production backdrop no longer uses a raster image; the SVG rail remains sharp at the target viewport.
- Copy and content: no copy changes were required for this motion-only refinement.
- Glass material: blur ranges from 10px to 30px with restrained saturation, token-backed borders, and a 90%/80%/70%/60%/50% surface-opacity scale.

## Findings

- Initial P2: the first comparison rendered the head too cyan relative to the reference's blue-violet tip.
- Fix: increased the violet weighting of the first three head dots without changing the teal/cyan tail.
- Post-fix evidence: `/tmp/cashlift-auth-04e-reference-comparison-final.png`; no actionable P0, P1, or P2 differences remain.
- Glass P2: the first framed backdrop added 2px of page overflow.
- Glass fix: removed the unnecessary outer border while retaining the rounded image crop; final document and viewport both measure 1280 x 720.
- Glass post-fix evidence: `/tmp/cashlift-auth-05a-final-no-scroll.png`; no actionable P0, P1, or P2 differences remain.

## Comparison history

1. Replaced the full-width multi-kink graph with a bounded single-bend rail.
2. Slowed all motion options and made the selected synced option use multiple moving dots.
3. Delayed the fast form reveal until dot motion completes.
4. Replaced the placeholder brand mark with the existing header `Logo` component.
5. Verified all variants `04a` through `04e` settle with the form visible and loading layer hidden.
6. Refined the train to approximately 1px visual gaps and a slightly faster 1.14s rail traversal.
7. Decoupled the decorative loop from the form/auth loading state by making it repeat indefinitely.
8. Removed the fixed endpoint dot and kept the right side hidden on initialization.
9. Reframed `04a` through `04e` as tonal, transparency, CashLift gradient, soft glow, and brand-prism treatments of the same motion.
10. Refined `04e` with approximately 400ms at the form border, approximately 450ms after exit, and a token-derived cyan-blue, signal-green, and soft-white palette.
11. Tripled both pauses, increased `04e` to 14 smaller dots, removed white, and added progress-linked radius and opacity changes.
12. Compared the focused trail against the new source, corrected the overly cyan head, and recaptured the final comparison.
13. Added `05a` through `05e` as balanced frost, slate glass, cyan lens, layered edge, and deep glass treatments.
14. Reused the existing finance-command image behind 88%-96% opaque cards, then fixed the initial 2px overflow and recaptured all five variants.
15. Reduced card opacity to 84%-93% and control opacity to 84%, then verified all five computed styles and the settled `05b` render.
16. Replaced the narrow range with an exact A-E transparency scale of 10% through 50%, verified computed card/control alpha, and compared all five settled renders.
17. Promoted `05e` to the real `/login` route, preserved Clerk's hosted form, and removed the prototype variant query path.
18. Kept the glass shell and both dot rails outside Clerk loading state so the background never remounts during authentication readiness.
19. Tightened the production card from 544px to 448px after browser QA, preserving the 392px width and eliminating excess empty space.
20. Verified the loaded form accepts input, the CTA remains visible, both static rail paths stay unchanged, all 28 animated dots are present, and the page has no viewport overflow.
21. Reduced Clerk's focused email treatment from a 4px ring to a 1px primary ring after focused-state review.
22. Restored the approved 408px card height, reducing the Continue-to-card-bottom gap from about 70px to 30px without page overflow.
23. Replaced the focused input's outer ring with an in-box 1px primary border so both vertical edges remain visible inside the form surface.
24. Set the primary Continue button to a uniform 12px radius and verified its computed overflow clips the fill cleanly at every corner.
25. Reserved the email input's 1px border footprint and changed only its inset ring color on focus, keeping all four edges visible without moving the Continue button.
26. Removed the production backdrop image, overlay, outer border, and rounded frame while retaining the static rails and animated dots.
27. Applied the shared glass shell and Clerk appearance to signup, then reserved responsive route-specific card footprints so neither auth form changes height when loading completes.

## Final result

passed
