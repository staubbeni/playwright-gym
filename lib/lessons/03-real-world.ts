import type { Lesson } from "./types.ts";

export const realWorld: Lesson[] = [
  {
    id: "12-iframe",
    module: "real-world",
    title: "iFrames",
    shortDescription: "Locate inside embedded documents",
    description: "Pay through an embedded card form and verify results inside the frame and on the parent page.",
    learningGoals: [
      "Scope locators to an iframe with frameLocator or contentFrame.",
      "Assert inside and outside the frame in one test.",
      "Test validation that lives inside a third-party frame."
    ],
    theory: `An iframe is a separate document. Locators on \`page\` don't look inside it. Enter it explicitly: \`page.frameLocator("iframe[title='Payment form']")\`, or the more readable \`page.getByTitle("Payment form").contentFrame()\`. Everything after that works as usual: \`frame.getByLabel("Card number").fill(...)\`.

Payment providers, embedded editors, and widgets typically communicate with the host page through \`postMessage\`. A good test checks both sides: the frame's own confirmation, and the effect on the parent page.`,
    goodExample: `const frame = page.getByTitle("Payment form").contentFrame();
await frame.getByLabel("Card number").fill("4242424242424242");`,
    badExample: `await page.getByLabel("Card number").fill("4242..."); // not inside the frame`,
    commonMistakes: [
      "Searching the main page for elements that live in the frame.",
      "Selecting the frame by index (page.frames()[1]).",
      "Only asserting inside the frame and missing a broken host page."
    ],
    mission: "Pay with a valid card, reject an invalid one, and confirm that the host page learns about the payment.",
    target: "/play/12-iframe",
    practices: [
      {
        title: "Pay inside the frame",
        goal: "Fill Card number 4242424242424242 and Expiry 12/30, click Pay now, and assert \"Payment confirmed.\" inside the frame.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /contentFrame\(|frameLocator\(/, message: "Scope your locators to the frame with contentFrame() or frameLocator()." }] }
      },
      {
        title: "Validation inside the frame",
        goal: "The frame validates both fields. Prove that card number 1234 is rejected with \"Card number must be 16 digits.\" and that a valid card with expiry 13/99 is rejected with \"Expiry must be MM/YY.\".",
        difficulty: "independent",
        bugs: ["A short card number is accepted", "A malformed expiry is accepted"]
      },
      {
        title: "Frame and host talk",
        goal: "Pay successfully and prove both the frame (\"Payment confirmed.\") and the host page (\"Order paid.\") agree. Then click the host's \"Start over\" button and prove the frame is back to \"Ready for payment.\" and the host to \"Awaiting payment.\".",
        difficulty: "challenge",
        hint: "Start over reloads the frame: take a fresh locator or reuse the frame locator, which re-resolves.",
        bugs: ["The host ignores the payment message", "Start over doesn't reset the host's status"]
      }
    ],
    concepts: ["FrameLocator", "contentFrame", "postMessage"],
    resources: [{ label: "Frames", url: "https://playwright.dev/docs/frames" }],
    prerequisites: ["Forms & validation"]
  },
  {
    id: "13-shadow-dom",
    module: "real-world",
    title: "Shadow DOM",
    shortDescription: "Web components",
    description: "Interact with a web component and a nested component inside its shadow root.",
    learningGoals: [
      "Know that Playwright locators pierce open shadow roots.",
      "Interact with controls inside a component.",
      "Assert state rendered by a nested component."
    ],
    theory: `Web components hide their markup in a **shadow root**. \`document.querySelector\` can't see inside, but Playwright's locators (except XPath) pierce *open* shadow roots automatically. \`getByLabel("Display name")\` finds the input inside \`<user-settings>\` without special syntax.

Components often report changes through custom events that the host page renders. Test the user-visible result on both levels: the component's own UI and the page around it. Nested components are just more shadow roots, and the same locators work.`,
    goodExample: `await page.getByLabel("Display name").fill("Grace Hopper");`,
    badExample: `await page.evaluate(() => document.querySelector("user-settings")!.shadowRoot!.querySelector("input")!.value = "x");`,
    commonMistakes: [
      "Reaching into shadowRoot with page.evaluate. It skips real user events.",
      "Using XPath, which does not pierce shadow roots.",
      "Assuming closed shadow roots work too (they don't)."
    ],
    mission: "Save a name and a theme inside the component and check the initials rendered by a nested avatar component.",
    target: "/play/13-shadow-dom",
    practices: [
      {
        title: "Fill inside the component",
        goal: "Set Display name to \"Grace Hopper\", click \"Save settings\", and assert \"Saved name: Grace Hopper\".",
        difficulty: "guided"
      },
      {
        title: "Name and theme together",
        goal: "Both fields live in the shadow root. In one test choose Theme \"Dark\", set the name \"Grace Hopper\", save once, and prove both saved lines.",
        difficulty: "independent",
        bugs: ["The name isn't saved", "The theme isn't saved"],
        rubric: { requires: [{ pattern: /selectOption\(/, message: "Use selectOption() for the theme." }] }
      },
      {
        title: "Avatar initials",
        goal: "The avatar is a component inside the component. Save \"Grace Hopper\" and prove the avatar shows GH; then save \"Plato\" and prove it shows P. Find it by its accessible name: no shadow-piercing selectors.",
        difficulty: "challenge",
        hint: "getByLabel(\"Avatar\") already sees through open shadow roots. toHaveText is exact, so the case matters.",
        bugs: ["The initials don't update after saving", "The initials come out lowercase"],
        rubric: { forbids: [{ pattern: />>|css=|shadowRoot|\.locator\(/, message: "Use getByLabel/getByRole: Playwright pierces open shadow roots for you." }] }
      }
    ],
    concepts: ["Open shadow roots", "Custom elements", "Custom events"],
    resources: [{ label: "Locators & shadow DOM", url: "https://playwright.dev/docs/locators#locate-in-shadow-dom" }],
    prerequisites: ["Forms & validation"]
  },
  {
    id: "14-popups",
    module: "real-world",
    title: "Popups & new tabs",
    shortDescription: "Multiple pages",
    description: "Catch popup windows and new tabs, interact with them, and verify how they talk back to the opener.",
    learningGoals: [
      "Wait for the popup event before clicking.",
      "Use the popup Page object like any other page.",
      "Handle target=_blank links."
    ],
    theory: `A popup or a \`target="_blank"\` link opens a new **Page** in the same browser context. Start waiting for it before the click, so the event can't fire before you're listening:

\`const popupPromise = page.waitForEvent("popup"); await link.click(); const popup = await popupPromise;\`

The popup is a full Page: locate, act, and assert on it. When it closes and reports back to the opener, switch your assertions back to \`page\`. \`context.waitForEvent("page")\` catches any new page in the context, including ones not opened by a specific page.`,
    goodExample: `const popupPromise = page.waitForEvent("popup");
await page.getByRole("button", { name: "Open payment window" }).click();
const popup = await popupPromise;`,
    badExample: `await page.getByRole("button", { name: "Open payment window" }).click();
await expect(page.getByText("Payment window")).toBeVisible(); // wrong page`,
    commonMistakes: [
      "Awaiting waitForEvent after the click.",
      "Looking for popup content on the original page.",
      "Forgetting that the popup may close itself, so popup locators fail afterwards."
    ],
    mission: "Open and approve a payment popup, then follow a link that opens in a new tab.",
    target: "/play/14-popups",
    practices: [
      {
        title: "Catch the popup",
        goal: "Click \"Open payment window\" and assert the popup heading \"Payment window\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /waitForEvent\(["']popup/, message: "Wait for the popup event before clicking." }] }
      },
      {
        title: "Approve and close",
        goal: "In the popup click \"Approve payment\". Prove the original page says \"Payment approved.\" and that the popup closed itself.",
        difficulty: "independent",
        hint: "Start listening for the popup's close event before the click that triggers it: popup.waitForEvent(\"close\") or popup.isClosed() in a retrying assertion.",
        bugs: ["The opener never hears about the approval", "The popup stays open after approving"],
        rubric: { requires: [{ pattern: /close|isClosed/, message: "Prove the popup closed." }] }
      },
      {
        title: "Two windows at once",
        goal: "Open the payment popup (don't approve it) and, in the same test, the terms link. Prove the terms tab has the URL /popup/terms and the heading \"Terms of service\", and that the opener still says \"Waiting for approval...\" afterwards.",
        difficulty: "challenge",
        hint: "Each window is its own Page object. Wait for each popup event separately and assert on the right page.",
        bugs: ["The terms link opens the payment window", "Opening the terms resets the payment status"],
        rubric: { requires: [{ pattern: /waitForEvent\(["']popup[\s\S]*waitForEvent\(["']popup/, message: "Wait for each popup separately." }] }
      }
    ],
    concepts: ["Page events", "Popups", "Multiple pages"],
    resources: [{ label: "Pages", url: "https://playwright.dev/docs/pages" }],
    prerequisites: ["Selectors & click"]
  },
  {
    id: "15-network-mocking",
    module: "real-world",
    title: "Network mocking",
    shortDescription: "Control API responses",
    description: "Intercept the Gym Shop product API to render mocked data, error states, and modified responses.",
    learningGoals: [
      "Fulfill a request with your own JSON.",
      "Simulate server errors to test error UI.",
      "Patch a real response with route.fetch()."
    ],
    theory: `\`page.route(url, handler)\` intercepts matching requests. Register it **before** the page makes the request, usually before \`goto\`. In the handler you can \`route.fulfill({ json })\` to answer yourself, \`route.abort()\` to simulate a network failure, or \`route.fetch()\` to get the real response and change it.

Mocking makes edge cases deterministic: an empty list, a 500 error, or a product that costs nothing. The Gym Shop catalog calls \`GET /api/shop/products\`, which returns \`{ items: [{ id, name, price, category, sale }], total, page, pages }\`.

Use a glob like \`"**/api/shop/products*"\` so query strings still match. \`page.waitForResponse\` lets you wait for a specific call when you need its timing.`,
    goodExample: `await page.route("**/api/shop/products*", (route) =>
  route.fulfill({ json: { items: [...], total: 1, page: 1, pages: 1 } }));`,
    badExample: `// Hoping the real backend returns the edge case you want to test`,
    commonMistakes: [
      "Registering the route after goto, so the request already went through.",
      "Mocking so much that the test only tests the mock.",
      "Not asserting that the UI actually used the mocked data."
    ],
    mission: "Render a mocked catalog, show the error state for a 500, and display a free product.",
    target: "/shop",
    practices: [
      {
        title: "Fulfill with JSON",
        goal: "Mock the products API with one product named \"Mocked Dumbbell\" and assert that exactly one article with that name is shown.",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /route\.fulfill\(/, message: "Use route.fulfill()." }] }
      },
      {
        title: "Server error",
        goal: "Fulfill the products API with status 500 and assert the alert \"Could not load products. Please try again.\".",
        difficulty: "independent"
      },
      {
        title: "Modify a real response",
        goal: "Use route.fetch() and set the first item's price to 0. Assert that the product shows the price \"Free\".",
        difficulty: "challenge",
        rubric: { requires: [{ pattern: /route\.fetch\(/, message: "Use route.fetch()." }] }
      }
    ],
    concepts: ["page.route", "fulfill / abort / fetch", "Error states"],
    resources: [
      { label: "Mock APIs", url: "https://playwright.dev/docs/mock" },
      { label: "Network", url: "https://playwright.dev/docs/network" }
    ],
    prerequisites: ["Auto-waiting & loading"]
  },
  {
    id: "16-api-testing",
    module: "real-world",
    title: "API testing",
    shortDescription: "request fixture",
    description: "Call the Gym Shop API directly, seed data for UI tests, and check error responses.",
    learningGoals: [
      "Send requests with the request fixture.",
      "Seed state via API, then verify it in the UI.",
      "Assert status codes and JSON bodies."
    ],
    theory: `The \`request\` fixture is an HTTP client that uses \`baseURL\` and sends no browser. It's ideal for API tests: \`const res = await request.get("/api/shop/products"); expect(res.status()).toBe(200);\`.

\`page.request\` is the same client but **shares cookies with the page's context**. Use it to set up state quickly (add items to the cart, log in) and then open the page to check how the UI shows that state. Setting up through the API is faster and more reliable than clicking through the UI every time.

Assert API responses directly: \`expect(res.ok()).toBeTruthy()\`, \`await res.json()\`, and \`expect(res).toBeOK()\`.`,
    goodExample: `await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat", quantity: 2 } });
await page.goto("/shop/cart");`,
    badExample: `// Clicking through the catalog in every test just to get one item in the cart`,
    commonMistakes: [
      "Using the request fixture to seed data for a page. It has its own cookies, so use page.request.",
      "Only checking the status code and ignoring the body.",
      "Testing only the happy path of an endpoint."
    ],
    mission: "Check the products endpoint, seed a cart through the API, and verify login error responses.",
    target: "/api/shop/products",
    practices: [
      {
        title: "GET and assert JSON",
        goal: "GET /api/shop/products, assert status 200, total 12, and that some item is named \"Steel Kettlebell\".",
        difficulty: "guided",
        rubric: { requires: [{ pattern: /request\.get\(/, message: "Use request.get()." }] }
      },
      {
        title: "Seed via API, verify in UI",
        goal: "POST {productId: \"yoga-mat\", quantity: 2} to /api/shop/cart with page.request, open /shop/cart, and assert the quantity 2 and total \"$58.00\".",
        difficulty: "independent",
        rubric: { requires: [{ pattern: /page\.request\.post\(/, message: "Seed with page.request so the cookie is shared." }] }
      },
      {
        title: "Negative API test",
        goal: "POST wrong credentials to /api/shop/login and assert 401 with error \"Invalid username or password.\". Then assert student/playwright returns 200.",
        difficulty: "challenge"
      }
    ],
    concepts: ["request fixture", "page.request", "API seeding"],
    resources: [
      { label: "API testing", url: "https://playwright.dev/docs/api-testing" },
      { label: "APIRequestContext", url: "https://playwright.dev/docs/api/class-apirequestcontext" }
    ],
    prerequisites: ["Network mocking"]
  },
  {
    id: "17-auth-storage",
    module: "real-world",
    title: "Authentication & storage state",
    shortDescription: "Log in once, reuse it",
    description: "Log in through the UI, sign out, and reuse a saved storage state in a new context.",
    learningGoals: [
      "Test the login and logout boundary.",
      "Save cookies and localStorage with storageState().",
      "Start a new context that is already logged in."
    ],
    theory: `Logging in through the UI in every test is slow. Instead, log in once (via UI or API), save the context state with \`context.storageState({ path })\`, and start other contexts from it: \`browser.newContext({ storageState: path })\`.

In a real suite this happens in a **setup project**: \`auth.setup.ts\` logs in and writes \`playwright/.auth/user.json\`, and other projects declare \`dependencies: ["setup"]\` and \`use: { storageState: "playwright/.auth/user.json" }\`.

Still test the boundary itself at least once: valid login reaches the account, invalid login is rejected, and signing out really ends the session.`,
    goodExample: `await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
await page.context().storageState({ path: statePath });`,
    badExample: `// Every test: goto login, fill username, fill password, click Sign in...`,
    commonMistakes: [
      "Committing storage state files with real credentials.",
      "Never testing logout.",
      "Sharing one logged-in page between tests instead of one storage state."
    ],
    mission: "Log in through the form, prove that sign-out ends the session, and reuse a saved session in a fresh context.",
    target: "/shop/login",
    practices: [
      {
        title: "Log in through the UI",
        goal: "Sign in as student / playwright and assert the URL /shop/account, the heading \"My account\", and \"Signed in as student\".",
        difficulty: "guided"
      },
      {
        title: "Sign out ends the session",
        goal: "After logging in click \"Sign out\", then open /shop/account and assert you land on /shop/login.",
        difficulty: "independent"
      },
      {
        title: "Reuse storage state",
        goal: "Log in via page.request, save storageState to test.info().outputPath(\"state.json\"), create a new context from it, and assert that /shop/account shows \"Signed in as student\".",
        difficulty: "challenge",
        rubric: {
          requires: [
            { pattern: /storageState\(/, message: "Save the state with storageState()." },
            { pattern: /newContext\(\s*\{[\s\S]*storageState/, message: "Create a context with storageState." }
          ]
        }
      }
    ],
    concepts: ["Storage state", "Setup projects", "Session boundaries"],
    resources: [
      { label: "Authentication", url: "https://playwright.dev/docs/auth" },
      { label: "Browser contexts", url: "https://playwright.dev/docs/browser-contexts" }
    ],
    prerequisites: ["API testing"]
  }
];
