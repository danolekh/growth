---
name: write-proposal
description: Draft a winning Upwork proposal for a job Dan is pursuing — the cover letter, an answer to every screening question, and the apply settings (rate, boost, connects). Use after triage says pursue, or when Dan pastes a job and says "write a proposal" / "draft this" / is on the apply screen.
user-invocable: true
---

# write-proposal — draft the proposal + apply settings

## Read first
- `playbook/proposals.md` — the 10 things that win, the reusable skeleton, the unproven-account opener,
  the milestone template, **"Write in Dan's voice"**, and the terminal **formatting rule**.
- `case-studies/oasi-kadir.md` — the model win.
- `me/profile.md`, `me/skills.md`, `me/experience.md`, `me/portfolio.md` — real details + which proof to
  lead with by job type.
- `playbook/the-trust-gap.md`, `playbook/connects.md`, `me/connects.md`.

## Steps
1. **Pick the hook (first line):** for speed/rescue/small jobs, the default hook is the **Oasi Kadir
   review numbers** (mobile 69→99, 16s→<2s, verified 5.0 review) + the case study
   (https://www.danolekh.com/p/oasi-kadir). Otherwise: live demo link > shipped product/repo >
   best-matching proof, per `me/portfolio.md` "which link to lead with, by job type". If a demo is
   warranted and missing, suggest `/build-demo` or `/build-blog-demo` first and lead with that link.
2. **De-risk early** (only if the account is still unproven): one line right after the hook — small paid
   test slice / milestone approvals / start-small. Skip it once Dan has a wall of reviews.
3. **Body:** follow the skeleton — mirror the client's stated priority (what they repeat), then answer
   **every hard requirement and every screening question** point by point. Confirm hard constraints they
   bolded (e.g. "individual freelancers only").
4. **Screening questions:** answer each in its own field, weaving the answer naturally (don't restate
   the label). If they ask for a keyword ("start with 'mango'"), put it first.
5. **Price + availability:** rate at mid/upper of the stated budget, justified by fit. Fixed-price
   structure by size: small jobs ($200–800) → flat price or two milestones (50/50); bigger builds
   ($1k+) → 20/20/40/20. State availability.
6. **Apply settings:** rate to bid, **boost call**, apply cost → remaining balance.
7. **Save the record:** scaffold `applications/<slug>/` from `applications/_TEMPLATE.md` and write
   `proposal.md` (raw post, fit analysis, hook, the final text, status).

## Dan's voice (non-negotiable — see playbook/proposals.md)
- Plain and conversational. **Hyphens (`-`), never em-dashes (`—`).**
- No "X, not Y" contrast flourishes; no clever quips; no labeled-list sentences ("Turnaround — ...").
  Weave answers into prose ("Regarding turnaround, ...").
- Print the proposal as **plain text bracketed by `---`** so it copy-pastes clean — never inside a
  blockquote or code fence.
- Only claim skills in `me/skills.md`. Be specific to the post; delete filler.
