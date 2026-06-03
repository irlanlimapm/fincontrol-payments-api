# ADR-004: Agent Memory and State Strategy

## Status

Accepted

## Context

The PR Reviewer Agent needs to resume work safely across executions.

However, relying only on conversation history is unsafe because it may be incomplete, stale, truncated, non-auditable, or unavailable in future sessions.

The agent needs a clear strategy for memory, state, checkpoints, context refresh, pruning, and reset.

Without this strategy, the agent may:

* repeat completed work;
* continue from stale context;
* miss new commits or workflow results;
* act on outdated assumptions;
* drift from the original issue or pull request scope;
* produce recommendations that cannot be audited.

## Decision

The PR Reviewer Agent will use GitHub durable artifacts as the primary source of truth for execution continuity.

The agent will not treat conversation history as authoritative state.

The agent will reconstruct context from:

* issues;
* pull requests;
* commits;
* branch state;
* workflow runs;
* check status;
* PR comments;
* review comments;
* ADRs;
* repository documentation;
* evaluation artifacts.

The agent will persist only the minimum state required to resume safely and support auditability.

## Memory Strategy

The PR Reviewer Agent will use three memory categories:

| Memory Type       | Strategy                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Short-term memory | Used only during the current task or session                                                        |
| Long-term memory  | Curated through repository documentation, ADRs, specs, and rubrics                                  |
| External memory   | Stored in durable GitHub artifacts such as issues, PRs, commits, workflow runs, logs, and artifacts |

Short-term memory must not be treated as durable state.

Long-term memory must be explicit, reviewed, and stored in the repository.

External memory is the source used to reconstruct execution after interruption.

## State Strategy

Execution state should track:

* active issue or pull request;
* approved plan;
* current execution step;
* completed steps;
* pending steps;
* latest observed commit SHA;
* branch and target branch;
* workflow/check status;
* tools used;
* risk classification;
* escalation status;
* checkpoint summary;
* audit evidence.

The agent should persist enough state to resume safely, not everything it has seen.

## Checkpoint Strategy

The agent should create or update checkpoints at meaningful execution boundaries, such as:

* after reading pull request metadata;
* after inspecting the diff;
* after checking workflow status;
* after classifying risk;
* before escalation;
* before final recommendation.

A checkpoint should include:

* task identifier;
* current source of truth;
* observed commit SHA or branch state;
* completed steps;
* pending steps;
* risk classification;
* evidence collected;
* escalation reason, if applicable;
* next safe action.

## Stale Context Strategy

Before resuming work, the agent must refresh context from durable sources.

The agent should verify:

* whether the pull request still exists;
* whether the branch has new commits;
* whether the target branch changed;
* whether the linked issue changed;
* whether workflow/check status changed;
* whether CODEOWNERS or branch protection requirements changed;
* whether any relevant ADR or repository document changed.

If context is stale, the agent must update its working context before continuing.

## Conflicting Context Strategy

When sources conflict, the agent must not guess.

The agent should:

1. stop;
2. identify the conflict;
3. compare authoritative sources;
4. re-anchor on the latest source of truth;
5. document the conflict;
6. escalate to a human reviewer if the conflict cannot be resolved safely.

Examples of conflicting context:

* PR description says tests passed, but checks are failing;
* issue scope says validation-only, but diff changes payment behavior;
* checkpoint references an old commit SHA, but the PR has new commits;
* previous recommendation says low risk, but new dependency changes increase risk.

## Pruning Strategy

The agent should prune:

* stale assumptions;
* outdated intermediate conclusions;
* redundant context;
* irrelevant files;
* old workflow results;
* low-value temporary notes;
* context unrelated to the current issue or pull request.

Pruning should not delete durable audit evidence. It should only remove unnecessary working context.

## Reset Strategy

The agent should reset its working context when continuing would be unsafe.

Reset is required when:

* task scope changes significantly;
* source-of-truth artifacts change materially;
* context becomes stale;
* context becomes conflicting;
* drift is detected;
* execution state is corrupted;
* a new task starts;
* an approved plan changes;
* policy or permission boundaries change.

After reset, the agent must rebuild context from durable GitHub artifacts.

## Data That Must Not Be Persisted

The agent must not persist:

* secrets;
* credentials;
* tokens;
* unnecessary sensitive data;
* private data unrelated to the task;
* temporary reasoning;
* hallucinated outputs;
* unvalidated assumptions;
* stale context;
* redundant artifacts.

## Alternatives Considered

### Rely only on conversation history

Rejected.

Conversation history is not durable, may be truncated, may be unavailable across sessions, and does not provide a reliable audit trail.

### Persist everything the agent sees

Rejected.

Persisting everything increases noise, privacy risk, stale context risk, and makes recovery harder.

### Use an external vector store from day one

Deferred.

A vector store may be useful later, but it adds complexity before the agent has a clear state model, checkpoint strategy, and audit trail.

### Use GitHub durable artifacts as the initial source of truth

Accepted.

GitHub already provides issues, pull requests, commits, workflow runs, logs, review comments, approvals, and artifacts. These are aligned with the SDLC control plane and support traceability.

## Consequences

The agent can resume work more safely after interruption.

The agent must refresh source-of-truth context before continuing.

The agent may spend more time reconstructing context, but this improves correctness, auditability, and governance.

The agent should not optimize for speed at the cost of stale or unauditable execution.

## Related Artifacts

* [Memory, State, and Execution Continuity](../docs/03-memory-state-execution.md)
* [ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent](./003-mcp-tool-access-strategy.md)
* [Autonomy Matrix](../guardrails/autonomy-matrix.md)
* [PR Reviewer Evaluation Rubric](../evaluation/pr-review-rubric.md)
* [Domain 03 State Continuity Simulation](../simulations/domain-03-state-continuity-simulation.md)
