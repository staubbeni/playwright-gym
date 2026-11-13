# Lesson 16 — API testing
# Check the products endpoint, seed a cart through the API, and verify login
# error responses.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/16_api_testing_test.py
#   npm run check -- 16-api-testing --python
from playwright.sync_api import APIRequestContext, Page, expect


def test_practice_1_get_and_assert_json(api_request_context: APIRequestContext):
    # TODO (guided): GET /api/shop/products with api_request_context.get().
    # Assert status 200, total 12, and that some item is named "Steel Kettlebell".
    # Hint: assert any(item["name"] == ... for item in body["items"])
    pass


def test_practice_2_seed_via_api_verify_in_ui(page: Page):
    # TODO (independent): POST {"productId": "yoga-mat", "quantity": 2} to
    # /api/shop/cart with page.request (it shares cookies with page!), then open
    # /shop/cart and assert quantity 2 and the total "$58.00".
    pass


def test_practice_3_negative_api_test(api_request_context: APIRequestContext):
    # TODO (challenge): POST wrong credentials to /api/shop/login → 401 and
    # {"error": "Invalid username or password."}; student / playwright → 200.
    pass
