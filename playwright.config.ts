import { defineConfig, devices } from "@playwright/test";

// GYM_BUG=<flags> switches on planted bugs (see lib/bug.ts). The checker sets
// it; every request from the browser and the request fixture carries it.
const bugFlags = process.env.GYM_BUG;
const port = Number(process.env.PORT ?? 3000);

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    actionTimeout: 10_000,
    trace: "on-first-retry",
    extraHTTPHeaders: bugFlags ? { "x-gym-bug": bugFlags } : undefined
  },
  webServer: {
    command: process.env.CI ? `npm run build && npm run start -- -p ${port}` : `npm run dev -- -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 180_000
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
