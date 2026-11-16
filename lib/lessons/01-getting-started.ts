import type { Lesson } from "./types.ts";

export const gettingStarted: Lesson[] = [
  {
    id: "01-setup",
    module: "getting-started",
    title: "Setup & first run",
    shortDescription: "Install, run, record",
    description: "Install Playwright, run your first test, read the HTML report, and record a test with codegen.",
    learningGoals: [
      "Run a single spec file from the command line.",
      "Read the HTML report and know where traces live.",
      "Use codegen and UI mode to explore a page."
    ],
    theory: `Playwright Test is a test runner and a browser automation library in one package. \`npm init playwright@latest\` creates a config, an example test, and downloads the browsers. In this repo everything is already installed: run \`npx playwright install chromium\` once if the browser is missing.

Every test receives fixtures such as \`page\`, which is a fresh browser tab in an isolated context. You run tests with \`npx playwright test <file>\`. Add \`--ui\` for the interactive UI mode, \`--headed\` to watch the browser, and \`npx playwright show-report\` to open the HTML report after a run.

\`npx playwright codegen <url>\` opens a browser and records your clicks as code. The recorder picks a locator for each action, and its toolbar can generate assertions too. Treat recorded code as a draft: keep the locators that describe the page the way a user sees it, and replace the rest.`,
    goodExample: `await expect(page).toHaveTitle(/Setup/);`,
    badExample: `expect(await page.title()).toBe("Playwright Gym — Setup");`,
    commonMistakes: [
      "Running every test while developing one lesson. Pass the file path to run only that spec.",
      "Pasting codegen output without reading it. Recorded tests often click but never assert.",
      "Forgetting `await`. Every Playwright action and web-first assertion returns a promise."
    ],
    mission: "Run your first spec, then add assertions for the title, the training button, and the setup checklist.",
    target: "/play/01-setup",
    practices: [
      {
        title: "Check the page title",
        goal: "Open /play/01-setup and assert that the title matches /Setup/ with `toHaveTitle`.",
        difficulty: "guided",
        hint: "`await expect(page).toHaveTitle(/Setup/)` retries until the title matches.",
        rubric: { requires: [{ pattern: /toHaveTitle\(/, message: "Use toHaveTitle() for the title." }] }
      },
      {
        title: "Clean up a recorded test",
        goal: "The starter holds a test that codegen could have recorded: it passes, but it finds elements with CSS selectors. Rewrite it the way a user sees the page (role and text locators) and keep the assertion that the start message shows.",
        difficulty: "independent",
        hint: "Run `npx playwright codegen http://127.0.0.1:3000/play/01-setup` and compare: prefer getByRole(\"button\", { name: ... }) and getByText(...) over button.primary-button.",
        rubric: {
          requires: [{ pattern: /getByRole\(/, message: "Find the button by its role and name." }],
          forbids: [{ pattern: /\.locator\(/, message: "Replace the CSS locators with getByRole / getByText." }]
        }
      },
      {
        title: "Assert the setup checklist",
        goal: "The checklist must have exactly four steps and each one must read: Install Node.js, Install Playwright, Run the example test, Open the HTML report. Prove both, in the order shown.",
        difficulty: "challenge",
        hint: "`toHaveText([...])` takes an array and checks the count and the text of every item in order.",
        bugs: ["The last step is missing", "A step is renamed"],
        rubric: { requires: [{ pattern: /toHaveText\(\s*\[|toHaveCount\(/, message: "Check every item's text (toHaveText with an array) or at least count the items." }] }
      }
    ],
    concepts: ["Test runner", "Fixtures", "HTML report", "Codegen", "UI mode"],
    resources: [
      { label: "Installation", url: "https://playwright.dev/docs/intro" },
      { label: "Running tests", url: "https://playwright.dev/docs/running-tests" },
      { label: "Test generator", url: "https://playwright.dev/docs/codegen-intro" },
      { label: "UI mode", url: "https://playwright.dev/docs/test-ui-mode" }
    ],
    prerequisites: ["Node.js 18+", "A terminal and an editor"]
  },
  {
    id: "02-test-anatomy",
    module: "getting-started",
    title: "Your first Playwright test",
    shortDescription: "Arrange, act, assert",
    description: "Learn the structure of a readable, isolated Playwright test.",
    learningGoals: [
      "Separate setup, action, and verification.",
      "Understand that every test gets its own page.",
      "Name steps with test.step() so reports read like a story."
    ],
    theory: `A useful test has three parts. **Arrange** puts the app in a known state, usually with \`page.goto\`. **Act** performs one focused user action. **Assert** verifies the outcome the user can see.

The \`page\` fixture is created fresh for every test inside a new browser context. Tests never share cookies, storage, or page state, which is why they can run in any order and in parallel.

\`test.step("name", async () => { ... })\` groups actions under a readable name. Steps appear in the HTML report and the trace viewer, so a failure says *which part of the story* broke.`,
    goodExample: `test("saves a draft", async ({ page }) => {
  await page.goto("/editor");                               // arrange
  await page.getByRole("button", { name: "Save" }).click(); // act
  await expect(page.getByRole("status")).toHaveText("Saved"); // assert
});`,
    badExample: `test("everything", async ({ page }) => {
  // 40 lines of unrelated clicks and no assertion at the end
});`,
    commonMistakes: [
      "A test that only clicks: without an assertion it passes even when the feature is broken.",
      "Several unrelated scenarios in one test, so a failure doesn't tell you what broke.",
      "Relying on another test having run first."
    ],
    mission: "Verify the three stages of a test, their explanations, and the demo run.",
    target: "/play/02-test-anatomy",
    practices: [
      {
        title: "Find the three stages",
        goal: "Assert that the arrange-step, act-step and assert-step test ids are all visible.",
        difficulty: "guided",
        rubric: {
          requires: [
            { pattern: /getByTestId\(["'`]arrange-step/, message: "Assert the arrange-step element." },
            { pattern: /getByTestId\(["'`]act-step/, message: "Assert the act-step element." },
            { pattern: /getByTestId\(["'`]assert-step/, message: "Assert the assert-step element." }
          ]
        }
      },
      {
        title: "Read the failure",
        goal: "The starter's test fails. Run it, read the error (expected vs received) and fix the test, not the page. Don't make it pass by deleting the check or skipping the test.",
        difficulty: "independent",
        hint: "The act-step element contains the heading \"Act\" as well as the sentence, and toHaveText matches the whole text. Which matcher checks only a part?",
        rubric: {
          forbids: [{ pattern: /test\.(skip|fixme)|\.catch\(|\.not\./, message: "Fix the assertion itself; don't skip it or swallow the error." }]
        }
      },
      {
        title: "Structure a readable test",
        goal: "Write one test with three test.step() blocks (Arrange, Act, Assert): open the page, click Run demo test, then assert both the verdict \"Demo test passed.\" and the counter \"Stages completed: 3 of 3\".",
        difficulty: "challenge",
        bugs: ["The verdict says the test failed", "The stage counter stops at 2 of 3"],
        rubric: {
          requires: [
            {
              pattern: /test\.step\([\s\S]*test\.step\([\s\S]*test\.step\(/,
              message: "Use at least three test.step() blocks."
            }
          ]
        }
      }
    ],
    concepts: ["Arrange-act-assert", "Test isolation", "test.step"],
    resources: [
      { label: "Writing tests", url: "https://playwright.dev/docs/writing-tests" },
      { label: "Test steps", url: "https://playwright.dev/docs/api/class-test#test-step" }
    ],
    prerequisites: ["Setup & first run"]
  },
  {
    id: "03-selectors",
    module: "getting-started",
    title: "Selectors & click",
    shortDescription: "Find elements like a user",
    description: "Use getByRole, getByLabel, getByPlaceholder and friends to find elements and act on them.",
    learningGoals: [
      "Locate elements by role and accessible name.",
      "Find icon-only buttons through their aria-label.",
      "Pick the built-in locator that matches what the user sees."
    ],
    theory: `A locator describes how to find an element. It is lazy: nothing is searched until you act or assert. Every action re-runs the search, so locators survive re-renders.

Playwright's built-in locators mirror how people perceive the page: \`getByRole\` (buttons, links, headings, checkboxes…), \`getByLabel\`, \`getByPlaceholder\`, \`getByText\`, \`getByAltText\`, \`getByTitle\`, and \`getByTestId\`. An icon-only button has no visible text, but its \`aria-label\` is its accessible name, so \`getByRole("button", { name: "Open settings" })\` still works.

Locators are **strict**: if a locator matches more than one element when you act on it, Playwright throws instead of guessing. That is a feature. It tells you your locator is ambiguous.`,
    goodExample: `page.getByRole("button", { name: "Complete action" })`,
    badExample: `page.locator("#action-ready")   // the id changes on every render`,
    commonMistakes: [
      "Copying a generated id or CSS class from DevTools.",
      "Using getByText for a button when getByRole describes it better.",
      "Asserting the button exists instead of asserting what clicking it changed."
    ],
    mission: "Click buttons, open an icon-only panel, and type into a search field without relying on ids or CSS.",
    target: "/play/03-selectors",
    practices: [
      {
        title: "Click and verify",
        goal: "Click \"Complete action\" and assert that the status says \"Action completed successfully.\".",
        partial: "```\nawait page.goto(\"/play/03-selectors\");\nawait page.getByRole(\"button\", { name: \"Complete action\" }).click();\n// now assert the status text\n```",
        difficulty: "guided",
        rubric: { forbids: [{ pattern: /#action-/, message: "Do not use the changing id." }] }
      },
      {
        title: "Two controls, no CSS",
        goal: "Open the settings panel with the gear button and prove it is visible. Then type \"locators\" into the search box and prove the echo shows it. Use built-in locators only: no CSS, no ids.",
        difficulty: "independent",
        hint: "The gear has no text, but its aria-label is its accessible name. The search box has no label: find it by its placeholder.",
        bugs: ["The settings panel never opens", "The search echo stays empty"],
        rubric: {
          requires: [{ pattern: /getByPlaceholder\(/, message: "Use getByPlaceholder() for the search field." }],
          forbids: [{ pattern: /\.locator\(/, message: "Use built-in locators instead of locator()." }]
        }
      },
      {
        title: "Fix the strict mode error",
        goal: "The starter clicks Save and fails with a strict mode violation. Run it, read which elements matched, and fix the locator (no .first(), .last() or .nth()). Then click \"Save as draft\" and assert its result too.",
        difficulty: "challenge",
        hint: "Role names match as a case-insensitive substring by default. { exact: true } or a regular expression pins the name down.",
        bugs: ["Save reports a draft instead of a saved document", "Save as draft does nothing"],
        rubric: { forbids: [{ pattern: /\.(first|last|nth)\(/, message: "Make the locator unambiguous; don't pick by position." }] }
      }
    ],
    concepts: ["Role locators", "Accessible names", "Strictness", "Lazy locators"],
    resources: [
      { label: "Locators", url: "https://playwright.dev/docs/locators" },
      { label: "Actions", url: "https://playwright.dev/docs/input" }
    ],
    prerequisites: ["Your first Playwright test"]
  },
  {
    id: "04-forms",
    module: "getting-started",
    title: "Forms & validation",
    shortDescription: "Fill, select, check, submit",
    description: "Fill a registration form through its labels, then test the happy path, a validation error, and selected options.",
    learningGoals: [
      "Use fill, check, and selectOption through accessible labels.",
      "Test both a success path and a validation error.",
      "Assert the exact outcome message."
    ],
    theory: `Form controls should be found the way a user finds them, by their **label**. \`getByLabel("Email address")\` works for \`<label for>\`, wrapping labels, and \`aria-label\`.

\`fill()\` replaces the value, \`check()\` and \`uncheck()\` set checkboxes and radios (and fail if the state didn't change), and \`selectOption()\` picks an option of a \`<select>\` by value or label.

A form test is only complete when you assert the outcome: the success message, or the error the user sees. Always test at least one failure path: a form that accepts everything is a bug.`,
    goodExample: `await page.getByLabel("Plan").selectOption("Pro");
await page.getByRole("radio", { name: "Teacher" }).check();`,
    badExample: `await page.locator("select").nth(0).selectOption({ index: 1 });`,
    commonMistakes: [
      "Clicking a checkbox instead of check(). check() is idempotent and verifies the state.",
      "Testing only valid input.",
      "Asserting that the submit button exists instead of the result message.",
      "Expecting getByRole(\"alert\") to be unique. Frameworks add their own live regions, so read the strict mode error and filter."
    ],
    mission: "Create an account, prove that an invalid email is rejected, and verify the selected plan and role.",
    target: "/play/04-forms",
    practices: [
      {
        title: "Happy path",
        goal: "Fill Full name \"Ada Lovelace\", Email address, Password (8+ chars), accept the terms, submit, and assert that the status contains \"Account created\".",
        partial: "```\nawait page.getByLabel(\"Full name\").fill(\"Ada Lovelace\");\nawait page.getByLabel(\"Email address\").fill(\"ada@example.com\");\n// ...password and terms, then click \"Create account\"\n```",
        difficulty: "guided"
      },
      {
        title: "Validation matrix",
        goal: "A form that accepts bad input is a bug. Prove each rule on its own: an invalid email, a 7-character password and unchecked terms are each rejected with a message, and no account is created.",
        difficulty: "independent",
        hint: "Start every case from valid data and break one field. Each field error has role=alert, but Next.js also renders an empty route announcer with role=alert. Narrow it down: getByRole(\"alert\").filter({ hasText: \"email\" }).",
        bugs: ["A malformed email is accepted", "A 7-character password is accepted", "The terms checkbox is not required"],
        rubric: { requires: [{ pattern: /getByRole\(["']alert/, message: "Assert the error message (role alert) for each rule." }] }
      },
      {
        title: "Options, summary and reset",
        goal: "Choose plan \"Pro\" and role \"Teacher\" and assert the exact summary. Then click \"Reset form\" and prove the form is clean again: empty name, Free plan, Student role and the starting status message.",
        difficulty: "challenge",
        hint: "toHaveValue() reads a field, toBeChecked() a radio. The starting status is \"Complete the form to continue.\".",
        bugs: ["The summary ignores the chosen plan", "The summary ignores the chosen role", "Reset keeps the name"],
        rubric: {
          requires: [
            { pattern: /selectOption\(/, message: "Use selectOption() for the plan." },
            { pattern: /toHaveValue\(/, message: "Check the reset fields with toHaveValue()." }
          ]
        }
      }
    ],
    concepts: ["Labels", "fill / check / selectOption", "Validation paths"],
    resources: [
      { label: "Actions", url: "https://playwright.dev/docs/input" },
      { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" }
    ],
    prerequisites: ["Selectors & click"]
  },
  {
    id: "05-navigation",
    module: "getting-started",
    title: "Navigation & URLs",
    shortDescription: "Links, URLs, redirects",
    description: "Move through the Gym Shop with links and verify URLs, headings, and a login redirect.",
    learningGoals: [
      "Assert URLs with toHaveURL and regular expressions.",
      "Confirm the destination by its heading, not just the URL.",
      "Test a redirect for a protected page."
    ],
    theory: `\`page.goto()\` resolves relative paths against \`baseURL\` from the config, so tests never hardcode a host. After clicking a link, \`await expect(page).toHaveURL(/\\/shop\\/cart/)\` waits until the URL matches.

A URL alone is weak evidence that the right page opened: a broken page can still have the right URL. Pair it with a user-visible check, like the page heading.

Protected pages usually redirect anonymous users to a login page. Test that boundary explicitly: open the protected URL in a fresh (logged-out) context and assert where you end up.`,
    goodExample: `await page.getByRole("link", { name: /Cart/ }).click();
await expect(page).toHaveURL(/\\/shop\\/cart$/);`,
    badExample: `expect(page.url()).toBe("http://localhost:3000/shop/cart");`,
    commonMistakes: [
      "Reading page.url() once. It doesn't wait for the navigation to finish.",
      "Hardcoding http://localhost:3000 instead of relying on baseURL.",
      "Not checking the content of the page you landed on."
    ],
    mission: "Navigate to the cart and a product page, then verify the login redirect for the account page.",
    target: "/shop",
    practices: [
      {
        title: "Go to the cart",
        goal: "From /shop click the link whose name contains \"Cart\", then assert the URL ends with /shop/cart and the heading \"Your cart\" is visible.",
        partial: "```\nawait page.goto(\"/shop\");\nawait page.getByRole(\"link\", { name: /Cart/ }).click();\n// now assert URL and heading\n```",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toHaveURL\(/, message: "Use toHaveURL() for the URL." }] }
      },
      {
        title: "Back, forward and reload",
        goal: "Open \"Trail Runner Shoes\" from the catalog and prove you are on its page (URL and heading). Go back and prove you are on the catalog again, go forward, then reload and prove the product page survives a reload.",
        difficulty: "independent",
        hint: "page.goBack(), page.goForward() and page.reload() resolve before the page is ready, so assert the URL after each one.",
        rubric: {
          requires: [
            { pattern: /goBack\(/, message: "Use page.goBack()." },
            { pattern: /reload\(/, message: "Use page.reload()." }
          ]
        }
      },
      {
        title: "Protected page and ?next=",
        goal: "Open /shop/account while logged out and prove you are sent to the login page and that the URL remembers where you came from (?next=/shop/account). Sign in as student / playwright and prove you land back on \"My account\".",
        difficulty: "challenge",
        hint: "The redirect adds a query string, so match the URL with a regular expression such as /\\/shop\\/login\\?next=/. Pages are also reachable straight from the login form's submit.",
        bugs: ["Anonymous users are not redirected", "Signing in ignores the page you came from"],
        rubric: { requires: [{ pattern: /next=|next%3D/, message: "Assert the next= query parameter in the login URL." }] }
      }
    ],
    concepts: ["baseURL", "toHaveURL", "Redirects"],
    resources: [
      { label: "Navigations", url: "https://playwright.dev/docs/navigations" },
      { label: "Page assertions", url: "https://playwright.dev/docs/api/class-pageassertions" }
    ],
    prerequisites: ["Selectors & click"]
  }
];
