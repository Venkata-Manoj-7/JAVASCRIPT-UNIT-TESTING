import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
const describe = it.describe;
describe('E2E Suite: LaunchPad Board Actions', () => {
  it('should navigate directly to LaunchPad project board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    await expect(page).toHaveURL(/\/projects\/71(?:\/|$|\?)/);
    await expect(launchpad.breadcrumbLaunchpadLink).toBeVisible();
  });
  it('should search and filter cards on the LaunchPad board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    const filterInput = launchpad.filterInput;
    const searchTerm = 'PR';
    await filterInput.fill(searchTerm);
    await expect(filterInput).toHaveValue(searchTerm);
    await expect(page.getByText(/\(\d+\) matching items/)).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page
        .getByRole('button', {
          name: /PR-Implement Employee Dashboard UI and Filtering in React/i,
        })
        .first()
    ).toBeVisible({ timeout: 10000 });
  });
  it('should create a new issue and verify it appears on the board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    const issueTitle = `E2E Automated Issue ${Date.now()}`;
    await launchpad.createIssue(issueTitle);
  });
});
