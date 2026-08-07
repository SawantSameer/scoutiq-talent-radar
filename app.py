"""
ScoutIQ - Athlete Discovery App (Python port)

Originally a React Native + Expo mobile app (Discover feed, Profile screen,
Shortlist with AsyncStorage persistence). This is a full rewrite as a
server-rendered Flask + Jinja2 web app: same features, zero Node.js/npm,
zero JavaScript build tooling, one language end to end.

See README.md for a feature-by-feature map of the old RN code to this file.
"""
from __future__ import annotations

import json
from pathlib import Path

from flask import Flask, redirect, render_template, request, session, url_for

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "athletes.json"

# --- Static reference data (mirrors the TS constants in the original app) ---

SPORTS = ["All", "Football", "Basketball", "Athletics"]

SPORT_COLORS = {
    "Football": "#3b82f6",
    "Basketball": "#f97316",
    "Athletics": "#a855f7",
}

# Which stat keys belong to each sport, and the human-readable label for each.
# Mirrors getStatEntries() in the original ProfileScreen.tsx.
STAT_LABELS = {
    "Football": [
        ("pace", "Pace"),
        ("shooting", "Shooting"),
        ("passing", "Passing"),
        ("dribbling", "Dribbling"),
        ("defending", "Defending"),
        ("physical", "Physical"),
    ],
    "Basketball": [
        ("threePoint", "3-Point"),
        ("midRange", "Mid Range"),
        ("ballHandling", "Ball Handling"),
        ("defense", "Defense"),
        ("rebounding", "Rebounding"),
        ("athleticism", "Athleticism"),
    ],
    "Athletics": [
        ("speed", "Speed"),
        ("stamina", "Stamina"),
        ("strength", "Strength"),
        ("agility", "Agility"),
        ("technique", "Technique"),
        ("consistency", "Consistency"),
    ],
}

SHORTLIST_SESSION_KEY = "shortlist"


def load_athletes() -> list[dict]:
    with DATA_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


# Loaded once at startup, kept in memory — same role as importing athletes.json
# directly in the RN screens. Never mutated; per-request helpers below build
# fresh dicts for rendering instead of writing computed fields back onto this.
ATHLETES: list[dict] = load_athletes()
ATHLETES_BY_ID: dict[str, dict] = {a["id"]: a for a in ATHLETES}


def get_initials(name: str) -> str:
    """Mirrors getInitials() in AthleteCard.tsx / ProfileScreen.tsx."""
    parts = [p for p in name.split(" ") if p]
    return "".join(p[0] for p in parts).upper()[:2]


def get_score_color(score: int) -> str:
    """Mirrors getScoreColor() in AthleteCard.tsx and ProgressBar.tsx."""
    if score >= 70:
        return "#22c55e"
    if score >= 40:
        return "#f59e0b"
    return "#ef4444"


def get_stat_entries(athlete: dict) -> list[dict]:
    labels = STAT_LABELS[athlete["sport"]]
    return [{"label": label, "value": athlete["stats"][key]} for key, label in labels]


def to_card(athlete: dict) -> dict:
    """Builds the view-model dict a card template needs, without mutating
    the shared ATHLETES data (equivalent to computed props in a RN component)."""
    return {
        **athlete,
        "initials": get_initials(athlete["name"]),
        "score_color": get_score_color(athlete["score"]),
        "sport_color": SPORT_COLORS[athlete["sport"]],
    }


def get_shortlist_ids() -> list[str]:
    """Reads the shortlist ID list. Backed by Flask's signed session cookie,
    which — like AsyncStorage in the original app — persists client-side
    (in the browser) and stores only IDs, not full athlete objects."""
    return session.get(SHORTLIST_SESSION_KEY, [])


def set_shortlist_ids(ids: list[str]) -> None:
    session[SHORTLIST_SESSION_KEY] = ids


def create_app() -> Flask:
    app = Flask(__name__)
    # Signs the session cookie. Replace with a real secret (env var) before
    # deploying anywhere public — see README "Tech decisions" section.
    app.secret_key = "scoutiq-dev-secret-change-me"

    @app.context_processor
    def inject_globals():
        # Available in every template — mirrors reading useShortlist() from
        # the shared ShortlistContext anywhere in the RN component tree.
        return {
            "shortlist_count": len(get_shortlist_ids()),
        }

    @app.route("/")
    def discover():
        query = request.args.get("q", "").strip()
        active_filter = request.args.get("sport", "All")
        if active_filter not in SPORTS:
            active_filter = "All"

        filtered = [
            a
            for a in ATHLETES
            if (active_filter == "All" or a["sport"] == active_filter)
            and (query == "" or query.lower() in a["name"].lower())
        ]
        cards = [to_card(a) for a in filtered]

        empty_message = (
            f"No {active_filter} players match your search"
            if active_filter != "All"
            else "No athletes match your search"
        )

        return render_template(
            "discover.html",
            athletes=cards,
            sports=SPORTS,
            active_filter=active_filter,
            query=query,
            empty_message=empty_message,
        )

    @app.route("/athlete/<athlete_id>")
    def profile(athlete_id: str):
        athlete = ATHLETES_BY_ID.get(athlete_id)
        if athlete is None:
            return render_template("profile.html", athlete=None), 404

        return render_template(
            "profile.html",
            athlete=athlete,
            stat_entries=get_stat_entries(athlete),
            shortlisted=athlete_id in get_shortlist_ids(),
            sport_color=SPORT_COLORS[athlete["sport"]],
            score_color=get_score_color(athlete["score"]),
            initials=get_initials(athlete["name"]),
        )

    @app.route("/athlete/<athlete_id>/shortlist/toggle", methods=["POST"])
    def toggle_shortlist(athlete_id: str):
        if athlete_id not in ATHLETES_BY_ID:
            return redirect(url_for("discover"))
        ids = get_shortlist_ids()
        if athlete_id in ids:
            ids = [i for i in ids if i != athlete_id]
        else:
            ids = [*ids, athlete_id]
        set_shortlist_ids(ids)
        return redirect(url_for("profile", athlete_id=athlete_id))

    @app.route("/shortlist")
    def shortlist():
        ids = get_shortlist_ids()
        shortlisted = [ATHLETES_BY_ID[i] for i in ids if i in ATHLETES_BY_ID]
        shortlisted.sort(key=lambda a: a["score"], reverse=True)
        cards = [to_card(a) for a in shortlisted]

        avg_score = (
            round(sum(a["score"] for a in shortlisted) / len(shortlisted))
            if shortlisted
            else 0
        )

        return render_template("shortlist.html", athletes=cards, avg_score=avg_score)

    @app.route("/shortlist/<athlete_id>/remove", methods=["POST"])
    def remove_from_shortlist(athlete_id: str):
        set_shortlist_ids([i for i in get_shortlist_ids() if i != athlete_id])
        return redirect(url_for("shortlist"))

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
