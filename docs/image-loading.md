# Image Loading

Use browser-native responsive image selection whenever an image is lazy-loaded and its rendered layout size is known before request time.

## Rule

- Lazy responsive images use `loading="lazy"` and start `sizes` with `auto`.
- Include a fallback source size after `auto` for older browsers, for example `sizes="auto, 100vw"`.
- Do not lazy-load LCP candidates, hero images, or above-the-fold product screenshots. Give those images an explicit `sizes` value, usually `100vw` or a simple viewport-based expression.
- Fixed-size logos and icons do not need `sizes`; keep explicit `width` and `height`.
- Keep image dimensions or stable aspect-ratio constraints in the layout to avoid shifts.

## Pattern

```tsx
<Image
	src={screenshot}
	alt="Workspace approval queue"
	width={1600}
	height={1000}
	loading="lazy"
	sizes="auto, 100vw"
	className="h-auto w-full"
/>
```

The browser can use the rendered lazy-image size when selecting from `srcset`. The fallback keeps the markup valid for browsers that do not support `auto`.

## Exception

```tsx
<Image
	src={heroImage}
	alt="Workspace dashboard"
	width={1920}
	height={1200}
	priority
	sizes="100vw"
	className="h-auto w-full"
/>
```

Hero and LCP images should be requested early, so they still need a real source-size hint.
