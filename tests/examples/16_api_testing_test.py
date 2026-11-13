from playwright.sync_api import APIRequestContext, Page, expect


def test_practice_1_lists_products_through_the_api(api_request_context: APIRequestContext):
    response = api_request_context.get("/api/shop/products")
    assert response.status == 200
    body = response.json()
    assert body["total"] == 12
    assert any(item["name"] == "Steel Kettlebell" for item in body["items"])


def test_practice_2_a_cart_seeded_via_the_api_shows_in_the_ui(page: Page):
    response = page.request.post("/api/shop/cart", data={"productId": "yoga-mat", "quantity": 2})
    assert response.status == 201

    page.goto("/shop/cart")
    expect(page.get_by_label("Quantity for Yoga Mat")).to_have_value("2")
    expect(page.get_by_test_id("cart-total")).to_have_text("$58.00")


def test_practice_3_login_rejects_wrong_credentials(api_request_context: APIRequestContext):
    wrong = api_request_context.post("/api/shop/login", data={"username": "student", "password": "nope"})
    assert wrong.status == 401
    assert wrong.json() == {"error": "Invalid username or password."}

    right = api_request_context.post("/api/shop/login", data={"username": "student", "password": "playwright"})
    assert right.status == 200
    assert right.json()["username"] == "student"
