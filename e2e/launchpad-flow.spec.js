import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
const describe = it.describe;
describe('E2E Suite: GitHub Launchpad Flow Tests', () => {
  it('should render Launchpad header controls with authenticated state', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
     await launchpad.goToLaunchpad();
    await expect(launchpad.userAvatarButton).toBeVisible();
    await expect(launchpad.globalSearchInput).toBeVisible();
  });
  it('should assert repository sidebar visibility and item counts', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.goToLaunchpad();
    await expect(launchpad.repoContainer.first()).toBeVisible({
      timeout: 10000,
    });
    const count = await launchpad.repoListItems.count();
    expect(count).toBeGreaterThan(0);
  });
  it('should dynamically filter repositories in the sidebar', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
     await launchpad.goToLaunchpad();
      await launchpad.filterRepositories('project-training');
    await expect(launchpad.repoListItems.first()).toBeVisible();
  });
  it('should navigate to repo projects and open LaunchPad dashboard', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    await expect(page).toHaveURL(/\/projects\/71(?:\/|$|\?)/);
  });
});
