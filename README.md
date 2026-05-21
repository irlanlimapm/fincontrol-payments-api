# fincontrol-payments-api

A fintech payments API used as a live laboratory for applying 
agentic AI governance in practice.

This repository demonstrates how to operate AI agents safely within 
an engineering workflow — covering branch protection, human-in-the-loop 
approval, agent autonomy boundaries, MCP allow-list strategy, and 
evaluation harnesses. It is the portfolio artifact for the 
GitHub Certified: Agentic AI Developer certification(GH-600).

## What this project is

A payments API for a fictional fintech (FinControl) serving as the 
host system where agentic AI workflows are designed, governed, and 
documented — not just described in theory.

The focus is not on the API itself, but on the governance layer 
around it: how agents are introduced, constrained, monitored, 
and kept accountable within a real development workflow.

## Repository structure

| Folder | Contents |
|---|---|
| `agents/pr-reviewer` | PR Reviewer agent — the primary functional agent |
| `simulations` | Security Reviewer and Doc Updater agents (documented simulations) |
| `adrs` | Architecture Decision Records — every governance decision explained |
| `guardrails` | Guardrail policies and MCP allow-list configuration |
| `evaluation` | Evaluation harness and golden task sets |
| `docs` | Autonomy matrix, agent specs, operational runbooks |
| `src` | API source code |

## Governance approach

Every agent introduced to this repository operates under an explicit 
autonomy level. Agents may not approve their own PRs, may not bypass 
branch protection, and any agent-authored change requires human approval 
before merge. This is enforced at the ruleset level, not just by convention.

Architecture decisions are documented as ADRs before code is written. 
Prompts are versioned artifacts, not configuration. Changes to agent 
behavior go through the same PR process as code changes.

## Author

Irlan Lima — Senior Technical Product Manager with 17+ years in technology, focused on APIs, platform engineering, cloud architecture, and banking/fintech products.  
Former API Gateway and API Management Product Manager at Itaú.
[LinkedIn](https://linkedin.com/in/irlanlima)