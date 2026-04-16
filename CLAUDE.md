# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScoutIQ is a React Native mobile app built with Expo for discovering and shortlisting athletes. It uses TypeScript with strict mode.

## Development Commands

```bash
# Start the Expo dev server (opens menu to choose platform)
npm start

# Run directly on a platform
npm run android
npm run ios
npm run web
```

No linting or test scripts are configured yet.

## Architecture

```
index.ts → App.tsx → AppNavigator.tsx
                          ├── DiscoverScreen   (browse athletes)
                          ├── ProfileScreen    (view athlete details)
                          └── ShortlistScreen  (saved athletes)
```

**Navigation**: Bottom-tab navigation via `@react-navigation/bottom-tabs` + `@react-navigation/native-stack`.

**State**: `useShortlist` hook (in `src/hooks/`) manages shortlist state persisted via `@react-native-async-storage/async-storage`.

**Data**: Mock athlete data lives in `src/data/athletes.json`. Types are centralized in `src/types/index.ts`.

**Components**: `AthleteCard`, `EmptyState`, `ProgressBar` in `src/components/` are shared across screens.

## Key Config

- `app.json`: Expo config — portrait-only orientation, new architecture enabled.
- `tsconfig.json`: Extends `expo/tsconfig.base` with `strict: true`.
- All source files under `src/` were scaffolded as empty placeholders and are being built out.
