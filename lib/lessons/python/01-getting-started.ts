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
        goal: "The starter holds a test that codegen could have recorded: it passes, but it finds elements with CSS selectors. Rewrite it the way a user sees the page (role and text locators) and keep the assertion that the start message shows.",
        hint: "Run `playwright codegen --target python-pytest http://127.0.0.1:3000/play/01-setup` and compare: prefer get_by_role(\"button\", name=...) and get_by_text(...) over button.primary-button.",
        rubric: {
          requires: [{ pattern: /get_by_role\(/, message: "Find the button by its role and name." }],
          forbids: [{ pattern: /\.locator\(/, message: "Replace the CSS locators with get_by_role / get_by_text." }]
        }
      },
      {
        goal: "The checklist must have exactly four steps and each one must read: Install Node.js, Install Playwright, Run the example test, Open the HTML report. Prove both, in the order shown.",
        hint: "`to_have_text([...])` takes a list and checks the count and the text of every item in order.",
        rubric: { requires: [{ pattern: /to_have_text\(\s*\[|to_have_count\(/, message: "Check every item's text (to_have_text with a list) or at least count the items." }] }
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
      {
        goal: "The starter's test fails. Run it, read the error (expected vs received) and fix the test, not the page. Don't make it pass by deleting the check or skipping the test.",
        hint: "The act-step element contains the heading \"Act\" as well as the sentence, and to_have_text matches the whole text. Which matcher checks only a part?",
        rubric: {
          forbids: [{ pattern: /pytest\.(mark\.)?(skip|xfail)|except\s|\.not_/, message: "Fix the assertion itself; don't skip it or swallow the error." }]
        }
      },
      {
        goal: "Write one test split into three commented phases (`# Arrange`, `# Act`, `# Assert`): open the page, click Run demo test, then assert both the verdict \"Demo test passed.\" and the counter \"Stages completed: 3 of 3\".",
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
        goal: "Open the settings panel with the gear button and prove it is visible. Then type \"locators\" into the search box and prove the echo shows it. Use built-in locators only: no CSS, no ids.",
        hint: "The gear has no text, but its aria-label is its accessible name. The search box has no label: find it by its placeholder.",
        rubric: {
          requires: [{ pattern: /get_by_placeholder\(/, message: "Use get_by_placeholder() for the search field." }],
          forbids: [{ pattern: /\.locator\(/, message: "Use built-in locators instead of locator()." }]
        }
      },
      {
        goal: "The starter clicks Save and fails with a strict mode violation. Run it, read which elements matched, and fix the locator (no .first, .last or .nth()). Then click \"Save as draft\" and assert its result too.",
        hint: "Role names match as a case-insensitive substring by default. exact=True or a regular expression pins the name down.",
        rubric: { forbids: [{ pattern: /\.(first|last|nth)\b/, message: "Make the locator unambiguous; don't pick by position." }] }
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
        goal: "A form that accepts bad input is a bug. Prove each rule on its own: an invalid email, a 7-character password and unchecked terms are each rejected with a message, and no account is created.",
        hint: "Start every case from valid data and break one field. Each field error has role=alert, but Next.js also renders an empty route announcer with role=alert. Narrow it down: get_by_role(\"alert\").filter(has_text=\"email\").",
        rubric: { requires: [{ pattern: /get_by_role\(["']alert/, message: "Assert the error message (role alert) for each rule." }] }
      },
      {
        goal: "Choose plan \"Pro\" and role \"Teacher\" and assert the exact summary. Then click \"Reset form\" and prove the form is clean again: empty name, Free plan, Student role and the starting status message.",
        hint: "to_have_value() reads a field, to_be_checked() a radio. The starting status is \"Complete the form to continue.\".",
        rubric: {
          requires: [
            { pattern: /select_option\(/, message: "Use select_option() for the plan." },
            { pattern: /to_have_value\(/, message: "Check the reset fields with to_have_value()." }
          ]
        }
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
        goal: "Open \"Trail Runner Shoes\" from the catalog and prove you are on its page (URL and heading). Go back and prove you are on the catalog again, go forward, then reload and prove the product page survives a reload.",
        hint: "page.go_back(), page.go_forward() and page.reload() return before the page is ready, so assert the URL after each one.",
        rubric: {
          requires: [
            { pattern: /go_back\(/, message: "Use page.go_back()." },
            { pattern: /reload\(/, message: "Use page.reload()." }
          ]
        }
      },
      {
        goal: "Open /shop/account while logged out and prove you are sent to the login page and that the URL remembers where you came from (?next=/shop/account). Sign in as student / playwright and prove you land back on \"My account\".",
        hint: "The redirect adds a query string, so match the URL with a regular expression such as re.compile(r\"/shop/login\\?next=\").",
        rubric: { requires: [{ pattern: /next=|next%3D/, message: "Assert the next= query parameter in the login URL." }] }
      }
    ]
  }
};
