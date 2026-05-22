# Architecture — Agent Integration in the SDLC

> How the PR Reviewer agent fits into the development workflow of FinControl Payments API, and what governance layer surrounds it.

---

## The lifecycle

Every change to this repository follows the same lifecycle, whether the contributor is human or agent:

Agents are governed at every stage. **No stage is skipped because the contributor is an agent** — if anything, the discipline is stricter.

## Where the PR Reviewer agent operates

The agent is invoked at **stage 6 (Evaluation)** of the lifecycle. It does NOT plan code changes, write code, or merge code. It assists human reviewers by producing a structured first-pass assessment.

┌──────────────────────────────────────────┐
            │   Human or agent contributor opens PR    │
            └────────────────────┬─────────────────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────────────┐
            │   Automated checks (CI, lint, tests)     │
            └────────────────────┬─────────────────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────────────┐
            │   PR Reviewer agent posts plan comment   │
            └────────────────────┬─────────────────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────────────┐
            │   PR Reviewer agent posts review summary │
            └────────────────────┬─────────────────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────────────┐
            │   Human reviewer (CODEOWNERS) decides    │
            └────────────────────┬─────────────────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────────────┐
            │   Merge (if approved + checks pass)      │
            └──────────────────────────────────────────┘

The human reviewer is the **gate**, not the agent. The agent is a **signal generator**, not a decision-maker.

## Control plane: GitHub as system of record

This repository treats GitHub itself as the control plane for agent governance. Every governance mechanism is enforced through native GitHub primitives:

| Governance need | GitHub primitive |
|---|---|
| Plan must precede execution | PR comments + PR template requiring plan section |
| Action requires approval | Branch protection rules + CODEOWNERS |
| Permissions are scoped | Tool permissions + workflow `permissions:` block |
| All decisions are auditable | PR comments + workflow logs + issue tracking |
| Some actions are blocked | Branch protection + repository ruleset (not relying on agent's "good behavior") |

Nothing in this architecture relies on the agent choosing not to misbehave. The boundaries are **enforced**, not requested.

## Separation of planning, reasoning, and action

The PR Reviewer agent's lifecycle internally mirrors the broader SDLC lifecycle:

1. **Plan phase**: agent reads PR metadata, generates structured plan, posts plan as comment. **No action on code or repository state.**
2. **Reasoning phase**: agent analyzes diff, runs checks against its own rubric. **Still no action on code or repository state.**
3. **Action phase**: agent posts review summary + optional inline comments + applies labels. **Only allowed actions, only after plan and reasoning.**

If the plan phase fails to produce a structured plan, the reasoning phase does not start. If the reasoning phase fails, the action phase posts the "review incomplete" comment instead of the full summary.

## Anti-patterns this architecture avoids

| Anti-pattern | How it's avoided here |
|---|---|
| Agent acts without a plan | Plan comment is the first artifact, before any analysis runs |
| Agent has broad permissions | Tool permissions scoped to read PR + write comments; nothing else |
| Agent silently fails | Failure path produces explicit incomplete-review comment |
| Agent can override humans | Cannot merge, approve, push, or dismiss reviews |
| Agent acts on `main` directly | Branch protection + scope restriction to PRs targeting `develop` |
| Agent's work is invisible | All outputs are PR comments + workflow logs (durable, public) |

## Human-in-the-loop, calibrated

The agent operates with **autonomy proportional to reversibility and risk**:

- Posting a comment on a PR — fully reversible, low risk → autonomous
- Recommending a decision — humans act on the recommendation → autonomous
- Merging a PR — irreversible, high risk → blocked
- Modifying repository settings — irreversible, high risk → blocked

No approval gates exist where they would add friction without reducing material risk. Every gate that exists, exists for a reason that ties back to operational, security, or compliance risk.

## What this architecture explicitly does NOT do

- It does not aim to automate code review entirely. Human reviewers are essential.
- It does not aim to be a general-purpose agent. The PR Reviewer is single-purpose.
- It does not protect against malicious humans contributing code — that's a different problem.
- It does not solve agent reliability. It assumes the agent will fail sometimes, and designs around that.

## What comes next

This architecture is the foundation. Subsequent additions across the project:

- **Week 2**: MCP allow list configuration (which external tools the agent can call)
- **Week 3**: Error handling, retry, rollback, and escalation paths
- **Week 4**: Agent state persistence and evaluation rubric
- **Week 5**: Coordination patterns with simulated Security Reviewer and Doc Updater agents
- **Week 6**: Audit trail consolidation and policy guardrails