import { test, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
import testData from './fixtures/testData.json' with { type: 'json' };
test.describe('Launchpad home and project navigation', () => {
  let launchpad;
  test.beforeEach(async ({ page }) => {
    launchpad = new LaunchpadService(page);
    await launchpad.goToLaunchpad();
  });
  test('Signed-in user sees their profile menu and search on the home page', async () => {
    await expect(launchpad.userAvatarButton).toBeVisible();
    await expect(launchpad.globalSearchInput).toBeVisible();
  });
  test('User sees a list of their top repositories in the side panel', async () => {
    await expect(launchpad.repoListItems.first()).toBeVisible();
    expect(await launchpad.repoListItems.count()).toBeGreaterThan(0);
  });
  test('User can search and filter repositories by typing a project name', async () => {
    const term = testData.launchpad.repoFilterQuery;
    await launchpad.filterRepositories(term);
    await expect(launchpad.repoListItems.first()).toContainText(new RegExp(term, 'i'));
  })
  test('User can open the LaunchPad project board from the repository projects page', async ({ page }) => {
    await launchpad.openLaunchpadProject();
    await expect(page).toHaveURL(new RegExp(testData.launchpad.projectUrlPattern));
  });
});
