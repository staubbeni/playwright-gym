# Playwright Gym

Playwright Gym is a hands-on testing playground for learning reliable browser
automation through small, intentionally focused lessons.

## Current status

The current frontend-first course prototype is built with Next.js and React.
It contains twelve interactive lessons at stable URLs, ordered from test
structure to reliable browser automation:

- `/lessons/01-selectors` — locate a dynamic button and assert its result.
- `/lessons/02-forms` — fill valid form data and verify the success state.
- `/lessons/09-test-anatomy` — arrange, act, and assert with isolated fixtures.
- `/lessons/10-navigation` — verify navigation with resilient URL assertions.
- `/lessons/11-locator-strategy` — choose accessible, resilient locators.
- `/lessons/12-assertions` — use web-first state assertions.
- `/lessons/03-auto-waiting` — wait for asynchronous content without sleeps.
- `/lessons/04-toast` — assert transient notification feedback.
- `/lessons/05-network-mocking` — control an API response with `page.route`.
- `/lessons/06-shadow-dom` — interact with an open web component shadow tree.
- `/lessons/07-iframe` — scope locators to an embedded document.
- `/lessons/08-auth-storage` — test a protected dashboard login boundary.
- `/lessons/13-debugging` — investigate failures with focused runs and traces.
- `/lessons/14-contexts` — keep browser state isolated between tests.
- `/lessons/15-popups` — coordinate multiple pages and popup events.
- `/lessons/16-api-testing` — combine API and browser-level checks.

Append `?bug=true` to any lesson URL, for example
`/lessons/01-selectors?bug=true`, to activate deterministic broken behavior.
This makes it possible to verify that a test fails for the right reason rather
than merely passing after an interaction.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000. The project-owned regression tests can be run with:

```bash
npm run test:e2e
```

The learner starter specs are a separate test project:

```bash
npm run test:lessons -- tests/lessons/01-selectors.spec.ts
```

Do not edit the tracked starter when solving a lesson. Copy it into the
gitignored solutions workspace first:

```bash
mkdir -p tests/solutions
cp tests/lessons/01-selectors.spec.ts tests/solutions/01-selectors.spec.ts
```

Then edit and run your private solution:

```bash
npm run test:lessons -- tests/solutions/01-selectors.spec.ts
```

You can also check one lesson end-to-end:

```bash
npm run check -- 01-selectors
```

The checker performs static anti-pattern checks, runs the learner spec against
the normal app, and runs a temporary mutated copy against
`/lessons/01-selectors?bug=true`. A successful check requires the normal run to
pass and the mutation run to fail. The current mutation slice recognizes
direct `page.goto("/lessons/<id>")` calls; broader URL and rubric analysis will
be added as the course grows.

The files in `tests/lessons/` are intentionally incomplete, tracked learner
starter files. Your completed solutions belong in the gitignored
`tests/solutions/` directory, so they remain available locally but are not
included in commits or pushes. The checker uses the solution file when it
exists and refuses to treat the incomplete starter as a completed solution.
The project’s own regression tests live separately in `tests/app/`.

This project intentionally uses an IDE-first workflow instead of an embedded
browser editor. That mirrors real Playwright work: inspect the playground in
the browser, implement the test in the IDE, run the focused spec, then use
`?bug=true` to verify that the assertion catches the broken behavior.

Each lesson page includes the learning goals, short theory, a preferred and
an intentionally fragile locator example, the exercise, hints, and success
criteria. The page teaches the concept without providing the complete test
implementation.

Lessons are grouped into a zero-to-hero progression: foundations, reliable
tests, real-world browser testing, and test engineering. The foundation
module continues with test anatomy and navigation; reliable tests then cover
locator strategy, assertions, auto-waiting, and transient UI. Each lesson
includes guided steps, key concepts, checkpoints, and links to the relevant
Playwright documentation so beginners can build confidence before moving to
the next concept.

The curriculum is based primarily on the official Playwright documentation:
locators and best practices, actions and assertions, auto-waiting, fixtures,
authentication, browser contexts, frames, network mocking, and API testing.
Microsoft Learn's beginner Playwright module is used as a supplementary
learning-path reference. External links are shown on the relevant lesson
page, while all playground fixtures remain local and deterministic.

The learner files are deliberately incomplete. A starter file may pass before
it contains a meaningful assertion; that is temporary scaffolding, not proof
that the lesson is solved. Use `npm run check -- <lesson-id>` to verify that
your assertion detects the broken behavior.

## Validator architecture

`scripts/check.ts` uses the TypeScript compiler API for structural
anti-pattern checks, runs a student test against the normal app, then runs it
against the mutation state and reports false positives. It preserves the
IDE-first workflow: the checker validates the test file you wrote rather than
moving editing into the browser. Reference solutions remain local and
gitignored while behavior rubrics are developed.

Docker Compose is intentionally deferred until the application and validator
contracts are stable. GitHub Actions CI will be added with the reference
solution strategy in a later phase.
