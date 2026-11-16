import type { PythonLesson } from "../types.ts";

export const realWorld: Record<string, PythonLesson> = {
  "12-iframe": {
    concepts: ["frame_locator", "content_frame", "postMessage"],
    goodExample: `frame = page.get_by_title("Payment form").content_frame
frame.get_by_label("Card number").fill("4242424242424242")`,
    badExample: `page.get_by_label("Card number").fill("4242...")  # not inside the frame`,
    commonMistakes: [
      "Searching the main page for elements that live in the frame.",
      "Selecting the frame by index (page.frames[1]).",
      "Only asserting inside the frame and missing a broken host page."
    ],
    practices: [
      {
        rubric: { requires: [{ pattern: /content_frame|frame_locator\(/, message: "Scope your locators to the frame with content_frame or frame_locator()." }] }
      },
      {
        goal: "The frame validates both fields. Prove that card number 1234 is rejected with \"Card number must be 16 digits.\" and that a valid card with expiry 13/99 is rejected with \"Expiry must be MM/YY.\"."
      },
      {
        goal: "Pay successfully and prove both the frame (\"Payment confirmed.\") and the host page (\"Order paid.\") agree. Then click the host's \"Start over\" button and prove the frame is back to \"Ready for payment.\" and the host to \"Awaiting payment.\".",
        hint: "Start over reloads the frame: take a fresh locator or reuse the frame locator, which re-resolves."
      }
    ]
  },
  "13-shadow-dom": {
    goodExample: `page.get_by_label("Display name").fill("Grace Hopper")`,
    badExample: `page.evaluate("document.querySelector('user-settings').shadowRoot.querySelector('input').value = 'x'")`,
    practices: [
      {},
      {
        goal: "Both fields live in the shadow root. In one test choose Theme \"Dark\", set the name \"Grace Hopper\", save once, and prove both saved lines.",
        rubric: { requires: [{ pattern: /select_option\(/, message: "Use select_option() for the theme." }] }
      },
      {
        goal: "The avatar is a component inside the component. Save \"Grace Hopper\" and prove the avatar shows GH; then save \"Plato\" and prove it shows P. Find it by its accessible name: no shadow-piercing selectors.",
        hint: "get_by_label(\"Avatar\") already sees through open shadow roots. to_have_text is exact, so the case matters.",
        rubric: { forbids: [{ pattern: />>|css=|shadow_root|\.locator\(/, message: "Use get_by_label/get_by_role: Playwright pierces open shadow roots for you." }] }
      }
    ]
  },
  "14-popups": {
    theory: `A popup or a \`target="_blank"\` link opens a new **Page** in the same browser context. Wrap the click in \`page.expect_popup()\`, so Playwright is listening before the event can fire:
\`with page.expect_popup() as popup_info: link.click()\`, then \`popup = popup_info.value\`.

The popup is a full Page: locate, act, and assert on it. When it closes and reports back to the opener, switch your assertions back to \`page\`. \`context.expect_page()\` catches any new page in the context, including ones not opened by a specific page.`,
    learningGoals: [
      "Wait for the popup with expect_popup() around the click.",
      "Use the popup Page object like any other page.",
      "Handle target=_blank links."
    ],
    goodExample: `with page.expect_popup() as popup_info:
    page.get_by_role("button", name="Open payment window").click()
popup = popup_info.value`,
    badExample: `page.get_by_role("button", name="Open payment window").click()
expect(page.get_by_text("Payment window")).to_be_visible()  # wrong page`,
    commonMistakes: [
      "Clicking outside the expect_popup() block, so the event can fire before you listen.",
      "Looking for popup content on the original page.",
      "Forgetting that the popup may close itself, so popup locators fail afterwards."
    ],
    practices: [
      {
        rubric: { requires: [{ pattern: /expect_popup\(/, message: "Wrap the click in page.expect_popup()." }] }
      },
      {
        goal: "In the popup click \"Approve payment\". Prove the original page says \"Payment approved.\" and that the popup closed itself.",
        hint: "Start listening for the popup's close event before the click that triggers it: `with popup.expect_event(\"close\"):`, or popup.is_closed() inside a retry loop.",
        rubric: { requires: [{ pattern: /close|is_closed/, message: "Prove the popup closed." }] }
      },
      {
        goal: "Open the payment popup (don't approve it) and, in the same test, the terms link. Prove the terms tab has the URL /popup/terms and the heading \"Terms of service\", and that the opener still says \"Waiting for approval...\" afterwards.",
        hint: "Each window is its own Page object. Wait for each popup separately with its own expect_popup() and assert on the right page.",
        rubric: { requires: [{ pattern: /expect_popup\([\s\S]*expect_popup\(/, message: "Wait for each popup separately." }] }
      }
    ]
  },
  "15-network-mocking": {
    theory: `\`page.route(url, handler)\` intercepts matching requests. Register it **before** the page makes the request, usually before \`goto\`. In the handler you can \`route.fulfill(json=...)\` to answer yourself, \`route.abort()\` to simulate a network failure, or \`route.fetch()\` to get the real response and change it.

Mocking makes edge cases deterministic: an empty list, a 500 error, or a product that costs nothing. The Gym Shop catalog calls \`GET /api/shop/products\`, which returns \`{"items": [{"id", "name", "price", "category", "sale"}], "total", "page", "pages"}\`.

Use a glob like \`"**/api/shop/products*"\` so query strings still match. \`page.expect_request()\` and \`page.expect_response()\` wait for a specific call, so you can check what the page *sent* (for example the search query), not just what it displays. Open the \`with\` block **before** the action that triggers the call.`,
    goodExample: `page.route("**/api/shop/products*", lambda route: route.fulfill(
    json={"items": [...], "total": 1, "page": 1, "pages": 1}))`,
    badExample: `# Hoping the real backend returns the edge case you want to test`,
    practices: [
      { rubric: { requires: [{ pattern: /route\.fulfill\(/, message: "Use route.fulfill()." }] } },
      {
        hint: "A later page.route() for the same URL wins over an earlier one, so you can re-route and reload inside one test.",
        rubric: { requires: [{ pattern: /route\.abort\(/, message: "Simulate the network failure with route.abort()." }] }
      },
      {
        hint: "Wrap the action that causes the call: `with page.expect_request(...) as request_info:`.",
        rubric: {
          requires: [
            { pattern: /route\.fetch\(/, message: "Use route.fetch() to patch the real response." },
            { pattern: /expect_(request|response)\(/, message: "Use page.expect_request() or page.expect_response() to check the call." }
          ]
        }
      }
    ]
  },
  "16-api-testing": {
    concepts: ["api_request_context", "page.request", "API seeding"],
    theory: `An \`APIRequestContext\` is an HTTP client that uses \`base_url\` and sends no browser. This repo's \`conftest.py\` provides one as the \`api_request_context\` fixture: \`response = api_request_context.get("/api/shop/products")\`, then \`assert response.status == 200\`.

\`page.request\` is the same client but **shares cookies with the page's context**. Use it to set up state quickly (add items to the cart, log in) and then open the page to check how the UI shows that state. Setting up through the API is faster and more reliable than clicking through the UI every time.

Assert API responses directly: \`response.status\`, \`response.json()\`, and \`expect(response).to_be_ok()\`.`,
    learningGoals: [
      "Send requests with the api_request_context fixture.",
      "Seed state via API, then verify it in the UI.",
      "Assert status codes and JSON bodies.",
      "Test the error contract: 400 vs 401 vs 404."
    ],
    goodExample: `page.request.post("/api/shop/cart", data={"productId": "yoga-mat", "quantity": 2})
page.goto("/shop/cart")`,
    badExample: `# Clicking through the catalog in every test just to get one item in the cart`,
    commonMistakes: [
      "Using api_request_context to seed data for a page. It has its own cookies, so use page.request.",
      "Only checking the status code and ignoring the body.",
      "Testing only the happy path of an endpoint."
    ],
    practices: [
      { rubric: { requires: [{ pattern: /api_request_context\.get\(/, message: "Use api_request_context.get()." }] } },
      { rubric: { requires: [{ pattern: /page\.request\.post\(/, message: "Seed with page.request so the cookie is shared." }] } },
      {
        hint: "`expect(response).to_be_ok()` is the positive check; compare `response.json()` with a dict, or check single keys, to pin the body.",
        rubric: { requires: [{ pattern: /to_be_ok\(/, message: "Use expect(response).to_be_ok() for the success cases." }] }
      }
    ]
  },
  "17-auth-storage": {
    concepts: ["Storage state", "Session fixtures", "Session boundaries"],
    theory: `Logging in through the UI in every test is slow. Instead, log in once (via UI or API), save the context state with \`context.storage_state(path=...)\`, and start other contexts from it: \`browser.new_context(storage_state=path)\`.

In a real suite this happens in a **fixture** (module- or session-scoped, often in \`conftest.py\`): it logs in once and writes the state file. Tests that want the session open a context with \`browser.new_context(storage_state=path)\`; tests that use the plain \`page\` fixture stay logged out. You can also override pytest-playwright's \`browser_context_args\` fixture to add \`"storage_state": path\` so every test starts logged in.

Still test the boundary itself at least once: valid login reaches the account, invalid login is rejected, and signing out really ends the session.`,
    learningGoals: [
      "Test the login and logout boundary.",
      "Save cookies and localStorage with storage_state().",
      "Start tests that are already logged in, and others that are explicitly logged out."
    ],
    goodExample: `page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
page.context.storage_state(path=state_path)`,
    badExample: `# Every test: goto login, fill username, fill password, click Sign in...`,
    practices: [
      {},
      {},
      {
        goal: "Write a module-scoped fixture that logs in through the API and saves the session with `context.storage_state(path=...)`. Then make one file hold two tests: one that starts a context from that saved state and is logged in, and one with a fresh context that is logged out and is sent to the login page.",
        hint: "Create contexts yourself with `browser.new_context(storage_state=path)`. A plain `page` fixture starts without any session. Use `tmp_path_factory` for a module-scoped temp folder.",
        rubric: {
          requires: [
            { pattern: /@pytest\.fixture/, message: "Log in once in a fixture." },
            { pattern: /storage_state\(/, message: "Save the state with storage_state()." },
            { pattern: /new_context\([^)]*storage_state/, message: "Create a context with storage_state=." }
          ]
        }
      }
    ]
  }
};
