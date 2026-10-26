export type Lesson = {
  id: string;
  number: string;
  module: string;
  moduleTitle: string;
  title: string;
  shortDescription: string;
  description: string;
  learningGoals: string[];
  theory: string;
  goodExample: string;
  badExample: string;
  mission: string;
  hints: string[];
  expectedAssertion: string;
  successCriteria: string[];
  prerequisites?: string[];
  guidedSteps?: string[];
  checkpoints?: string[];
  bugExplanation?: string;
  concepts?: string[];
  resources?: { label: string; url: string }[];
  nextLessonId?: string;
};

export const lessons: Lesson[] = [
  {
    id: "01-selectors",
    number: "01",
    module: "foundations",
    moduleTitle: "Playwright foundations",
    title: "Basic selectors & click",
    shortDescription: "Find stable locators",
    description:
      "Practice locating a dynamic button and verifying the UI change after a click.",
    learningGoals: [
      "Choose a locator based on user-facing behavior.",
      "Perform an action and assert its visible result."
    ],
    theory:
      "A good locator describes how a user finds an element. Prefer role and accessible name over implementation details such as a CSS class or a changing id.",
    goodExample:
      `page.getByRole("button", { name: "Complete action" })`,
    badExample: `page.locator("#action-ready")`,
    mission:
      "Write a test that clicks Complete action and proves that the success message is visible.",
    hints: [
      "Prefer getByRole or getByTestId over an implementation-specific id.",
      "A click without an assertion can pass even when the button is broken.",
      "The URL ?bug=true activates the mutation state."
    ],
    expectedAssertion: "await expect(page.getByRole('status')).toHaveText(...)",
    successCriteria: [
      "The test passes in normal mode.",
      "The test fails when run with ?bug=true.",
      "The assertion checks the result of the click."
    ],
    prerequisites: ["A test file with a page fixture", "Basic async/await syntax"],
    guidedSteps: [
      "Open the lesson URL in your test.",
      "Find the button by how a user would identify it.",
      "Click it, then assert the success message."
    ],
    checkpoints: ["Can your locator survive a changing id?", "Does the assertion fail in bug mode?"],
    bugExplanation: "In bug mode the click handler does not update the status message."
  },
  {
    id: "02-forms",
    number: "02",
    module: "foundations",
    moduleTitle: "Playwright foundations",
    title: "Form fill & assertions",
    shortDescription: "Validate user input",
    description:
      "Fill a small registration form and assert that valid input produces a success message.",
    learningGoals: [
      "Use accessible labels to find form controls.",
      "Combine fill, check, submit, and an outcome assertion."
    ],
    theory:
      "Forms should be tested as a user experiences them: enter values through labels, select options, submit, and verify the message that communicates the outcome.",
    goodExample: `page.getByLabel("Email address").fill("student@example.com")`,
    badExample: `page.locator("input[name=email]").fill("student@example.com")`,
    mission:
      "Submit a valid email with the terms checkbox selected, then verify the success status.",
    hints: [
      "Use accessible labels to target form controls.",
      "Check the checkbox before submitting the form.",
      "Assert the final status text, not only that the submit button exists."
    ],
    expectedAssertion: "await expect(page.getByRole('status')).toHaveText(...)",
    successCriteria: [
      "The email and terms controls are completed.",
      "The success message is asserted after submitting.",
      "The test does not rely on a fixed sleep."
    ],
    prerequisites: ["Selectors and expect assertions", "Basic form semantics"],
    guidedSteps: [
      "Fill the email through its visible label.",
      "Check the terms control and submit.",
      "Assert the final account-created message."
    ],
    checkpoints: ["What happens with an invalid email?", "Which assertion proves the form was accepted?"],
    bugExplanation: "In bug mode valid input is accepted visually but the success state is never committed."
  },
  {
    id: "03-auto-waiting",
    number: "03",
    module: "reliable-tests",
    moduleTitle: "Reliable tests",
    title: "Auto-waiting & loading states",
    shortDescription: "Wait for real UI state",
    description:
      "Practice waiting for asynchronous content without hardcoded sleeps.",
    learningGoals: [
      "Wait for a meaningful UI state instead of a fixed duration.",
      "Assert that loading has finished before reading the content."
    ],
    theory:
      "Playwright automatically retries web-first assertions. Use that behavior to wait for the spinner to disappear or the loaded content to become visible instead of guessing how long the request will take.",
    goodExample: `expect(page.getByText("Report ready")).toBeVisible()`,
    badExample: `page.waitForTimeout(3000)`,
    mission:
      "Start the report load and verify that the final report appears after the loading state finishes.",
    hints: [
      "Start the load with the Load report button.",
      "The assertion should describe the final user-visible state.",
      "The URL ?bug=true leaves the loading state stuck forever."
    ],
    expectedAssertion: "await expect(page.getByText('Report ready')).toBeVisible()",
    successCriteria: [
      "The test waits through the loading state.",
      "The final report content is asserted.",
      "No page.waitForTimeout call is needed."
    ],
    prerequisites: ["Web-first assertions", "Understanding of asynchronous UI"],
    guidedSteps: ["Start the report load.", "Observe the loading state.", "Wait by asserting the final state."],
    checkpoints: ["What should the test observe while loading?", "Why is a fixed sleep fragile?"],
    bugExplanation: "In bug mode the loading state never resolves."
  },
  {
    id: "04-toast",
    number: "04",
    module: "reliable-tests",
    moduleTitle: "Reliable tests",
    title: "Dynamic toast messages",
    shortDescription: "Assert transient feedback",
    description:
      "Verify a short-lived toast message and learn why timing assertions matter.",
    learningGoals: [
      "Trigger a transient notification.",
      "Assert the notification while Playwright is retrying its locator."
    ],
    theory:
      "A toast is feedback, not permanent page content. Locate it by its role and text, then assert that it becomes visible after the user action. Avoid arbitrary sleeps because they make tests slower and flaky.",
    goodExample: `expect(page.getByRole("alert")).toHaveText("Saved")`,
    badExample: `page.locator(".toast").isVisible()`,
    mission:
      "Save the preferences and verify that the confirmation toast appears.",
    hints: [
      "Click Save preferences first.",
      "Use the alert role rather than the styling class.",
      "The URL ?bug=true prevents the toast from appearing."
    ],
    expectedAssertion: "await expect(page.getByRole('alert')).toHaveText(...)",
    successCriteria: [
      "The save action is triggered.",
      "The toast text is asserted.",
      "The test does not use a fixed sleep or a one-time isVisible check."
    ],
    prerequisites: ["Role-based locators", "Web-first assertions"],
    guidedSteps: ["Trigger the save action.", "Locate the alert by its semantic role.", "Assert its message."],
    checkpoints: ["Why should you not use a CSS class as the main locator?", "When does the toast appear?"],
    bugExplanation: "In bug mode the save action completes without rendering the confirmation."
  },
  {
    id: "05-network-mocking",
    number: "05",
    module: "real-world",
    moduleTitle: "Real-world browser testing",
    title: "Network mocking",
    shortDescription: "Control API responses",
    description:
      "Mock an API response and verify that the UI handles the response you defined.",
    learningGoals: [
      "Intercept a request with page.route.",
      "Assert both the request-driven UI and its error state."
    ],
    theory:
      "Network mocking makes browser tests deterministic. Intercept the request before the action, return a controlled response, and assert what the user sees instead of depending on a live backend.",
    goodExample: `await page.route("**/api/profile", route => route.fulfill(...))`,
    badExample: `await page.goto("https://real-api.example.com/profile")`,
    mission:
      "Mock the profile API with a test user and verify that the profile card renders the mocked name.",
    hints: [
      "Register the route before clicking Load profile.",
      "Return a JSON response with a name field.",
      "The URL ?bug=true makes the app ignore the successful API response."
    ],
    expectedAssertion: "await expect(page.getByTestId('profile-name')).toHaveText(...)",
    successCriteria: [
      "The API response is controlled by the test.",
      "The mocked profile name is asserted in the UI.",
      "The test does not depend on an external service."
    ],
    prerequisites: ["Click actions and assertions", "Basic JSON"],
    guidedSteps: ["Register the route before the click.", "Return a small fixture response.", "Assert the mocked name."],
    checkpoints: ["What happens if the route is registered after the click?", "Which response belongs to this test?"],
    bugExplanation: "In bug mode the request still completes, but the UI ignores the returned profile."
  },
  {
    id: "06-shadow-dom",
    number: "06",
    module: "real-world",
    moduleTitle: "Real-world browser testing",
    title: "Shadow DOM & web components",
    shortDescription: "Test encapsulated UI",
    description:
      "Locate and interact with controls rendered inside a custom web component.",
    learningGoals: [
      "Recognize when an element belongs to a shadow tree.",
      "Use Playwright locators that pierce open shadow DOM."
    ],
    theory:
      "Open shadow DOM keeps component internals encapsulated, but Playwright's locators can pierce it automatically. Prefer the component's accessible labels over implementation-specific shadow-root selectors.",
    goodExample: `page.getByRole("textbox", { name: "Display name" })`,
    badExample: `page.locator("user-settings >>> input")`,
    mission:
      "Update the display name inside the web component and verify the saved value.",
    hints: [
      "The form is rendered inside the user-settings custom element.",
      "Use the visible label to find the input.",
      "The URL ?bug=true prevents the saved value from updating."
    ],
    expectedAssertion: "await expect(page.getByTestId('saved-name')).toHaveText(...)",
    successCriteria: [
      "The shadow DOM input is found through its accessible label.",
      "The form is submitted.",
      "The saved name is asserted after the update."
    ],
    prerequisites: ["Accessible labels", "Form submit assertions"],
    guidedSteps: ["Find the labeled input inside the component.", "Fill and submit it.", "Assert the saved value outside the component."],
    checkpoints: ["Why can Playwright still find an open shadow tree?", "What is the user-visible outcome?"],
    bugExplanation: "In bug mode the component emits the event, but the page ignores the saved value."
  },
  {
    id: "07-iframe",
    number: "07",
    module: "real-world",
    moduleTitle: "Real-world browser testing",
    title: "iFrame handling",
    shortDescription: "Test embedded pages",
    description: "Fill a form rendered inside an embedded frame and assert its result.",
    learningGoals: ["Target content inside a frame.", "Keep frame interactions explicit and reliable."],
    theory: "An iframe has its own document. Use frameLocator to scope locators to that embedded document instead of searching the top-level page.",
    goodExample: `page.frameLocator("#payment-frame").getByLabel("Card number")`,
    badExample: `page.getByLabel("Card number")`,
    mission: "Complete the embedded payment form and verify the confirmation inside the frame.",
    hints: ["Scope every embedded locator to payment-frame.", "Fill the card number and submit.", "The bug URL prevents confirmation."],
    expectedAssertion: "await expect(page.frameLocator('#payment-frame').getByRole('status')).toHaveText(...)",
    successCriteria: ["The frame is targeted explicitly.", "The form is completed inside the frame.", "The confirmation is asserted inside the frame."],
    prerequisites: ["Role and label locators", "Form submission"],
    guidedSteps: ["Locate the frame.", "Fill its labeled field.", "Submit and assert its status."],
    checkpoints: ["Why does a page-level label locator fail?", "Which locator scopes into the frame?"],
    bugExplanation: "In bug mode the frame accepts the form but never shows confirmation."
  },
  {
    id: "08-auth-storage",
    number: "08",
    module: "test-engineering",
    moduleTitle: "Test engineering",
    title: "Authentication & storage state",
    shortDescription: "Reuse an authenticated session",
    description: "Test a login flow and verify a protected page using stored session state.",
    learningGoals: ["Complete a login flow.", "Verify protected content and a logged-out redirect."],
    theory: "Authentication tests should verify both sides of the boundary: valid credentials reach protected content, while an unauthenticated browser is redirected.",
    goodExample: `await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()`,
    badExample: `expect(page.url()).toContain("dashboard")`,
    mission: "Log in with the demo credentials and assert that the protected dashboard is visible.",
    hints: ["Use the accessible labels.", "Submit the demo credentials.", "The bug URL prevents the session from being stored."],
    expectedAssertion: "await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()",
    successCriteria: ["Credentials are entered through labels.", "The protected heading is asserted.", "The test verifies the user-facing result."],
    prerequisites: ["Form testing", "URL and page assertions"],
    guidedSteps: ["Open the login page.", "Enter the demo credentials.", "Submit and assert the dashboard."],
    checkpoints: ["What makes the dashboard protected?", "What should happen after logout?"],
    bugExplanation: "In bug mode the login appears to submit but no authenticated storage state is created."
  },
  {
    id: "09-test-anatomy",
    number: "09",
    module: "foundations",
    moduleTitle: "Playwright foundations",
    title: "Your first Playwright test",
    shortDescription: "Arrange, act, assert",
    description: "Learn the structure of a readable, isolated Playwright test.",
    learningGoals: ["Understand test anatomy.", "Separate setup, action, and assertion."],
    theory: "A useful test has a clear arrange, act, and assert flow. The page fixture gives every test an isolated browser page.",
    goodExample: `test("...", async ({ page }) => { /* arrange, act, assert */ })`,
    badExample: `test("everything", async ({ browser }) => { /* shared state */ })`,
    mission: "Open the lesson, perform the action, and assert the result in one focused test.",
    hints: ["Use the provided page fixture.", "Navigate before acting.", "Finish with a user-visible assertion."],
    expectedAssertion: "await expect(page.getByRole('status')).toHaveText(...)",
    successCriteria: ["The test has a clear flow.", "It uses the page fixture.", "It verifies an outcome."],
    prerequisites: ["TypeScript basics"],
    guidedSteps: ["Arrange the page.", "Act as the user.", "Assert what the user sees."],
    checkpoints: ["Can another person understand the test in one read?"],
    bugExplanation: "Bug mode prevents the action from producing the expected result."
  },
  {
    id: "10-navigation",
    number: "10",
    module: "foundations",
    moduleTitle: "Playwright foundations",
    title: "Navigation & page lifecycle",
    shortDescription: "URLs, titles, redirects",
    description: "Verify navigation using page URLs and user-facing links.",
    learningGoals: ["Navigate with links.", "Assert URL changes instead of inspecting implementation details."],
    theory: "Navigation is part of the user journey. Use toHaveURL and role-based link locators to verify it reliably.",
    goodExample: `await expect(page).toHaveURL(/\\/lessons\\/10-navigation/)`,
    badExample: `expect(page.url()).toBe("http://localhost:3000/...")`,
    mission: "Follow the lesson link and verify that the destination URL is correct.",
    hints: ["Click the navigation link.", "Use a URL assertion.", "Bug mode keeps the link on the wrong destination."],
    expectedAssertion: "await expect(page).toHaveURL(...)",
    successCriteria: ["The link is clicked.", "The destination is asserted.", "The assertion is resilient to the host."],
    prerequisites: ["Locators and click"],
    guidedSteps: ["Open the page.", "Click the link.", "Assert the URL."],
    checkpoints: ["Why is a URL pattern better than a hardcoded host?"],
    bugExplanation: "Bug mode points the navigation link to the wrong destination."
  },
  {
    id: "11-locator-strategy",
    number: "11",
    module: "reliable-tests",
    moduleTitle: "Reliable tests",
    title: "Locator strategy",
    shortDescription: "Choose resilient locators",
    description: "Compare roles, labels, text, test ids, and brittle selectors.",
    learningGoals: ["Choose the strongest available locator.", "Avoid ambiguous and implementation-coupled selectors."],
    theory: "Start with role and accessible name, then label or text. Use test ids when no user-facing contract exists, and CSS only as a last resort.",
    goodExample: `page.getByRole("button", { name: "Reveal message" })`,
    badExample: `page.locator("div.panel button:nth-child(2)")`,
    mission: "Reveal the message using a user-facing locator and assert its text.",
    hints: ["The button has an accessible name.", "Do not depend on the DOM nesting.", "Bug mode keeps the message hidden."],
    expectedAssertion: "await expect(page.getByTestId('locator-message')).toHaveText(...)",
    successCriteria: ["The button is found semantically.", "The message is asserted.", "No nth-child selector is used."],
    prerequisites: ["Test anatomy"],
    guidedSteps: ["Inspect the accessible name.", "Choose a role locator.", "Assert the revealed message."],
    checkpoints: ["What would break if the layout changed?"],
    bugExplanation: "Bug mode makes the action leave the message hidden."
  },
  {
    id: "12-assertions",
    number: "12",
    module: "reliable-tests",
    moduleTitle: "Reliable tests",
    title: "Web-first assertions",
    shortDescription: "Assert behavior, not snapshots",
    description: "Use the right assertion for visibility, text, value, and state.",
    learningGoals: ["Use retrying web-first assertions.", "Match the assertion to the UI state."],
    theory: "Playwright assertions wait and retry until the expected state is reached. This is safer than reading a value once and asserting on a snapshot.",
    goodExample: `await expect(page.getByRole("checkbox")).toBeChecked()`,
    badExample: `expect(await page.getByRole("checkbox").isChecked()).toBe(true)`,
    mission: "Enable the setting and assert that the checkbox and status reflect the change.",
    hints: ["Click the checkbox.", "Use toBeChecked.", "Also verify the status text."],
    expectedAssertion: "await expect(page.getByRole('checkbox')).toBeChecked()",
    successCriteria: ["The state assertion retries.", "The status is verified.", "No one-time boolean snapshot is used."],
    prerequisites: ["Locator strategy"],
    guidedSteps: ["Find the checkbox.", "Change its state.", "Assert state and message."],
    checkpoints: ["Which assertion communicates intent best?"],
    bugExplanation: "Bug mode does not update the setting state."
  },
  {
    id: "13-debugging",
    number: "13",
    module: "test-engineering",
    moduleTitle: "Test engineering",
    title: "Debugging & trace viewer",
    shortDescription: "Turn failures into evidence",
    description: "Use focused runs, headed mode, and traces to understand a failing test.",
    learningGoals: ["Read a Playwright failure.", "Use trace artifacts to inspect actions and state."],
    theory: "A failing test is useful evidence. Playwright traces record actions, snapshots, network activity, and source locations so you can debug instead of guessing.",
    goodExample: "npx playwright test tests/lessons/13-debugging.spec.ts --trace on",
    badExample: "Add page.waitForTimeout(5000) and hope the failure disappears",
    mission: "Run the report action and assert the final state, then inspect the trace when bug mode fails.",
    hints: ["Use a web-first status assertion.", "Run with --trace on when investigating.", "Do not replace an assertion with a fixed sleep."],
    expectedAssertion: "await expect(page.getByRole('status')).toHaveText('Report ready.')",
    successCriteria: ["The normal report becomes ready.", "The bugged report is detected as failing.", "The test does not use a fixed timeout."],
    prerequisites: ["Web-first assertions", "Auto-waiting"],
    guidedSteps: ["Run the test normally.", "Run it with --trace on.", "Open the trace and inspect the failed action."],
    checkpoints: ["What did the trace show immediately before the failure?"],
    bugExplanation: "Bug mode leaves the report in its initial state.",
  },
  {
    id: "14-contexts",
    number: "14",
    module: "test-engineering",
    moduleTitle: "Test engineering",
    title: "Browser contexts & isolation",
    shortDescription: "Keep tests independent",
    description: "Understand isolated browser contexts and why state must not leak between tests.",
    learningGoals: ["Use a fresh context per scenario.", "Recognize state leakage as a test bug."],
    theory: "Playwright Test gives each test an isolated browser context. Tests should create their own state and never depend on another test's localStorage or cookies.",
    goodExample: "test('scenario', async ({ browser }) => { const context = await browser.newContext(); })",
    badExample: "Reuse one page and one login state across unrelated tests",
    mission: "Save a value in the current session and assert that the user-visible state is updated.",
    hints: ["Use the page fixture for the current context.", "Assert the status after saving.", "The bug mode prevents the value from being saved."],
    expectedAssertion: "await expect(page.getByTestId('context-result')).toHaveText(...)",
    successCriteria: ["The action is performed in one test.", "The saved state is asserted.", "The test does not depend on prior test order."],
    prerequisites: ["Test anatomy", "Authentication basics"],
    guidedSteps: ["Open the lesson.", "Save the session value.", "Assert the result and consider a fresh context."],
    checkpoints: ["What state would disappear in a new browser context?"],
    bugExplanation: "Bug mode ignores the save action.",
  },
  {
    id: "15-popups",
    number: "15",
    module: "real-world",
    moduleTitle: "Real-world browser testing",
    title: "Popups & multiple pages",
    shortDescription: "Coordinate browser pages",
    description: "Wait for a new page and assert content in the popup instead of the original page.",
    learningGoals: ["Wait for a popup event.", "Use the returned Page object for assertions."],
    theory: "A popup is a new Page in the same browser context. Start waiting for the page before clicking so the event cannot race the action.",
    goodExample: "const popupPromise = page.waitForEvent('popup'); await button.click(); const popup = await popupPromise;",
    badExample: "Click first, then search the original page for popup content",
    mission: "Open the payment window and assert its heading in the new page.",
    hints: ["Create the popup promise before clicking.", "Await the promise after the click.", "Assert the popup heading."],
    expectedAssertion: "await expect(popup.getByRole('heading')).toHaveText(...)",
    successCriteria: ["The popup event is awaited.", "The new page is asserted.", "The original page is not used for popup content."],
    prerequisites: ["Locators", "Async/await"],
    guidedSteps: ["Prepare the popup wait.", "Click the button.", "Assert the popup document."],
    checkpoints: ["Why must the event wait start before the click?"],
    bugExplanation: "Bug mode does not create the payment window.",
  },
  {
    id: "16-api-testing",
    number: "16",
    module: "real-world",
    moduleTitle: "Real-world browser testing",
    title: "API testing with request",
    shortDescription: "Test beyond the browser UI",
    description: "Use Playwright's request fixture to verify an API response directly.",
    learningGoals: ["Send an API request without a browser locator.", "Assert response status and UI feedback."],
    theory: "The request fixture can prepare state and verify server-side behavior directly, while page tests cover the user journey.",
    goodExample: "const response = await request.get('/api/profile'); expect(response.ok()).toBeTruthy();",
    badExample: "Open a browser page only to check an HTTP status",
    mission: "Verify the local profile API and then confirm the UI reports a successful request.",
    hints: ["Use the request fixture for the API assertion.", "The UI button provides the browser-side exercise.", "Bug mode suppresses the success message."],
    expectedAssertion: "await expect(page.getByTestId('api-result')).toHaveText('API request succeeded.')",
    successCriteria: ["The API response is checked.", "The UI result is asserted.", "The test separates API and UI responsibilities."],
    prerequisites: ["Network mocking", "Assertions"],
    guidedSteps: ["Call the profile endpoint.", "Assert the response.", "Use the page to verify the user-facing result."],
    checkpoints: ["Which checks belong in an API test rather than a browser test?"],
    bugExplanation: "Bug mode prevents the success feedback from being shown.",
  }
];

export const curriculumOrder = [
  "01-selectors",
  "02-forms",
  "09-test-anatomy",
  "10-navigation",
  "11-locator-strategy",
  "12-assertions",
  "03-auto-waiting",
  "04-toast",
  "05-network-mocking",
  "06-shadow-dom",
  "07-iframe",
  "08-auth-storage"
  ,"13-debugging"
  ,"14-contexts"
  ,"15-popups"
  ,"16-api-testing"
];

const resourcesByLesson: Record<string, Lesson["resources"]> = {
  "01-selectors": [
    { label: "Locators", url: "https://playwright.dev/docs/locators" },
    { label: "Best practices", url: "https://playwright.dev/docs/best-practices" }
  ],
  "02-forms": [
    { label: "Actions", url: "https://playwright.dev/docs/input" },
    { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" }
  ],
  "03-auto-waiting": [
    { label: "Auto-waiting", url: "https://playwright.dev/docs/actionability" },
    { label: "Web-first assertions", url: "https://playwright.dev/docs/test-assertions" }
  ],
  "04-toast": [
    { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" },
    { label: "Test user-visible behavior", url: "https://playwright.dev/docs/best-practices#test-user-visible-behavior" }
  ],
  "05-network-mocking": [
    { label: "Network mocking", url: "https://playwright.dev/docs/mock" },
    { label: "API testing", url: "https://playwright.dev/docs/api-testing" }
  ],
  "06-shadow-dom": [
    { label: "Locators", url: "https://playwright.dev/docs/locators" },
    { label: "Web components", url: "https://playwright.dev/docs/api/class-locator#locator-locator" }
  ],
  "07-iframe": [
    { label: "Frames", url: "https://playwright.dev/docs/frames" }
  ],
  "08-auth-storage": [
    { label: "Authentication", url: "https://playwright.dev/docs/auth" },
    { label: "Browser contexts", url: "https://playwright.dev/docs/browser-contexts" }
  ],
  "09-test-anatomy": [
    { label: "Writing tests", url: "https://playwright.dev/docs/writing-tests" },
    { label: "Fixtures", url: "https://playwright.dev/docs/test-fixtures" }
  ],
  "10-navigation": [
    { label: "Navigations", url: "https://playwright.dev/docs/navigations" },
    { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" }
  ],
  "11-locator-strategy": [
    { label: "Locators", url: "https://playwright.dev/docs/locators" },
    { label: "Best practices", url: "https://playwright.dev/docs/best-practices" }
  ],
  "12-assertions": [
    { label: "Assertions", url: "https://playwright.dev/docs/test-assertions" },
    { label: "Auto-waiting", url: "https://playwright.dev/docs/actionability" }
  ],
  "13-debugging": [
    { label: "Trace viewer", url: "https://playwright.dev/docs/trace-viewer" },
    { label: "Debugging tests", url: "https://playwright.dev/docs/debug" }
  ],
  "14-contexts": [
    { label: "Browser contexts", url: "https://playwright.dev/docs/browser-contexts" },
    { label: "Isolation", url: "https://playwright.dev/docs/browser-contexts#what-is-test-isolation" }
  ],
  "15-popups": [
    { label: "Pages and popups", url: "https://playwright.dev/docs/pages" }
  ],
  "16-api-testing": [
    { label: "API testing", url: "https://playwright.dev/docs/api-testing" },
    { label: "Request fixture", url: "https://playwright.dev/docs/api/class-apirequestcontext" }
  ]
};

const conceptsByLesson: Record<string, string[]> = {
  "01-selectors": ["Role locators", "Accessible names", "User-visible behavior"],
  "02-forms": ["Labels", "Form controls", "Outcome assertions"],
  "03-auto-waiting": ["Actionability", "Web-first assertions", "No fixed sleeps"],
  "04-toast": ["Transient UI", "ARIA roles", "Timing-safe assertions"],
  "05-network-mocking": ["page.route", "Fixtures", "Success and error paths"],
  "06-shadow-dom": ["Open shadow roots", "Component boundaries", "Custom events"],
  "07-iframe": ["FrameLocator", "Embedded documents", "Frame-scoped assertions"],
  "08-auth-storage": ["Browser contexts", "Storage state", "Session boundaries"],
  "09-test-anatomy": ["Arrange-act-assert", "Test isolation", "Fixtures"],
  "10-navigation": ["URL assertions", "Navigation", "Client-side routing"],
  "11-locator-strategy": ["Locator priority", "Strictness", "Resilient selectors"],
  "12-assertions": ["Web-first assertions", "State transitions", "Polling"]
  ,"13-debugging": ["Focused runs", "Trace viewer", "Failure diagnosis"]
  ,"14-contexts": ["Browser contexts", "Test isolation", "State boundaries"]
  ,"15-popups": ["Page events", "Popup handling", "Multiple pages"]
  ,"16-api-testing": ["request fixture", "HTTP responses", "UI/API boundaries"]
};

for (const lesson of lessons) {
  lesson.concepts = conceptsByLesson[lesson.id];
  lesson.resources = resourcesByLesson[lesson.id];
  lesson.nextLessonId =
    curriculumOrder[curriculumOrder.indexOf(lesson.id) + 1];
}
