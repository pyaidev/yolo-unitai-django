import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:3138', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['Pixel 7'] },
  ],
  webServer: {
    command: 'npm run preview -- --port 3138 --strictPort',
    url: 'http://127.0.0.1:3138',
    reuseExistingServer: false,
  },
});
