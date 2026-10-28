import { test, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
import testData from './fixtures/testData.json' with { type: 'json' };

test.describe('LaunchPad project board actions', () => {
  let launchpad;

  test.beforeEach(async ({ page }) => {
    launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
  });

  test('User can open the LaunchPad project board directly', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(testData.launchpad.projectUrlPattern));
  });

  test('User can filter board cards by typing a keyword', async () => {
    const term = testData.launchpad.boardFilterQuery;

    await launchpad.filterBoard(term);

    await expect(launchpad.boardFilterInput).toHaveValue(term);
    await expect(launchpad.boardItemsMatching(term)).toBeVisible();
  });
});