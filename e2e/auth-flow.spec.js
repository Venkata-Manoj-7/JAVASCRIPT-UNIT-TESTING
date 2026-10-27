import 'dotenv/config';
import { test as it, expect } from '@playwright/test';
import { AuthService } from './auth-service.js';
const describe = it.describe;
describe('E2E Suite: GitHub Auth Flows', () => {
  it('should render sign-in form elements correctly', async ({ page }) => {
    const authService = new AuthService(page);
    await authService.goToLogin();
    await expect(authService.usernameInput).toBeVisible();
    await expect(authService.passwordInput).toBeVisible();
    await expect(authService.submitButton).toBeVisible();
  });
  it('should log in successfully with valid credentials', async ({ page }) => {
    const authService = new AuthService(page);
    await authService.goToLogin();
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    await authService.login(email, password);
    await expect(page).not.toHaveURL('https://github.com/login');
  });
});
