# Lesson 04 — Forms & validation
# Create an account, prove that an invalid email is rejected, and verify the
# selected plan and role.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/04_forms_test.py
#   npm run check -- 04-forms --python
from playwright.sync_api import Page, expect


def test_practice_1_happy_path(page: Page):
    page.goto("/play/04-forms")
    # TODO (guided): Fill Full name "Ada Lovelace", Email address, Password (8+
    # chars), accept the terms, submit, and assert that the status contains
    # "Account created".


def test_practice_2_invalid_email(page: Page):
    page.goto("/play/04-forms")
    # TODO (independent): Submit with email "not-an-email" (everything else
    # valid) and assert the alert "Enter a valid email address.".
    # Hint: Each field error has role=alert, but Next.js also renders an empty
    # route announcer with role=alert. Narrow it down:
    # get_by_role("alert").filter(has_text="email").


def test_practice_3_options_and_summary(page: Page):
    page.goto("/play/04-forms")
    # TODO (challenge): Choose plan "Pro" and role "Teacher" and assert the
    # exact summary: "Account created for Ada Lovelace on the Pro plan as a
    # Teacher.".
