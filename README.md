# Unit AI

Django API and React UI for camera/model management and YOLO tracking.

## Local setup

Use Python 3.12 and Node 24 LTS. The old Node 14 / Django 3.2 / Create React App
toolchain is no longer supported by this repository.

Backend (from `backend/`):

```sh
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --require-hashes -r requirements/production.txt
cp .env-example .env
# Set a unique random SECRET_KEY (50+ characters) and your allowed hosts in .env.
python manage.py migrate
python manage.py runserver
```

For web/API-only development, install `requirements/web.lock.txt` instead. The camera
streaming feature additionally requires `requirements/ml.lock.txt` (included by
`production.txt`). Runtime imports are lazy; API tests need no model weights.

Frontend (from `frontend/`):

```sh
npm ci --ignore-scripts
cp .env.local-example .env.local
npm start
```

`REACT_APP_API` remains the public backend base URL, embedded at build time.
No other process environment variables are exposed to the browser. Vite still
builds into `frontend/build/`; existing routes and login response fields remain.
Bootstrap CSS is bundled locally, with no legacy jQuery/Popper/Bootstrap CDN JS.

## Verification

```sh
# frontend/
npm run test:security
npm run build
npx playwright install chromium
npm run test:browser

# backend/ (activate its isolated .venv first)
python manage.py check --settings=core.settings.test
python manage.py test --settings=core.settings.test
python manage.py makemigrations --check --dry-run --settings=core.settings.test
python scripts/ml_smoke.py
pip-audit -r requirements/web.lock.txt --require-hashes --disable-pip
pip-audit -r requirements/ml.lock.txt --require-hashes --disable-pip
```

Tests use synthetic credentials, an in-memory database and a randomly initialized
YOLO architecture. ML smoke exercises CPU tracking without downloading or loading
trained checkpoints. It is a compatibility check, not an accuracy assessment or
a real-camera test. Browser screenshots are written to `frontend/test-results/`.

Python lockfiles include transitive versions, hashes and platform markers. Regenerate
them together after updating direct requirements, then repeat audits and tests:

```sh
uv pip compile requirements/base.txt --universal --python-version 3.12 --generate-hashes -o requirements/web.lock.txt
uv pip compile requirements/ml.txt --universal --python-version 3.12 --generate-hashes -o requirements/ml.lock.txt
```

## Security upgrade, 2026-11-15

- Django 5.2 LTS, DRF, JWT, Pillow, requests and SQL parser updated to patched versions.
- Unused allauth/social-auth/rest-auth, treasuremap and other unused runtime
  packages removed after checking application imports and migrations.
- The one used `dj-rest-auth` login wrapper was replaced by Django authentication
  and SimpleJWT. Both email/username login, session creation and existing JSON
  fields are covered by regression tests; inactive accounts are rejected.
- Private API routes require authentication; profile access is owner/staff-only,
  user listing is staff-only and never returns password hashes.
- Create React App removed, including its vulnerable development-server/crypto
  graph. Node-forge is now absent, rather than retained through an override.
- Axios and React Router upgraded; direct frontend versions and lockfile agree.
- Production frontend serves static files using unprivileged nginx, not a dev server.
- Backend Dockerfile name corrected (removed trailing space), Python image updated,
  packages hash-verified and runtime user made non-root.
- Weekly Dependabot updates and security/compatibility CI added. Alerts are not
  dismissed or disabled by these changes.

Before deployment, back up the actual database/media, provision the environment
and run migrations. A strong SECRET_KEY is now required; rotating the former
hard-coded key invalidates existing sessions/JWTs. Do not copy test settings or
test hashes into a deployment. Docker Compose expects an existing migrated
`backend/db.sqlite3` and a writable `backend/media` directory. It does not
automatically create or alter your production database.

Docker targets: `web` for API-only checks; default `inference` installs the full
ML lock. Frontend container listens on 8080 (Compose maps host 3000).
Full inference-image execution, existing trained checkpoints and live RTSP feeds
must be verified in staging before a production rollout. No production deployment
is performed by this dependency change.

Verification on 2026-11-15: npm/pip audits found no known vulnerabilities; 9 Python,
3 dependency and 4 browser checks passed, as did synthetic YOLO tracking. GitHub
confirmed all 310 previously open alerts closed after the main-branch push.
The GitHub CI jobs did not start: the account is locked due to a billing issue.
Local Docker builds succeeded, but subsequent container execution failed with a
Docker Desktop metadata I/O error while the host disk had approximately 2 GB free.
These environment issues are not recorded as passing CI/container runtime tests.
