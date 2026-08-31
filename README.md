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

| Action | Keyboard | Touch |
|---|---|---|
| Move (any direction — N, S, E, W, or anywhere between) | Arrow keys / `WASD` | On-screen round joystick |
| Shoot | `Space` | SHOT button |
| Short pass | `J` | SHORT button |
| Long pass | `K` | LONG button |
| Sprint (hold) | `Shift` | RUN button |

Control automatically switches to whichever of your players is closest to
the ball. On touch devices the joystick and action buttons are pinned to
the bottom corners of the screen, always inside the visible viewport.

## Features

- League and club picker (Premier League, La Liga, Bundesliga, or Custom)
- Choose your opponent, or let the computer pick one at random
- Home/away venue selection
- Pick which squad position you control
- Adjustable match length and difficulty
- Kickoff intro screen with team crests
- Auto-landscape/fullscreen attempt on first tap (browsers require a
  gesture for this, so a rotate-device prompt is the fallback)
- Omnidirectional analog joystick + dedicated Sprint / Short Pass / Long
  Pass / Shot action buttons
- Full ball physics: gravity, arcing lofted shots/passes, curving spin,
  bouncing, and a crossbar
- Throw-ins, corner kicks, and goal kicks when the ball goes out of play
- Two linesmen patrolling the touchlines alongside the referee
- 90-minute match clock with a half-time break (teams switch sides)
- Referee AI that calls fouls and yellow cards, with a broadcast-style
  camera zoom-in and a short VAR review before the restart
- 3D-perspective pitch rendering with a camera that pans and zooms to
  follow play, plus zoom-ins for goal celebrations and corners
- Players rendered with faces (eyes, nose, mouth), running animation, and
  mood/expression changes (happy, sad, angry) after goals and fouls
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
