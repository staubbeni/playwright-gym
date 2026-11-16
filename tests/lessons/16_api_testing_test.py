# Lesson 16 — API testing
# Check the products contract, seed a cart through the API, and pin down the
# error responses.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/16_api_testing_test.py
#   npm run check -- 16-api-testing --python
from playwright.sync_api import APIRequestContext, Page, expect


def test_practice_1_get_and_assert_json(api_request_context: APIRequestContext):
    # TODO (guided): GET the product list with api_request_context.get(). Prove
    # the contract: success status, the right total, and that the Steel
    # Kettlebell is in it.
    pass


def test_practice_2_seed_via_api_verify_in_ui(page: Page):
    # TODO (independent): put two Yoga Mats in the cart with page.request (it
    # shares cookies with the page, api_request_context does not!), then open
    # the cart page and prove the UI shows that quantity and the matching total.
    pass


def test_practice_3_negative_contract(api_request_context: APIRequestContext):
    # TODO (challenge): a wrong password, an unknown product added to the cart,
    # and a product page for an unknown id each answer with their own status and
    # error body: assert all three. Then assert a valid login and a real
    # product are OK (expect(response).to_be_ok()) and have the right shape.
    pass
