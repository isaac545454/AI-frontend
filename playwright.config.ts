import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["apps/**/src/app/**/tests-e2e/**/*.spec.ts"],
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    /** Fora de CI o Chromium abre visível; em CI (`test:e2e:ci`) roda headless. */
    headless: !!process.env.CI,
    /** `PW_RECORD_VIDEO=1 pnpm test:e2e` grava `.webm` em `test-results/`. */
    video: process.env.PW_RECORD_VIDEO === "1" ? "on" : "off",
    trace: "on-first-retry",
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        /** Fora de CI usa o Chrome instalado; evita depender do cache em ~/Library/Caches/ms-playwright. */
        ...(process.env.CI ? {} : { channel: "chrome" as const }),
      },
    },
  ],
  webServer: {
    command: "pnpm dev:stack",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
