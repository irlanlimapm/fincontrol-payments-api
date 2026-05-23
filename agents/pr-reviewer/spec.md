# Agent Specification PR Reviewer

> Specification for the primary agent in this repository: an automated reviewer of pull requests opened against the FinControl Payments API. This document defines what the agent does, what it must NOT do, how success is measured, and how it is held accountable.

---

## Purpose

Review pull requests opened in this repository, producing a structured assessment that helps human reviewers focus on what matters. The agent is a **first-pass reviewer**, not a final approver.

## Trigger

| Event | Scope |
|---|---|
| `pull_request` opened or synchronized | Any branch targeting `develop` |
| Manual `workflow_dispatch` | For testing during development |

The agent does **not** trigger on pushes to `main`. PRs to `main` follow a separate, human-led review path.

## Inputs

The agent receives:
- The pull request metadata (title, body, author, labels)
- The diff of changed files (limited to changes in `src/` and `tests/`)
- The output of automated checks already run on the PR (lint, unit tests, build status)
- The repository's `copilot-instructions.md` as governing context

The agent does **not** receive:
- Secrets, environment variables, or credentials
- Files outside `src/` and `tests/` unless explicitly referenced in the diff
- Historical PRs or unrelated issues

## Outputs

For every PR it reviews, the agent produces exactly three artifacts:

1. **A structured plan** posted as the first comment on the PR before any analysis runs. Plan format:
   - What the agent will inspect
   - Files it will analyze
   - Checks it will run
   - Estimated risk classification for the change
2. **A review summary** a single PR comment with sections:
   - Scope adherence (did the PR stay within its stated scope?)
   - Risk assessment (operational / security / compliance)
   - Test coverage observations
   - Specific concerns, if any
   - Recommendation: `approve` / `request-changes` / `defer-to-human`
3. **Inline comments** only on lines where the agent has high-confidence concerns. Maximum 5 inline comments per PR to avoid noise.

## Success criteria

The agent is considered successful when:
- 100% of opened PRs receive a plan comment within 60 seconds
- 100% of opened PRs receive a review summary
- False-positive rate on security flags < 10%
- No PR is auto-merged by the agent (this should be impossible by design)
- Human reviewers report the summary as useful in at least 70% of cases (qualitative signal)

## Allowed actions

- Read PR metadata, diff, and check results
- Post comments on the PR (plan, summary, inline)
- Apply labels from a fixed allowlist: `agent-reviewed`, `risk-low`, `risk-medium`, `risk-high`, `needs-human-review`
- Request additional checks to run (via comment, not by triggering directly)

## Disallowed actions

- Merge any PR (under any circumstance)
- Push commits directly to any branch
- Modify the PR's source files
- Approve a PR formally (the "Approve" GitHub action)
- Dismiss reviews from human reviewers
- Modify branch protection rules, CODEOWNERS, or workflow files
- Access secrets, environment variables, or repository settings
- Comment on or interact with PRs targeting `main`

These restrictions are enforced through tool permissions and branch protection, not relying on the agent's judgment alone.

## Autonomy level

| Action | Autonomy |
|---|---|
| Post plan comment | Autonomous |
| Post review summary | Autonomous |
| Add labels from allowlist | Autonomous |
| Recommend `request-changes` | Autonomous (recommendation only — humans act on it) |
| Recommend `defer-to-human` | Autonomous (and required for risk-high PRs) |
| Merge / approve / push | **Blocked** by design |

## Escalation path

The agent escalates to a human (by adding label `needs-human-review` and tagging CODEOWNERS) when:
- The change touches `src/payments/` (core payment logic)
- The risk classification is `high`
- The agent's own analysis fails or is inconclusive
- The PR includes changes to dependencies (`package.json`)

## Failure handling

If the agent fails to complete a review (timeout, tool error, MCP server unreachable):
- It must still post a final comment stating: "Review incomplete due to [reason]. Human review required."
- It must add the label `needs-human-review`
- It must NOT silently skip the PR

## Auditability

Every action the agent takes produces a durable artifact:
- Plan and summary are PR comments (permanent)
- Inline comments are PR comments (permanent)
- Workflow run logs are preserved per GitHub Actions retention
- All decisions reference the plan that was originally posted

## Open questions

These will be resolved as the project progresses through GH-600 weeks 2–6:

- Which MCP servers will the agent use? (Week 2)
- How will agent state persist between runs? (Week 4)
- What evaluation rubric will be applied to the agent's own performance? (Week 4)
- How will this agent coordinate with the Security Reviewer and Doc Updater simulations? (Week 5)