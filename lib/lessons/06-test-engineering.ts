import type { Lesson } from "./types.ts";

export const testEngineering: Lesson[] = [
  {
    id: "25-debugging",
    module: "test-engineering",
    title: "Debugging & trace viewer",
    shortDescription: "Turn failures into evidence",
    description: "Use descriptive assertions, the trace viewer, and console capture to understand failures.",
    learningGoals: [
      "Read a Playwright error and its call log.",
      "Write assertion messages that explain intent.",
      "Collect browser console errors as test evidence."
    ],
    theory: `A failing test is evidence. Read the error first: Playwright prints the locator, the expected and received values, and a **call log** of every retry. Then use the tools:

- \`npx playwright test --ui\`: time-travel through each step.
- \`--debug\` or \`await page.pause()\`: step through with the inspector.
- \`--trace on\`, then \`npx playwright show-trace\`: DOM snapshots, network, and console for every action. In CI, \`trace: "on-first-retry"\` keeps traces only when needed.

\`expect(locator, "report should list three regions").toHaveCount(3)\` puts your intent into the failure message. Listening to \`page.on("console")\` and \`page.on("pageerror")\` turns silent JavaScript errors into failing tests.`,
    goodExample: `await expect(rows, "report should list three regions").toHaveCount(3);`,
    badExample: `await page.waitForTimeout(5000); // "maybe it's just slow"`,
    commonMistakes: [
      "Rerunning a failure until it passes instead of opening the trace.",
      "Ignoring console errors because the UI looks fine.",
      "Assertion failures that don't say what the test meant to check."
    ],
    mission: "Assert the report state, give your assertions clear messages, and fail on console errors.",
    target: "/play/25-debugging",
    practices: [
      {
        title: "Assert the final state",
        goal: "Click \"Generate report\" and assert the status \"Report ready.\". If it fails, run with --trace on and open the trace.",
        difficulty: "guided"
      },
      {
        title: "Assertion messages",
        goal: "Assert the report table has 3 data rows, with a custom message as the second argument of expect().",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /expect\([^;]*?,\s*["'`][^"'`]*["'`]\s*\)\s*\.\s*(not\.)?to/, message: "Pass a message as the second argument of expect()." }] }
      },
      {
        title: "Fail on console errors",
        goal: "Collect console messages of type \"error\" during report generation and assert the list is empty once the report is ready.",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /\.on\(\s*["'](console|pageerror)["']/, message: "Listen to the console or pageerror event." }] }
      }
    ],
    concepts: ["Call log", "Trace viewer", "Console capture"],
    resources: [
      { label: "Trace viewer", url: "https://playwright.dev/docs/trace-viewer" },
      { label: "Debugging tests", url: "https://playwright.dev/docs/debug" }
    ],
    prerequisites: ["Web-first assertions"]
  },
  {
    id: "26-contexts",
    module: "test-engineering",
    title: "Contexts & isolation",
    shortDescription: "Independent sessions",
    description: "Use multiple browser contexts to prove that state does not leak between users.",
    learningGoals: [
      "Create extra contexts with browser.newContext().",
      "Detect state leaking between sessions.",
      "Simulate two users at the same time."
    ],
    theory: `A **browser context** is like a fresh browser profile: its own cookies, localStorage, and cache. Playwright Test gives each test a new context, which is why tests are isolated by default.

You can create more inside a test: \`const other = await browser.newContext(); const page2 = await other.newPage();\`. That is how you test multi-user features (chat, sharing, permissions) and how you prove isolation: something saved in one context must not appear in another. Close extra contexts when you're done.

If data shows up in a second context, it isn't stored in the browser. It leaked through the server. That's a real bug class worth testing.`,
    goodExample: `const guest = await browser.newContext();
const guestPage = await guest.newPage();`,
    badExample: `// Assuming isolation without ever testing it`,
    commonMistakes: [
      "Forgetting to close contexts you created.",
      "Using the same page for two \"users\".",
      "Assuming that a new page shares nothing (pages in one context share storage)."
    ],
    mission: "Save a note, prove another context can't see it, and prove a login doesn't leak to a guest.",
    target: "/play/26-contexts",
    practices: [
      {
        title: "Save in this context",
        goal: "Fill \"Session note\" with \"hello\", click \"Save note\", reload, and assert \"Saved note: hello\".",
        difficulty: "guided"
      },
      {
        title: "Not visible elsewhere",
        goal: "After saving, open the page in a new context and assert it shows \"No saved note.\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /newContext\(/, message: "Create a second context." }] }
      },
      {
        title: "Two users",
        goal: "Log in context A via its page.request. In a fresh guest context open /shop/account and assert it lands on /shop/login, while A sees \"Signed in as student\".",
        difficulty: "challenge"
      }
    ],
    concepts: ["Browser contexts", "Isolation", "Multi-user tests"],
    resources: [{ label: "Isolation", url: "https://playwright.dev/docs/browser-contexts" }],
    prerequisites: ["Authentication & storage state"]
  },
  {
    id: "27-config-ci",
    module: "test-engineering",
    title: "Config, parallelism & CI",
    shortDescription: "Run anywhere, reliably",
    description: "Configure tests per file, retry eventually-consistent checks, and write parallel-safe tests ready for CI.",
    learningGoals: [
      "Read playwright.config.ts: projects, workers, retries, reporters.",
      "Retry a block until it passes with expect().toPass().",
      "Make tests safe to run in parallel with unique data."
    ],
    theory: `\`playwright.config.ts\` defines how tests run: \`testDir\`, \`use\` (baseURL, trace, viewport), \`projects\` (browsers, devices, setup dependencies), \`workers\`, \`retries\`, \`reporter\`, and \`webServer\`. Override per file with \`test.use({...})\` and per describe with \`test.describe.configure({ mode: "parallel", retries: 1 })\`.

In CI, run with \`retries: 2\` and \`trace: "on-first-retry"\`, upload the HTML report as an artifact, and split big suites with \`--shard=1/4\`. A minimal GitHub Actions job runs \`npm ci\`, \`npx playwright install --with-deps\`, then \`npx playwright test\`. This repo's own \`.github/workflows/ci.yml\` is a working example.

Parallel tests must not collide. Generate unique data per test (\`test.info().testId\`, \`Date.now()\`), and retry eventually-consistent checks with \`await expect(async () => { ... }).toPass()\` instead of adding test-level retries.`,
    goodExample: `await expect(async () => {
  await page.getByRole("button", { name: "Refresh status" }).click();
  await expect(status).toHaveText("Healthy", { timeout: 1000 });
}).toPass();`,
    badExample: `test.describe.configure({ retries: 5 }); // hide the flakiness`,
    commonMistakes: [
      "Hardcoded test data (\"user1\") that collides in parallel runs.",
      "Raising retries to make a flaky test green.",
      "Different config locally and in CI without knowing why."
    ],
    mission: "Configure the viewport for a file, poll a service until it is healthy, and add unique team members in parallel.",
    target: "/play/27-config-ci",
    practices: [
      {
        title: "Per-test configuration",
        goal: "In a describe with test.use({ viewport: { width: 1280, height: 720 } }) assert \"Viewport: 1280 × 720\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /test\.use\(/, message: "Configure with test.use()." }] }
      },
      {
        title: "Retry a block",
        goal: "The service reports \"Degraded\" for the first refreshes. Use expect(...).toPass() to click \"Refresh status\" until it says \"Healthy\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /\.toPass\(/, message: "Use toPass()." }] }
      },
      {
        title: "Parallel-safe data",
        goal: "In a parallel describe, add a member with a unique name (e.g. from test.info().testId) and assert exactly one list item has that name.",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /mode:\s*["']parallel["']/, message: "Configure the describe as parallel." }] }
      }
    ],
    concepts: ["Projects", "Workers & sharding", "toPass", "CI"],
    resources: [
      { label: "Configuration", url: "https://playwright.dev/docs/test-configuration" },
      { label: "Parallelism", url: "https://playwright.dev/docs/test-parallel" },
      { label: "CI", url: "https://playwright.dev/docs/ci-intro" }
    ],
    prerequisites: ["Contexts & isolation"]
  },
  {
    id: "28-flaky-clinic",
    module: "test-engineering",
    title: "Flaky test clinic",
    shortDescription: "Diagnose and fix",
    description: "The starter tests pass sometimes. Find the cause of each flake and fix it properly.",
    learningGoals: [
      "Reproduce flakiness with --repeat-each.",
      "Recognize sleeps, snapshot reads, and order assumptions as flake sources.",
      "Fix the cause instead of adding retries."
    ],
    theory: `A flaky test passes and fails without code changes. Reproduce first: \`npx playwright test file.spec.ts --repeat-each=20\`. Then look for the usual suspects:

- **Fixed sleeps**: the app is sometimes slower than the sleep.
- **Snapshot reads** (\`textContent()\`, \`isVisible()\`) followed by a plain \`expect\`: they read once and don't retry.
- **Order assumptions**: the UI doesn't guarantee an order, but the test asserts \`nth(0)\`.
- **Timing windows**: waiting so long that a transient element is already gone.

The checker runs your fixed spec several times in a row. A fix only counts if it passes every time.`,
    goodExample: `await expect(page.getByTestId("score")).toHaveText("Score: 42");`,
    badExample: `await page.waitForTimeout(300);
expect(await page.getByTestId("score").textContent()).toBe("Score: 42");`,
    commonMistakes: [
      "Increasing the sleep.",
      "Adding retries and calling it fixed.",
      "Asserting order when the product doesn't promise order."
    ],
    mission: "Fix three flaky tests: a racy score, an unordered activity feed, and a short-lived toast.",
    target: "/play/28-flaky-clinic",
    practices: [
      {
        title: "The racy score",
        goal: "Fix the score test: click \"Fetch score\" and assert \"Score: 42\" with a retrying assertion.",
        difficulty: "guided"
      },
      {
        title: "The unordered feed",
        goal: "The activity feed renders Login, Purchase, Logout in random order. Assert all three are present without depending on order.",
        difficulty: "independent",
        rubric: { forbids: [{ pattern: /\.nth\(|\.first\(\)/, message: "Don't depend on position." }] }
      },
      {
        title: "The short-lived toast",
        goal: "Click \"Sync now\" and assert the toast \"Synced.\" without waiting for it to disappear first.",
        difficulty: "challenge"
      }
    ],
    concepts: ["--repeat-each", "Flake sources", "Root-cause fixes"],
    resources: [
      { label: "Retries", url: "https://playwright.dev/docs/test-retries" },
      { label: "Best practices", url: "https://playwright.dev/docs/best-practices" }
    ],
    prerequisites: ["Debugging & trace viewer"],
    check: { repeatEach: 5 }
  },
  {
    id: "29-capstone",
    module: "test-engineering",
    title: "Capstone: Gym Shop suite",
    shortDescription: "Put it all together",
    description: "Write a complete end-to-end suite for the Gym Shop. The checker plants 8 hidden bugs, and your suite must catch at least 6.",
    learningGoals: [
      "Plan coverage for a whole application.",
      "Combine page objects, fixtures, API seeding, and web-first assertions.",
      "Measure a suite by the bugs it catches."
    ],
    theory: `A good suite is measured by the bugs it catches, not by its test count. The checker runs your entire capstone spec once normally (everything must pass), then once for each of 8 planted bugs. Each run with a bug should make at least one test fail.

The planted bugs hide in these areas: catalog search, product details, cart quantities, discount codes, checkout validation, order confirmation, login, and account settings. Plan one or two focused tests per area, seed through the API where it helps, and assert exactly what the user sees.

Reuse what you've built: page objects from lesson 20, fixtures from lesson 21, and the data tables from lesson 19. The checkout asks for confirmation through a native dialog.`,
    goodExample: `test("discount GYM10 reduces the total", async ({ seededCart }) => { /* ... */ });`,
    badExample: `test("shop works", async ({ page }) => { await page.goto("/shop"); await expect(page).toHaveTitle(/Gym/); });`,
    commonMistakes: [
      "Smoke tests that never assert prices or totals.",
      "One huge test where the first failure hides everything after it.",
      "Not testing the unhappy paths (invalid email, wrong password)."
    ],
    mission: "Write a suite that covers the whole Gym Shop and catches at least 6 of 8 planted bugs.",
    target: "/shop",
    practices: [
      { title: "Catalog search", goal: "Searching filters the product list correctly.", difficulty: "challenge" },
      { title: "Product details", goal: "The product page shows the right price.", difficulty: "challenge" },
      { title: "Cart quantities", goal: "Changing a quantity updates the total.", difficulty: "challenge" },
      { title: "Discounts", goal: "A valid discount code reduces the total.", difficulty: "challenge" },
      { title: "Checkout validation", goal: "The checkout rejects an invalid email.", difficulty: "challenge" },
      { title: "Order confirmation", goal: "A placed order shows its order number.", difficulty: "challenge" },
      { title: "Login", goal: "Wrong credentials are rejected.", difficulty: "challenge" },
      { title: "Account settings", goal: "Saving settings shows a confirmation.", difficulty: "challenge" }
    ],
    concepts: ["Coverage planning", "Mutation score", "Suite design"],
    resources: [{ label: "Best practices", url: "https://playwright.dev/docs/best-practices" }],
    prerequisites: ["Everything before this lesson"],
    check: { capstone: { minCaught: 6 } }
  }
];
