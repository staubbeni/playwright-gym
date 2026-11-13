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
        title: "Record a click with codegen",
        goal: "Run `npx playwright codegen http://127.0.0.1:3000/play/01-setup`, click Start training, and keep an assertion that the message \"Training started. Good luck!\" is visible.",
        difficulty: "independent",
        hint: "In the codegen toolbar, the eye and \"Aa\" icons record visibility and text assertions."
      },
      {
        title: "Count the setup checklist",
        goal: "Assert that the list named \"Setup checklist\" has exactly 4 items.",
        difficulty: "challenge",
        hint: "Chain locators: getByRole(\"list\", { name: ... }).getByRole(\"listitem\"), then use toHaveCount.",
        rubric: { requires: [{ pattern: /toHaveCount\(/, message: "Use toHaveCount() to count items." }] }
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
        title: "Verify the explanations",
        goal: "Assert the user-facing explanation text of each stage with toContainText.",
        difficulty: "independent",
        hint: "Act should mention \"one focused user action\"."
      },
      {
        title: "Structure a readable test",
        goal: "Use three test.step() blocks (Arrange, Act, Assert): open the page, click Run demo test, and assert \"Demo test passed.\".",
        difficulty: "challenge",
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
        title: "Icon-only button",
        goal: "Click the gear button (accessible name \"Open settings\") and assert that the region named \"Settings panel\" is visible.",
        partial: "```\nawait page.getByRole(\"button\", { name: \"Open settings\" }).click();\n// now assert the region is visible\n```",
        difficulty: "independent",
        hint: "getByRole(\"region\", { name: \"Settings panel\" })"
      },
      {
        title: "Placeholder search",
        goal: "Fill the field with placeholder \"Search lessons\" with \"locators\" and assert the echo \"Showing results for: locators\".",
        partial: "```\nawait page.getByPlaceholder(\"Search lessons\").fill(\"locators\");\n// now assert the echo text\n```",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /getByPlaceholder\(/, message: "Use getByPlaceholder() for the search field." }] }
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
        title: "Invalid email",
        goal: "Submit with email \"not-an-email\" (everything else valid) and assert the alert \"Enter a valid email address.\".",
        partial: "```\n// fill every field with valid data, but use \"not-an-email\" for the email\nawait page.getByRole(\"button\", { name: \"Create account\" }).click();\n```",
        difficulty: "independent",
        hint: "Each field error has role=alert, but Next.js also renders an empty route announcer with role=alert. Narrow it down: getByRole(\"alert\").filter({ hasText: \"email\" })."
      },
      {
        title: "Options and summary",
        goal: "Choose plan \"Pro\" and role \"Teacher\" and assert the exact summary: \"Account created for Ada Lovelace on the Pro plan as a Teacher.\".",
        partial: "```\nawait page.getByLabel(\"Plan\").selectOption(\"Pro\");\nawait page.getByRole(\"radio\", { name: \"Teacher\" }).check();\n// fill the rest, submit, then assert the summary\n```",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /selectOption\(/, message: "Use selectOption() for the plan." }] }
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
        title: "Open a product",
        goal: "Click the product link \"Trail Runner Shoes\" and assert the URL /shop/products/trail-runner-shoes and the product heading.",
        partial: "```\nawait page.goto(\"/shop\");\nawait page.getByRole(\"link\", { name: \"Trail Runner Shoes\" }).click();\n// now assert URL and heading\n```",
        difficulty: "independent"
      },
      {
        title: "Protected redirect",
        goal: "Open /shop/account while logged out and assert that you are redirected to /shop/login and see the \"Sign in\" heading.",
        hint: "The redirect adds a query string (/shop/login?next=/shop/account), so match the URL with a regex such as /\\/shop\\/login/ instead of an exact string.",
        partial: "```\nawait page.goto(\"/shop/account\");\n// now assert the URL and the \"Sign in\" heading\n```",
        difficulty: "challenge"
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
