# Djinni application message — Lynx Capital Partners

English post, EU product company.

Angle: lead with the one specific, verifiable overlap (idempotent money movement on the iGaming
platform), then Quextro solo ownership as general backend proof, then name the years and the
FIX/market-data gap plainly. Don't oversell exchange-connectivity language.

## Message (send this)

Hi! On my last contract I built money-correctness into a live iGaming platform: idempotent
withdrawals keyed on the ledger index, single-statement bonus expiry with debit, and abuse limits
on bonus issuance, so a payment path can't double-fire even under retries. That's the same
discipline your order and P&L reconciliation work needs.

I'm a full-stack TypeScript developer based in Vienna, three years commercial. Alongside the
money-correctness work I built event-driven Node microservices (Express, Drizzle, Postgres, Redis,
Docker, GitLab CI) across identity, gateway, wallet, bonus and casino domains, plus
session-revocation events consumed downstream and per-brand access rules with counters and
threshold alerts. Before that I built Quextro solo, an ed-tech platform now used by British
teachers and students, with Bun, Postgres, Docker, GitHub Actions and OpenTelemetry around it so I
could debug production myself.

Honest about the gap. Your post asks for 5+ years and a real fan-out market-data system I can
describe in numbers, connections, messages per second, p99 latency, and I don't have that at that
scale. I haven't touched FIX, brokerage or clearing-firm integrations, and my production experience
is three years. What I can point to is the same shape of problem at smaller scale: idempotency,
retries, event ordering and reconciliation against a ledger, in a system that also moves real
money.

Portfolio: danolekh.com. GitHub: github.com/danolekh. Happy to walk through the ledger and
idempotency design on a call if that's useful.

## Form settings

- **Salary expectations:** $2,000. "$$$$" band shown but no explicit number, EU product company, so
  the no-band default for EU/US applies.
- **CV:** `me/resume/out/Resume-backend.pdf`
- **Timing:** fresh post (8 views, 1 application). Send now; the years/domain gap means low odds,
  so no reason to sit on it.
