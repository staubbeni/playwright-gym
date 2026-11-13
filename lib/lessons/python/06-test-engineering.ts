import type { PythonLesson } from "../types.ts";

export const testEngineering: Record<string, PythonLesson> = {
  "25-debugging": {
    theory: `A failing test is evidence. Read the error first: Playwright prints the locator, the expected and received values, and a **call log** of every retry. Then use the tools:
- \`PWDEBUG=1 pytest -s <file>\` or \`page.pause()\`: step through with the inspector.
- \`pytest --headed --slowmo 500\`: watch the run.
- \`pytest --tracing on\` (or \`retain-on-failure\`), then \`playwright show-trace test-results/<test>/trace.zip\`: DOM snapshots, network, and console for every action.
\`expect(locator, "report should list three regions").to_have_count(3)\` puts your intent into the failure message. Listening to \`page.on("console", ...)\` and \`page.on("pageerror", ...)\` turns silent JavaScript errors into failing tests.`,
    goodExample: `expect(rows, "report should list three regions").to_have_count(3)`,
    badExample: `page.wait_for_timeout(5000)  # "maybe it's just slow"`,
    practices: [
      { goal: "Click \"Generate report\" and assert the status \"Report ready.\". If it fails, run with --tracing on and open the trace." },
      {
        rubric: {
          requires: [{ pattern: /expect\([^)]*?,\s*["'][^"']*["']\s*\)\s*\.\s*(not_)?to_/, message: "Pass a message as the second argument of expect()." }]
        }
      },
      {
        goal: "Collect console messages of type \"error\" during report generation (`page.on(\"console\", ...)`) and assert the list is empty once the report is ready.",
        rubric: { requires: [{ pattern: /\.on\(\s*["'](console|pageerror)["']/, message: "Listen to the console or pageerror event." }] }
      }
    ]
  },
  "26-contexts": {
    theory: `A **browser context** is like a fresh browser profile: its own cookies, localStorage, and cache. pytest-playwright gives each test a new context, which is why tests are isolated by default.

You can create more inside a test: \`other = browser.new_context()\` and \`page2 = other.new_page()\`. That is how you test multi-user features (chat, sharing, permissions) and how you prove isolation: something saved in one context must not appear in another. Close extra contexts when you're done.

If data shows up in a second context, it isn't stored in the browser. It leaked through the server. That's a real bug class worth testing.`,
    goodExample: `guest = browser.new_context()
guest_page = guest.new_page()`,
    badExample: `# Assuming isolation without ever testing it`,
    practices: [{}, { rubric: { requires: [{ pattern: /new_context\(/, message: "Create a second context." }] } }, {}]
  },
  "27-config-ci": {
    concepts: ["pytest options", "pytest-xdist", "Retry loops", "CI"],
    theory: `\`pytest.ini\` (or \`pyproject.toml\`) and the command line define how tests run: \`--browser chromium --browser firefox\`, \`--base-url\`, \`--tracing retain-on-failure\`, \`--headed\`. Override context options per test with \`@pytest.mark.browser_context_args(...)\`, or for every test by overriding the \`browser_context_args\` fixture in \`conftest.py\`.

In CI, install with \`pip install -r requirements.txt\` and \`playwright install --with-deps chromium\`, run \`pytest --tracing retain-on-failure\`, and upload \`test-results/\` as an artifact. Parallelism comes from the \`pytest-xdist\` plugin (\`pytest -n auto\`); retries from \`pytest-rerunfailures\` (\`--reruns 2\`).

Parallel tests must not collide. Generate unique data per test (\`uuid.uuid4()\`), and retry eventually-consistent checks in a short loop with a deadline: click, then \`expect(..., timeout=1_000)\` inside \`try/except AssertionError\`, re-raising once the deadline passes. Python has no \`toPass()\`.`,
    learningGoals: [
      "Configure runs with pytest.ini, CLI options and browser_context_args.",
      "Retry a block until a deadline instead of raising test retries.",
      "Make tests safe to run in parallel with unique data."
    ],
    goodExample: `deadline = time.monotonic() + 10
while True:
    page.get_by_role("button", name="Refresh status").click()
    try:
        expect(status).to_have_text("Healthy", timeout=1_000)
        break
    except AssertionError:
        if time.monotonic() > deadline:
            raise`,
    badExample: `pytest --reruns 5  # hide the flakiness`,
    commonMistakes: [
      "Hardcoded test data (\"user1\") that collides under pytest -n.",
      "Raising --reruns to make a flaky test green.",
      "A retry loop without a deadline, which hangs instead of failing."
    ],
    practices: [
      {
        goal: "With `@pytest.mark.browser_context_args(viewport={\"width\": 1280, \"height\": 720})` assert \"Viewport: 1280 × 720\".",
        rubric: { requires: [{ pattern: /browser_context_args/, message: "Configure the viewport with browser_context_args." }] }
      },
      {
        goal: "The service reports \"Degraded\" for the first refreshes. Click \"Refresh status\" in a retry loop with a deadline until a short `to_have_text(\"Healthy\", timeout=1_000)` passes.",
        rubric: {
          requires: [
            { pattern: /\bwhile\b|\bfor\b/, message: "Retry the click and assertion in a loop." },
            { pattern: /except\s+AssertionError/, message: "Catch AssertionError to retry." }
          ]
        }
      },
      {
        goal: "Parametrize the test over two roles. Each adds a member with a unique name (`uuid.uuid4()`) and asserts exactly one list item has that name.",
        rubric: { requires: [{ pattern: /uuid|time\.time\(|time_ns\(/, message: "Generate a unique name per test." }] }
      }
    ]
  },
  "28-flaky-clinic": {
    concepts: ["Repeated runs", "Flake sources", "Root-cause fixes"],
    theory: `A flaky test passes and fails without code changes. Reproduce first: run it many times, e.g. \`pytest file.py --count=20\` with the \`pytest-repeat\` plugin, or a shell loop. Then look for the usual suspects:
- **Fixed sleeps**: the app is sometimes slower than the sleep.
- **Snapshot reads** (\`text_content()\`, \`is_visible()\`) followed by a plain \`assert\`: they read once and don't retry.
- **Order assumptions**: the UI doesn't guarantee an order, but the test asserts \`nth(0)\`.
- **Timing windows**: waiting so long that a transient element is already gone.
The checker runs your fixed file several times in a row. A fix only counts if it passes every time.`,
    learningGoals: [
      "Reproduce flakiness by repeating a test.",
      "Recognize sleeps, snapshot reads, and order assumptions as flake sources.",
      "Fix the cause instead of adding retries."
    ],
    goodExample: `expect(page.get_by_test_id("score")).to_have_text("Score: 42")`,
    badExample: `page.wait_for_timeout(300)
assert page.get_by_test_id("score").text_content() == "Score: 42"`,
    practices: [
      {},
      { rubric: { forbids: [{ pattern: /\.nth\(|\.first\b/, message: "Don't depend on position." }] } },
      {}
    ]
  },
  "29-capstone": {
    goodExample: `@pytest.mark.usefixtures("seeded_cart")
def test_discount_gym10_reduces_the_total(page: Page): ...`,
    badExample: `def test_shop_works(page: Page):
    page.goto("/shop")
    expect(page).to_have_title(re.compile("Gym"))`,
    practices: [{}, {}, {}, {}, {}, {}, {}, {}]
  }
};
