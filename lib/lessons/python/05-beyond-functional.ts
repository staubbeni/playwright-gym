import type { PythonLesson } from "../types.ts";

export const beyondFunctional: Record<string, PythonLesson> = {
  "22-visual": {
    concepts: ["Baselines", "Masks", "Animations", "assert_snapshot"],
    theory: `Playwright for Python has no screenshot assertion built in, so this repo's \`conftest.py\` provides one: \`assert_snapshot(locator, "card.png")\` compares a screenshot against a baseline in \`__snapshots__/\` next to the test file. The first run has no baseline and fails while writing one; rerun. Delete a baseline after an intentional UI change. Baselines depend on OS and browser, so generate them on the same platform as CI (often in Docker).

Dynamic content (clocks, counters, avatars) makes every screenshot different. Any \`screenshot()\` option passes through: \`mask=[locator]\` paints those areas with a solid box, \`animations="disabled"\` freezes CSS animations, and \`full_page=True\` captures the whole page. \`max_diff_pixels\` allows tiny anti-aliasing differences.

Visual tests catch what functional assertions miss (colors, spacing, overlap) but they're more brittle. Prefer element screenshots of a stable component to whole pages.`,
    learningGoals: [
      "Create and update screenshot baselines.",
      "Mask content that changes on every run.",
      "Disable animations for stable screenshots."
    ],
    goodExample: `assert_snapshot(page.get_by_test_id("pricing-card"), "pricing-card.png")`,
    badExample: `assert_snapshot(page, "page.png")  # includes a live clock`,
    practices: [
      {
        goal: "Guard the pricing card with `assert_snapshot(locator, \"pricing-card.png\")`. The first run writes the baseline and fails: run again.",
        rubric: { requires: [{ pattern: /assert_snapshot\(/, message: "Use the assert_snapshot fixture." }] }
      },
      {
        goal: "Guard the dashboard header with a snapshot. It contains live numbers that change every second, so the test must pass on every run without hiding the rest of the header.",
        hint: "Pass the changing element as `mask=[locator]`. The mask paints a solid box over it.",
        rubric: { requires: [{ pattern: /mask\s*=\s*\[/, message: "Mask the dynamic element." }] }
      },
      {
        goal: "The starter's full-page snapshot test is flaky. Run it a few times and find out why (two things move on this page), then stabilize it so it passes every time and still fails when the plan name changes. If you add a tolerance, explain it in a comment.",
        hint: "An endless animation never settles, and live text never matches the baseline. Freeze one, mask the other. `max_diff_pixels` is only for tiny anti-aliasing noise: a big value hides real changes.",
        rubric: {
          requires: [
            { pattern: /animations\s*=\s*["']disabled["']/, message: "Disable animations." },
            { pattern: /mask\s*=\s*\[/, message: "Mask the live data." }
          ],
          forbids: [{ pattern: /max_diff_pixels\s*=\s*\d{3,}/, message: "A tolerance this large would hide a changed plan name." }]
        }
      }
    ]
  },
  "23-accessibility": {
    goodExample: `expect(page.get_by_label("Contact email")).to_have_accessible_description("Contact email is required.")`,
    badExample: `expect(page.locator(".error")).to_be_visible()  # visible ≠ announced`,
    practices: [
      {
        rubric: { requires: [{ pattern: /to_match_aria_snapshot\(/, message: "Use to_match_aria_snapshot()." }] }
      },
      {
        hint: "`to_be_focused()` is a web-first assertion. Assert it twice: once on the field inside the dialog, once on the button that opened it.",
        rubric: {
          requires: [
            { pattern: /to_be_focused\(/, message: "Use to_be_focused()." },
            { pattern: /Escape[\s\S]*to_be_focused\(/, message: "Assert focus again after pressing Escape." }
          ]
        }
      },
      {
        hint: "Error text that appears is only announced when it is a live region (role \"alert\"); Next.js adds an empty alert of its own, so narrow yours down by text. `to_have_attribute(\"aria-invalid\", ...)` and `to_have_accessible_description()` cover the rest.",
        rubric: {
          requires: [
            { pattern: /to_have_accessible_description\(/, message: "Use to_have_accessible_description()." },
            { pattern: /aria-invalid/, message: "Check aria-invalid." },
            { pattern: /get_by_role\(\s*["']alert["']/, message: "Find the announced errors with get_by_role(\"alert\")." }
          ],
          forbids: [{ pattern: /get_by_test_id\(|\.locator\(|get_by_text\(/, message: "Use roles and labels only: that is how assistive technology finds things." }]
        }
      }
    ]
  },
  "24-emulation-clock": {
    concepts: ["page.clock", "browser_context_args", "Viewport", "Geolocation"],
    theory: `Code that depends on the environment is hard to test unless you control the environment. \`page.clock.set_fixed_time(datetime(2026, 3, 1, 8, 0))\` makes \`Date.now()\` in the page return that moment. \`page.clock.install()\` + \`page.clock.fast_forward("05:00")\` lets timers advance on demand.

Context options emulate the user's setup. Set them per test with a mark: \`@pytest.mark.browser_context_args(locale="de-DE", timezone_id="Europe/Berlin")\`, or for every test by overriding the \`browser_context_args\` fixture in \`conftest.py\`. Other options include \`viewport\`, \`geolocation\` + \`permissions=["geolocation"]\`, \`color_scheme\`, and device profiles via \`--device "iPhone 13"\`.

Set options *before* the page is created, which is what the mark does. Changing them mid-test is limited to a few page methods such as \`set_viewport_size\`.`,
    learningGoals: [
      "Freeze time with page.clock.",
      "Emulate locale and timezone with @pytest.mark.browser_context_args.",
      "Emulate a mobile viewport and geolocation."
    ],
    goodExample: `@pytest.mark.browser_context_args(locale="de-DE", timezone_id="Europe/Berlin")
def test_formats_prices(page: Page): ...`,
    badExample: `# A test that only passes before noon on the developer's laptop`,
    practices: [
      {
        goal: "Pin the browser's clock to 08:00 on 1 March 2026 and prove the greeting for that time. The clock must be set before the page loads.",
        rubric: { requires: [{ pattern: /page\.clock\./, message: "Use page.clock." }] }
      },
      {
        goal: "Pretend the visitor is in Berlin with a German browser. Prove the membership price uses German formatting (1.234,50) and that the event, which is 12:00 UTC, shows Berlin's local time. Set the environment with a mark on the test, not in the middle of it.",
        hint: "`@pytest.mark.browser_context_args(locale=..., timezone_id=...)`. The price contains a non-breaking space: match it with a regex.",
        rubric: {
          requires: [
            { pattern: /locale\s*=\s*["']de-DE["']/, message: "Emulate the de-DE locale." },
            { pattern: /timezone_id\s*=\s*["']Europe\/Berlin["']/, message: "Emulate the Berlin timezone." }
          ]
        }
      },
      {
        goal: "As a phone user (390×844) in Budapest (47.4979, 19.0402), prove the mobile menu button exists and the nearest gym is found. Then prove the session timeout: the page warns about inactivity, so check the expiry notice is NOT shown just before the limit, IS shown right after it, and that \"Stay signed in\" restarts the countdown. Never wait in real time.",
        hint: "The notice is a role \"alert\" (Next.js adds an empty one too: filter by text). `page.clock.install()` before `goto`, then `page.clock.fast_forward(\"14:00\")`. The countdown starts when the page hydrates, so wait for something the page fills in before you fast-forward. Fast-forwarding in two steps tests both sides of the limit. After clicking \"Stay signed in\", run the same two checks again. Geolocation needs `permissions=[\"geolocation\"]`.",
        rubric: {
          requires: [
            { pattern: /geolocation\s*=/, message: "Emulate geolocation." },
            { pattern: /clock\.install\(/, message: "Install the fake clock with page.clock.install()." },
            { pattern: /fast_forward\(/, message: "Jump time forward with fast_forward()." }
          ],
          forbids: [{ pattern: /wait_for_timeout\(/, message: "Never wait in real time: fast-forward the clock." }]
        }
      }
    ]
  }
};
