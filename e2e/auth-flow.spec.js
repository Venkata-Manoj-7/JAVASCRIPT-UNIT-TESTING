import { test as it, expect } from '@playwright/test';
import { AuthService } from './auth-service.js';


const describe = it.describe;

describe('E2E Suite: GitHub LaunchPad Board User Journey', () => {

  it('should navigate to LaunchPad board using AuthService', async ({ page }) => {
    const authService = new AuthService(page);

    // 1. Navigate to LaunchPad board using service helper
    await authService.goToLaunchPad();

    // 2. Assert page title
    await expect(page).toHaveTitle(/Sign in to GitHub · GitHub/i);

    // 3. Verify board UI container is loaded
    await authService.verifyBoardLoaded();
    await page.pause();
  });

});