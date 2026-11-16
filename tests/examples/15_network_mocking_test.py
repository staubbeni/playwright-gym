from playwright.sync_api import Page, Route, expect

PRODUCTS_API = "**/api/shop/products*"


def test_practice_1_renders_a_mocked_catalog(page: Page):
    page.route(
        PRODUCTS_API,
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


def test_practice_2_shows_the_error_failure_and_empty_states(page: Page):
    alert = page.get_by_role("alert").filter(has_text="Could not load")

    page.route(PRODUCTS_API, lambda route: route.fulfill(status=500, json={"error": "boom"}))
    page.goto("/shop")
    expect(alert).to_have_text("Could not load products. Please try again.")

    page.route(PRODUCTS_API, lambda route: route.abort())
    page.reload()
    expect(alert).to_have_text("Could not load products. Please try again.")

    page.route(PRODUCTS_API, lambda route: route.fulfill(json={"items": [], "total": 0, "page": 1, "pages": 1}))
    page.reload()
    expect(page.get_by_text("No products found.")).to_be_visible()
    expect(alert).to_have_count(0)


def test_practice_3_patches_a_response_and_checks_the_search_request(page: Page):
    def make_first_free(route: Route):
        response = route.fetch()
        body = response.json()
        body["items"][0]["price"] = 0
        route.fulfill(response=response, json=body)

    page.route(PRODUCTS_API, make_first_free)
    page.goto("/shop")
    expect(page.get_by_role("article").first.get_by_text("Free", exact=True)).to_be_visible()

    with page.expect_request(lambda req: "q=mat" in req.url, timeout=5_000):
        page.get_by_label("Search products").fill("mat")
    expect(page.get_by_role("article").first.get_by_text("Free", exact=True)).to_be_visible()
