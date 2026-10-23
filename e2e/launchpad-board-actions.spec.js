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
    await expect(launchpad.breadcrumbLaunchpadLink).toBeVisible();
  });

  // Test 2: Search and verify matching results on the board
  it('should search and filter cards on the LaunchPad board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    // Open the LaunchPad project board.
    await launchpad.openLaunchpadProject();

    // Board filter input (already verified visible by openLaunchpadProject).
    const filterInput = launchpad.filterInput;

    // Enter the search term.
    const searchTerm = 'PR';
    await filterInput.fill(searchTerm);

    // Verify the search input retains the value.
    await expect(filterInput).toHaveValue(searchTerm);

    // Verify GitHub displays the matching-item count.
    await expect(page.getByText(/\(\d+\) matching items/)).toBeVisible({
      timeout: 10000,
    });

    // Verify a matching card is visible.
    await expect(
      page
        .getByRole('button', {
          name: /PR-Implement Employee Dashboard UI and Filtering in React/i,
        })
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  // Test 3: Create a new GitHub issue
  it('should create a new issue and verify it appears on the board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    // Open the LaunchPad board using the existing helper.
    await launchpad.openLaunchpadProject();

    // Generate a unique title for this test run.
    const issueTitle = `E2E Automated Issue ${Date.now()}`;

    await launchpad.createIssue(issueTitle);
  });

});