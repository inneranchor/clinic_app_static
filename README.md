# Clinic App — Static Demo

Static build of the Inner Anchor Clinic App running with mock data. No backend, Firebase, or authentication required.

**Live site:** https://inneranchor.github.io/clinic_app_static/

## Using the demo

The app opens directly to the **Appointments > Upcoming** page — no login needed. Use the left sidebar to navigate between sections.

### What you can browse

| Section | Pages | Mock data included |
|---------|-------|--------------------|
| **Appointments** | Upcoming, History | 3 upcoming appointments (treatment + blood draw), past appointments |
| **Patients** | Patient list, patient detail tabs | 3 patients (Alice Johnson, Bob Martinez, Carol Wu) with overview, treatments, prescriptions, notes, health logs, account activity |
| **Compounding** | Blood Draws, PRP Inventory, Compounding Records, Environment | Blood draws, PRP units, compounding records |
| **Monitor** | Patients, Inbox | Patient list with unread message indicators |
| **Admin** | Providers, Locations, Equipment, Formulations, Label Templates, Audit Log | 2 providers, equipment list, formulations with versioning |
| **Settings** | Account, Account Activity | Provider profile and activity log |

### Limitations

- **Read-only**: Mutations (create, update, delete) return generic success stubs but nothing actually changes. Data does not persist across page refreshes.
- **Chat**: The inbox and patient chat pages won't load real conversations (Twilio is stubbed out).
- **File uploads/downloads**: Signed URL links point to placeholder URLs.
- **Search**: Clinic and location search return empty results.

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

# 3. Fix the service worker JS bug in index.html
#    Flutter build injects broken double-quotes around the version number.
#    Replace the serviceWorkerVersion line with:
#      var serviceWorkerVersion = "0";
#    Remove the firebase-messaging-sw.js registration line.
#    Remove the serviceWorker config from _flutter.loader.load().

# 4. Copy index.html to 404.html (required for client-side routing on GitHub Pages)
cp index.html 404.html

# 5. Replace the .env with mock values (strip real secrets)
cp .env.example assets/assets/env/.env

# 6. Commit and push
git add -A && git commit -m "Update demo build" && git push
```

GitHub Pages deploys automatically from the `main` branch.

## Key files in the monorepo

| File | Purpose |
|------|---------|
| `lib/main_mock.dart` | Alternate entry point — stubs Firebase, auth, analytics; overrides GraphQL client with mock link using `FetchPolicy.noCache` |
| `lib/mock/mock_graphql_link.dart` | Custom `Link` that intercepts all GQL operations and returns fixture JSON. Extracts operation names from the document AST since `request.operation.operationName` is null at runtime. |
| `lib/mock/mock_data.dart` | All mock JSON fixtures (patients, appointments, treatments, prescriptions, notes, compounding, formulations, equipment, schedules, pickups) |

## Notes

- The `404.html` is a copy of `index.html` — required for Flutter's client-side routing to work on GitHub Pages.
- The `.nojekyll` file disables Jekyll processing which would break asset paths.
- The `.env` must contain dummy values for all env vars the app reads but no real secrets. See `.env.example`.
- The mock GraphQL client uses `FetchPolicy.noCache` to avoid cache write exceptions from data lacking `__typename` fields.
- Mutations return generic `{ Id: "mock-...", Status: "COMPLETED" }` stubs.
- The `findPatientsByProvider` mock returns association wrapper objects (with nested `Patient` key), not flat patient objects — this matches what the data source parser expects.
