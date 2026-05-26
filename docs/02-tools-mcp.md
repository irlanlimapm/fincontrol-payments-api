# Tools and MCP PR Reviewer Agent

> How the PR Reviewer agent accesses tools and external services, what MCP servers it may use, and how permissions are scoped.

---

## Purpose

This document defines the tool access model for the `PR Reviewer Agent` in the `fincontrol-payments-api` repository.

The goal is not to give the agent maximum capability.

The goal is to give the agent enough capability to review pull requests safely, produce useful evaluation evidence, and remain auditable without being able to bypass human governance.

This document supports the GH-600 Domain 2 learning objective:

> Implement tool use and environment interaction.

It covers:

- agent tools
- GitHub APIs and workflows
- MCP servers
- MCP registry and allow-list strategy
- execution context
- repository, branch, and workflow boundaries
- safe execution paths
- retry, rollback, escalation, and traceability

---

## Design principle

The PR Reviewer Agent follows this principle:

> Tools expand what an agent can do. Governance defines what it is allowed to do.

Tool access is therefore designed around:

1. **Least privilege**
2. **Repository-level scope**
3. **Branch-based isolation**
4. **Read-first behavior**
5. **Human approval before merge**
6. **Traceable execution**
7. **Explicit escalation for uncertainty or risk**

The agent may inspect, analyze, comment, classify, and recommend.

The agent may not approve, merge, deploy, modify secrets, change protected workflows, or bypass branch protection.

---

## Agent role

| Field | Definition |
|---|---|
| Agent | `PR Reviewer Agent` |
| Primary SDLC step | Pull request review |
| Trigger | Pull request opened, updated, or manually requested |
| Main responsibility | Review PRs for scope, risk, quality, security, and evidence |
| Output type | Structured PR review, risk classification, evidence checklist, escalation recommendation |
| Human gate | Required before merge |
| Autonomy model | Autonomous analysis and commenting; no autonomous merge or deployment |

---

## Tooling mental model

The agent interacts with the development environment through controlled tools.

```text
Task / PR
↓
Agent reasoning
↓
Tool selection
↓
Permission boundary
↓
Execution context
↓
Evidence output
↓
Human review