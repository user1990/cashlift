# Homepage decision story performance

Measured on 2026-07-14 with local production builds, Chrome mobile Lighthouse,
and DevTools throttling. The `origin/main` baseline (`739570e`) and final branch
used the same browser, audit command, environment, and network-transfer fields.
Each run used a fresh Lighthouse session.

## Lighthouse

| Run | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 100 | 100 | 765 ms | 39 ms | 0 |
| 2 | 100 | 100 | 100 | 100 | 737 ms | 27 ms | 0 |
| 3 | 100 | 100 | 100 | 100 | 736 ms | 26 ms | 0 |

## Homepage payload comparison

Lighthouse's network-request records provide the actual transferred script
bytes. Total transfer is Lighthouse's full page-weight measurement, including
scripts, styles, fonts, images, and document requests. The final value below is
the largest of the three final runs.

| Build | Initial script transfer | Total transfer |
| --- | ---: | ---: |
| `origin/main` | 411,947 B | 514,917 B |
| Decision story | 256,249 B | 354,291 B |

The decision story transfers 155,698 B (37.8%) less initial JavaScript and
160,626 B (31.2%) less overall than the baseline.
