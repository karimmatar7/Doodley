# Doodley

A real-time multiplayer drawing-and-guessing game, built for the browser. One player draws a word each round while everyone else guesses via live chat. The faster you guess, the more points you get. After every player has had a turn drawing, a final leaderboard crowns the winner.

Live demo: [Doodley](https://doodley-eight.vercel.app/)
## What it does

- **Rooms**: create a room and get a shareable 5-character code, join one by typing a code, or scan a QR code to hop in instantly. Hosts can also cancel a lobby before the game starts.
- **Rounds**: each round, the drawer is offered a choice of words across themed categories (animals, food, countries, landmarks, and more), picks one, and draws it live while everyone else watches the strokes appear in real time.
- **Guessing chat**: non-drawers guess in a live chat panel. Correct guesses are flagged instantly and scored based on how quickly they were submitted, so early correct guesses are worth more than late ones.
- **Rotation**: every player in the room draws exactly once before the game ends, so turns are always fair regardless of room size.
- **Leaderboard**: once every player has drawn, a final standings screen shows the winner and full scores, and anyone can ready up for a rematch with the same room.
- **Accounts**: email/password sign-up and login, a full forgot-password flow (an emailed reset link lands on the reset-password page), or a one-tap guest login for anyone who doesn't want to register.
- **Settings**: a dedicated page for changing your display name or your password, with your current password verified before a new one is accepted.
- **Friends**: send, accept, decline friend requests, chat with friends directly, and unfriend them, which removes the connection for both sides at once.
- **Persistent sessions**: closing the browser and coming back later drops you straight into the lobby if you're already logged in, guest sessions included.

## Why this stack

**Next.js 16 (App Router, Turbopack)**: chosen for the combination of server components (used for session-aware redirects on protected pages), file-based routing for the room and game dynamic segments, and Turbopack's fast dev feedback loop, which mattered a lot given the deadline. The trade-off: Next.js 16 renamed middleware.ts to proxy.ts mid-cycle, which cost a bit of migration time, but the framework's SSR-first auth story is otherwise a very good fit for a game that needs to know whether a user is logged in before rendering anything.

**Supabase**: covers three needs with one service instead of three separate ones.
- Postgres with Row Level Security for all game data (rooms, players, rounds, guesses, friends, messages), with RLS policies enforcing rules like "only the two people in a friendship can delete that friendship row" directly at the database layer rather than trusting client-side checks.
- Realtime (Postgres change feeds) powers every live piece of the game: player lists updating as people join, drawing strokes appearing as the drawer draws, guesses streaming into chat, friend requests and messages arriving without a refresh. This was the deciding factor over building a WebSocket server from scratch, since Realtime gives that behavior for free, tied directly to database writes.
- Auth, including anonymous guest sign-in, email and password, and password-reset email flows, all handled without hand-rolling session or token logic.

**Tailwind CSS**: used for every visual surface in the app. Chosen for iteration speed. The whole UI went through several rounds of visual revision (an early bright gradient look was reworked into a darker, more deliberate theme with a subtle grid texture and consistent maroon and emerald brand accents), and utility classes made that kind of full-app restyle fast to do consistently across dozens of components without touching a separate stylesheet each time.

**TypeScript throughout**: every component, hook, and Supabase RPC call is typed, which caught several real bugs during development, including a friend-request handler that could resolve to undefined instead of a function, and a modal component whose type signature didn't match its actual usage.

**Jest and React Testing Library**: unit and component tests cover core game logic (scoring, room codes, time formatting, password validation) and the interactive UI pieces most likely to regress silently (buttons, list items, confirmation modals, the guess-chat form). 39 tests currently pass across 14 suites.

## Architecture at a glance

```
app/
  page.tsx              landing page, redirects logged-in users straight to /lobby
  login/, signup/       auth forms, guest login, forgot-password flow
  reset-password/       password reset landing page from the emailed link
  lobby/                create or join a room, friends drawer, logout
  room/[code]/          pre-game lobby with player list, host starts the game
  game/[code]/          live gameplay: word choice, drawing, round end, game end
  settings/             change display name or password

components/
  auth/                 AuthCard shell, GuestLoginButton
  friends/              requests, friend list, DM panel, the friends drawer
  game/                 drawing canvas, round timer, word/theme choice, guess chat, round, game end and rematch screens
  room/                 room code badge, invite link, QR scanner, player list
  settings/             collapsible settings sections
  ui/                   shared primitives: Button, Input, ConfirmModal, ErrorMessage, PasswordHint, Modal, PasswordInput

lib/
  hooks/                useProfile, useRoom, useRoomPlayers, useRoomEvents, useRound, useGuesses, useDrawChannel, useFriends, useDirectMessages
  supabase/             client.ts for the browser, server.ts for server components, middleware.ts for the session refresh helper
  game/                 scoring logic
  utils/                room code generation and QR parsing, time formatting
  validation/           password rules
  constants/            word-theme labels
```

The rough game flow: creating or joining a room writes to the rooms and players tables. The host triggers a start_game RPC. Each round the drawer gets word choices, picks one, and drawing strokes plus guesses stream through Realtime-subscribed tables. A round timer calls end_round when time is up. Once every player has drawn, the room status flips to game_end and the final scores render.

## Beyond the brief

The brief asked for the core drawing, guessing, and scoring loop. Two things were added on top of that because they meaningfully improve the actual experience of playing with friends rather than strangers.

- **Friends system**: send requests, accept or decline, and see friends collapsed into a compact drawer rather than a growing list taking over the lobby, so it stays clean regardless of how many friends someone has.
- **Direct messages**: a lightweight chat with friends outside of active games, so coordinating a game doesn't require leaving the app or using a separate platform.

Neither was strictly required, but both felt like the difference between building a game and building a game people would actually keep using with the same group.

## Running it locally

```bash
npm install
npm run dev
```

Requires a .env file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

```bash
npm test
npm run build
```
