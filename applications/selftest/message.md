# Application — growth-selftest (pipeline smoke test)

This is a synthetic test item ("[TEST] ignore me: ingest-discord smoke test"), not a real job.
Processed only to validate the questions-answering round trip end to end.

## Message (already drafted by a prior test run, not sent anywhere)

[TEST] Hi, your post says the agents handle the typing - that's already how I work day to day. I
run Claude Code on real feature work.

Before that I built Quextro, an ed-tech platform, solo from an empty repo to real users.

What does the first month look like?

## Screening answers

**Q: What breaks most often when AI writes the code?**
A: Edge cases it can't see and state it doesn't have context on - a race condition in payment
code, or a corner the tests don't cover. It's also confident on the happy path even when the real
behavior is wrong, so I never ship a diff without reading it end to end myself. On the iGaming
platform I work on now, money correctness is where I check hardest - idempotent withdrawals,
ledger keys, bonus expiry - because a wrong-but-plausible answer there costs real money, not just
a bug report.

**Q: Beyond writing code, what does your daily routine look like?**
A: I read the ticket, sketch the approach, then let the agent write a first pass while I stay on
architecture and edge cases. After that it's review, running tests, and debugging when something
breaks in a way I didn't expect. I do a short daily call with my current team, keep PRs small, and
write conventional commits so the history stays readable. I also split time across a few projects
at once, so a lot of the day is context-switching between codebases and picking back up where I
left off.
