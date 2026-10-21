
import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';

const describe = it.describe;

describe('E2E Suite: GitHub Launchpad Flow Tests', () => {

  // Test 1: Verify authenticated header controls
  it('should render Launchpad header controls with authenticated state', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await launchpad.goToLaunchpad();

    await expect(launchpad.userAvatarButton).toBeVisible();
    await expect(launchpad.globalSearchInput).toBeVisible();
  });

  // Test 2: Verify repository sidebar and item count
  it('should assert repository sidebar visibility and item counts', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await launchpad.goToLaunchpad();

    await expect(launchpad.repoContainer.first()).toBeVisible({
      timeout: 10000,
    });

    const count = await launchpad.repoListItems.count();

    expect(count).toBeGreaterThan(0);
  });

  // Test 3: Verify repository search filtering
  it('should dynamically filter repositories in the sidebar', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await launchpad.goToLaunchpad();

    await launchpad.filterRepositories('project-training');

    // Verify that at least one filtered repository remains visible
    await expect(launchpad.repoListItems.first()).toBeVisible();
  });

  // Test 4: Navigate to the LaunchPad project dashboard
  it('should navigate to repo projects and open LaunchPad dashboard', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await launchpad.openLaunchpadProject();

    // Verify that the LaunchPad project URL is open
    await expect(page).toHaveURL(/\/projects\/71(?:\/|$|\?)/);
  });

});
