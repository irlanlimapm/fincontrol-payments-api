# Copilot Instructions — fincontrol-payments-api

## Project context

This repository is a GH-600 study and portfolio project focused on building a fintech payments API while practicing safe software delivery with GitHub Copilot and agentic workflows.

The project simulates a financial-domain API where changes must be handled with extra care because payments-related systems require reliability, traceability, validation, and clear human accountability.

## Domain constraints

Code changes must respect the following constraints:

- Payment operations must be designed with idempotency in mind.
- All API inputs must be validated.
- Changes must preserve auditability and traceability.
- No secrets, credentials, tokens, or private keys may be committed.
- Risky changes must include clear rollback guidance.
- Architectural decisions must be documented as ADRs.

## Coding standards

- Use Node.js and Express.
- Use clear, readable code.
- Prefer small, focused changes.
- Follow Conventional Commits:
  - feat:
  - fix:
  - docs:
  - chore:
  - test:
  - refactor:
- All new behavior should include or reference tests.
- Error responses should be explicit and predictable.

## Agent boundaries

Agents and Copilot may:

- Suggest code.
- Explain code.
- Draft documentation.
- Propose refactorings.
- Draft pull request descriptions.
- Help identify risks.
- Help create test cases.

Agents and Copilot may not:

- Merge pull requests.
- Push directly to main.
- Approve their own changes.
- Modify branch protection rules.
- Modify repository secrets.
- Modify CI/CD workflows without human review.
- Add new dependencies without an ADR explaining the decision.
- Make production-like changes without a rollback plan.

## Pull request expectations

Every pull request must include:

- Summary of the change.
- Whether an agent was involved.
- Risk classification.
- Evaluation or test evidence.
- Rollback plan.
- Human review confirmation.

## Security expectations

- Never expose secrets in code, logs, commits, or documentation.
- Prefer environment variables for configuration.
- Treat payments, authentication, authorization, and CI/CD as high-risk areas.
- Any change touching security-sensitive areas requires explicit human review.

## Documentation expectations

Use the following folders consistently:

- `/adrs` for architecture decision records.
- `/docs` for study notes and architecture explanations.
- `/evaluation` for rubrics and evaluation methods.
- `/guardrails` for autonomy, security, and governance boundaries.
- `/agents` for agent specifications.
- `/simulations` for simulated agent workflows.