import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
const describe = it.describe;
describe('E2E Suite: LaunchPad Board Actions', () => {
  it('should navigate directly to LaunchPad project board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    await expect(page).toHaveURL(/\/projects\/71(?:\/|$|\?)/);
  });
  it('should search and filter cards on the LaunchPad board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    const filterInput = page.locator(
      'input[aria-label*="Filter"], input[placeholder*="Filter"], #filter-input'
    ).first();
    await expect(filterInput).toBeVisible({
      timeout: 10000,
    });
    const searchTerm = 'PR';
    await filterInput.fill(searchTerm);
    await page.keyboard.press('Enter');
    await expect(filterInput).toHaveValue(searchTerm);
    const matchedResult = page.getByText(searchTerm, {
      exact: false,
    }).first();
     await expect(matchedResult).toBeVisible({
      timeout: 10000,
    });
  });
});
