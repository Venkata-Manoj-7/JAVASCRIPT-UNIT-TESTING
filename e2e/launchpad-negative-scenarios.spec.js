import { test, expect } from '@playwright/test';
// Adjust this path to where launchpad-service.js actually lives.
// If the spec is in e2e/ and the service is in the same folder, keep it as is.
import { LaunchpadService } from './launchpad-service.js';

test.use({
  storageState: 'playwright/.auth/user.json',
});

test.describe('LaunchPad Board - Negative Testing & Edge Cases', () => {
  let launchpad;

  test.beforeEach(async ({ page }) => {
    launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
  });

  test('empty title does not create an item', async ({ page }) => {
    await launchpad.openAddItemInput();
    await launchpad.typeAndSubmit('');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('whitespace-only title does not create an item', async ({ page }) => {
    await launchpad.openAddItemInput();
    await launchpad.typeAndSubmit('     ');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('Escape cancels creation and leaves no card', async () => {
    const title = `QA-cancel-${Date.now()}`;
    await launchpad.openAddItemInput();
    await launchpad.addItemInput.fill(title);
    await launchpad.addItemInput.press('Escape');
    await expect(launchpad.cardByTitle(title)).toHaveCount(0);
  });

  test('script tag in title is rendered as text, not executed', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', (d) => {
      dialogFired = true;
      d.dismiss();
    });

    const title = `QA-<script>alert(1)</script>-${Date.now()}`;
    await launchpad.createIssue(title);

    expect(dialogFired).toBe(false);
    await expect(launchpad.cardByTitle(title).first()).toBeVisible();
  });

  test('very long title does not crash the board', async ({ page }) => {
    const title = 'QA-' + 'x'.repeat(300);
    await launchpad.openAddItemInput();
    await launchpad.typeAndSubmit(title);
    await expect(page.locator('body')).not.toContainText(/something went wrong/i);
  });

  test('filter with no matches shows no cards', async () => {
    await launchpad.filterInput.fill(`no-such-item-${Date.now()}`);
    await launchpad.filterInput.press('Enter');
    await expect(launchpad.cardByTitle('QA-')).toHaveCount(0);
  });

  test('non-existent project returns 404', async ({ page }) => {
    const res = await page.goto('https://github.com/orgs/Bhrish/projects/999999');
    expect(res.status()).toBe(404);
  });
});

test.describe('unauthenticated access', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('logged-out user cannot add items', async ({ page }) => {
    await page.goto('https://github.com/orgs/Bhrish/projects/71');
    await expect(page.getByRole('button', { name: /Add item/i })).toHaveCount(0);
  });
});