# Mobility Tracker

Internal web application for the company's Mobility Week: employees record sustainable journeys, an iPad kiosk offers
quick entry, and a wall display visualizes the collective impact in real time.

## Application surfaces

- `/` - desktop journey entry and compact live collective dashboard.
- `/kiosk` - touch-first iPad entry flow.
- `/display` - non-interactive 1920x1080 wall display. Append `?demo=1` to preview the live animations without writing
  to PostgreSQL.
- `/admin` - protected CSV export page for challenge administrators.

## Local development

Prerequisites: Node.js 24, pnpm 11, Docker Desktop, and Docker Compose.

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
pnpm install
pnpm exec prisma migrate dev
pnpm dev
```

Open `http://localhost:3000`. Common checks:

```powershell
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

Reset local data only:

```powershell
pnpm exec prisma migrate reset --force
```

Restart `pnpm dev` after a Prisma migration/reset to clear development database connections.

## Environment configuration

Copy `.env.example` to `.env` and set the production values before deployment.

| Variable                         | Purpose                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`                  | PostgreSQL database user.                                                                      |
| `POSTGRES_PASSWORD`              | Strong URL-safe PostgreSQL password; never commit the real value.                              |
| `POSTGRES_DB`                    | PostgreSQL database name.                                                                      |
| `POSTGRES_PORT`                  | Host port for local PostgreSQL access.                                                         |
| `APP_PORT`                       | HTTP port exposed by the app container.                                                        |
| `ADMIN_PASSWORD`                 | Required for `/admin` participant management, exports, and journey reset; use only over HTTPS. |
| `SHOW_INDIVIDUAL_WEEKLY_CO2`     | Defaults to `false`; enable only after a GDPR review.                                          |
| `NEXT_PUBLIC_TREE_GROWTH_MAX_KM` | Kilometres for the 20 visual tree growth stages. Rebuild the app image after changing it.      |
| `DATABASE_URL`                   | Used by local Prisma commands. The Compose app uses its internal `postgres` hostname instead.  |

## Internal server deployment

Install Docker Engine and the Docker Compose plugin on the internal server. Clone the repository and create an
environment file with a strong `POSTGRES_PASSWORD`.

```bash
git clone https://github.com/Isard7777/mobility-tracker.git
cd mobility-tracker
cp .env.example .env
nano .env
docker compose up -d --build
docker compose ps
```

Compose waits for PostgreSQL health, runs `prisma migrate deploy` in the one-shot `migrate` service, then starts the
standalone Next.js `app` service. Data is stored in the named `postgres-data` Docker volume and survives container
restarts and `docker compose down` without `-v`.

PostgreSQL reads `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` only when it first creates `postgres-data`.
Changing these values later does not change an existing database account. Use a URL-safe password such as
`openssl rand -hex 32`; the value is interpolated into the internal PostgreSQL connection URL.

For a truly fresh local deployment test, including a newly initialized database, run the following destructive command
before `docker compose up -d --build`:

```bash
docker compose down -v
```

This permanently deletes the database volume and all journey data. For a deployed server with data to retain, change the
PostgreSQL user's password using an authenticated database administration command instead of deleting the volume.

Check service logs:

```bash
docker compose logs -f app
docker compose logs migrate
```

For an update after merging `main`:

```bash
git pull --ff-only
docker compose up -d --build
docker compose ps
```

The GitHub Actions workflow runs formatting, lint, unit tests, the Next.js build, and both Docker image builds for every
pull request, branch push, and tag push. It does not deploy to the internal server.

## Administrator CSV exports

Open `/admin` to download protected CSV exports by date, participant, transport mode, or all journey data whenever data
extracts are needed. The all-journey export is one row per recorded entry and includes all available operational fields.
Each download requests HTTP Basic authentication using the fixed username `admin` and the `ADMIN_PASSWORD` value from
the server environment. The CSV endpoints have `Cache-Control: no-store` and are not available when `ADMIN_PASSWORD` is
missing.

These exports contain employee-level mobility data. Serve the application through HTTPS before using them outside a
trusted local network, limit the password to authorised administrators, and keep downloaded CSV files in accordance with
the organisation's data-retention policy.

## Administrator roster and reset

The protected controls on `/admin` can replace the active participant roster by importing a complete CSV file. Use this
header and semicolon separator:

```csv
quadrigram;display_name
ADUP;Alice Dupont
BLEF;Benoit Lefevre
```

Quadrigrams must be unique four-character alphanumeric codes. Roster replacement is atomic: invalid files do not change
the database, and historic journey records retain their recorded names. The same page can permanently delete all journey
records, but only after the administrator checks the acknowledgement, types `DELETE JOURNEYS`, and supplies the admin
password. The participant roster is preserved by this reset.

## Mini-PC wall display

1. Install a lightweight Linux desktop, Chromium, and `unclutter` on the mini-PC.
2. Configure automatic graphical login for the dedicated display account.
3. Disable display blanking by adding the following autostart file at `~/.config/autostart/mobility-display.desktop`:

    ```ini
    [Desktop Entry]
    Type=Application
    Name=Mobility wall display
    Exec=sh -c 'xset s off; xset -dpms; xset s noblank; unclutter -idle 0.1 -root & chromium --kiosk --noerrdialogs --disable-session-crashed-bubble http://SERVER_HOST:3000/display'
    X-GNOME-Autostart-enabled=true
    ```

    Replace `SERVER_HOST` with the internal server hostname or IP and adapt `chromium` to `chromium-browser` where
    required by the distribution.

4. In the BIOS/UEFI, set the power-recovery option to `Power On` or `Restore Last State` after AC loss.
5. Enable Docker at boot on the server: `sudo systemctl enable --now docker`.

The display uses SSE. It reconnects with an exponential backoff if the network or server is temporarily unavailable, and
reloads at 4am to keep long-running kiosk sessions fresh.

## iPad kiosk

1. Open `http://SERVER_HOST:3000/kiosk` in Safari.
2. Use Share, then **Add to Home Screen**.
3. In **Settings > Display & Brightness > Auto-Lock**, choose **Never** while the kiosk is in use.
4. In **Settings > Accessibility > Guided Access**, enable Guided Access and set a passcode.
5. Open the Home Screen shortcut, triple-click the side or Home button, then choose **Start** Guided Access.

The kiosk is intentionally separate from the wall display: it handles entry only while collective feedback stays limited
to the footer.
