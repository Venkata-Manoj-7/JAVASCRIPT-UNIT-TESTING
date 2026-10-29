import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { AuthService } from './auth-service.js';
import testData from './fixtures/testData.json' with { type: 'json' };

// Reset session storage so this spec always starts logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('GitHub Authentication - Form Validation and User Login Flows', () => {
  test('verify sign-in form displays all required inputs and submit button', async ({ page }) => {
    const authService = new AuthService(page);
    await authService.goToLogin();
    await expect(authService.usernameInput).toBeVisible();
    await expect(authService.passwordInput).toBeVisible();
    await expect(authService.submitButton).toBeVisible();
  });


  test('authenticate successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    const authService = new AuthService(page);
    await authService.goToLogin();
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in .env configuration'
      );
    }

    await authService.login(email, password);

    await expect(page).not.toHaveURL(testData.urls.login);
  });
});