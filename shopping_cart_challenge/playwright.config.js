import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  retries: 1,
  testDir: './src/tests',
  reporter: [
    ['list'], 
    ['html', { open: 'never' }]
  ],
  use: {
    headless: true,
    actionTimeout: 5000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'UI - Chromium',
      testDir: './src/tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        headless: true,
      },
    },
    {
      name: 'UI - Firefox',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://www.saucedemo.com',
        headless: true,
      },
    },
    {
      name: 'UI - WebKit',
      testDir: './src/tests/ui',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'https://www.saucedemo.com',
        headless: true,
      },
    },
    {
      name: 'API Tests',
      testDir: './src/tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
