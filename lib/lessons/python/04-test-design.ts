import type { PythonLesson } from "../types.ts";

export const testDesign: Record<string, PythonLesson> = {
  "18-hooks": {
    concepts: ["Test classes", "Autouse fixtures", "Marks", "Teardown evidence"],
    theory: `A \`class TestCart:\` groups tests, and an **autouse fixture** inside it is pytest's \`beforeEach\`: \`@pytest.fixture(autouse=True)\` on a method that opens \`/shop\` runs before every test in the class. Each test still gets a fresh page. Avoid \`scope="session"\` fixtures that hold a page.

Marks let you select tests: \`@pytest.mark.smoke\` on a test, then \`pytest -m smoke\`. Register custom marks in \`pytest.ini\` (this repo registers \`smoke\`). \`@pytest.mark.skip\`, \`@pytest.mark.xfail\` and \`pytest.skip()\` document intent in the report.

Code after \`yield\` in a fixture is teardown and runs after every test, even a failing one. Use it to keep evidence: \`page.screenshot(path=f"{output_path}/cart.png")\` writes into pytest-playwright's per-test \`output_path\` folder (\`test-results/\`). To keep it only for failures, compare \`request.session.testsfailed\` before and after the \`yield\`: a bigger number means the test that just ran failed.`,
    learningGoals: [
      "Group related tests in a test class.",
      "Share setup with an autouse fixture without sharing state.",
      "Mark tests and keep evidence in fixture teardown."
    ],
    goodExample: `class TestCart:
    @pytest.fixture(autouse=True)
    def open_shop(self, page: Page):
        page.goto("/shop")

    def test_starts_empty(self, page: Page): ...`,
    badExample: `@pytest.fixture(scope="session")  # one page shared by every test
def shared_page(browser):
    return browser.new_page()`,
    commonMistakes: [
      "Sharing a page between tests with a session-scoped fixture.",
      "Putting assertions in an autouse fixture, which hides which test actually failed.",
      "Leaving a stray `-k` or `skip` behind so CI runs fewer tests than you think."
    ],
    practices: [
      {
        goal: "In a class `TestPractice_1_cart`, open /shop in an autouse fixture. Test A proves a new shopper's cart is empty. Test B adds Steel Kettlebell and proves the header counts one item.",
        rubric: {
          requires: [
            { pattern: /class\s+\w*[Pp]ractice_1_/, message: "Group the tests in a class TestPractice_1_…." },
            { pattern: /autouse\s*=\s*True/, message: "Open the shop in an autouse fixture." }
          ]
        }
      },
      {
        goal: "Mark one test `@pytest.mark.smoke`: it puts an item in the cart (the API is quickest), opens the cart, clicks through to checkout and proves you landed on the checkout page. The checker runs `pytest -m smoke` and expects exactly this test, so leave the mark off the others.",
        rubric: { requires: [{ pattern: /@pytest\.mark\.smoke/, message: "Mark the test with @pytest.mark.smoke." }] }
      },
      {
        goal: "Add an autouse fixture that `yield`s and then saves `page.screenshot(path=...)` into `output_path` ONLY when the test failed. The test adds Steel Kettlebell and Yoga Mat, removes the kettlebell and proves only the mat is left, then removes the mat and proves the cart is empty.",
        hint: "Take `request: pytest.FixtureRequest`, remember `request.session.testsfailed` before the yield and compare it after: a bigger number means this test failed.",
        rubric: {
          requires: [
            { pattern: /\byield\b/, message: "Run the screenshot after the test, behind yield." },
            { pattern: /\.screenshot\(/, message: "Save a screenshot as evidence." },
            { pattern: /testsfailed|rep_call|excinfo/, message: "Screenshot only on failure: compare request.session.testsfailed before and after the yield." }
          ]
        }
      }
    ]
  },
  "19-data-driven": {
    theory: `When the same steps run with different inputs, put the inputs in a table and let pytest generate the tests:
\`@pytest.mark.parametrize(("term", "count"), [("mat", 2), ("zzz", 0)])\` above \`def test_practice_1_search(page, term, count)\`.

Each row becomes a separate test with its own report entry (\`test_practice_1_search[mat-2]\`), so one failing row doesn't hide the others. pytest builds the ids from the data; pass \`ids=[...]\` or \`pytest.param(..., id="...")\` for nicer names.

Keep the table next to the test, or load it from JSON when it is shared. Don't loop *inside* one test: the first failure stops the rest, and the report shows a single result.`,
    learningGoals: [
      "Generate one test per data row with @pytest.mark.parametrize.",
      "Give each generated test a readable id.",
      "Seed the precondition through the API."
    ],
    goodExample: `@pytest.mark.parametrize(("code", "total"), codes)
def test_discount(page: Page, code: str, total: str): ...`,
    badExample: `def test_all_codes(page: Page):
    for code in codes:
        ...  # first failure hides the rest`,
    commonMistakes: [
      "Rows that produce identical ids, so the report can't tell them apart.",
      "Looping inside a single test.",
      "Rows that depend on the previous row's state."
    ],
    practices: [
      {
        goal: "Parametrize `test_practice_1_…` over: mat → 2 products, kettlebell → 1, protein → 1, zzz → 0 (an empty result says so too).",
        rubric: { requires: [{ pattern: /@pytest\.mark\.parametrize\(/, message: "Generate the tests with @pytest.mark.parametrize." }] }
      },
      {
        goal: "Adjustable Dumbbell ($149.00) is in the cart: seed it through the API, not the UI. Parametrize `test_practice_2_…` over: GYM10 → $134.10, GYM20 → $119.20, a lowercase gym10 → $134.10, and BOGUS → an alert and the total stays $149.00.",
        hint: "Seed with page.request.post(\"/api/shop/cart\", data={\"productId\": ...}).",
        rubric: { requires: [{ pattern: /@pytest\.mark\.parametrize\(/, message: "Generate the tests with @pytest.mark.parametrize." }] }
      },
      {
        goal: "Shipping depends on country and on delivery. Parametrize `test_practice_3_…` over every country (Hungary $5.00, Germany $8.00, United States $15.00) with Standard delivery and with Express (+$10.00), on /shop/checkout. Give every row a unique, descriptive id so a failing row names its country and delivery.",
        hint: "Stack two parametrize decorators, or use pytest.param(..., id=\"germany-express\") per row.",
        rubric: {
          requires: [
            { pattern: /@pytest\.mark\.parametrize\(/, message: "Generate the tests with @pytest.mark.parametrize." },
            { pattern: /\bids\s*=|pytest\.param\(/, message: "Give the rows readable ids with ids=[...] or pytest.param(..., id=...)." }
          ]
        }
      }
    ]
  },
  "20-page-objects": {
    theory: `A page object is a class that knows *how* to interact with one page. It exposes intent-revealing methods (\`add_to_cart(name)\`) and locators (\`cart_link\`), so tests say *what* happens. When the markup changes, you update one class instead of twenty tests.
\`\`\`
class CatalogPage:
    def __init__(self, page: Page):
        self.page = page
        self.cart_link = page.get_by_role("link", name=re.compile("Cart"))

    def goto(self):
        self.page.goto("/shop")
\`\`\`
Keep page objects thin: locators and actions. Leave most assertions in the test, so a reader can see what is being verified.`,
    goodExample: `catalog = CatalogPage(page)
catalog.add_to_cart("Yoga Mat")
expect(catalog.cart_link).to_have_text("Cart (1)")`,
    badExample: `class CatalogPage:
    def test_everything(self): ...  # clicks + 12 assertions`,
    practices: [
      {
        goal: "Complete pages/catalog_page.py with goto(), search_for(term), add_to_cart(name) and cart_link. Add \"Yoga Mat\" through the page object and prove the header counts one item.",
        hint: "The catalog is paginated and Yoga Mat is on page 2. Let add_to_cart() search for the product first: page objects are the right place to hide that detail.",
        rubric: { requires: [{ pattern: /from\s+pages\./, message: "Import your page objects from pages." }] }
      },
      {
        goal: "Complete pages/cart_page.py with goto(), set_quantity(name, n) and total. With Yoga Mat in the cart set quantity 3 and prove the total is three mats' worth.",
        rubric: { requires: [{ pattern: /CartPage\(/, message: "Use your CartPage." }] }
      },
      {
        goal: "The starter's \"practice 3\" test already passes, but it is 25 lines of raw locators. Rewrite its body with CatalogPage and CartPage, keeping every assertion. Extend the page objects where they lack something (subtotal, discount, ...). No raw page.get_by_…/page.locator() may be left in the test body.",
        hint: "Give each missing element an attribute in the page object's __init__ and each repeated action a method.",
        rubric: {
          requires: [
            { pattern: /CatalogPage\(/, message: "Use your CatalogPage." },
            { pattern: /CartPage\(/, message: "Use your CartPage." }
          ],
          forbids: [{ pattern: /\bpage\.(get_by_\w+|locator)\(/, message: "No raw locators in the test body: move them into the page objects." }]
        }
      }
    ]
  },
  "21-fixtures": {
    concepts: ["@pytest.fixture", "Setup / teardown with yield", "conftest.py"],
    theory: `Fixtures are pytest's dependency injection. A function decorated with \`@pytest.fixture\` builds a value, and a test asks for it by naming it as an argument. pytest builds only the fixtures a test uses.

Write setup, then \`yield value\`; everything after the \`yield\` is teardown, which runs even when the test fails. Fixtures can depend on other fixtures (\`page\`, \`browser\`, or your own) and can be scoped per test, module or session. Put shared ones in \`conftest.py\` to reuse them across files without imports.

To give a fixture a per-test choice, parametrize it *indirectly*: \`@pytest.mark.parametrize("seeded_cart", [...], indirect=True)\` hands each value to the fixture as \`request.param\`.

Fixtures replace most autouse setup: setup is explicit, reusable, and only runs when needed. Use \`@pytest.mark.usefixtures("seeded_cart")\` when the test needs the side effect but not the value.`,
    learningGoals: [
      "Create custom fixtures with @pytest.fixture.",
      "Run setup before and teardown after `yield`.",
      "Compose fixtures that depend on other fixtures."
    ],
    goodExample: `@pytest.fixture
def catalog_page(page: Page):
    catalog = CatalogPage(page)
    catalog.goto()
    yield catalog`,
    badExample: `catalog = None

def setup_function():
    global catalog  # shared, untyped, always runs`,
    commonMistakes: [
      "Putting cleanup before `yield`, so it runs before the test.",
      "Returning instead of yielding when the fixture needs teardown.",
      "Defining the same fixture in several files instead of once in conftest.py."
    ],
    practices: [
      {
        goal: "Create a catalog_page fixture that opens /shop and returns a CatalogPage. Search for resistance bands and prove exactly one product is listed and that it is the right one.",
        rubric: { requires: [{ pattern: /@pytest\.fixture/, message: "Create fixtures with @pytest.fixture." }] }
      },
      {
        goal: "Create an account_page fixture that signs the student in through page.request (no form) and opens the account page. Prove the page says who is signed in.",
        rubric: { requires: [{ pattern: /request\.post\(/, message: "Sign in through page.request.post(), not the login form." }] }
      },
      {
        goal: "seeded_cart seeds the cart through the API before `yield` and empties it (DELETE /api/shop/cart) after. What it seeds comes from the fixture's parameter (default: 2 × whey-protein). In your test choose 3 × resistance-bands with `@pytest.mark.parametrize(\"seeded_cart\", [...], indirect=True)` and prove the cart shows three bands: the quantity field and the header count.",
        hint: "Inside the fixture take `request: pytest.FixtureRequest` and read `getattr(request, \"param\", default)`.",
        rubric: {
          requires: [
            { pattern: /indirect\s*=\s*True/, message: "Pass the choice to the fixture with parametrize(..., indirect=True)." },
            { pattern: /\byield\b[\s\S]*\.delete\(/, message: "Clean up after yield." }
          ]
        }
      }
    ]
  }
};
