# Cardog — Founding Engineer (dealer platform)

- **Source:** Hacker News "Who is hiring" · https://news.ycombinator.com/item?id=49530464
- **Published:** 2 Sep 2026 (HN thread). Views/applications not visible on HN.
- **Company:** Cardog — system of record for the Canadian vehicle. Turns raw automotive data
  (government registry filings, manufacturer records, listing sites, insurance records, VIN
  decoding, live OBD-II reads) into reconciled, checkable facts. Open-source VIN decoder sits
  underneath a government vehicle registry. https://cardog.app/careers
- **Format:** Toronto, Canada or Remote · Full-time.
- **Salary:** not stated.
- **Years required:** not stated.

## Raw post (abridged)
Four open roles: VIN Decode Engineer, Data Platform Engineer, Infrastructure Engineer, Founding
Engineer (dealer platform). Stack: TypeScript, Postgres, Cloudflare Workers. Company describes
the hard part of the work as reconciliation - the same vehicle described four different ways by
a government registry, a manufacturer filing, a listing site and an insurance record, with
nothing linking them, in a way that has to hold up when a regulator asks how the match was made.
Also decoding the 17-character VIN (inconsistent per manufacturer, filled in from filings, recall
documents and inferred patterns) and reading vehicles directly over OBD-II (a recent Hyundai
returned 40 modules, each with its own part number and software version, none of it visible
downstream of the VIN).

## Requirements → Dan
| They want | Dan |
|---|---|
| TypeScript | **Yes**, primary language |
| Postgres | **Yes**, Drizzle daily |
| Cloudflare Workers | **Yes**: Azulejo is deployed on Cloudflare Workers with Hyperdrive Postgres acceleration |
| Founding-engineer ownership (dealer platform role specifically) | **Yes**: built Quextro's entire platform solo, backend to frontend |
| Data reconciliation / messy real-world data modeling | **Partial**: no vehicle-data or regulatory-reconciliation experience specifically, but Azulejo's variant/SKU/attribute modeling and the iFit catalog are the closest shape (structured entities from inconsistent sources) |
| VIN decoding / OBD-II / automotive domain | **No** |

## Stack-ability
Stack (TypeScript, Postgres, Cloudflare Workers) is a near-exact match to the Azulejo build.
Four roles open means some flexibility in which one to pitch for; "Founding Engineer (dealer
platform)" is the closest to Dan's strongest story (solo ownership, full-stack).

## Verdict
**Apply**, for Founding Engineer (dealer platform). Stack match is real and specific (Cloudflare
Workers + Hyperdrive is not a common combination to have shipped). Angle: Azulejo as direct
proof of the exact stack, Quextro as proof of founding-engineer solo ownership. Name the
automotive-domain gap plainly - it's real and the post is clearly domain-heavy.
