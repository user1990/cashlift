# Homepage decision story performance

Measured against a local production build on 2026-07-14 with Chrome mobile
Lighthouse and DevTools throttling. Each run used a fresh Lighthouse session.

## Lighthouse

| Run | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 100 | 100 | 765 ms | 39 ms | 0 |
| 2 | 100 | 100 | 100 | 100 | 737 ms | 27 ms | 0 |
| 3 | 100 | 100 | 100 | 100 | 736 ms | 26 ms | 0 |

## Homepage payload comparison

The comparison sums the uncompressed JavaScript referenced by the production
homepage HTML, the HTML response, and the eager hero visual in each build.

| Build | JavaScript | HTML | Hero visual | Combined |
| --- | ---: | ---: | ---: | ---: |
| Previous homepage | 1,014,639 B | 400,234 B | 5,943 B | 1,420,816 B |
| Decision story | 939,917 B | 246,541 B | 44,914 B | 1,231,372 B |

The decision story is 189,444 B (13.3%) smaller by this comparison. Lighthouse
reported between 354,269 B and 354,291 B total transferred in the final audits.
