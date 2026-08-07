# ScoutIQ — Athlete Discovery App (Python / Flask)

A scouting tool for browsing athletes, reviewing profiles, and maintaining a shortlist for trials — rewritten from the original React Native + Expo mobile app into a pure Python web app.

**Stack:** Python 3.11+, Flask, Jinja2 templates, plain CSS. No Node.js, no npm, no JavaScript build step, no frontend framework.

> This project originally started as a React Native Intern take-home assignment (see git history for that version). It has since been fully rewritten in Python — every screen, every behavior, and every technical decision below carries over from that original app.

---

## Why Flask + Jinja2

The original app was a mobile app (React Native/Expo), which has no direct Python equivalent — Python doesn't render native iOS/Android UI. Flask was chosen over the alternatives because it produces a real, server-rendered web app with a URL per screen (`/`, `/athlete/<id>`, `/shortlist`), which is the closest single-language analogue to a multi-screen mobile app: each "screen" is a route, each navigation is a link, each user action is a form post. Everything — routing, data filtering, scoring, session handling, and templating — is Python or Python-adjacent (Jinja2). The only non-Python file is a small stylesheet and a ~10-line vanilla JS snippet for search debounce (explained below); there is no React, no build tooling, and nothing to `npm install`.

---

## Setup & Running Locally

**Prerequisites:** Python 3.11+

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ScoutIQ

# 2. Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Open `http://127.0.0.1:5000` in a browser. That's the whole setup — no phone, no Expo Go, no QR code.

---

## How Each Piece Was Converted, and Why

| Original (React Native) | Python version | Why |
|---|---|---|
| `App.tsx` + `ShortlistProvider` (Context API) | `app.py` — Flask app factory | A single Flask app object plays the same "root" role as the top-level `<App>` component; there's no component tree to provide context down, so no context layer is needed. |
| `ShortlistContext` / `useShortlist()` hook | `get_shortlist_ids()` / `set_shortlist_ids()` helpers + Flask `session` | The original need — shared state readable/writable from three places — is met by every route reading the same `session` object. Flask injects it into every template via `context_processor`, mirroring how `useShortlist()` was callable from any screen. |
| `AsyncStorage` (device-local persistence, IDs only) | Flask's signed session cookie (IDs only) | This is the closest real analogue: AsyncStorage persists data in the browser/device, not on a server; Flask's session cookie does exactly that — it's stored client-side (signed, not encrypted) and round-trips with each request. Athlete data still lives only in `athletes.json`; the session stores just a `list[str]` of IDs, exactly like before. |
| `athletes.json` (mock data source) | `data/athletes.json` | Copied unchanged — same 16 athletes, same schema. No reason to touch working data. |
| `AppNavigator.tsx` (bottom tabs + stack navigator) | `base.html` fixed bottom `<nav>` + Flask routes | URLs (`/`, `/shortlist`) replace the tab navigator; a link with an `active` CSS class replaces `tabBarActiveTintColor`. The stack navigation from feed → profile becomes a normal link to `/athlete/<id>`. |
| `DiscoverScreen.tsx` (`FlatList`, filter chips, debounce) | `discover.html` + `?q=` / `?sport=` query params | Filtering/search happens server-side in `app.py` on each request instead of client-side `Array.filter`. The 300ms `setTimeout` debounce is reproduced with a small vanilla JS snippet that delays the search form's auto-submit — the one deliberate non-Python file in the project, kept under 15 lines and with no dependency on it (Enter still submits the form if JS is disabled). |
| `ProfileScreen.tsx` (stats, custom progress bar) | `profile.html` + CSS | `getStatEntries()` became `get_stat_entries()` in `app.py`; the two-`View` progress bar became two nested `<div>`s with a CSS `width: {value}%`, which is exactly what the original custom component did — no charting library needed either way. |
| `ShortlistScreen.tsx` (count/avg score header) | `shortlist.html` + Python `sum()`/`round()` | Same arithmetic, just computed in the route handler instead of in a component render. |
| `AthleteCard.tsx` (shared card, used on 2 screens) | `templates/_athlete_card.html` (Jinja include) | Jinja `{% include %}` is the direct equivalent of a reusable React component — one template, rendered from both `discover.html` and `shortlist.html`. |
| `EmptyState.tsx` | `templates/_empty_state.html` | Same idea: a shared partial included wherever a screen has zero results. |
| Inline `StyleSheet.create({...})` per file | `static/style.css` (single file) | React Native's per-file style objects became CSS classes. Colors (`#0f172a`, `#1e293b`, `#334155`, `#10b981`, etc.) were carried over unchanged, so the visual identity didn't change — this also finally centralizes theme colors in one file, which the original README flagged as a known gap. |
| `package.json` / npm dependencies | `requirements.txt` | One line: `Flask`. Everything else (routing, templating, sessions) is part of Flask or the Python standard library (`json`, `pathlib`). |

---

## Project Structure

```
.
├── app.py                    # Routes, filtering/search/score logic, session-based shortlist
├── requirements.txt          # Flask only
├── data/
│   └── athletes.json         # Same 16 mock athletes, unchanged
├── templates/
│   ├── base.html             # Shared layout: header + bottom nav (Discover / Shortlist)
│   ├── discover.html         # Search + sport filter chips + result list
│   ├── profile.html          # Athlete detail: score, stats, shortlist toggle
│   ├── shortlist.html        # Count/avg-score header + shortlisted list
│   ├── _athlete_card.html    # Shared card partial (used by discover + shortlist)
│   └── _empty_state.html     # Shared "no results" partial
└── static/
    └── style.css             # All styling, ported from the RN StyleSheet objects
```

---

## Feature Parity Checklist

| Feature | Status |
|---|---|
| Athlete discovery feed with filter chips | Ported — server-side filtering via `?sport=` |
| Search with debounce + result count | Ported — 300ms JS debounce auto-submits the search form |
| Athlete profile (stats + progress bar + shortlist toggle) | Ported |
| Shortlist screen (persistence + count/avg score) | Ported — Flask session replaces AsyncStorage |
| Bottom tab navigation with badge count | Ported — CSS-styled fixed nav bar |
| Remove button on shortlist cards | Ported |

**Not carried over, and why:** cross-tab navigation from Shortlist → Profile was intentionally left out in the original for the same reason it's left out here (keeps navigation simple); swipe-to-delete was never implemented in the original either (a remove button was used instead), so there was nothing to port.

---

## Known Limitations of This Version

The Flask `secret_key` in `app.py` is a hardcoded placeholder (`"scoutiq-dev-secret-change-me"`). This is fine for local use and demos. If you deploy this anywhere public, replace it with a value read from an environment variable — a hardcoded secret key means anyone with the source can forge session cookies.

The shortlist is stored in a session cookie, so it's per-browser, not per-user-account — there's no login system, matching the original app's single-device, no-login scope.
