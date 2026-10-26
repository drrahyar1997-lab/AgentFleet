# Security policy

## Reporting a vulnerability

Please do not report exploitable vulnerabilities in a public issue. Use GitHub's
**Report a vulnerability** flow on this repository's Security tab. Include the
affected version/commit, impact, reproduction steps, and any suggested fix.

## Deployment requirements

- Do not expose the API to an untrusted network without setting a strong
  `API_ACCESS_TOKEN` and terminating HTTPS at a trusted reverse proxy.
- Docker Compose requires `API_ACCESS_TOKEN` and `POSTGRES_PASSWORD`, binds the
  application to loopback by default, and does not publish the database port.
- Direct development without an API token is intended only for a loopback-bound
  local server. API routes require `Authorization: Bearer <token>` whenever the
  environment variable is configured; `/api/v1/health` is intentionally public.
- Agent API keys are write-only through the API: reads return only whether a key
  is configured. Protect the database and its backups as secrets remain stored
  server-side.

## Dependency-audit exception

The current LiteLLM release (`1.106.4`) declares `filelock<4`, while the three
filelock advisories below are fixed only in the 4.2.1 series according to the
current Python advisory database. The CI audit temporarily ignores only these
IDs rather than silently skipping all filelock findings:

- `CVE-2026-112940`
- `CVE-2026-112913`
- `CVE-2026-112907`

This is a tracked compatibility exception, not a claim that the advisories are
harmless. Remove the exception as soon as LiteLLM permits a patched filelock
release or the dependency is replaced. Review it at each dependency update.
