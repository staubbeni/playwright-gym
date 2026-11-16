# Lesson 12 — Iframes
# Work inside an embedded payment frame and check what the host page learns.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 12-iframe --python
from playwright.sync_api import Page, expect


def test_practice_1_pay_inside_the_frame(page: Page):
    page.goto("/play/12-iframe")
    # TODO (guided): fill Card number 4242424242424242 and Expiry 12/30, click "Pay
    # now", and assert "Payment confirmed." inside the frame.
    # Hint: page.get_by_title("Payment form").content_frame or page.frame_locator(...)


def test_practice_2_validation_inside_the_frame(page: Page):
    page.goto("/play/12-iframe")
    # TODO (independent): card number 1234 is rejected with "Card number must be 16
    # digits."; a valid card with expiry 13/99 is rejected with "Expiry must be
    # MM/YY.".


def test_practice_3_frame_and_host_talk(page: Page):
    page.goto("/play/12-iframe")
    # TODO (challenge): pay successfully; assert the frame ("Payment confirmed.")
    # and the host ("Order paid."). Click "Start over" and assert the frame says
    # "Ready for payment." and the host "Awaiting payment.".
