# Learner starters

One starter per lesson. They are intentionally incomplete: each contains
`practice N:` tests with TODO comments. Don't edit them here; copy the
lesson you're working on into the gitignored `tests/solutions/` folder:

```bash
mkdir -p tests/solutions
cp tests/lessons/03-selectors.spec.ts tests/solutions/
npx playwright test tests/solutions/03-selectors.spec.ts
npm run check -- 03-selectors
```

Lessons 20, 21 and 29 use page objects. Copy the `pages/` folder once:

```bash
cp -r tests/lessons/pages tests/solutions/
```

A starter may "pass" before you've written anything, because a test without
assertions passes. That's exactly what the checker's bug-mode run catches.
