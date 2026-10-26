# Playwright Gym

A hands-on, zero-to-hero Playwright course. Twenty-nine lessons take you from
your first `npx playwright test` to page objects, fixtures, visual and
accessibility testing, CI, and a capstone suite.

Every lesson has three practices (guided → independent → challenge). You
write the tests in your own editor; a checker then proves that each test
**catches a real bug**: it runs your test against the normal app (must pass)
and against a deliberately broken version (must fail).

## Getting started

```bash
npm install
npx playwright install chromium
npm run dev
```

Open http://localhost:3000 and start with lesson 01.

## The workflow

```bash
# 1. Copy the starter into your private, gitignored workspace
mkdir -p tests/solutions
cp tests/lessons/03-selectors.spec.ts tests/solutions/

# 2. Write the tests, run them while you work
npx playwright test tests/solutions/03-selectors.spec.ts --ui

# 3. Check your work
npm run check -- 03-selectors
```

Name each test (or `describe` block) `practice N: …`. For each practice the
checker:

1. runs static checks: anti-patterns such as `waitForTimeout`, `test.only`,
   missing assertions, plus lesson-specific rules (e.g. "use `toHaveCount`");
2. runs the practice against the normal app, where it must pass;
3. runs it again with the bug flag `<lesson>:<N>` switched on, where it must fail.
   A test that stays green is a **false positive**: it doesn't really verify
   the behavior.

Lessons 20, 21 and 29 also use page objects: copy `tests/lessons/pages/` to
`tests/solutions/pages/` once.

## Curriculum

| Module | Lessons |
| --- | --- |
| 1 · Getting started | 01 Setup & first run · 02 Your first test · 03 Selectors & click · 04 Forms & validation · 05 Navigation & URLs |
| 2 · Reliable tests | 06 Locator strategy · 07 Web-first assertions · 08 Auto-waiting · 09 Transient UI & toasts · 10 Keyboard, hover & drag · 11 Dialogs, uploads & downloads |
| 3 · Real-world browser testing | 12 iFrames · 13 Shadow DOM · 14 Popups & new tabs · 15 Network mocking · 16 API testing · 17 Auth & storage state |
| 4 · Test design | 18 Hooks & organization · 19 Data-driven tests · 20 Page Object Model · 21 Custom fixtures |
| 5 · Beyond functional | 22 Visual comparisons · 23 Accessibility · 24 Emulation & clock |
| 6 · Test engineering | 25 Debugging & trace viewer · 26 Contexts & isolation · 27 Config, parallelism & CI · 28 Flaky test clinic · 29 Capstone |

Each lesson page has the theory, a preferred and an avoided example, common
mistakes, the practice set with hints, and links to the official docs.

## Two kinds of practice targets

- **Playgrounds** at `/play/<lesson-id>`: small focused pages, one per
  lesson. The lesson page at `/lessons/<lesson-id>` shows the same playground
  next to the guide; your tests should visit `/play/...`, which has no guide
  text to accidentally match.
- **Gym Shop** at `/shop`: a small store (catalog, product pages, cart,
  discount codes, checkout, login, account, orders) with a JSON API under
  `/api/shop`. Lessons from 05 onwards reuse it, and the capstone tests all of
  it. Each browser context gets its own cart, so tests can run in parallel.

## Bug mode

Planted bugs are switched on by flags such as `03-selectors:2`:

- In the browser, append `?bug=true` (all flags of the current lesson),
  `?bug=03-selectors:2` (one flag), or `?bug=false` (off). The choice is
  stored in a cookie, so it survives navigation.
- In tests, set `GYM_BUG`: `GYM_BUG=03-selectors:2 npx playwright test ...`.
  `playwright.config.ts` forwards it as the `x-gym-bug` header on every
  request, including the `request` fixture.

Gym Shop defects are listed by name in `lib/shop/defects.ts`.

## Reference examples

`tests/examples/` contains a complete, passing solution for every lesson. Use
them when you're stuck, after you've tried. They're also how the course is
tested:

```bash
npm run check -- 06-locator-strategy --examples   # one lesson
npm run check:all -- --examples                     # every lesson, every bug
```

## Project layout

| Path | What |
| --- | --- |
| `lib/lessons/` | Lesson content and checker rubrics, one file per module |
| `components/playgrounds/` | One playground per lesson, plus `registry.ts` |
| `components/shop/`, `app/shop/`, `app/api/shop/` | The Gym Shop |
| `lib/bug.ts`, `middleware.ts` | Bug flag resolution |
| `scripts/check.ts` | The checker |
| `tests/lessons/` | Learner starters (tracked, incomplete on purpose) |
| `tests/solutions/` | Your solutions (gitignored) |
| `tests/examples/` | Reference solutions |
| `tests/app/` | The project's own regression tests (`npm run test:e2e`) |

## Adding a lesson

1. Add the lesson object to the right `lib/lessons/0X-*.ts` module file
   (array order is the curriculum order; the id prefix is its number).
2. Add a playground in `components/playgrounds/` and register it, or point
   `target` at a Gym Shop page and add defects to `lib/shop/defects.ts`.
3. Gate each practice's bug with `useLessonBugs(id)` → `bug(N)`.
4. Add a starter in `tests/lessons/` and a reference in `tests/examples/`.
5. `npm run check -- <id> --examples` must report every practice complete.
