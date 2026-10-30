import { test, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
import testData from './fixtures/testData.json' with { type: 'json' };

test.describe('LaunchPad card side panel and status changes', () => {
  let launchpad;

  test.beforeEach(async ({ page }) => {
    launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
  });

  test('User can change a card status from its side panel', async ({ page }) => {
  await launchpad.openFirstCard();
  await expect(page).toHaveURL(new RegExp(testData.launchpad.issuePaneUrlPattern));

  const current = await launchpad.currentStatusText();
  const alreadyInTarget = new RegExp(testData.launchpad.targetStatus, 'i').test(current);
  const newStatus = alreadyInTarget
    ? testData.launchpad.alternateStatus
    : testData.launchpad.targetStatus;

  await launchpad.changeStatus(newStatus);

  await expect(launchpad.statusButton).toContainText(new RegExp(newStatus, 'i'));
});

 test('User can move a card to In Progress from its side panel', async ({ page }) => {
  page.on('response', (r) => {
    if (r.request().method() === 'POST') console.log('POST', r.status(), r.url());
  });

  await launchpad.openFirstCard();
  await expect(page).toHaveURL(new RegExp(testData.launchpad.issuePaneUrlPattern));

  await launchpad.changeStatus(testData.launchpad.targetStatus);

  await page.reload();
  await expect(launchpad.statusButton).toBeVisible();
  console.log('Status after reload:', await launchpad.statusButton.innerText());
});
});