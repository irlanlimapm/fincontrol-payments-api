# PR Reviewer Agent Autonomy Matrix

## Purpose

This matrix defines what the PR Reviewer Agent is allowed to access, decide, recommend, or execute.

It separates **permissions** from **autonomy**:

* **Permission** defines what systems, tools, APIs, and resources the agent can access.
* **Autonomy** defines what actions the agent can decide or execute within the SDLC workflow.

This distinction matters because an agent may technically have access to a capability while still being prohibited from using it without human approval.

## Design Principle

The PR Reviewer Agent should produce useful review evidence without bypassing GitHub SDLC controls.

The agent can read context, classify risk, and recommend next steps, but it must not approve, merge, deploy, access secrets, or modify critical repository configuration.

> Permissions control access. Autonomy controls action.

## Autonomy Levels

| Level | Meaning          | Human Approval Required?                     |
| ----- | ---------------- | -------------------------------------------- |
| A0    | Not allowed      | Always blocked                               |
| A1    | Read-only        | No, if within approved scope                 |
| A2    | Recommend only   | Human decides next action                    |
| A3    | Limited write    | Allowed only for predefined low-risk actions |
| A4    | High-risk action | Always requires human approval               |

## Permission and Autonomy Matrix

| Capability                                | Permission | Autonomy Level |               Human Approval | Enforcement Mechanism                              | Notes                                                       |
| ----------------------------------------- | ---------: | -------------: | ---------------------------: | -------------------------------------------------- | ----------------------------------------------------------- |
| Read pull request metadata                |    Allowed |             A1 |                           No | GitHub MCP permissions                             | Required for review context                                 |
| Read pull request diff                    |    Allowed |             A1 |                           No | GitHub MCP permissions                             | Required to inspect code changes                            |
| Read linked issues                        |    Allowed |             A1 |                           No | GitHub MCP permissions                             | Used to validate scope and intent                           |
| Read repository files required for review |    Allowed |             A1 |                           No | GitHub MCP permissions                             | Limited to files needed for review context                  |
| Read workflow and check status            |    Allowed |             A1 |                           No | GitHub MCP permissions / GitHub Actions visibility | Used to understand CI state                                 |
| Classify PR risk                          |    Allowed |             A2 |                           No | Agent spec / evaluation rubric                     | Output must explain rationale                               |
| Recommend merge readiness                 |    Allowed |             A2 |                           No | Agent spec / PR comment template                   | Recommendation only, not approval                           |
| Recommend additional tests                |    Allowed |             A2 |                           No | Agent spec / PR comment template                   | Agent may suggest but not modify code                       |
| Request human review                      |    Allowed |             A2 |                           No | CODEOWNERS / PR review process                     | Required for high-risk or unclear changes                   |
| Post structured PR review comment         |    Planned |             A3 |        No, if template-bound | GitHub MCP permissions / fixed output template     | Must follow approved review structure                       |
| Apply fixed risk label                    |    Planned |             A3 | No, if label is allow-listed | GitHub label allow-list                            | Allowed labels only: `risk:low`, `risk:medium`, `risk:high` |
| Trigger validation workflow               |   Deferred |             A4 |                          Yes | GitHub Actions permissions / workflow rules        | May be considered later for safe validation workflows       |
| Create branch                             |    Blocked |             A0 |               Always blocked | GitHub permissions / branch protection             | Not required for reviewer role                              |
| Modify source code                        |    Blocked |             A0 |               Always blocked | GitHub permissions / branch protection             | Reviewer must not become implementer                        |
| Modify GitHub Actions workflows           |    Blocked |             A0 |               Always blocked | CODEOWNERS / branch protection                     | Workflow changes are high-risk                              |
| Approve pull request                      |    Blocked |             A0 |               Always blocked | Branch protection / review rules                   | Agent must not approve its own or others' PRs               |
| Merge pull request                        |    Blocked |             A0 |               Always blocked | Branch protection / GitHub permissions             | Merge remains a human-controlled action                     |
| Push to main                              |    Blocked |             A0 |               Always blocked | Branch protection                                  | Direct changes to main are prohibited                       |
| Access repository secrets                 |    Blocked |             A0 |               Always blocked | GitHub secret permissions                          | Secrets are outside reviewer scope                          |
| Deploy to environments                    |    Blocked |             A0 |               Always blocked | Environment protection rules                       | Production-impacting actions require humans                 |
| Add arbitrary MCP servers                 |    Blocked |             A0 |               Always blocked | MCP allowlisting / ADR process                     | New MCP servers require a separate ADR                      |

## Required Escalation Conditions

The agent must escalate to a human reviewer when:

* the pull request changes authentication, authorization, payments, security, compliance, or workflow files;
* CI checks fail or produce inconsistent results;
* the requested action is outside the allowed tool scope;
* the agent needs access to a blocked capability;
* instructions conflict with repository policy;
* the change requires CODEOWNER review;
* the change may impact production or secrets;
* the agent cannot produce enough evidence to justify its recommendation.

## Retry, Rollback, and Escalation Rules

| Situation                    | Correct Response                                         |
| ---------------------------- | -------------------------------------------------------- |
| Temporary API timeout        | Retry within configured limits                           |
| MCP server unavailable       | Retry once, then escalate if still unavailable           |
| Rate limit encountered       | Stop and escalate; do not bypass controls                |
| Permission denied            | Stop and escalate; do not retry blindly                  |
| CI failure caused by code    | Escalate or recommend fix; do not retry as if transient  |
| Policy violation             | Stop and escalate                                        |
| Human approval missing       | Stop and wait for approval                               |
| Unsafe change already merged | Recommend rollback path; agent does not execute rollback |

## Audit Evidence

For each review, the agent output should make the following evidence reconstructable:

* pull request reviewed;
* linked issue or stated intent;
* files inspected;
* workflow/check status observed;
* risk classification;
* recommendation;
* blocked or unavailable tools, if any;
* escalation reason, if applicable;
* timestamped PR comment or review artifact.

## Related ADRs

* [ADR-001: PR Self-Approval During Solo Development Phase](../adrs/001-pr-self-approval-solo-development.md)
* [ADR-002: PR Reviewer as the First Functional Agent](../adrs/002-pr-reviewer-first-agent.md)
* [ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent](../adrs/003-mcp-tool-access-strategy.md)
