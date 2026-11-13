from playwright.sync_api import Page, Route, expect


def test_practice_1_renders_a_mocked_catalog(page: Page):
    page.route(
        "**/api/shop/products*",
        lambda route: route.fulfill(
            json={
                "items": [{"id": "mocked-dumbbell", "name": "Mocked Dumbbell", "price": 9.99, "category": "Equipment", "sale": False}],
                "total": 1,
                "page": 1,
                "pages": 1,
            }
        ),
    )
    page.goto("/shop")
    expect(page.get_by_role("article")).to_have_count(1)
    expect(page.get_by_role("article", name="Mocked Dumbbell")).to_be_visible()


def test_practice_2_shows_an_error_when_the_api_fails(page: Page):
    page.route("**/api/shop/products*", lambda route: route.fulfill(status=500, json={"error": "boom"}))
    page.goto("/shop")
    expect(page.get_by_role("alert").filter(has_text="Could not load")).to_have_text(
        "Could not load products. Please try again."
    )


def test_practice_3_shows_a_free_product(page: Page):
    def make_first_free(route: Route):
        response = route.fetch()
        body = response.json()
        body["items"][0]["price"] = 0
        route.fulfill(response=response, json=body)

    page.route("**/api/shop/products*", make_first_free)
    page.goto("/shop")
    expect(page.get_by_role("article").first.get_by_text("Free", exact=True)).to_be_visible()
