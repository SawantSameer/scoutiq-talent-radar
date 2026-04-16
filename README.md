# ScoutIQ — Athlete Discovery App

A React Native app built with Expo for sports talent scouts to browse athletes, review individual profiles, and maintain a shortlist for upcoming trials.

Built as part of the Nurdd React Native Intern take-home assignment.

---

## Setup & Running Locally

**Prerequisites:** Node.js, Expo Go installed on your phone (iOS or Android)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ScoutIQ

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start --tunnel
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

> Use `--tunnel` if your phone and PC are on different networks. For same-network setups, `npm start` is sufficient.

---

## What's Built

| Task | Status |
|---|---|
| Athlete Discovery Feed (FlatList + filter chips) | Complete |
| Athlete Profile Screen (stats + custom progress bar + shortlist toggle) | Complete |
| Shortlist Screen (AsyncStorage persistence + count/avg score) | Complete |
| Search with 300ms debounce + result count | Complete |
| Bottom tab + stack navigation | Complete |

---

## Key Technical Decisions

### 1. Context API for shared shortlist state
The shortlist needs to be readable and writable from three places: the Profile screen (add/remove button), the Shortlist screen (remove button), and the tab bar (badge count). Rather than prop-drilling through the navigator or duplicating state, a single `ShortlistContext` wraps the entire app. Any screen calls `useShortlist()` and gets live state instantly. This also means the add/remove button on the Profile screen reflects reality even after navigating back and forward multiple times — no stale state.

### 2. Shortlist stores IDs, not full athlete objects
`AsyncStorage` only persists the list of athlete IDs (`string[]`), not the full athlete objects. The source of truth for athlete data stays in `athletes.json`. On the Shortlist screen, IDs are mapped back to athletes at render time. This keeps the persisted data minimal and means if athlete data ever changes, shortlisted entries automatically reflect the update.

### 3. Empty state rendered outside FlatList
The initial implementation used `ListEmptyComponent` with `contentContainerStyle={{ flex: 1 }}`. On Android, `flex: 1` inside a FlatList's `contentContainerStyle` does not reliably expand to the visible viewport height — the empty state rendered below the fold and required scrolling to reach. The fix: conditionally render either the `FlatList` or a plain `View` depending on whether results exist. A plain `View` with `flex: 1` always fills remaining space correctly, with no scroll container involved.

### 4. `useRef` for the debounce timer, not `useState`
The 300ms debounce timer ID is held in a `useRef`. If it were in `useState`, updating the timer ID on every keystroke would trigger a re-render, which could interfere with the timer itself. `useRef` holds a mutable value that persists across renders without causing them — the right tool for anything the UI doesn't need to display.

### 5. Score derived as a stat average, not arbitrary
Each athlete's `score` (0–100) is the simple arithmetic mean of their six sport-specific stats, pre-computed in `athletes.json`. This makes the score meaningful and auditable — a scout looking at the stats can verify the number. The `ProgressBar` color shifts automatically: red below 40, amber 40–69, green 70+.

### 6. Custom `ProgressBar` built from two nested Views
The assignment prohibits external UI libraries for this component. The implementation is two `View`s: an outer track with `overflow: hidden` and `backgroundColor: #334155`, and an inner fill whose `width` is set to `${value}%`. The color is computed from the score at render time. No dependencies, no external packages.

### 7. AI tooling
This project was built with assistance from **Claude Code** (Anthropic). All code was reviewed, understood, and verified before inclusion. The assignment explicitly allows AI tools and evaluates judgment — AI was used to accelerate scaffolding and catch edge cases, not to replace understanding.

---

## What's Incomplete & Why

**Swipe-to-delete on the Shortlist screen**
The assignment lists this as an option alongside a remove button. A remove button (the ✕ icon on each card) is implemented instead. Swipe-to-delete in React Native requires either a third-party library (e.g. `react-native-gesture-handler` with a custom swipeable row) or a significant amount of gesture handling code. Given the 24-hour scope, a clearly labelled remove button achieves the same outcome with zero additional dependencies and no gesture conflicts on Android.

**No navigation from Shortlist → Profile**
Tapping an athlete card on the Shortlist screen does nothing. Navigating to the Profile screen from a bottom tab that doesn't own the stack requires cross-tab navigation (`navigation.navigate('Discover', { screen: 'Profile', params: { ... } })`), which switches tabs as a side effect and can leave the stack in an unexpected state. Since the assignment only specifies profile navigation from the Discovery feed, this was intentionally left out to keep the navigation clean.

**Search clear button (Android)**
The `clearButtonMode="while-editing"` prop on `TextInput` is iOS-only. On Android, there is no built-in clear button — users must manually delete text. A custom clear button was not added to keep the component surface area small within the time constraint.

---

## One Thing I'd Do Differently

I would extract all colors into a shared `theme.ts` constants file from the start.

Right now, values like `#0f172a`, `#1e293b`, `#334155`, and `#10b981` are repeated across every screen and component file. This works fine for a project this size, but it means changing the accent color requires editing eight files. A single source-of-truth theme object would also make light/dark mode support trivial to add later — which is a natural next feature for a scouting app used outdoors in variable lighting.

---

## Project Structure

```
src/
├── components/
│   ├── AthleteCard.tsx     # Reused on Discover and Shortlist screens
│   ├── EmptyState.tsx      # Handles all zero-result states
│   └── ProgressBar.tsx     # Custom-built, no external lib
├── data/
│   └── athletes.json       # 16 mock athletes across 3 sports
├── hooks/
│   └── useShortlist.ts     # Context + provider + hook for shortlist state
├── navigation/
│   └── AppNavigator.tsx    # Bottom tabs + stack navigator
├── screens/
│   ├── DiscoverScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ShortlistScreen.tsx
└── types/
    └── index.ts            # Centralised TypeScript types
```
