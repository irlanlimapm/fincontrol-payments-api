# ADR-003: MCP and Tool Access Strategy for PR Reviewer Agent

## Status

Accepted

## Context

The PR Reviewer Agent needs access to GitHub context such as pull requests, issues, repository files, workflow runs, checks, comments, and labels.

However, tool access increases operational and security risk. The agent must not be able to bypass SDLC controls, approve its own work, merge pull requests, access secrets, or deploy to production.

## Decision

The PR Reviewer Agent will start with a read-only GitHub MCP strategy.
The agent will use the GitHub remote MCP server (official), HTTP/SSE transport.

Allowed capabilities:

- read pull request metadata
- read pull request diff
- read linked issues
- read repository files
- read workflow/check status

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

- **Full read/write on GitHub MCP server**: rejected — gives the agent capacity to merge or approve, breaks least privilege.
- **No MCP servers, only Copilot-native tools**: rejected — too limiting, would prevent the agent from accessing the PR diff and check status via structured API.
- **Multiple MCP servers from day one (GitHub + custom internal)**: deferred — adds attack surface before the agent has proven its baseline behavior.

## Rationale

This approach follows least privilege, keeps the agent inside the GitHub SDLC control plane, and preserves human accountability for high-risk actions.

## Consequences

The agent can produce useful review evidence without exceeding the boundaries defined by branch protection and CODEOWNERS.

Enforcement is via GitHub tool permissions, repository allow list, and branch protection rules — not relying on agent self-restraint.

Additional MCP servers require a separate ADR before activation.