# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A Node.js/Express payments API for a fictional fintech (FinControl), used as a **governance laboratory** for agentic AI workflows. The primary focus is not the API implementation itself, but the governance layer: how agents are introduced, constrained, monitored, and kept accountable.

## Commands

```bash
# Run the API
node src/app.js

# Check syntax without running
node --check src/app.js

# Install dependencies
npm install
```

No test suite is configured yet (`npm test` exits with an error by design — tests are a future milestone).

## Architecture

### API (`src/app.js`)
A single-file Express 5 app with three routes:
- `GET /health` — liveness check
- `POST /payments` — create payment (requires `amount` and `currency` in body)
- `GET /payments/:id` — retrieve payment by ID (stub, returns hardcoded values)

The app exports itself as a module for future test use.

### Agent architecture

**PR Reviewer** (`agents/pr-reviewer/spec.md`) is the only functional agent. It triggers on PRs to `develop`, posts a structured plan comment and review summary, and adds labels from a fixed allowlist. It operates in suggest-only mode — it cannot approve, merge, or push.

**Security Reviewer** and **Doc Updater** (`simulations/`) are documented simulations only — no running implementation.

### Governance layer

| Artifact | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Governing rules for agents and Copilot |
| `adrs/` | Architecture Decision Records — required before significant changes |
| `guardrails/autonomy-matrix.md` | What each agent is allowed to do |
| `evaluation/pr-review-rubric.md` | Rubric for evaluating agent review quality |
| `.github/workflows/agent-validation.yml` | CI: checks governance files exist and `src/app.js` parses |

### CI

The `Agent Validation` workflow runs on every PR to `main` and `workflow_dispatch`. It verifies that required governance files exist and that `src/app.js` passes a syntax check (`node --check`).

## Domain constraints

- Payment operations must be designed with **idempotency** in mind.
- All API inputs must be validated before processing.
- Changes must preserve auditability and traceability.
- **New dependencies require an ADR** explaining the decision before `package.json` is modified.
- Risky changes must include a rollback plan in the PR.
- Architectural decisions must be documented as ADRs in `adrs/` before code is written.

## Agent boundaries

Agents (including Claude Code) may:
- Suggest and write code, tests, and documentation.
- Draft pull request descriptions.
- Post review comments.
- Apply labels from the allowlist: `agent-reviewed`, `risk-low`, `risk-medium`, `risk-high`, `needs-human-review`.

Agents may **not**:
- Merge pull requests or approve PRs.
- Push directly to `main` or `develop`.
- Modify branch protection rules, CODEOWNERS, or CI/CD workflows without human review.
- Add dependencies without a supporting ADR.
- Access or commit secrets, credentials, or environment variables.

## Commit conventions

Follow Conventional Commits:
- `feat:` — new behavior
- `fix:` — bug fix
- `docs:` — documentation only
- `chore:` — maintenance
- `test:` — test changes
- `refactor:` — code restructuring without behavior change

## PR requirements

Every PR must complete `.github/pull_request_template.md`, which includes: summary, author type (human / agent / mixed), risk classification (Low / Medium / High / Critical), evaluation evidence, security checklist, rollback plan, and human approval confirmation.

The PR Reviewer agent triggers on PRs to `develop`, not `main`. PRs to `main` follow a human-led review path.

## Project context — GH-600 certification

This repository is a portfolio artifact for the GitHub Certified: Agentic AI Developer (GH-600) exam. Every decision in this repo is evaluated by two criteria:

1. Does it demonstrate a concept covered in one of the six GH-600 domains (Architecture/SDLC, Tools/MCP, Memory/State, Evaluation/Tuning, Multi-agent, Guardrails)?
2. Does it strengthen the artifact's defensibility in technical interviews?

If a proposed change doesn't satisfy at least one of these, deprioritize it.

The exam is scheduled for around 20/07/2026. The repo must be portfolio-ready by 12/07/2026 (one week before the exam).

## Strategy: portfolio-first

This repo is built portfolio-first, certification-second. Implications:

- README, ADRs, and the autonomy matrix are first-class deliverables, not afterthoughts
- Every governance decision is documented as an ADR — the documentation IS the artifact
- Public LinkedIn posts cite specific files in this repo (1 post per study week)
- Visual polish matters: clear diagrams, clean Markdown, professional README

When trading off "ship faster" vs "document more carefully", default to documenting more carefully.

## External study materials

## External study materials — Obsidian vault

This repo is paired with an Obsidian vault at `../GH-600/` (sibling directory) where:
- Study notes for each of the 6 GH-600 domains live (`02 - Dominios/`)
- 60 situational scenarios are written and answered (`04 - Scenarios/`)
- Fixed artifacts: Decision Matrix, paired distinctions, glossary, framework (`01 - Artefatos fixos/`)
- Daily recall in Portuguese (`03 - Daily recall/`)
- NotebookLM exports (`07 - NotebookLM exports/`)

### Vault access rules

**Read access**: Claude Code may read any file in the vault when relevant context is needed — for example, when reviewing a repo artifact against its corresponding domain note, when proposing updates to the Decision Matrix, or when cross-referencing scenarios.

**Write access**: Claude Code must NOT modify vault files autonomously. The user writes the vault. If a vault file change is genuinely needed, propose it explicitly, show the diff, and require approval. The user's daily recall, reflections, and Portuguese notes are not for automation.

**Privacy boundary**: the `03 - Daily recall/` folder contains personal reflections in Portuguese. Read only when the user explicitly asks for cross-referencing with a specific recall entry. Don't summarize, analyze patterns, or comment on recall content unprompted.

When the user asks for help with a scenario, Decision Matrix update, or cross-reference, Claude Code may read the relevant vault files directly instead of asking the user to paste content.

## Working with the user

The user (Irlan) is a Senior Technical Product Manager preparing for the GH-600. Communication preferences:

- Direct and honest. No inflated praise, no filler ("great question!", "let me know if you need anything else").
- Push back when proposals don't make sense, explain why, suggest alternatives.
- Default to short responses; expand only when the topic justifies depth.
- One question per turn maximum.
- Portuguese (BR) or English — match what he writes in.
- Use his background context (Itaú API Gateway Federation, Santander IDP) as analogy bridge when relevant.

When the user says he completed a task, trust him. Don't repeatedly verify by running commands unless he asks for verification.
