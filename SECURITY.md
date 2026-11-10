# Security and deployment

This is a portfolio demo, not a multi-user production service.

- Keep provider credentials in server environment variables. Never put them in
  `NEXT_PUBLIC_`, `VITE_`, a browser bundle, a ZIP, logs, or Git.
- Set `DEMO_ACCESS_TOKEN` to a randomly generated access code of at least 32
  characters. An unset or short code disables protected operations. Share the
  code only with people you authorize to use the demo; it is not a provider key.
  The browser asks for it when needed and keeps it in memory only.
- `ALLOW_LOCAL_DEMO=true` is an explicit local testing exception. Bind the
  backend to loopback and never enable this exception on a public host.
- Use HTTPS for deployments. Set allowed origins to the actual frontend origin.
- Request limits are per process, not a distributed quota. Before sharing a
  live paid API broadly, add a persistent gateway rate limit and configure the
  provider's usage restrictions and billing alerts.
- Raw provider errors, uploaded data, and model responses must not appear in
  public error responses or logs.
- If a credential was ever committed, revoke/rotate it first. Deleting the file,
  archiving the repository, or making it private does not revoke a credential.
  Coordinate any history rewrite with collaborators; forks and old clones can
  retain the original data.
- Run the security regression tests before merging changes. Tests use fake
  credentials and mocked provider calls; they do not contact paid services.

## File storage

Uploads and downloads require the shared demo code. Uploads use generated IDs,
a 10 MiB per-file limit and a 100 MiB per-process storage quota. Downloads are
attachments, not executable web content. All holders of the demo code are
trusted; this is not per-user file authorization. Do not upload private data.
Vercel /tmp storage is temporary and does not support durable cross-instance
files. Use private object storage and user authentication before a real launch.

Run the API from daily-hacker with:
`uvicorn backend.main:app --host 127.0.0.1 --port 8000`.

Run tests from the repository root: `python -m pytest tests -q`.

