import type { Lesson } from "./types.ts";

export const beyondFunctional: Lesson[] = [
  {
    id: "22-visual",
    module: "beyond-functional",
    title: "Visual comparisons",
    shortDescription: "toHaveScreenshot",
    description: "Catch visual regressions with element and full-page screenshots, masking dynamic content.",
    learningGoals: [
      "Create and update screenshot baselines.",
      "Mask content that changes on every run.",
      "Disable animations for stable screenshots."
    ],
    theory: `\`await expect(locator).toHaveScreenshot("card.png")\` compares a screenshot against a baseline image. The first run has no baseline and fails while writing one. Rerun, or use \`--update-snapshots\` after an intentional UI change. Baselines depend on OS and browser, so generate them on the same platform as CI (often in Docker).

Dynamic content (clocks, counters, avatars) makes every screenshot different. \`mask: [locator]\` paints those areas with a solid box. \`animations: "disabled"\` freezes CSS animations, and \`maxDiffPixelRatio\` allows tiny anti-aliasing differences.

Visual tests catch what functional assertions miss (colors, spacing, overlap) but they're more brittle. Prefer element screenshots of a stable component to whole pages.`,
    goodExample: `await expect(page.getByTestId("pricing-card")).toHaveScreenshot("pricing-card.png");`,
    badExample: `await expect(page).toHaveScreenshot(); // includes a live clock`,
    commonMistakes: [
      "Committing baselines generated on a different OS than CI.",
      "Updating snapshots blindly when a test fails.",
      "Full-page screenshots of pages with live data and no masks."
    ],
    mission: "Guard the pricing card, a dashboard header with live data, and the whole page against visual changes.",
    target: "/play/22-visual",
    practices: [
      {
        title: "Element screenshot",
        goal: "Guard the pricing card with an element screenshot named \"pricing-card.png\". The first run writes the baseline and fails: run again.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toHaveScreenshot\(/, message: "Use toHaveScreenshot()." }] }
      },
      {
        title: "Mask live data",
        goal: "Guard the dashboard header with a screenshot. It contains live numbers that change every second, so the test must pass on every run without hiding the rest of the header.",
        difficulty: "independent",
        hint: "Pass the changing element to the `mask` option as a locator. The mask paints a solid box over it.",
        rubric: { requires: [{ pattern: /mask:\s*\[/, message: "Mask the dynamic element." }] }
      },
      {
        title: "Fix the flaky page test",
        goal: "The starter's full-page screenshot test is flaky. Run it a few times and find out why (two things move on this page), then stabilize it so it passes every time and still fails when the plan name changes. If you add a tolerance, explain it in a comment.",
        difficulty: "challenge",
        hint: "An endless animation never settles, and live text never matches the baseline. Freeze one, mask the other. `maxDiffPixelRatio` is only for tiny anti-aliasing noise: a big value hides real changes.",
        rubric: {
          requires: [
            { pattern: /animations:\s*["']disabled["']/, message: "Disable animations." },
            { pattern: /mask:\s*\[/, message: "Mask the live data." }
          ],
          forbids: [{ pattern: /maxDiffPixelRatio:\s*(0?\.0[5-9]|0?\.[1-9]|1)/, message: "A tolerance this large would hide a changed plan name." }]
        }
      }
    ],
    concepts: ["Baselines", "Masks", "Animations", "Thresholds"],
    resources: [{ label: "Visual comparisons", url: "https://playwright.dev/docs/test-snapshots" }],
    prerequisites: ["Web-first assertions"],
    check: { snapshots: true }
  },
  {
    id: "23-accessibility",
    module: "beyond-functional",
    title: "Accessibility testing",
    shortDescription: "ARIA snapshots, focus, names",
    description: "Verify accessible names, focus management, and announced errors.",
    learningGoals: [
      "Assert accessibility trees with toMatchAriaSnapshot.",
      "Check focus management in a dialog.",
      "Verify that errors are linked to their inputs."
    ],
    theory: `If your tests use role-based locators, they already check part of the accessibility contract. \`toMatchAriaSnapshot\` goes further: it compares a section of the accessibility tree, the way assistive technology sees it, with a YAML template:

\`\`\`
- navigation "Main":
  - link "Home"
  - link "Shop"
\`\`\`

Dialogs must move focus inside (\`toBeFocused()\`) and close with Escape. Error messages must be connected to their inputs through \`aria-describedby\`, which you can verify with \`toHaveAccessibleDescription()\`, and invalid inputs carry \`aria-invalid\`. For broad automated audits, add \`@axe-core/playwright\` on top of these targeted checks.`,
    goodExample: `await expect(page.getByLabel("Contact email")).toHaveAccessibleDescription("Contact email is required.");`,
    badExample: `await expect(page.locator(".error")).toBeVisible(); // visible ≠ announced`,
    commonMistakes: [
      "Only checking that an error is visible, not that it is announced.",
      "Icon-only links without accessible names.",
      "Dialogs that leave focus behind on the page."
    ],
    mission: "Snapshot the main navigation, check the newsletter dialog's focus handling, and verify accessible error descriptions.",
    target: "/play/23-accessibility",
    practices: [
      {
        title: "ARIA snapshot",
        goal: "Prove the main navigation is exposed to assistive technology with all three of its links, each with an accessible name.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toMatchAriaSnapshot\(/, message: "Use toMatchAriaSnapshot()." }] }
      },
      {
        title: "Dialog focus",
        goal: "Open the newsletter dialog and prove keyboard users are looked after: focus moves into the dialog, and after Escape closes it focus is back where it started.",
        difficulty: "independent",
        hint: "`toBeFocused()` is a web-first assertion. Assert it twice: once on the field inside the dialog, once on the button that opened it.",
        bugs: ["Focus stays behind when the dialog opens", "Focus is lost after Escape closes the dialog"],
        rubric: {
          requires: [
            { pattern: /toBeFocused\(/, message: "Use toBeFocused()." },
            { pattern: /Escape[\s\S]*toBeFocused\(/, message: "Assert focus again after pressing Escape." }
          ]
        }
      },
      {
        title: "Announced errors",
        goal: "Submit the empty contact form and prove both errors are really announced to assistive technology, not just visible: each field is marked invalid and its description is its error text. Find everything by role or label.",
        difficulty: "challenge",
        hint: "Error text that appears is only announced when it is a live region (role \"alert\"); Next.js adds an empty alert of its own, so narrow yours down by text. `toHaveAttribute(\"aria-invalid\", ...)` and `toHaveAccessibleDescription()` cover the rest.",
        bugs: ["Fields are never marked invalid", "Errors aren't linked to their fields", "Errors aren't announced as alerts"],
        rubric: {
          requires: [
            { pattern: /toHaveAccessibleDescription\(/, message: "Use toHaveAccessibleDescription()." },
            { pattern: /aria-invalid/, message: "Check aria-invalid." },
            { pattern: /getByRole\(\s*["']alert["']/, message: "Find the announced errors with getByRole(\"alert\")." }
          ],
          forbids: [{ pattern: /getByTestId\(|\.locator\(|getByText\(/, message: "Use roles and labels only: that is how assistive technology finds things." }]
        }
      }
    ],
    concepts: ["Accessibility tree", "Focus management", "aria-describedby"],
    resources: [
      { label: "ARIA snapshots", url: "https://playwright.dev/docs/aria-snapshots" },
      { label: "Accessibility testing", url: "https://playwright.dev/docs/accessibility-testing" }
    ],
    prerequisites: ["Locator strategy"]
  },
  {
    id: "24-emulation-clock",
    module: "beyond-functional",
    title: "Emulation & clock",
    shortDescription: "Time, locale, devices",
    description: "Control time, locale, timezone, viewport, and geolocation to test environment-dependent UI.",
    learningGoals: [
      "Freeze time with page.clock.",
      "Emulate locale and timezone with test.use.",
      "Emulate a mobile viewport and geolocation."
    ],
    theory: `Code that depends on the environment is hard to test unless you control the environment. \`page.clock.setFixedTime(new Date("2026-03-01T08:00:00"))\` makes \`Date.now()\` return that moment. \`page.clock.install()\` + \`fastForward("05:00")\` lets timers advance on demand.

Context options emulate the user's setup. Set them per file or describe block with \`test.use({ locale: "de-DE", timezoneId: "Europe/Berlin" })\`. Other options include \`viewport\`, \`geolocation\` + \`permissions: ["geolocation"]\`, \`colorScheme\`, and whole device profiles like \`devices["iPhone 13"]\` (in projects).

Set options *before* the page is created, which is what \`test.use\` does. Changing them mid-test is limited to a few page methods such as \`setViewportSize\`.`,
    goodExample: `test.use({ locale: "de-DE", timezoneId: "Europe/Berlin" });`,
    badExample: `// A test that only passes before noon on the developer's laptop`,
    commonMistakes: [
      "Tests that depend on the real current time.",
      "Asserting an exact formatted string that contains a non-breaking space. Use a regex.",
      "Forgetting permissions when emulating geolocation."
    ],
    mission: "Freeze the clock for the greeting, format prices in German, and use a phone viewport with geolocation.",
    target: "/play/24-emulation-clock",
    practices: [
      {
        title: "Freeze time",
        goal: "Pin the browser's clock to 08:00 on 1 March 2026 and prove the greeting for that time. The clock must be set before the page loads.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /page\.clock\./, message: "Use page.clock." }] }
      },
      {
        title: "Locale and timezone",
        goal: "Pretend the visitor is in Berlin with a German browser. Prove the membership price uses German formatting (1.234,50) and that the event, which is 12:00 UTC, shows Berlin's local time. Set the environment once for the group of tests, not in the middle of a test.",
        difficulty: "independent",
        hint: "`test.use({ locale, timezoneId })` inside a `test.describe`. The price contains a non-breaking space: match it with a regex.",
        bugs: ["The price ignores the locale", "The event time ignores the timezone"],
        rubric: {
          requires: [
            { pattern: /locale:\s*["']de-DE["']/, message: "Emulate the de-DE locale." },
            { pattern: /timezoneId:\s*["']Europe\/Berlin["']/, message: "Emulate the Berlin timezone." }
          ]
        }
      },
      {
        title: "Timeouts on a phone",
        goal: "As a phone user (390×844) in Budapest (47.4979, 19.0402), prove the mobile menu button exists and the nearest gym is found. Then prove the session timeout: the page warns about inactivity, so check the expiry notice is NOT shown just before the limit, IS shown right after it, and that \"Stay signed in\" restarts the countdown. Never wait in real time.",
        difficulty: "challenge",
        hint: "The notice is a role \"alert\" (Next.js adds an empty one too: filter by text). `page.clock.install()` before `goto`, then `page.clock.fastForward(\"14:00\")`. The countdown starts when the page hydrates, so wait for something the page fills in before you fast-forward. Fast-forwarding in two steps tests both sides of the limit. After clicking \"Stay signed in\", run the same two checks again. Geolocation needs `permissions: [\"geolocation\"]`.",
        bugs: ["The session expires too early", "Stay signed in doesn't restart the countdown", "The gym finder confuses latitude and longitude"],
        rubric: {
          requires: [
            { pattern: /geolocation:/, message: "Emulate geolocation." },
            { pattern: /clock\.install\(/, message: "Install the fake clock with page.clock.install()." },
            { pattern: /fastForward\(/, message: "Jump time forward with fastForward()." }
          ],
          forbids: [{ pattern: /waitForTimeout\(/, message: "Never wait in real time: fast-forward the clock." }]
        }
      }
    ],
    concepts: ["page.clock", "Locale & timezone", "Viewport", "Geolocation"],
    resources: [
      { label: "Clock", url: "https://playwright.dev/docs/clock" },
      { label: "Emulation", url: "https://playwright.dev/docs/emulation" }
    ],
    prerequisites: ["Web-first assertions"]
  }
];
