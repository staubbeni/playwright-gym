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
        goal: "Call `assert_snapshot(locator, \"pricing-card.png\")` on the pricing-card test id.",
        rubric: { requires: [{ pattern: /assert_snapshot\(/, message: "Use the assert_snapshot fixture." }] }
      },
      { rubric: { requires: [{ pattern: /mask\s*=\s*\[/, message: "Mask the dynamic element." }] } },
      {
        goal: "Snapshot the whole page with full_page=True, animations disabled and live-stats masked.",
        rubric: { requires: [{ pattern: /animations\s*=\s*["']disabled["']/, message: "Disable animations." }] }
      }
    ]
  },
  "23-accessibility": {
    goodExample: `expect(page.get_by_label("Contact email")).to_have_accessible_description("Contact email is required.")`,
    badExample: `expect(page.locator(".error")).to_be_visible()  # visible ≠ announced`,
    practices: [
      { rubric: { requires: [{ pattern: /to_match_aria_snapshot\(/, message: "Use to_match_aria_snapshot()." }] } },
      { rubric: { requires: [{ pattern: /to_be_focused\(/, message: "Use to_be_focused()." }] } },
      { rubric: { requires: [{ pattern: /to_have_accessible_description\(/, message: "Use to_have_accessible_description()." }] } }
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
        goal: "Set the fixed time to `datetime(2026, 3, 1, 8, 0)`, open the page, and assert the greeting \"Good morning\".",
        rubric: { requires: [{ pattern: /page\.clock\./, message: "Use page.clock." }] }
      },
      {
        goal: "With `@pytest.mark.browser_context_args(locale=\"de-DE\", timezone_id=\"Europe/Berlin\")` assert the price matches `re.compile(r\"1\\.234,50\")` and the event time is \"14:00\".",
        rubric: { requires: [{ pattern: /locale\s*=\s*["']de-DE["']/, message: "Emulate the de-DE locale." }] }
      },
      { rubric: { requires: [{ pattern: /geolocation\s*=/, message: "Emulate geolocation." }] } }
    ]
  }
};
