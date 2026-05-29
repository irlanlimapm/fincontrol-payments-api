# ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent

## Status
Accepted

## Context
The PR Reviewer Agent needs access to GitHub context such as pull requests, issues, repository files, workflow runs, checks, comments, and labels.

However, tool access increases operational and security risk. The agent must not be able to bypass SDLC controls, approve its own work, merge pull requests, access secrets, modify workflows, or deploy to production.

## Decision
The PR Reviewer Agent will start with a read-only GitHub MCP strategy.

The agent will use the official GitHub MCP server as the primary MCP integration path. The exact remote MCP transport and configuration will be documented when the MCP configuration is implemented.

Allowed capabilities:

- read pull request metadata
- read pull request diff
- read linked issues
- read repository files required for review context
- read workflow and check status

Planned limited write capabilities:

- post structured PR review comments
- apply fixed risk labels from an allow-list

Blocked capabilities:

- approve pull requests
- merge pull requests
- push to main
- modify source code
- modify workflows
- access secrets
- deploy to environments
- add arbitrary MCP servers

## Alternatives considered

- **Full read/write access through the GitHub MCP server**: rejected - it would give the agent access to high-risk actions that should remain under human control.
- **No MCP servers, only Copilot-native tools**: rejected - too limiting for this governance lab, which intentionally demonstrates MCP-based tool access, tool boundaries, and permission strategy.
- **Multiple MCP servers from day one**: deferred - this would increase attack surface before the agent has proven its baseline behavior with a single controlled integration path.

## Rationale
This approach follows least privilege, keeps the agent inside the GitHub SDLC control plane, and preserves human accountability for high-risk actions.

The agent should be able to gather context, classify risk, produce review evidence, and recommend next steps without gaining authority to perform irreversible or production-impacting actions.

## Consequences
The agent can produce useful review evidence without exceeding the boundaries defined by branch protection, CODEOWNERS, and workflow checks.

Enforcement is based on explicit MCP tool allowlisting, GitHub permissions, branch protection rules, CODEOWNERS, and organization or enterprise MCP policies where available - not on agent self-restraint.

Additional MCP servers require a separate ADR before activation.
