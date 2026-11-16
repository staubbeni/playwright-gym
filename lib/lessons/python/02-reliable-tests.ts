import type { PythonLesson } from "../types.ts";

export const reliableTests: Record<string, PythonLesson> = {
  "06-locator-strategy": {
    goodExample: `(page.get_by_role("article")
    .filter(has_text="Steel Kettlebell")
    .get_by_role("button", name="Add to cart"))`,
    badExample: `page.locator(".grid > article:nth-child(7) button")`,
    commonMistakes: [
      "Using .first to silence a strictness error. It hides the ambiguity instead of fixing it.",
      "Counting with locator.count() and a plain assert. Use to_have_count, which retries.",
      "Matching by price or position when the product name is the stable identity."
    ],
    practices: [
      {
        partial: "```\npage.goto(\"/shop\")\npage.get_by_role(\"article\").filter(has_text=\"Steel Kettlebell\").get_by_role(\"button\", name=\"Add to cart\").click()\n```",
        rubric: {
          requires: [{ pattern: /\.filter\(/, message: "Scope the button to the right card with filter()." }],
          forbids: [{ pattern: /\.(first|last|nth)\b/, message: "Don't pick by position. Filter by content." }]
        }
      },
      {
        goal: "Prove the search really narrows the list: \"mat\" shows exactly 2 products, and \"kettlebell\" shows exactly 1 product whose heading is \"Steel Kettlebell\".",
        hint: "Reuse one products locator for both searches. A heading inside the card is a child: products.get_by_role(\"heading\", ...).",
        rubric: { requires: [{ pattern: /to_have_count\(/, message: "Use to_have_count() on the product list." }] }
      },
      {
        goal: "Of the 8 products on the first page, exactly 3 carry the \"Sale\" badge and exactly 5 do not. Express \"has the badge\" and \"doesn't have it\" with filter, not with two separate hand-written selectors.",
        hint: "filter(has=badge) keeps cards that contain the badge, filter(has_not=badge) keeps the others. Use exact matching so \"Sale\" doesn't match other text.",
        rubric: {
          requires: [
            { pattern: /has\s*=/, message: "Use filter(has=...) for the sale cards." },
            { pattern: /has_not\s*=/, message: "Use filter(has_not=...) for the cards without the badge." }
          ]
        }
      }
    ]
  },
  "07-assertions": {
    concepts: ["Retrying matchers", "Negative assertions", "List assertions"],
    theory: `Web-first assertions take a locator and **retry** until the condition holds or the timeout (5s by default) runs out. That is why \`expect(checkbox).to_be_checked()\` is safe after a click, but \`assert checkbox.is_checked()\` reads the state once and races the UI.

Pick the matcher that states your intent: \`to_be_disabled()\` reads better than \`not_to_be_enabled()\`, and \`to_have_value("Ada")\` beats reading the input's value by hand. For lists, \`to_have_count(n)\` and \`to_have_text(["a", "b"])\` check the whole set at once.

Python's \`expect\` has no soft mode: the first failing assertion stops the test. Prefer one assertion that checks the whole set (\`to_have_text([...])\`) over many small ones, and order assertions from the most to the least informative.`,
    learningGoals: [
      "Choose among to_be_checked, to_be_enabled/disabled, to_have_value, to_have_text and to_have_count.",
      "Assert a negative state with not_to_… or a dedicated matcher.",
      "Assert a whole list at once with to_have_text([...])."
    ],
    goodExample: `expect(page.get_by_role("button", name="Save profile")).to_be_disabled()`,
    badExample: `assert page.get_by_role("button").is_disabled() is True`,
    commonMistakes: [
      "Wrapping a boolean snapshot (is_visible, is_checked) in a plain assert.",
      "Using to_contain_text when you mean the exact text. A partial match can hide bugs.",
      "Asserting the same thing twice instead of the different states that matter."
    ],
    practices: [
      {
        rubric: { requires: [{ pattern: /to_be_checked\(/, message: "Use to_be_checked() for the checkbox." }] }
      },
      {
        rubric: {
          requires: [
            { pattern: /to_be_disabled\(/, message: "Use to_be_disabled() before the name is valid." },
            { pattern: /to_be_enabled\(/, message: "Use to_be_enabled() once it is." }
          ]
        }
      },
      {
        goal: "Add the tags playwright, testing and qa, then try to add \"qa\" a second time. Prove all of it: the tags in order, the counter \"3 tags\", and that the duplicate was refused with the message \"qa\" already exists. Python's `expect` has no soft mode, so a failing check stops the test: order the checks from most to least important.",
        hint: "to_have_text([...]) checks the count and the text of every item in order. Fix the first failure and rerun to see the next one.",
        rubric: { requires: [{ pattern: /to_have_text\(\s*\[/, message: "Assert the tags with to_have_text([...])." }] }
      }
    ]
  },
  "08-auto-waiting": {
    theory: `Before every action Playwright waits until the element is **attached, visible, stable, enabled, and receives events**. A button that is disabled while stock is checked will be clicked as soon as it becomes enabled, with no extra code.

For data that appears later, assert the final state: \`expect(page.get_by_role("article")).to_have_count(8)\` waits for the products to load. A \`page.wait_for_timeout(3000)\` is wrong twice: too slow when the app is fast, and flaky when it is slower than usual.

When you need to wait for something that isn't visible, wait for that specific event: \`page.expect_response()\`, \`page.wait_for_url()\`, or \`page.wait_for_function()\`.`,
    goodExample: `page.get_by_role("button", name="Show reviews").click()
expect(page.get_by_role("list", name="Reviews").get_by_role("listitem")).to_have_count(3)`,
    badExample: `page.wait_for_timeout(3000)
assert page.locator(".review").count() == 3`,
    commonMistakes: [
      "Adding wait_for_timeout to fix flakiness. It moves the race, it doesn't remove it.",
      "Using wait_for_load_state(\"networkidle\") in a single-page app.",
      "Asserting the loading indicator but never the loaded content."
    ],
    practices: [
      {},
      {},
      {
        goal: "The starter adds the kettlebell to the cart by sleeping and reading text once. It passes, but it is slow and fragile. Rewrite it without any sleep or snapshot read: let click() wait for the button to become enabled and let an assertion wait for the new cart count.",
        hint: "click() waits until the button is visible, stable and enabled. to_have_text() retries until the cart link says \"Cart (1)\".",
        rubric: {
          forbids: [
            { pattern: /wait_for_timeout|wait_for_selector|wait_for_function/, message: "No manual waits: click() and expect() wait for you." },
            { pattern: /text_content\(|inner_text\(|is_enabled\(|is_visible\(/, message: "Reading once doesn't retry. Use a web-first assertion." },
            { pattern: /force\s*=\s*True/, message: "Do not force the click." }
          ]
        }
      }
    ]
  },
  "09-toast": {
    goodExample: `toast = page.get_by_role("region", name="Notifications").get_by_role("status")
expect(toast).to_have_text("Preferences saved.")
expect(toast).to_be_hidden()`,
    badExample: `page.wait_for_timeout(2500)
expect(page.get_by_text("Preferences saved.")).to_be_visible()`,
    practices: [
      {
        goal: "Click \"Save preferences\" and prove two things about the toast: it says \"Preferences saved.\", and it goes away on its own.",
        rubric: { requires: [{ pattern: /to_be_hidden\(|to_have_count\(\s*0\s*\)|not_to_be_visible\(/, message: "Assert that the toast goes away." }] }
      },
      {
        goal: "\"Send 3 emails\" shows three toasts one after another. Prove that all three are on screen together, in the order they were sent: Email 1 sent., Email 2 sent., Email 3 sent..",
        hint: "One locator that matches every toast plus to_have_text([...]) checks the count and the order in a single retrying assertion.",
        rubric: { requires: [{ pattern: /to_have_text\(\s*\[/, message: "Assert the whole stack with to_have_text([...])." }] }
      },
      {
        goal: "Click \"Delete draft\". The toast reads \"Draft deleted. Undo in 4s\" and the number keeps counting down, so match only the part that doesn't change. Click \"Undo\" and prove the draft \"Weekly plan\" is back and the toast \"Draft restored.\" appeared.",
        hint: "An exact string will flake because the countdown changes every second. A regular expression such as re.compile(r\"^Draft deleted\\.\") or to_contain_text() matches the stable part.",
        rubric: { requires: [{ pattern: /to_contain_text\(|to_have_text\(\s*re\.compile/, message: "Match the stable part of the countdown text (regular expression or to_contain_text)." }] }
      }
    ]
  },
  "10-keyboard-mouse": {
    goodExample: `page.get_by_text("Write tests").drag_to(page.get_by_role("list", name="Done"))`,
    badExample: `page.mouse.move(412, 233); page.mouse.down()  # pixel coordinates`,
    practices: [
      { rubric: { requires: [{ pattern: /press\(/, message: "Send the shortcut with press()." }] } },
      {
        goal: "Hover the \"About the Pro plan\" button and prove the tooltip \"Includes unlimited projects.\" shows. Then prove it goes away when the mouse leaves, and, after hovering again, when you press Escape.",
        hint: "Move the pointer elsewhere with page.mouse.move(0, 0) or by hovering another element. keyboard.press(\"Escape\") works on the page.",
        rubric: {
          requires: [
            { pattern: /\.hover\(/, message: "Use hover()." },
            { pattern: /Escape/, message: "Press Escape to dismiss it." }
          ]
        }
      },
      {
        goal: "Drag \"Write tests\" from To do into Done and prove it is only in Done. Below the board is a form for keyboard users (Card, Move to, \"Move card\"): use it to move \"Review PR\" to In review, then try to move \"Write tests\" back to To do and prove the board refuses.",
        hint: "drag_to(target) fires the real drag events and select_option() drives the form. After each move assert both lists: where the card is, and where it is no longer. Drag handlers only exist after hydration: wait for \"Keyboard shortcuts ready\" first, or the first drag silently does nothing.",
        rubric: {
          requires: [
            { pattern: /drag_to\(/, message: "Use drag_to()." },
            { pattern: /select_option\(/, message: "Use the move form with select_option()." }
          ]
        }
      }
    ]
  }
,
  "11-dialogs-files": {
    theory: `Native \`alert\`, \`confirm\`, and \`prompt\` dialogs are dismissed automatically unless you handle them. Register the handler **before** the click that opens the dialog: \`page.once("dialog", lambda dialog: dialog.accept())\`. Inside a handler function you can also check \`dialog.message\`.

\`locator.set_input_files()\` uploads files without a file picker. Pass a path, or a dict \`{"name": ..., "mimeType": ..., "buffer": b"..."}\` to create the file in memory.

Downloads are events. Wrap the click in a context manager so Playwright listens first: \`with page.expect_download() as download_info: button.click()\`. Then \`download_info.value\` gives you \`suggested_filename\` and \`path()\` to read the file contents.`,
    learningGoals: [
      "Handle native dialogs with page.once(\"dialog\", ...).",
      "Upload files with set_input_files.",
      "Capture and inspect a download with expect_download()."
    ],
    goodExample: `with page.expect_download() as download_info:
    page.get_by_role("button", name="Export CSV").click()
download = download_info.value`,
    badExample: `page.get_by_role("button", name="Export CSV").click()
download = page.wait_for_event("download")  # may miss the event`,
    practices: [
      { rubric: { requires: [{ pattern: /dialog/, message: "Handle the dialog event." }] } },
      {
        goal: "Upload an in-memory avatar.png and prove the status reads exactly \"Uploaded avatar.png (14 bytes)\" for the content b\"fake-png-bytes\". Then upload a notes.txt and prove it is refused with \"Only image files are allowed.\".",
        hint: "set_input_files(files={\"name\": ..., \"mimeType\": ..., \"buffer\": ...}) builds a file without touching the disk. The mime type is what the app checks.",
        rubric: { requires: [{ pattern: /set_input_files\(/, message: "Use set_input_files()." }] }
      },
      {
        goal: "Download via \"Export CSV\" and prove the filename is report.csv and the file starts with \"id,name,score\" and has both rows (Ada, Grace). Then import that same downloaded file with \"Import CSV\" and prove the page says \"Imported 2 rows.\".",
        hint: "download.path() gives the saved file: read it with open(), and pass the same path to set_input_files().",
        rubric: {
          requires: [
            { pattern: /expect_download\(/, message: "Capture the download with expect_download()." },
            { pattern: /set_input_files\(/, message: "Import the downloaded file with set_input_files()." }
          ]
        }
      }
    ]
  }
};
