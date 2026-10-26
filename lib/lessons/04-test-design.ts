import type { Lesson } from "./types.ts";

export const testDesign: Lesson[] = [
  {
    id: "18-hooks",
    module: "test-design",
    title: "Hooks & organization",
    shortDescription: "describe, beforeEach, tags",
    description: "Organize Gym Shop cart tests with describe blocks, hooks, tags, and attachments.",
    learningGoals: [
      "Group related tests with test.describe.",
      "Share setup with beforeEach without sharing state.",
      "Tag tests and attach evidence in afterEach."
    ],
    theory: `\`test.describe("cart", () => { ... })\` groups tests and scopes hooks. \`test.beforeEach\` runs before every test in the group. Use it for navigation and setup, but remember each test still gets a fresh page. \`beforeAll\`/\`afterAll\` run once per worker and should not hold page state.

Tags let you select tests: \`test("checkout", { tag: "@smoke" }, async ...)\` and run them with \`--grep @smoke\`. Annotations like \`test.skip()\`, \`test.fixme()\` and \`test.slow()\` document intent in the report.

\`test.afterEach(async ({ page }, testInfo) => ...)\` can attach evidence. \`testInfo.attach("cart", { body: await page.screenshot(), contentType: "image/png" })\` puts a screenshot into the HTML report for every test.`,
    goodExample: `test.describe("cart", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/shop"); });
  test("starts empty", async ({ page }) => { /* ... */ });
});`,
    badExample: `let page; // shared between tests via beforeAll
test.beforeAll(async ({ browser }) => { page = await browser.newPage(); });`,
    commonMistakes: [
      "Sharing a page between tests with beforeAll.",
      "Putting assertions in beforeEach, which hides which test actually failed.",
      "Leaving test.only in the code: CI runs one test and reports green."
    ],
    mission: "Structure cart tests with hooks, tag a smoke test, and attach a screenshot after each test.",
    target: "/shop",
    practices: [
      {
        title: "describe + beforeEach",
        goal: "In describe \"practice 1: cart\" open /shop in beforeEach. Test A asserts \"Cart (0)\". Test B adds \"Steel Kettlebell\" and asserts \"Cart (1)\".",
        difficulty: "guided",
        rubric: {
          requires: [
            { pattern: /test\.describe\(/, message: "Group the tests with test.describe()." },
            { pattern: /test\.beforeEach\(/, message: "Use test.beforeEach()." }
          ]
        }
      },
      {
        title: "Tag a smoke test",
        goal: "Write a test tagged @smoke that adds an item, opens the cart, and asserts the \"Checkout\" link is visible.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /tag:\s*["'`[]/, message: "Add a tag with { tag: \"@smoke\" }." }] }
      },
      {
        title: "Evidence in afterEach",
        goal: "Add an afterEach that attaches a screenshot via testInfo.attach. The test adds an item, removes it, and asserts \"Your cart is empty.\".",
        difficulty: "challenge",
        rubric: {
          requires: [
            { pattern: /test\.afterEach\(/, message: "Use test.afterEach()." },
            { pattern: /\.attach\(/, message: "Attach evidence with testInfo.attach()." }
          ]
        }
      }
    ],
    concepts: ["describe", "Hooks", "Tags", "Attachments"],
    resources: [
      { label: "Test annotations", url: "https://playwright.dev/docs/test-annotations" },
      { label: "Hooks", url: "https://playwright.dev/docs/api/class-test#test-before-each" }
    ],
    prerequisites: ["API testing"]
  },
  {
    id: "19-data-driven",
    module: "test-design",
    title: "Data-driven tests",
    shortDescription: "One test, many inputs",
    description: "Generate tests from tables of search terms, discount codes, and shipping countries.",
    learningGoals: [
      "Generate one test per data row with a loop.",
      "Give each generated test a unique, descriptive title.",
      "Seed the precondition through the API."
    ],
    theory: `When the same steps run with different inputs, put the inputs in a table and loop:

\`for (const { term, count } of searches) { test(\`search "\${term}"\`, async ({ page }) => { ... }); }\`

Each row becomes a separate test with its own report entry, so one failing row doesn't hide the others. Titles must be unique, so include the data in the title.

Keep the table next to the test, or load it from JSON when it is shared. Don't loop *inside* one test: the first failure stops the rest, and the report shows a single result.`,
    goodExample: `for (const { code, total } of codes) {
  test(\`discount \${code}\`, async ({ page }) => { /* ... */ });
}`,
    badExample: `test("all codes", async ({ page }) => {
  for (const code of codes) { /* first failure hides the rest */ }
});`,
    commonMistakes: [
      "Duplicate test titles.",
      "Looping inside a single test.",
      "Rows that depend on the previous row's state."
    ],
    mission: "Drive the catalog search, discount codes, and shipping rules from data tables.",
    target: "/shop",
    practices: [
      {
        title: "Search table",
        goal: "Generate one test per row: mat → 2, kettlebell → 1, protein → 1, zzz → 0 (and \"No products found.\"). Each title starts with \"practice 1:\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /for\s*\(\s*const/, message: "Generate the tests with a for…of loop." }] }
      },
      {
        title: "Discount codes",
        goal: "With Adjustable Dumbbell ($149.00) in the cart: GYM10 → total $134.10, GYM20 → $119.20, BOGUS → alert \"Invalid discount code.\" and total $149.00.",
        difficulty: "independent",
        hint: "Seed the cart with page.request.post(\"/api/shop/cart\", ...)."
      },
      {
        title: "Shipping by country",
        goal: "On /shop/checkout select each Country and assert the shipping line: Hungary $5.00, Germany $8.00, United States $15.00.",
        difficulty: "challenge"
      }
    ],
    concepts: ["Parameterized tests", "Unique titles", "Data tables"],
    resources: [{ label: "Parameterize tests", url: "https://playwright.dev/docs/test-parameterize" }],
    prerequisites: ["Hooks & organization"]
  },
  {
    id: "20-page-objects",
    module: "test-design",
    title: "Page Object Model",
    shortDescription: "Reusable page APIs",
    description: "Wrap the catalog and cart pages in classes so tests read like user stories.",
    learningGoals: [
      "Encapsulate locators and actions in a page class.",
      "Keep assertions in the test (or in clearly named helper methods).",
      "Compose page objects into a full flow."
    ],
    theory: `A page object is a class that knows *how* to interact with one page. It exposes intent-revealing methods (\`addToCart(name)\`) and locators (\`cartLink\`), so tests say *what* happens. When the markup changes, you update one class instead of twenty tests.

\`\`\`
export class CatalogPage {
  readonly cartLink: Locator;
  constructor(private readonly page: Page) {
    this.cartLink = page.getByRole("link", { name: /Cart/ });
  }
  async goto() { await this.page.goto("/shop"); }
}
\`\`\`

Keep page objects thin: locators and actions. Leave most assertions in the test, so a reader can see what is being verified.`,
    goodExample: `const catalog = new CatalogPage(page);
await catalog.addToCart("Yoga Mat");
await expect(catalog.cartLink).toHaveText("Cart (1)");`,
    badExample: `class CatalogPage { async testEverything() { /* clicks + 12 assertions */ } }`,
    commonMistakes: [
      "Page objects that hide every assertion, so the test reads like a black box.",
      "One giant class for the whole app.",
      "Storing data from previous tests on the page object."
    ],
    mission: "Create CatalogPage and CartPage and use them for single actions and for a full purchase flow.",
    target: "/shop",
    practices: [
      {
        title: "CatalogPage",
        goal: "Create pages/catalog-page.ts with goto(), searchFor(term), addToCart(name) and cartLink. Add \"Yoga Mat\" and assert cartLink has text \"Cart (1)\".",
        hint: "The catalog is paginated and Yoga Mat is on page 2. Let addToCart() search for the product first: page objects are the right place to hide that detail.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /from\s+["']\.\/pages\//, message: "Import your page objects from ./pages/." }] }
      },
      {
        title: "CartPage",
        goal: "Create pages/cart-page.ts with goto(), setQuantity(name, n) and total. With Yoga Mat in the cart set quantity 3 and assert the total \"$87.00\".",
        difficulty: "independent"
      },
      {
        title: "Full flow",
        goal: "Using both page objects, add Adjustable Dumbbell and Yoga Mat, apply GYM10, and assert the total \"$160.20\".",
        difficulty: "challenge"
      }
    ],
    concepts: ["Page objects", "Encapsulation", "Readable tests"],
    resources: [{ label: "Page object models", url: "https://playwright.dev/docs/pom" }],
    prerequisites: ["Data-driven tests"]
  },
  {
    id: "21-fixtures",
    module: "test-design",
    title: "Custom fixtures",
    shortDescription: "test.extend",
    description: "Build fixtures that provide ready page objects, a logged-in page, and a seeded cart with cleanup.",
    learningGoals: [
      "Extend test with custom fixtures.",
      "Run setup before and teardown after `use()`.",
      "Compose fixtures that depend on other fixtures."
    ],
    theory: `Fixtures are Playwright's dependency injection. \`test.extend<{ catalogPage: CatalogPage }>({ catalogPage: async ({ page }, use) => { ... await use(value); ... } })\` creates a fixture. A test asks for it by name, and Playwright builds only the fixtures that test uses.

Everything before \`await use(value)\` is setup; everything after is teardown, which runs even when the test fails. Fixtures can depend on other fixtures (\`page\`, \`request\`, or your own) and can be scoped per test or per worker.

Fixtures replace most \`beforeEach\` hooks: setup is explicit, typed, reusable across files, and only runs when needed.`,
    goodExample: `export const test = base.extend<{ catalogPage: CatalogPage }>({
  catalogPage: async ({ page }, use) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await use(catalog);
  }
});`,
    badExample: `let catalog: CatalogPage;
test.beforeEach(async ({ page }) => { catalog = new CatalogPage(page); });`,
    commonMistakes: [
      "Forgetting to await use(), so teardown runs immediately.",
      "Putting cleanup before use().",
      "Importing test from @playwright/test in a file that needs your extended test."
    ],
    mission: "Write three fixtures: a catalog page object, a logged-in account page, and a cart seeded via API with teardown.",
    target: "/shop",
    practices: [
      {
        title: "Page object fixture",
        goal: "Create a catalogPage fixture that opens /shop. Search \"bands\" and assert one article, \"Resistance Bands\".",
        difficulty: "guided",
        rubric: {
          requires: [
            { pattern: /\.extend[<(]/, message: "Create fixtures with test.extend()." },
            { pattern: /await use\(/, message: "Provide the fixture with await use()." }
          ]
        }
      },
      {
        title: "Logged-in fixture",
        goal: "Create an accountPage fixture that logs in via page.request and opens /shop/account. Assert \"Signed in as student\".",
        difficulty: "independent"
      },
      {
        title: "Setup and teardown",
        goal: "Create a seededCart fixture that POSTs 2 × whey-protein before use() and DELETEs /api/shop/cart after. Assert the Whey Protein quantity is 2.",
        difficulty: "challenge"
      }
    ],
    concepts: ["test.extend", "Setup / teardown", "Fixture composition"],
    resources: [{ label: "Fixtures", url: "https://playwright.dev/docs/test-fixtures" }],
    prerequisites: ["Page Object Model"]
  }
];
