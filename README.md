# Matchday — Pro Football ⚽

A browser-based 11v11 football (soccer) game. Step through a quick landscape
setup wizard — pick your club from the Premier League, La Liga, or
Bundesliga (or make your own custom club), choose an opponent yourself or
let the computer pick one at random, select which position you want to
control — then play a 90-minute match complete with half-time, a referee
who calls fouls, an animated crowd, and full match statistics.

The game is designed for landscape orientation. On a phone or tablet held
in portrait, you'll see a prompt asking you to rotate.

## Play it

Just open `index.html` in any modern browser — no build step, no
dependencies, nothing to install.

Or enable GitHub Pages for this repo (Settings → Pages → deploy from the
`main` branch) and it will be playable at
`https://<your-username>.github.io/<repo-name>/`.

## Setup

The pre-match menu is a single-screen step wizard (no scrolling through a
long page) — use **Next** / **Back** to move between:

1. Your Club
2. Opponent
3. Venue
4. Choose Your Player
5. Match Settings → **Kick Off**

## Controls

| Action | Key |
|---|---|
| Move your player | Arrow keys or `WASD` |
| Pass / Shoot toward goal | `Space` |
| Move (touch devices) | On-screen D-pad |
| Kick (touch devices) | On-screen KICK button |

Control automatically switches to whichever of your players is closest to
the ball.

## Features

- League and club picker (Premier League, La Liga, Bundesliga, or Custom)
- Choose your opponent, or let the computer pick one at random
- Home/away venue selection
- Pick which squad position you control
- Adjustable match length and difficulty
- Kickoff intro screen with team crests
- 90-minute match clock with a half-time break (teams switch sides)
- Referee AI that calls fouls and yellow cards
- Animated crowd in the stands, with bigger reactions on goals
- Full match statistics: possession, shots, shots on target, fouls, cards

## Project structure

```
.
├── index.html      # page structure / markup
├── css/
│   └── style.css   # all styling
└── js/
    └── game.js     # menu logic + game engine (canvas rendering, AI, physics)
```

## Notes

Club names and colors are used purely as text/color references for a
personal fan-made project — no official crests, logos, or licensed artwork
are included.
