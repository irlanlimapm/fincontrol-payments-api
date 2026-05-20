# ADR-001: PR self-approval during solo development phase

**Status**: Accepted  
**Date**: 2026-05-20  
**Deciders**: Irlan (sole maintainer)

## Context

The `fincontrol-payments-api` repository enforces branch protection on `main`:
all changes must go through a pull request with at least one approving review,
and direct pushes to `main` are blocked.

During the current phase, this repository has a single maintainer. There are
no other humans who can approve PRs, and no automated agents are yet
integrated. GitHub's default branch protection setting "Require approval of
the most recent reviewable push" would prevent the author from approving
their own PRs, making it impossible to merge anything without admin bypass.

This creates a tension between two valid goals:
1. Preserve a clean audit trail showing every change went through a PR with
   an explicit approval.
2. Allow the solo maintainer to actually ship code.

## Decision

For the solo-developer phase, the ruleset on `main` is configured to:
- Require a pull request before merging.
- Require 1 approving review.
- **Not** require that the approver be different from the author.

The author may approve their own PR. Admin bypass is **not** used: every
merge still produces an approval record in the repo audit log.

## Alternatives considered

**A. Admin bypass on every merge.** Rejected. Removes the explicit approval
record from history and sets a precedent of routing around branch protection
— exactly the anti-pattern this project aims to demonstrate awareness of.

**B. Add a co-maintainer as approver.** Rejected for now. No suitable
collaborator available, and inviting one purely to click approve would be
ceremonial, not governance.

**C. Disable branch protection until agents are integrated.** Rejected.
Loses the safety net during early development, and the muscle memory of
"every change goes through PR" is part of what this repo is designed to
demonstrate.

## Consequences

**Positive**
- Every change to `main` has an explicit approval record.
- Workflow mirrors what a real team would do: PR opened, reviewed, approved,
  merged.
- Foundation is in place for the next governance step (agent PRs reviewed
  and approved by a human).

**Negative**
- Self-approval has no independent oversight. Mitigated by the small scope
  of changes during this phase and by self-imposed review discipline
  (reading the diff before approving).

## Revisit when

This decision is **explicitly temporary**. It must be revisited when any of
the following happens:
- An automated agent (e.g. PR Reviewer agent) starts opening PRs against
  this repo. At that point: agents may **not** approve their own PRs;
  human approval becomes mandatory for any agent-authored change.
- A second human maintainer joins the repo.
- The repo moves out of portfolio scope into anything resembling production
  use.

A follow-up ADR will document the agent-era approval policy.