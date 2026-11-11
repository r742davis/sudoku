# Sudoku

A personal Sudoku app with no ads, built to play on a phone or a computer. It generates its own puzzles, grades them by the solving technique they need, and includes a set of lessons on advanced techniques with interactive practice boards.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS. The whole app runs in the browser; there is no server or database.

## Features

**Play**

- Five difficulty levels, graded by the hardest technique a puzzle needs
- Notes mode for pencil marks, which clear automatically when a digit is placed in the same row, column or box
- Undo, erase, pause, a timer and a three-mistake limit
- Highlighting for the selected cell's row, column and box, and for every matching digit
- Bulk edit: press and hold a number, then tap cells to place it or note it repeatedly
- The current game saves to the browser and resumes where you left off
- Light and dark themes that follow the system setting

**Learn**

- A ladder of 12 advanced techniques, each explained with an annotated diagram and ordered so each one builds on the last: X-Wing, Swordfish, Skyscraper, Two-String Kite, Crane, Simple Coloring, Y-Wing, XYZ-Wing, W-Wing, Finned X-Wing, Empty Rectangle and Unique Rectangle
- Practice boards for X-Wing, Swordfish, Skyscraper and Two-String Kite, six per technique. Each is a real puzzle stopped at the point where that technique is the next move. You find the pattern's cells, remove the candidates it rules out, and place the digit that unlocks, with specific feedback on wrong picks.

## Difficulty levels

| Level   | What the puzzle needs                                     |
| ------- | --------------------------------------------------------- |
| Easy    | Singles only, with 38 givens                              |
| Medium  | Singles only, with as few givens as possible              |
| Hard    | Pointing pairs, or naked and hidden pairs and triples     |
| Expert  | An X-Wing or Swordfish                                    |
| Extreme | Something beyond those, such as chains, wings or coloring |

## Controls

| Action          | Touch or mouse                          | Keyboard            |
| --------------- | --------------------------------------- | ------------------- |
| Select a cell   | Tap it                                  | Arrow keys          |
| Enter a digit   | Select a cell, then tap a number        | 1 to 9              |
| Bulk edit       | Press and hold a number, then tap cells | —                   |
| Leave bulk edit | Tap the active number again             | Escape              |
| Erase           | Erase button                            | Backspace or Delete |
| Toggle notes    | Notes button                            | N                   |
| Undo            | Undo button                             | U                   |
| Pause or resume | Pause button                            | P                   |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command         | What it does                                      |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Starts the development server                     |
| `npm run build` | Type-checks and exports the static site to `out/` |
| `npm run lint`  | Runs ESLint                                       |

To preview the exported site locally, run `npm run build` and then `npx serve out`.

## Deployment

The app is exported as static files (`output: "export"` in `next.config.ts`) and deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`. Every push to `main` builds the site and publishes it.

One-time setup: in the repository's Settings, under Pages, set Source to "GitHub Actions".

GitHub Pages serves a project site from `/<repo-name>`, so the workflow passes that prefix to the build through the `PAGES_BASE_PATH` environment variable. Local builds leave it unset and run at `/`.

On a phone, open the site and use "Add to Home Screen" to launch it like an app. Saved games are stored per browser, so each device keeps its own.

## Project structure

```
app/
  page.tsx                      Menu
  play/                         The game
  learn/                        Technique ladder
  learn/[slug]/                 One technique
  learn/[slug]/practice/        Practice boards
components/
  home/                         Menu cards
  sudoku/                       Header, board, actions and number pad
  learn/                        Technique diagram and legend
  practice/                     Practice board, steps and feedback
  ui/                           Shared top bar and lesson text
hooks/
  useSudokuGame.ts              Game state, autosave, timer, puzzle worker
  useSudokuKeyboard.ts          Keyboard controls
lib/
  sudoku/                       Grid helpers, solver, techniques, generator, game reducer
  learn/                        Lesson content and types
  practice/                     Practice engine, one file per technique, and their boards
```

## How puzzles are made

The generator fills a complete grid at random, then removes givens one at a time for as long as the puzzle keeps exactly one solution. A second solver then works the puzzle the way a person would, using singles, pointing pairs, pairs and triples, X-Wings and Swordfish, and records the hardest technique it needed. A puzzle is kept only if that matches the requested difficulty.

Generation runs in a Web Worker so the page stays responsive. Puzzles that need an X-Wing or Swordfish are rare, roughly one in 300, so Expert picks from a pre-generated set and shuffles its digits, rows and columns to produce a board you haven't seen.

## Adding to the Learn section

Techniques are plain data in `lib/learn/`. To add one, append an entry to one of the `techniques*.ts` files; its page and its place in the ladder are generated from that. Practice boards live in `lib/practice/`. `engine.ts` runs the three steps (find the pattern, remove candidates, place the digit) for any technique. Each technique has a small file that defines a `PracticeSet`: its boards, the wording for its messages, and a `diagnose` function that explains why a wrong pick isn't the pattern. To add practice for another technique, write that file and its board data, then register it under the technique's slug in `PRACTICE_SETS` in `lib/practice/sets.ts`. The practice page, the "Practice boards" badge on the ladder and the call to action on the technique page all follow from that entry.
