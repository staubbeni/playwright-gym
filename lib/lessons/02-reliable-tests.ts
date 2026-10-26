import type { Lesson } from "./types.ts";

export const reliableTests: Lesson[] = [
  {
    id: "06-locator-strategy",
    module: "reliable-tests",
    title: "Locator strategy",
    shortDescription: "Filter, chain, count",
    description: "Pick one product out of a list of look-alike cards using filtering and chaining.",
    learningGoals: [
      "Narrow a list with filter({ hasText }) and filter({ has }).",
      "Chain locators to scope an action to one card.",
      "Count matches with toHaveCount."
    ],
    theory: `Real pages repeat the same structure many times: every product card has an "Add to cart" button. \`page.getByRole("button", { name: "Add to cart" })\` therefore matches eight elements, and clicking it throws a strictness error.

Scope the search instead. Find the card first and then the button inside it: \`page.getByRole("article").filter({ hasText: "Steel Kettlebell" }).getByRole("button", { name: "Add to cart" })\`. \`filter({ has: locator })\` keeps cards that *contain* a matching element, such as a "Sale" badge.

Priority list for choosing locators: role + name → label → placeholder/text → test id → CSS/XPath as a last resort. Avoid \`nth()\`, \`first()\`, and positional CSS like \`:nth-child\`: they encode the layout, not the meaning.`,
    goodExample: `page.getByRole("article")
  .filter({ hasText: "Steel Kettlebell" })
  .getByRole("button", { name: "Add to cart" })`,
    badExample: `page.locator(".grid > article:nth-child(7) button")`,
    commonMistakes: [
      "Using .first() to silence a strictness error. It hides the ambiguity instead of fixing it.",
      "Counting with locator.count() and expect(...).toBe(). Use toHaveCount, which retries.",
      "Matching by price or position when the product name is the stable identity."
    ],
    mission: "Add one specific product to the cart, count search results, and count sale items.",
    target: "/shop",
    practices: [
      {
        title: "Add one specific product",
        goal: "On /shop add \"Steel Kettlebell\" to the cart and assert the message \"Steel Kettlebell added to cart.\".",
        difficulty: "guided",
        rubric: {
          requires: [{ pattern: /\.filter\(/, message: "Scope the card with filter()." }],
          forbids: [{ pattern: /nth-child|\.nth\(/, message: "Avoid positional locators." }]
        }
      },
      {
        title: "Count search results",
        goal: "Search for \"mat\" in the \"Search products\" field and assert that exactly 2 product articles are shown.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /toHaveCount\(/, message: "Use toHaveCount()." }] }
      },
      {
        title: "Filter by a child element",
        goal: "Assert that exactly 3 products on the first page carry a \"Sale\" badge, using filter({ has }).",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /has:\s*page\./, message: "Use filter({ has: page.… })." }] }
      }
    ],
    concepts: ["Locator priority", "filter / chaining", "Strictness", "toHaveCount"],
    resources: [
      { label: "Locators: filtering", url: "https://playwright.dev/docs/locators#filtering-locators" },
      { label: "Best practices", url: "https://playwright.dev/docs/best-practices" }
    ],
    prerequisites: ["Selectors & click"]
  },
  {
    id: "07-assertions",
    module: "reliable-tests",
    title: "Web-first assertions",
    shortDescription: "State, value, count, soft",
    description: "Use the right retrying assertion for checked state, enabled state, values, and lists. Collect several failures with soft assertions.",
    learningGoals: [
      "Choose among toBeChecked, toBeEnabled/Disabled, toHaveValue, toHaveText and toHaveCount.",
      "Assert a negative state with .not or a dedicated matcher.",
      "Use expect.soft to report several problems in one run."
    ],
    theory: `Web-first assertions take a locator and **retry** until the condition holds or the timeout (5s by default) runs out. That is why \`await expect(checkbox).toBeChecked()\` is safe after a click, but \`expect(await checkbox.isChecked()).toBe(true)\` reads the state once and races the UI.

Pick the matcher that states your intent: \`toBeDisabled()\` reads better than \`not.toBeEnabled()\`, and \`toHaveValue("Ada")\` beats reading the input's value by hand. For lists, \`toHaveCount(n)\` and \`toHaveText(["a", "b"])\` check the whole set at once.

\`expect.soft(...)\` records a failure but lets the test continue, which is handy when checking several independent fields. Use \`expect.poll(() => fn())\` to retry a value that doesn't come from a locator, such as an API call.`,
    goodExample: `await expect(page.getByRole("button", { name: "Save profile" })).toBeDisabled();`,
    badExample: `expect(await page.getByRole("button").isDisabled()).toBe(true);`,
    commonMistakes: [
      "Wrapping a boolean snapshot (isVisible, isChecked) in expect().toBe().",
      "Using toContainText when you mean the exact text. A partial match can hide bugs.",
      "Asserting the same thing twice instead of the different states that matter."
    ],
    mission: "Prove that a checkbox, a disabled-until-valid button, and a tag list behave correctly.",
    target: "/play/07-assertions",
    practices: [
      {
        title: "Checked state",
        goal: "Check \"Enable notifications\" and assert both toBeChecked() and the status \"Notifications enabled.\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toBeChecked\(/, message: "Use toBeChecked()." }] }
      },
      {
        title: "Disabled until valid",
        goal: "Assert \"Save profile\" is disabled, fill Display name with \"Ada\", assert it is enabled and the field has value \"Ada\", save, and assert \"Profile saved for Ada.\".",
        difficulty: "independent",
        rubric: {
          requires: [
            { pattern: /toBeDisabled\(|not\.toBeEnabled\(/, message: "Assert the initial disabled state." },
            { pattern: /toHaveValue\(/, message: "Use toHaveValue() for the input." }
          ]
        }
      },
      {
        title: "Soft list assertions",
        goal: "Add the tags playwright, testing and qa. With expect.soft, assert the Tags list has 3 items, their texts in order, and the counter \"3 tags\".",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /expect\.soft\(/, message: "Use expect.soft()." }] }
      }
    ],
    concepts: ["Retrying matchers", "Negative assertions", "expect.soft", "expect.poll"],
    resources: [
      { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" },
      { label: "Locator assertions", url: "https://playwright.dev/docs/api/class-locatorassertions" }
    ],
    prerequisites: ["Forms & validation"]
  },
  {
    id: "08-auto-waiting",
    module: "reliable-tests",
    title: "Auto-waiting & loading",
    shortDescription: "No sleeps, ever",
    description: "Test pages that load data asynchronously, without a single fixed timeout.",
    learningGoals: [
      "Understand the actionability checks Playwright runs before every action.",
      "Wait for the final state with an assertion instead of a sleep.",
      "Let click() wait for a button to become enabled."
    ],
    theory: `Before every action Playwright waits until the element is **attached, visible, stable, enabled, and receives events**. A button that is disabled while stock is checked will be clicked as soon as it becomes enabled, with no extra code.

For data that appears later, assert the final state: \`await expect(page.getByRole("article")).toHaveCount(8)\` waits for the products to load. A \`page.waitForTimeout(3000)\` is wrong twice: too slow when the app is fast, and flaky when it is slower than usual.

When you need to wait for something that isn't visible, wait for that specific event: \`page.waitForResponse\`, \`page.waitForURL\`, or \`expect.poll\`.`,
    goodExample: `await page.getByRole("button", { name: "Show reviews" }).click();
await expect(page.getByRole("list", { name: "Reviews" }).getByRole("listitem")).toHaveCount(3);`,
    badExample: `await page.waitForTimeout(3000);
expect(await page.locator(".review").count()).toBe(3);`,
    commonMistakes: [
      "Adding waitForTimeout to fix flakiness. It moves the race, it doesn't remove it.",
      "Using waitForLoadState(\"networkidle\") in a single-page app.",
      "Asserting the loading indicator but never the loaded content."
    ],
    mission: "Wait for the catalog, lazy-loaded reviews, and a stock check, all without sleeps.",
    target: "/shop",
    practices: [
      {
        title: "Wait for the catalog",
        goal: "Open /shop and assert that 8 product articles appear and that \"Loading products...\" is hidden.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /toBeHidden\(|not\.toBeVisible\(/, message: "Assert the loading text disappears." }] }
      },
      {
        title: "Lazy reviews",
        goal: "On /shop/products/steel-kettlebell click \"Show reviews\" and assert the first review says \"Solid grip and perfect weight.\".",
        difficulty: "independent"
      },
      {
        title: "Click when enabled",
        goal: "On the same product page click \"Add to cart\" (disabled while stock is checked) and assert the header link shows \"Cart (1)\". Don't add any waits.",
        difficulty: "challenge",
        rubric: {
          forbids: [
            { pattern: /waitForSelector|waitForFunction/, message: "No manual waits: click() auto-waits." },
            { pattern: /force:\s*true/, message: "Do not force the click." }
          ]
        }
      }
    ],
    concepts: ["Actionability", "Web-first assertions", "No fixed sleeps"],
    resources: [
      { label: "Auto-waiting", url: "https://playwright.dev/docs/actionability" },
      { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" }
    ],
    prerequisites: ["Web-first assertions"]
  },
  {
    id: "09-toast",
    module: "reliable-tests",
    title: "Transient UI & toasts",
    shortDescription: "Catch what disappears",
    description: "Assert notifications that appear briefly, disappear on their own, or offer an undo action.",
    learningGoals: [
      "Assert a toast before it disappears.",
      "Assert that something goes away with toBeHidden.",
      "Interact with an action inside a toast."
    ],
    theory: `Toasts appear for a moment and leave. Because web-first assertions start polling immediately, \`await expect(toast).toBeVisible()\` right after the click catches it. Don't put a sleep in between: you may wait past the moment it disappears.

Disappearing is behavior too. A toast that never closes covers the UI. \`await expect(toast).toBeHidden()\` waits for it to leave.

Toasts often have accessible roles (\`status\` or \`alert\`). Scope your locator to the notification region so you don't match other status messages on the page.`,
    goodExample: `const toast = page.getByRole("region", { name: "Notifications" }).getByRole("status");
await expect(toast).toHaveText("Preferences saved.");
await expect(toast).toBeHidden();`,
    badExample: `await page.waitForTimeout(2500);
await expect(page.getByText("Preferences saved.")).toBeVisible();`,
    commonMistakes: [
      "Sleeping before asserting a toast: by then it may be gone.",
      "Never checking that the toast closes.",
      "Clicking Undo but asserting the toast instead of the restored content."
    ],
    mission: "Verify the save toast appears and disappears, and that Undo restores a deleted draft.",
    target: "/play/09-toast",
    practices: [
      {
        title: "Toast appears",
        goal: "Click \"Save preferences\" and assert the toast text \"Preferences saved.\".",
        difficulty: "guided"
      },
      {
        title: "Toast disappears",
        goal: "Assert that the same toast is visible and then hidden again.",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /toBeHidden\(/, message: "Use toBeHidden()." }] }
      },
      {
        title: "Undo from a toast",
        goal: "Click \"Delete draft\", click \"Undo\" in the toast, and assert the draft \"Weekly plan\" is visible again.",
        difficulty: "challenge"
      }
    ],
    concepts: ["Transient UI", "ARIA live regions", "toBeHidden"],
    resources: [
      { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" },
      { label: "Test user-visible behavior", url: "https://playwright.dev/docs/best-practices#test-user-visible-behavior" }
    ],
    prerequisites: ["Auto-waiting & loading"]
  },
  {
    id: "10-keyboard-mouse",
    module: "reliable-tests",
    title: "Keyboard, hover & drag",
    shortDescription: "Beyond click and fill",
    description: "Drive a command palette with shortcuts, reveal a tooltip on hover, and drag a card between columns.",
    learningGoals: [
      "Send key combinations with press().",
      "Trigger hover-only UI.",
      "Drag and drop with dragTo()."
    ],
    theory: `\`locator.press("Enter")\` and \`page.keyboard.press("Control+K")\` send real keyboard events. Combine modifiers with \`+\`. \`ControlOrMeta+K\` picks Cmd on macOS and Ctrl elsewhere. Use \`pressSequentially\` only when the app reacts to each keystroke; \`fill\` is faster otherwise.

\`hover()\` moves the mouse over an element, which is how tooltips and hover menus open. Assert the tooltip by its role: \`getByRole("tooltip")\`.

\`source.dragTo(target)\` performs a full drag: mouse down, move, mouse up. It works for HTML5 drag and drop as well as pointer-based libraries. For custom gestures, \`page.mouse\` gives you down/move/up control.`,
    goodExample: `await page.getByText("Write tests").dragTo(page.getByRole("list", { name: "Done" }));`,
    badExample: `await page.mouse.move(412, 233); await page.mouse.down(); // pixel coordinates`,
    commonMistakes: [
      "Pressing a global shortcut before the app is ready. page.keyboard has no element to wait for, so wait for a ready signal first.",
      "Hardcoding pixel coordinates for drag and drop.",
      "Typing into the page instead of a focused element.",
      "Asserting the tooltip text with getByText, which also matches hidden copies."
    ],
    mission: "Open the command palette with a shortcut, read a hover tooltip, and move a kanban card.",
    target: "/play/10-keyboard-mouse",
    practices: [
      {
        title: "Keyboard shortcut",
        goal: "Press ControlOrMeta+K, type \"cart\" in the Command field, press Enter, and assert \"Opened: Cart\".",
        difficulty: "guided",
        hint: "Global shortcuts only work once the page's JavaScript is running. Wait for \"Keyboard shortcuts ready\" before pressing keys: page-level key presses have no element to auto-wait for.",
        rubric: { requires: [{ pattern: /press\(/, message: "Use press() for the shortcut." }] }
      },
      {
        title: "Hover tooltip",
        goal: "Hover the button \"About the Pro plan\" and assert the tooltip \"Includes unlimited projects.\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /\.hover\(/, message: "Use hover()." }] }
      },
      {
        title: "Drag and drop",
        goal: "Drag \"Write tests\" from To do into the Done list. Assert that it is in Done and no longer in To do.",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /dragTo\(/, message: "Use dragTo()." }] }
      }
    ],
    concepts: ["press / keyboard", "hover", "dragTo"],
    resources: [
      { label: "Actions: keys", url: "https://playwright.dev/docs/input#keys-and-shortcuts" },
      { label: "Drag and drop", url: "https://playwright.dev/docs/input#drag-and-drop" }
    ],
    prerequisites: ["Selectors & click"]
  },
  {
    id: "11-dialogs-files",
    module: "reliable-tests",
    title: "Dialogs, uploads & downloads",
    shortDescription: "Browser-native interactions",
    description: "Accept a confirm dialog, upload a file from memory, and verify a downloaded CSV.",
    learningGoals: [
      "Handle native dialogs with page.once(\"dialog\").",
      "Upload files with setInputFiles.",
      "Capture and inspect a download."
    ],
    theory: `Native \`alert\`, \`confirm\`, and \`prompt\` dialogs are dismissed automatically unless you handle them. Register the handler **before** the click that opens the dialog: \`page.once("dialog", (dialog) => dialog.accept())\`. Inside the handler you can also check \`dialog.message()\`.

\`locator.setInputFiles()\` uploads files without a file picker. Pass a path, or an object \`{ name, mimeType, buffer }\` to create the file in memory.

Downloads are events. Start waiting first, then click: \`const downloadPromise = page.waitForEvent("download")\`. The returned \`Download\` gives you \`suggestedFilename()\` and \`path()\` to read the file contents.`,
    goodExample: `const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Export CSV" }).click();
const download = await downloadPromise;`,
    badExample: `await page.getByRole("button", { name: "Export CSV" }).click();
const download = await page.waitForEvent("download"); // may miss the event`,
    commonMistakes: [
      "Registering the dialog handler after the click.",
      "Using page.on instead of page.once, so the handler leaks into later dialogs.",
      "Only checking that a download happened, not its name or content."
    ],
    mission: "Delete an account through a confirm dialog, upload an avatar, and verify an exported CSV.",
    target: "/play/11-dialogs-files",
    practices: [
      {
        title: "Confirm dialog",
        goal: "Accept the dialog opened by \"Delete account\" (assert its message contains \"cannot be undone\") and assert \"Account deleted.\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /["']dialog["']/, message: "Handle the dialog event." }] }
      },
      {
        title: "Upload a file",
        goal: "Upload an in-memory avatar.png through \"Upload avatar\" and assert the text starts with \"Uploaded avatar.png\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /setInputFiles\(/, message: "Use setInputFiles()." }] }
      },
      {
        title: "Inspect a download",
        goal: "Download via \"Export CSV\". Assert the filename is report.csv and the content starts with \"id,name,score\".",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /["']download["']/, message: "Wait for the download event." }] }
      }
    ],
    concepts: ["Dialog events", "setInputFiles", "Download events"],
    resources: [
      { label: "Dialogs", url: "https://playwright.dev/docs/dialogs" },
      { label: "Upload files", url: "https://playwright.dev/docs/input#upload-files" },
      { label: "Downloads", url: "https://playwright.dev/docs/downloads" }
    ],
    prerequisites: ["Keyboard, hover & drag"]
  }
];
