# Lesson 12 — iFrames
# Pay with a valid card, reject an invalid one, and confirm that the host
# page learns about the payment.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/12_iframe_test.py
#   npm run check -- 12-iframe --python
from playwright.sync_api import Page, expect


def test_practice_1_pay_inside_the_frame(page: Page):
    page.goto("/play/12-iframe")
    # TODO (guided): Fill Card number 4242424242424242 and Expiry 12/30, click
    # Pay now, and assert "Payment confirmed." inside the frame.


def test_practice_2_validation_inside_the_frame(page: Page):
    page.goto("/play/12-iframe")
    # TODO (independent): Submit card number 1234 and assert the frame alert
    # "Card number must be 16 digits.".


def test_practice_3_frame_to_host_communication(page: Page):
    page.goto("/play/12-iframe")
    # TODO (challenge): After a successful payment assert that the host page
    # status (outside the frame) says "Order paid.".
