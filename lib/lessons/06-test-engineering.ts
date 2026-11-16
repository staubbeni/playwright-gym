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
    mission: "Fix a failing test from its call log, explain your assertions, and fail on console and page errors.",
    target: "/play/25-debugging",
    practices: [
      {
        title: "Read the call log",
        goal: "The starter test FAILS. Run it, read the error and its call log, and fix the test so it generates the report and sees it become ready.",
        difficulty: "guided",
        hint: "The call log lists what Playwright could find. Match the page, not your memory of it."
      },
      {
        title: "Explain your assertions",
        goal: "Generate the report, then check in two named test.step() blocks that it lists every region and that every revenue figure is real. Give each assertion a message that says what you meant to prove.",
        difficulty: "independent",
        bugs: ["A region row is missing", "A revenue figure is $0"],
        rubric: {
          requires: [
            { pattern: /test\.step\(/, message: "Group the checks with test.step()." },
            { pattern: /expect\([^;]*?,\s*["'`][^"'`]*["'`]\s*\)\s*\.\s*(not\.)?to/, message: "Pass a message as the second argument of expect()." }
          ]
        }
      },
      {
        title: "A clean report",
        goal: "Generating the report must not leave errors behind. Collect browser console errors AND uncaught page errors, keep a trace of every run with a top-level test.use({ trace }), and prove both lists are empty once the report is ready.",
        difficulty: "challenge",
        hint: "The page also logs ordinary messages. Only type \"error\" counts.",
        bugs: ["A console error is logged", "An uncaught page error is thrown"],
        rubric: {
          requires: [
            { pattern: /\.on\(\s*["']console["']/, message: "Listen to the console event." },
            { pattern: /\.on\(\s*["']pageerror["']/, message: "Listen to the pageerror event." },
            { pattern: /test\.use\(\s*\{[^}]*trace/, message: "Turn tracing on with a top-level test.use({ trace })." }
          ]
        }
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
    mission: "Save a note, prove another context can't see it, and prove two users share the roster but not their sign-in.",
    target: "/play/26-contexts",
    practices: [
      {
        title: "Save in this context",
        goal: "Save a note and prove it is still shown after a reload.",
        difficulty: "guided"
      },
      {
        title: "Not visible elsewhere",
        goal: "Prove that a note saved here is invisible in a second, brand-new browser context. Close the context when you are done.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /newContext\(/, message: "Create a second context." }] }
      },
      {
        title: "Two users, one roster",
        goal: "User A signs in and adds a teammate with a unique name. User B, in a second context, must not look signed in as A, yet must see A's teammate after a reload. Close the contexts you create.",
        difficulty: "challenge",
        hint: "Cookies live in the context, but the roster lives on the server.",
        bugs: ["A teammate is only kept in the page that added it", "A's sign-in leaks to other contexts"],
        rubric: { requires: [{ pattern: /newContext\(/, message: "Create a second context for user B." }] }
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
    mission: "Configure the viewport per describe, poll a service until it is healthy, and keep shared data safe in parallel and serial tests.",
    target: "/play/27-config-ci",
    practices: [
      {
        title: "Per-test configuration",
        goal: "Make the tests in one describe run in a 1280 × 720 window with test.use(), and prove the page agrees.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /test\.use\(/, message: "Configure with test.use()." }] }
      },
      {
        title: "Eventually healthy",
        goal: "The status service reports \"Degraded\" for its first few checks. Make the test click \"Refresh status\" until the page reports Healthy, without sleeping or raising retries.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /\.toPass\(/, message: "Use toPass()." }] }
      },
      {
        title: "Parallel and serial",
        goal: "In a describe configured as parallel, two tests each add a member with a unique name and prove exactly one list item shows that name in full. In a second describe configured as serial, one test adds a member and the next test reloads the page and proves the member is still listed.",
        difficulty: "challenge",
        hint: "Both describes should start with \"practice 3:\" so the checker finds them.",
        bugs: ["Adding a member creates a duplicate", "Long names are cut off in the list", "Reloading the page loses the members"],
        rubric: {
          requires: [
            { pattern: /mode:\s*["']parallel["']/, message: "Configure one describe as parallel." },
            { pattern: /mode:\s*["']serial["']/, message: "Configure one describe as serial." }
          ]
        }
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
    description: "The starter tests pass sometimes. Find the cause of each flake, from sleeps to animations and network races, and fix it properly.",
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
    mission: "Fix five flaky tests: a racy score, an unordered feed, a short-lived toast, an animated total, and an out-of-order search.",
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
        difficulty: "independent"
      },
      {
        title: "The counting total",
        goal: "Click \"Count up\". The total animates for a random time, then stops. Prove it settles on its final figure and that the page then says counting is finished.",
        difficulty: "challenge",
        hint: "A snapshot read like textContent() catches the number halfway through the animation.",
        bugs: ["The total stops one short", "The finished message never appears"]
      },
      {
        title: "The out-of-order search",
        goal: "Type a query into \"Find exercise\" one key at a time with pressSequentially(): every keystroke is a request and the answers arrive in random order. Prove that only the matching exercise stays listed once you stop typing, and that a query with no matches says so.",
        difficulty: "challenge",
        bugs: ["A slow, old response overwrites the newest results", "A search with no matches shows nothing"],
        rubric: { requires: [{ pattern: /pressSequentially\(/, message: "Type key by key with pressSequentially()." }] }
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
    description: "Write a complete end-to-end suite for the Gym Shop. The checker plants 8 hidden bugs, and your suite must catch at least 7.",
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
    mission: "Write a suite that covers the whole Gym Shop and catches at least 7 of 8 planted bugs.",
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
    check: { capstone: { minCaught: 7 } }
  }
];
