# ADR-002: PR Reviewer as the first functional agent

**Status**: Accepted  
**Date**: 2026-05-21  
**Deciders**: Irlan (sole maintainer)

## Context

The fincontrol-payments-api repository is a learning laboratory with 
a dual purpose: studying for the GitHub Certified: Agentic AI Developer 
certification and producing a demonstrable portfolio artifact.

The project plan calls for one functional agent and two simulated agents 
documented in architecture artifacts. The choice of which agent to build 
first determines which certification domains get applied in practice and 
what governance decisions must be taken immediately.

Three candidates were considered: PR Reviewer, Security Reviewer, and 
Doc Updater. The selection criteria were (1) surface area of learning 
— how many exam domains does building this agent force into practice — 
and (2) demonstrable governance value for a senior PM portfolio.

## Decision

Build the PR Reviewer Agent as the first and primary functional agent.

The first version operates in suggest-only mode: it reads the PR diff, 
classifies risks, flags problems, and posts a structured review comment. 
It does not approve PRs, does not trigger merges, and does not modify 
any file. All action remains with the human reviewer.

## Alternatives considered

**Doc Updater Agent.** Rejected as the primary agent. Demonstrates 
productivity but not governance. Suggest-only mode adds limited value 
because documentation suggestions without human judgment rarely require 
an agent architecture. Lower exam domain coverage.

**Security Reviewer Agent.** Strong candidate on governance value, but 
rejected as the starting point. Operating a security agent responsibly 
requires more mature guardrails, eval harnesses, and MCP configuration 
than are available at project start. Higher risk of getting the autonomy 
boundaries wrong in the early phase. Better suited as the second agent 
once the governance patterns are established.

## Consequences

**Positive**

- Forces practical application of the core exam domains in sequence: 
  MCP (read diff, post comment via GitHub API), autonomy spectrum 
  (suggest-only with explicit human-in-the-loop), guardrails (no approve, 
  no merge, no code modification), and evaluation (how to measure review 
  quality against golden PRs).
- Demonstrates governance-first thinking in the portfolio: the agent 
  is constrained by design, not by accident.
- Risk is low. A comment on a PR is reversible. Starting here builds 
  the governance muscle before touching anything irreversible.

**Negative**

- Suggest-only mode limits the agent's visible impact in the early phase. 
  Mitigated by documenting the autonomy progression explicitly — the ADR 
  trail shows the deliberate design choice, not a capability gap.

## Revisit when

- The PR Reviewer Agent completes evaluation against golden PRs with 
  acceptable quality scores. At that point, a follow-up ADR will assess 
  whether to expand its autonomy (e.g., auto-approve low-risk PRs meeting 
  defined criteria).
- The Security Reviewer Agent is designed. Lessons from the PR Reviewer 
  governance model should inform that design.
