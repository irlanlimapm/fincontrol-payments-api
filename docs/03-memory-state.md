# Memory, State, and Execution Continuity

## Purpose

This document defines how the `PR Reviewer Agent` should handle memory, state, checkpoints, stale context, context drift, and execution continuity in the `fincontrol-payments-api` repository.

It supports the GH-600 Domain 3 learning objective:

> Manage memory, state, and execution.

The goal is to ensure that the agent can resume work safely without relying on fragile conversation history, stale assumptions, or implicit memory.

## Design Principle

The PR Reviewer Agent should not depend on conversation history as the source of truth.

The agent should use durable GitHub artifacts to reconstruct context, validate current state, and resume execution safely.

> Memory informs decisions. State tracks execution.

## Memory vs State

| Concept | Meaning                                                             | Example                                                                                       |
| ------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Memory  | Information the agent uses to understand context and make decisions | ADRs, architecture docs, coding standards, prior approved decisions                           |
| State   | Operational record of the current execution                         | Current step, completed steps, pending actions, active PR, observed checks, latest commit SHA |

Memory helps the agent understand **what matters**.

State helps the agent know **where it is in the workflow**.

## Types of Memory

| Type              | Description                                               | Example in this repository                                                                 |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Short-term memory | Temporary context used during the current task or session | Current PR review reasoning, temporary notes, active analysis                              |
| Long-term memory  | Curated knowledge that should guide future executions     | ADRs, architecture docs, agent specs, evaluation rubrics                                   |
| External memory   | Durable information stored outside the model context      | GitHub issues, pull requests, commits, workflow runs, logs, artifacts, documentation files |

Short-term memory is useful for reasoning, but it is not durable.

Long-term memory must be curated and intentional.

External memory should be treated as the source for reconstructing execution across sessions.

## Source of Truth

For this repository, the primary durable source of truth is GitHub.

The PR Reviewer Agent should re-anchor on:

* issues;
* pull requests;
* commits;
* latest branch state;
* workflow runs;
* check status;
* review comments;
* CODEOWNERS;
* ADRs;
* repository documentation;
* evaluation artifacts.

The agent should not assume that previous conversation context is complete, current, or authoritative.

## Execution State

Execution state is the operational tracking of the current task.

It should include:

* task or issue identifier;
* active pull request;
* target branch;
* latest observed commit SHA;
* completed steps;
* pending steps;
* tools used;
* workflow/check status observed;
* decisions made;
* risk classification;
* escalation status;
* checkpoint references;
* audit evidence.

## What Should Be Persisted

The agent should persist enough information to resume safely, not everything it has seen.

Persisted state should include:

* approved plan;
* current execution step;
* completed steps;
* pending steps;
* relevant issue or PR links;
* commit SHA or branch reference used during analysis;
* workflow/check status observed;
* review recommendation;
* risk classification;
* escalation reason, if applicable;
* checkpoint summary;
* audit evidence.

## What Should Not Be Persisted

The agent must not persist:

* secrets;
* credentials;
* tokens;
* unnecessary sensitive data;
* temporary reasoning;
* unvalidated assumptions;
* hallucinated outputs;
* stale context;
* redundant artifacts;
* private information unrelated to the task;
* low-value intermediate notes that do not support auditability.

## Checkpoints

A checkpoint is a persisted snapshot of execution state that allows the agent to resume from a known safe point.

A checkpoint should answer:

* What task was being executed?
* What source of truth was used?
* What commit or PR state was observed?
* What steps were completed?
* What remains pending?
* What evidence supports the current recommendation?
* Is human review or escalation required?

Checkpoints should be created at meaningful boundaries, such as:

* after reading PR metadata;
* after inspecting the diff;
* after reading workflow/check status;
* after risk classification;
* before escalation;
* before producing final recommendation.

## Context Drift

Context drift happens when the agent’s working context, assumptions, or actions move away from the original issue, PR scope, approved plan, or source of truth.

Examples:

* reviewing files unrelated to the pull request;
* making recommendations outside the linked issue scope;
* continuing after the PR changed without refreshing context;
* treating a previous plan as valid after requirements changed;
* using outdated branch or workflow information.

The agent should detect drift and re-anchor on the latest durable artifacts.

## Stale Context

Stale context is outdated information that no longer reflects the current state of the repository, branch, PR, workflow, issue, or decision record.

Examples:

* a PR receives new commits after the agent reviewed it;
* CI results change after the initial analysis;
* an issue is updated after the agent created its plan;
* branch protection rules change;
* an ADR supersedes a previous decision.

The agent must refresh context before continuing execution.

## Conflicting Context

Conflicting context happens when two or more sources disagree.

Examples:

* the issue says the change is validation-only, but the PR modifies payment behavior;
* the PR description says tests passed, but GitHub checks show failure;
* a previous comment says the PR is ready, but a new commit changed the implementation;
* the branch state does not match the checkpoint.

When conflicting context is detected, the agent should:

1. stop;
2. identify the conflict;
3. compare authoritative sources;
4. re-anchor on the source of truth;
5. refresh context;
6. document the conflict;
7. escalate to a human if it cannot resolve safely.

> Do not guess through conflicting context. Re-anchor, refresh, document, and escalate.

## Pruning

Pruning is the process of removing irrelevant, redundant, stale, or low-value context from memory.

The agent should prune:

* outdated assumptions;
* duplicate notes;
* irrelevant files;
* previous intermediate conclusions;
* stale workflow results;
* old branch state;
* context not needed for the current task.

Pruning reduces context drift and helps the agent focus on the current source of truth.

## Context Reset

The agent should reset its context when continuing would be unsafe.

A reset is required when:

* task scope changes significantly;
* the current context becomes stale;
* sources conflict and cannot be reconciled;
* the agent detects context drift;
* execution state is corrupted;
* a new task starts;
* the approved plan changes;
* policy or permission boundaries change;
* the source of truth has been updated.

Resetting context does not mean forgetting durable artifacts. It means rebuilding working context from authoritative sources.

## Safe Execution Continuity

Execution continuity is safe and auditable when the agent can resume from durable checkpoints and reconstruct:

* original task intent;
* approved plan;
* current execution state;
* latest source of truth;
* completed steps;
* pending steps;
* tool usage;
* workflow/check status;
* risk classification;
* escalation decisions;
* approval history;
* final recommendation.

Safe continuity requires:

* durable artifacts;
* checkpoints;
* source-of-truth references;
* quality gates;
* traceability;
* clear escalation rules.

## Exam-Oriented Summary

| Concept             | One-line definition                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Memory              | Information used to inform decisions                                                     |
| State               | Operational tracking of execution                                                        |
| Short-term memory   | Temporary task/session context                                                           |
| Long-term memory    | Curated reusable knowledge                                                               |
| External memory     | Durable context outside the model                                                        |
| Checkpoint          | Known safe point for resuming execution                                                  |
| Context drift       | Moving away from the original goal, scope, plan, or source of truth                      |
| Stale context       | Outdated context that no longer reflects current reality                                 |
| Conflicting context | Sources disagree and must be reconciled                                                  |
| Pruning             | Removing stale, redundant, or low-value context                                          |
| Reset               | Rebuilding working context when continuing would be unsafe                               |
| Safe continuity     | Resuming with durable state, source-of-truth references, quality gates, and auditability |

## Related Artifacts

* [PR Reviewer Agent Spec](../agents/pr-reviewer/spec.md)
* [Tools and MCP Documentation](./02-tools-mcp.md)
* [ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent](../adrs/003-mcp-tool-access-strategy.md)
* [Autonomy Matrix](../guardrails/autonomy-matrix.md)
* [PR Reviewer Evaluation Rubric](../evaluation/pr-review-rubric.md)
* [Domain 02 Tool Use Simulation](../simulations/domain-02-tool-use-simulation.md)

This document is part of the GH-600 Domain 3 portfolio package.
