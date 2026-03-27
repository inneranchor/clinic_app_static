# Clinic App — Static Demo

Static build of the Inner Anchor Clinic App running with mock data. No backend, Firebase, or authentication required.

**Live site:** https://inneranchor.github.io/clinic_app_static/

## What this is

A Flutter web build of the clinic app where all GraphQL queries return fixture data. The product team can browse the full UI, click through pages, and experiment with layout/design — but mutations (create, update, delete) return generic success stubs and data does not persist across page refreshes.

## How to update

From the `clinic_app` directory in the monorepo:

```bash
# 1. Build the mock web app
flutter build web --target lib/main_mock.dart --base-href /clinic_app_static/

# 2. Replace the contents of this repo (keep .git)
cd /path/to/clinic_app_static
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +
cp -r /path/to/clinic_app/build/web/* .
touch .nojekyll
cp index.html 404.html

# 3. Fix the service worker JS bug in index.html and 404.html
#    Line 53 has broken double-quotes around the version number.
#    Replace the serviceWorkerVersion block with:
#      var serviceWorkerVersion = "0";
#    Remove the firebase-messaging-sw.js registration and
#    the serviceWorker config from _flutter.loader.load().

# 4. Replace the .env with mock values (strip real secrets)
cat > assets/assets/env/.env << 'EOF'
API_HOST=http://localhost:3001
CLINIC_HOST=http://localhost:3000
NODE_ENV_SHORTFORM=demo
TWILIO_ACCOUNT_SID=mock
TWILIO_AUTH_TOKEN=mock
VAPID_KEY=mock
GOOGLE_AUTH_CLIENT_ID=mock
APPLE_SERVICE_ID=mock
APPLE_REDIRECT_URI=https://example.com/auth
POSTHOG_API_KEY=mock
BASE64_FIREBASE_CONFIG=eyJhcGlLZXkiOiJtb2NrLWFwaS1rZXkiLCJhdXRoRG9tYWluIjoibW9jay5maXJlYmFzZWFwcC5jb20iLCJwcm9qZWN0SWQiOiJtb2NrLXByb2plY3QiLCJzdG9yYWdlQnVja2V0IjoibW9jay5hcHBzcG90LmNvbSIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiMDAwMDAwMDAwMDAwIiwid2ViQXBwSWQiOiIxOjAwMDAwMDAwMDAwMDp3ZWI6bW9jayJ9
GCP_API_PROJECT_NAME=demo
GCP_PROJECT_NAME=demo
EOF

# 5. Commit and push
git add -A && git commit -m "Update demo build" && git push
```

GitHub Pages deploys automatically from the `main` branch.

## Key files in the monorepo

| File | Purpose |
|------|---------|
| `lib/main_mock.dart` | Alternate entry point — stubs Firebase, auth, analytics; overrides GraphQL with mock link |
| `lib/mock/mock_graphql_link.dart` | Custom `Link` that intercepts all GQL operations and returns fixture JSON |
| `lib/mock/mock_data.dart` | All the mock JSON fixtures (patients, appointments, treatments, etc.) |

## Mock data coverage

- 2 providers, 3 patients
- Upcoming and past appointments
- Treatments, prescriptions, notes
- Blood draws, PRP units, compounding records
- Formulations (with versioning)
- Equipment, clinic schedules
- Treatment pickups, account activity

## Notes

- The `404.html` is a copy of `index.html` — this is required for Flutter's client-side routing to work on GitHub Pages.
- The `.nojekyll` file disables Jekyll processing which would break asset paths.
- The `.env` must contain dummy values for all env vars the app reads (Twilio, Firebase, PostHog, etc.) but no real secrets.
- Mutations return generic `{ Id: "mock-...", Status: "COMPLETED" }` stubs.
