
import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';

const describe = it.describe;

describe('E2E Suite: LaunchPad Board Actions', () => {

  // Test 1: Direct navigation to LaunchPad board
  it('should navigate directly to LaunchPad project board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await launchpad.openLaunchpadProject();

    // Verify that the LaunchPad project board is open.
    await expect(page).toHaveURL(/\/projects\/71(?:\/|$|\?)/);
  });

  // Test 2: Search and verify matching results on the board
  it('should search and filter cards on the LaunchPad board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    // Open the LaunchPad project board.
    await launchpad.openLaunchpadProject();

    // Locate the board filter input.
    const filterInput = page.locator(
      'input[aria-label*="Filter"], input[placeholder*="Filter"], #filter-input'
    ).first();

    await expect(filterInput).toBeVisible({
      timeout: 10000,
    });

    // Enter the search term.
    const searchTerm = 'PR';

    await filterInput.fill(searchTerm);
    await page.keyboard.press('Enter');

    // Verify that the search input retains the value.
    await expect(filterInput).toHaveValue(searchTerm);

    // Verify that matching text is visible on the board.
    const matchedResult = page.getByText(searchTerm, {
      exact: false,
    }).first();

    await expect(matchedResult).toBeVisible({
      timeout: 10000,
    });
  });

});
