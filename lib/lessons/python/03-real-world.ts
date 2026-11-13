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
      { rubric: { requires: [{ pattern: /frame_locator\(|content_frame/, message: "Scope to the frame." }] } },
      {},
      {}
    ]
  },
  "13-shadow-dom": {
    goodExample: `page.get_by_label("Display name").fill("Grace Hopper")`,
    badExample: `page.evaluate("document.querySelector('user-settings').shadowRoot.querySelector('input').value = 'x'")`,
    practices: [{}, { rubric: { requires: [{ pattern: /select_option\(/, message: "Use select_option()." }] } }, {}]
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
      { rubric: { requires: [{ pattern: /expect_popup\(|expect_page\(/, message: "Wait for the popup with expect_popup()." }] } },
      {},
      {}
    ]
  },
  "15-network-mocking": {
    theory: `\`page.route(url, handler)\` intercepts matching requests. Register it **before** the page makes the request, usually before \`goto\`. In the handler you can \`route.fulfill(json=...)\` to answer yourself, \`route.abort()\` to simulate a network failure, or \`route.fetch()\` to get the real response and change it.

Mocking makes edge cases deterministic: an empty list, a 500 error, or a product that costs nothing. The Gym Shop catalog calls \`GET /api/shop/products\`, which returns \`{"items": [{"id", "name", "price", "category", "sale"}], "total", "page", "pages"}\`.

Use a glob like \`"**/api/shop/products*"\` so query strings still match. \`page.expect_response()\` lets you wait for a specific call when you need its timing.`,
    goodExample: `page.route("**/api/shop/products*", lambda route: route.fulfill(
    json={"items": [...], "total": 1, "page": 1, "pages": 1}))`,
    badExample: `# Hoping the real backend returns the edge case you want to test`,
    practices: [
      { rubric: { requires: [{ pattern: /route\.fulfill\(/, message: "Use route.fulfill()." }] } },
      {},
      { rubric: { requires: [{ pattern: /route\.fetch\(/, message: "Use route.fetch()." }] } }
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
      "Assert status codes and JSON bodies."
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
      {
        goal: "GET /api/shop/products with `api_request_context.get()`, assert status 200, total 12, and that some item is named \"Steel Kettlebell\".",
        rubric: { requires: [{ pattern: /api_request_context\.get\(/, message: "Use api_request_context.get()." }] }
      },
      {
        goal: "POST {\"productId\": \"yoga-mat\", \"quantity\": 2} to /api/shop/cart with page.request, open /shop/cart, and assert the quantity 2 and total \"$58.00\".",
        rubric: { requires: [{ pattern: /page\.request\.post\(/, message: "Seed with page.request so the cookie is shared." }] }
      },
      {}
    ]
  },
  "17-auth-storage": {
    concepts: ["Storage state", "Session fixtures", "Session boundaries"],
    theory: `Logging in through the UI in every test is slow. Instead, log in once (via UI or API), save the context state with \`context.storage_state(path=...)\`, and start other contexts from it: \`browser.new_context(storage_state=path)\`.

In a real suite this happens in a **session-scoped fixture** in \`conftest.py\`: it logs in once, writes the state file, and overrides pytest-playwright's \`browser_context_args\` fixture to add \`"storage_state": path\`, so every test starts logged in.

Still test the boundary itself at least once: valid login reaches the account, invalid login is rejected, and signing out really ends the session.`,
    learningGoals: [
      "Test the login and logout boundary.",
      "Save cookies and localStorage with storage_state().",
      "Start a new context that is already logged in."
    ],
    goodExample: `page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
page.context.storage_state(path=state_path)`,
    badExample: `# Every test: goto login, fill username, fill password, click Sign in...`,
    practices: [
      {},
      {},
      {
        goal: "Log in via page.request, save `page.context.storage_state(path=tmp_path / \"state.json\")`, create a new context from it, and assert that /shop/account shows \"Signed in as student\".",
        rubric: {
          requires: [
            { pattern: /storage_state\(/, message: "Save the state with storage_state()." },
            { pattern: /new_context\([^)]*storage_state/, message: "Create a context with storage_state=." }
          ]
        }
      }
    ]
  }
};
