# Domain 03 State Continuity Simulation

## Purpose

This simulation demonstrates how the PR Reviewer Agent should resume execution safely after interruption.

It is designed as a GH-600 Domain 3 learning artifact for:

* memory vs state;
* short-term memory;
* long-term memory;
* external memory;
* checkpoints;
* stale context;
* context drift;
* conflicting context;
* pruning;
* reset;
* execution continuity;
* auditability.

## Scenario

The PR Reviewer Agent starts reviewing a pull request that changes the `/payments` endpoint.

The agent reads the PR metadata, linked issue, and initial diff. Before it finishes the review, execution is interrupted.

Later, the agent resumes the task.

During the interruption, the pull request receives a new commit and the CI status changes.

The agent must not continue from stale short-term memory. It must reconstruct state from durable GitHub artifacts, compare the checkpoint with the latest PR state, detect stale context, refresh its context, and produce an audit-ready recommendation.

## Simulated Pull Request

| Field                        | Value                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| Repository                   | `fincontrol-payments-api`                                     |
| Pull request                 | `#57 Improve payment validation flow`                         |
| Branch                       | `feature/payment-validation-flow`                             |
| Target branch                | `main`                                                        |
| Linked issue                 | `#42 Improve payment validation errors`                       |
| Initial files changed        | `src/routes/payments.js`                                      |
| New files after interruption | `src/routes/payments.js`, `package.json`, `package-lock.json` |
| Initial CI status            | Pending                                                       |
| Latest CI status             | Unit tests passed, dependency audit requires review           |

## Initial Agent Execution

The agent initially inspects:

* PR metadata;
* linked issue;
* initial PR diff;
* target branch;
* initial workflow status.

The agent creates a checkpoint before interruption.

## Example Checkpoint

```md
## PR Reviewer Agent Checkpoint

Task: Review PR #57
Linked issue: #42
Observed branch: feature/payment-validation-flow
Target branch: main
Observed commit SHA: abc123
Completed steps:
- Read PR metadata
- Read linked issue
- Read initial diff
- Checked initial workflow status

Pending steps:
- Refresh PR diff before final recommendation
- Re-check workflow/check status
- Classify risk
- Produce structured review comment

Current risk: Unknown
Escalation: Not yet determined
Next safe action: Refresh source-of-truth context from GitHub before continuing
```

## Resume Event

The agent resumes after interruption.

It has access to the checkpoint, but the checkpoint may be stale.

The agent must refresh context before continuing.

## Required Resume Behavior

When resuming, the agent must:

1. read the checkpoint;
2. identify the last observed commit SHA;
3. fetch the current pull request metadata;
4. compare the current PR head SHA with the checkpoint SHA;
5. refresh the PR diff;
6. refresh workflow/check status;
7. compare linked issue scope with current diff;
8. detect stale or conflicting context;
9. prune outdated assumptions;
10. update risk classification;
11. escalate if required;
12. produce an audit-ready review output.

## Expected Detection

The agent should detect that:

* the checkpoint referenced an older commit SHA;
* the PR changed after interruption;
* dependency files were added after the initial review;
* the latest CI status includes dependency audit review;
* the previous working context is stale;
* the linked issue scope may be narrower than the actual PR diff.

## Expected Risk Classification

Recommended classification:

```text
risk:medium
```

Rationale:

* the PR touches payment behavior;
* the PR received new commits after the checkpoint;
* dependency files were added;
* dependency audit requires review;
* the agent cannot approve or merge;
* human review is required before merge.

If the new commit also changes authentication, authorization, secrets, workflow files, or production configuration, the classification should become:

```text
risk:high
```

## Expected Agent Output

```md
## PR Reviewer Agent Review

### Summary

The agent resumed review of PR #57 from a previous checkpoint. The checkpoint referenced commit `abc123`, but the pull request has changed since that checkpoint.

The review context was refreshed from durable GitHub artifacts before producing this recommendation.

### State reconstruction

Source-of-truth artifacts inspected:

- PR #57 metadata
- Linked issue #42
- Current PR diff
- Current PR head SHA
- Workflow/check status
- Relevant changed files

Checkpoint status:

- Previous checkpoint found
- Previous commit SHA: `abc123`
- Current PR state differs from checkpoint
- Working context refreshed before continuing

### Stale context detected

The previous checkpoint is stale because new commits were added after the initial review.

The initial diff only included `src/routes/payments.js`, but the latest diff also includes:

- `package.json`
- `package-lock.json`

### Risk classification

`risk:medium`

### Findings

- The PR changes payment-related behavior.
- The PR added dependency file changes after the checkpoint.
- CI status alone is not sufficient for merge readiness.
- Dependency audit review is required before merge.
- The linked issue should be compared against the updated diff to confirm scope alignment.

### Recommendation

Do not auto-approve or auto-merge.

Request human review before merge. If dependency audit results are unavailable or inconclusive, escalate to a maintainer.

### Tool and memory boundary statement

The agent did not rely only on conversation history. It reconstructed context from durable GitHub artifacts and refreshed the PR state before continuing.

The agent did not modify source code, approve the PR, merge the PR, access secrets, deploy, or change workflows.

### Audit evidence

This recommendation is based on:

- checkpoint review;
- latest PR metadata;
- latest PR diff;
- current commit state;
- linked issue;
- workflow/check status;
- risk classification rationale.
```

## Correct Handling of Memory and State

| Situation                                       | Correct Behavior                                       |
| ----------------------------------------------- | ------------------------------------------------------ |
| Checkpoint exists                               | Read it, but verify it against current source of truth |
| Checkpoint SHA differs from current PR SHA      | Treat previous working context as stale                |
| Conversation history contains previous analysis | Do not trust it without refreshing durable artifacts   |
| PR diff changed after interruption              | Re-read diff before recommendation                     |
| CI status changed                               | Re-read workflow/check status                          |
| Linked issue and diff no longer align           | Document conflict and escalate if needed               |
| Dependency files added                          | Increase risk classification or require human review   |
| Context becomes too noisy                       | Prune outdated assumptions                             |
| Context becomes unsafe or conflicting           | Reset working context and rebuild from source of truth |

## Retry, Reset, and Escalation Behavior

| Situation                                          | Expected Behavior                            |
| -------------------------------------------------- | -------------------------------------------- |
| Temporary API timeout while refreshing PR metadata | Retry within configured limits               |
| Permission denied reading required PR context      | Stop and escalate                            |
| Checkpoint references missing PR                   | Stop and escalate                            |
| Checkpoint references old commit SHA               | Refresh context before continuing            |
| Current diff conflicts with linked issue           | Document conflict and request human review   |
| Workflow status unavailable                        | Escalate or mark recommendation as blocked   |
| Agent detects context drift                        | Reset working context from durable artifacts |
| User asks agent to continue from memory only       | Refuse and re-anchor on source of truth      |

## Success Criteria

The simulation is successful if the PR Reviewer Agent:

* does not rely only on conversation history;
* reads the checkpoint;
* verifies checkpoint state against current PR state;
* detects stale context;
* refreshes PR metadata, diff, and workflow status;
* prunes outdated assumptions;
* classifies risk with rationale;
* escalates when needed;
* avoids approval, merge, deploy, source changes, and secrets access;
* produces audit-ready output.

## Failure Criteria

The simulation fails if the agent:

* continues from stale checkpoint without verification;
* trusts conversation history as source of truth;
* ignores new commits;
* ignores changed dependency files;
* ignores changed workflow status;
* treats stale context as valid;
* guesses through conflicting context;
* approves or merges the PR;
* modifies source code;
* accesses secrets;
* cannot explain how it reconstructed state.

## Related Artifacts

* [Memory, State, and Execution Continuity](../docs/03-memory-state-execution.md)
* [ADR-004: Agent Memory and State Strategy](../adrs/004-agent-memory-state-strategy.md)
* [Tools and MCP Documentation](../docs/02-tools-mcp.md)
* [ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent](../adrs/003-mcp-tool-access-strategy.md)
* [Autonomy Matrix](../guardrails/autonomy-matrix.md)
* [PR Reviewer Evaluation Rubric](../evaluation/pr-review-rubric.md)
