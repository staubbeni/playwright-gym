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
        goal: "Assert toHaveScreenshot(\"pricing-card.png\") on the pricing-card test id.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toHaveScreenshot\(/, message: "Use toHaveScreenshot()." }] }
      },
      {
        title: "Mask live data",
        goal: "Screenshot the dashboard-header test id while masking the live-stats element.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /mask:\s*\[/, message: "Mask the dynamic element." }] }
      },
      {
        title: "Stable full page",
        goal: "Take a fullPage screenshot with animations disabled and live-stats masked.",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /animations:\s*["']disabled["']/, message: "Disable animations." }] }
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
        goal: "Assert that the navigation \"Main\" matches an ARIA snapshot with links Home, Shop and Account.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toMatchAriaSnapshot\(/, message: "Use toMatchAriaSnapshot()." }] }
      },
      {
        title: "Dialog focus",
        goal: "Click \"Subscribe to newsletter\", assert the dialog \"Newsletter\" is visible and its Email field is focused, press Escape, and assert the dialog is hidden.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /toBeFocused\(/, message: "Use toBeFocused()." }] }
      },
      {
        title: "Accessible errors",
        goal: "Click \"Send message\" with an empty form. Assert that \"Contact email\" has aria-invalid=\"true\" and the accessible description \"Contact email is required.\".",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /toHaveAccessibleDescription\(/, message: "Use toHaveAccessibleDescription()." }] }
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
        goal: "Set the fixed time to 2026-03-01T08:00:00, open the page, and assert the greeting \"Good morning\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /page\.clock\./, message: "Use page.clock." }] }
      },
      {
        title: "Locale and timezone",
        goal: "In a describe with test.use({ locale: \"de-DE\", timezoneId: \"Europe/Berlin\" }) assert the price matches /1\\.234,50/ and the event time is \"14:00\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /locale:\s*["']de-DE["']/, message: "Emulate the de-DE locale." }] }
      },
      {
        title: "Phone with geolocation",
        goal: "Use a 390×844 viewport and geolocation 47.4979, 19.0402 (with permission). Assert the \"Open menu\" button is visible, then click \"Find nearest gym\" and assert \"Nearest gym: Budapest Central\".",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /geolocation:/, message: "Emulate geolocation." }] }
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
