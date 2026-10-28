import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';
import { AuthService } from './auth-service.js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const authService = new AuthService(page);
  await authService.goToLogin();

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  await authService.login(email, password);

  // Wait until navigation finishes after login
  await page.waitForURL((url) => !url.href.includes('/login'), { timeout: 10000 });

  // Save the logged-in session cookies/storage to file
  await page.context().storageState({ path: authFile });
});