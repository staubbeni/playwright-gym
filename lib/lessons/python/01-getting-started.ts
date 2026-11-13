import type { PythonLesson } from "../types.ts";

export const gettingStarted: Record<string, PythonLesson> = {
  "01-setup": {
    concepts: ["pytest", "Fixtures", "Headed runs & traces", "Codegen"],
    theory: `pytest-playwright adds Playwright's browser fixtures to pytest. Install it into a virtual environment with \`pip install -r requirements.txt\`, then run \`playwright install chromium\` once to download the browser.

Every test function receives fixtures by naming them as arguments. \`page\` is a fresh browser tab in an isolated context. You run tests with \`pytest <file>\`. Add \`--headed\` to watch the browser, \`--slowmo 500\` to slow it down, and \`--tracing on\` to record a trace you open with \`playwright show-trace\`.

\`playwright codegen --target python-pytest <url>\` opens a browser and records your clicks as pytest code. The recorder picks a locator for each action, and its toolbar can generate assertions too. Treat recorded code as a draft: keep the locators that describe the page the way a user sees it, and replace the rest.`,
    learningGoals: [
      "Run a single test file with pytest.",
      "Watch a run with --headed and record a trace with --tracing on.",
      "Use codegen to explore a page."
    ],
    goodExample: `expect(page).to_have_title(re.compile("Setup"))`,
    badExample: `assert page.title() == "Playwright Gym — Setup"`,
    commonMistakes: [
      "Running every test while developing one lesson. Pass the file path to run only that file.",
      "Pasting codegen output without reading it. Recorded tests often click but never assert.",
      "Comparing `page.title()` with `assert`: it reads once and does not wait. Use `expect(page).to_have_title()`."
    ],
    prerequisites: ["Python 3.9+", "A terminal and an editor"],
    practices: [
      {
        goal: "Open /play/01-setup and assert that the title matches `re.compile(\"Setup\")` with `to_have_title`.",
        hint: "`expect(page).to_have_title(re.compile(\"Setup\"))` retries until the title matches.",
        rubric: { requires: [{ pattern: /to_have_title\(/, message: "Use to_have_title() for the title." }] }
      },
      {
        goal: "Run `playwright codegen --target python-pytest http://127.0.0.1:3000/play/01-setup`, click Start training, and keep an assertion that the message \"Training started. Good luck!\" is visible."
      },
      {
        hint: "Chain locators: get_by_role(\"list\", name=...).get_by_role(\"listitem\"), then use to_have_count.",
        rubric: { requires: [{ pattern: /to_have_count\(/, message: "Use to_have_count() to count items." }] }
      }
    ]
  },
  "02-test-anatomy": {
    concepts: ["Arrange-act-assert", "Test isolation", "Readable test names"],
    theory: `A useful test has three parts. **Arrange** puts the app in a known state, usually with \`page.goto\`. **Act** performs one focused user action. **Assert** verifies the outcome the user can see.

The \`page\` fixture is created fresh for every test inside a new browser context. Tests never share cookies, storage, or page state, which is why they can run in any order and in parallel.

pytest has no step blocks, so make the story visible in the code itself: a descriptive test name, and short \`# Arrange\`, \`# Act\`, \`# Assert\` comments that split the body. pytest prints the failing line, so a failure still says *which part of the story* broke.`,
    learningGoals: [
      "Separate setup, action, and verification.",
      "Understand that every test gets its own page.",
      "Name tests and phases so a failure reads like a story."
    ],
    goodExample: `def test_saves_a_draft(page: Page):
    page.goto("/editor")                                   # arrange
    page.get_by_role("button", name="Save").click()        # act
    expect(page.get_by_role("status")).to_have_text("Saved")  # assert`,
    badExample: `def test_everything(page: Page):
    # 40 lines of unrelated clicks and no assertion at the end
    ...`,
    practices: [
      {
        rubric: {
          requires: [
            { pattern: /get_by_test_id\(["']arrange-step/, message: "Assert the arrange-step element." },
            { pattern: /get_by_test_id\(["']act-step/, message: "Assert the act-step element." },
            { pattern: /get_by_test_id\(["']assert-step/, message: "Assert the assert-step element." }
          ]
        }
      },
      {},
      {
        goal: "Split the test into three commented phases (`# Arrange`, `# Act`, `# Assert`): open the page, click Run demo test, and assert \"Demo test passed.\".",
        rubric: {
          requires: [
            { pattern: /#\s*Arrange[\s\S]*#\s*Act[\s\S]*#\s*Assert/i, message: "Mark the # Arrange, # Act and # Assert phases." }
          ]
        }
      }
    ]
  },
  "03-selectors": {
    goodExample: `page.get_by_role("button", name="Complete action")`,
    badExample: `page.locator("#action-ready")   # the id changes on every render`,
    practices: [
      {
        partial: "```\npage.goto(\"/play/03-selectors\")\npage.get_by_role(\"button\", name=\"Complete action\").click()\n# now assert the status text\n```",
        rubric: { forbids: [{ pattern: /#action-/, message: "Do not use the changing id." }] }
      },
      {
        partial: "```\npage.get_by_role(\"button\", name=\"Open settings\").click()\n# now assert the region is visible\n```",
        hint: "get_by_role(\"region\", name=\"Settings panel\")"
      },
      {
        partial: "```\npage.get_by_placeholder(\"Search lessons\").fill(\"locators\")\n# now assert the echo text\n```",
        rubric: { requires: [{ pattern: /get_by_placeholder\(/, message: "Use get_by_placeholder() for the search field." }] }
      }
    ]
  },
  "04-forms": {
    goodExample: `page.get_by_label("Plan").select_option("Pro")
page.get_by_role("radio", name="Teacher").check()`,
    badExample: `page.locator("select").nth(0).select_option(index=1)`,
    practices: [
      {
        partial: "```\npage.get_by_label(\"Full name\").fill(\"Ada Lovelace\")\npage.get_by_label(\"Email address\").fill(\"ada@example.com\")\n# ...password and terms, then click \"Create account\"\n```"
      },
      {
        partial: "```\n# fill every field with valid data, but use \"not-an-email\" for the email\npage.get_by_role(\"button\", name=\"Create account\").click()\n```",
        hint: "Each field error has role=alert, but Next.js also renders an empty route announcer with role=alert. Narrow it down: get_by_role(\"alert\").filter(has_text=\"email\")."
      },
      {
        partial: "```\npage.get_by_label(\"Plan\").select_option(\"Pro\")\npage.get_by_role(\"radio\", name=\"Teacher\").check()\n# fill the rest, submit, then assert the summary\n```",
        rubric: { requires: [{ pattern: /select_option\(/, message: "Use select_option() for the plan." }] }
      }
    ]
  },
  "05-navigation": {
    goodExample: `page.get_by_role("link", name=re.compile("Cart")).click()
expect(page).to_have_url(re.compile(r"/shop/cart$"))`,
    badExample: `assert page.url == "http://localhost:3000/shop/cart"`,
    commonMistakes: [
      "Reading page.url once. It doesn't wait for the navigation to finish.",
      "Hardcoding http://localhost:3000 instead of relying on base_url.",
      "Not checking the content of the page you landed on."
    ],
    practices: [
      {
        partial: "```\npage.goto(\"/shop\")\npage.get_by_role(\"link\", name=re.compile(\"Cart\")).click()\n# now assert URL and heading\n```",
        rubric: { requires: [{ pattern: /to_have_url\(/, message: "Use to_have_url() for the URL." }] }
      },
      {
        partial: "```\npage.goto(\"/shop\")\npage.get_by_role(\"link\", name=\"Trail Runner Shoes\").click()\n# now assert URL and heading\n```"
      },
      {
        hint: "The redirect adds a query string (/shop/login?next=/shop/account), so match the URL with re.compile(r\"/shop/login\") instead of an exact string.",
        partial: "```\npage.goto(\"/shop/account\")\n# now assert the URL and the \"Sign in\" heading\n```"
      }
    ]
  }
};
