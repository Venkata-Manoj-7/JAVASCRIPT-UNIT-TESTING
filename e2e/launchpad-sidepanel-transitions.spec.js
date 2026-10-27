import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
const describe = it.describe;
const enabledCards = (page) =>
  page.getByRole('button', {
    name: /github-project-training\s?#\d+/,
    disabled: false,
  });

describe('E2E Suite: LaunchPad Side-Panel & Status Transitions', () => {
  it('should open issue side-panel and verify content', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    const firstCard = enabledCards(page).first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.getByRole('heading', { level: 3 }).click();
    await expect(page).toHaveURL(/[?&]pane=issue/, { timeout: 10000 });
    await expect(page).toHaveURL(/[?&]itemId=/);
    await page.keyboard.press('Escape');
    await expect(page).not.toHaveURL(/[?&]pane=issue/, { timeout: 10000 });
  });
  it('should transition card status from Backlog to In Progress', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    const card = enabledCards(page).first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.getByRole('heading', { level: 3 }).click();
    await expect(page).toHaveURL(/[?&]pane=issue/, { timeout: 10000 });
    const statusButton = page
      .getByRole('button', { name: /^Status/i })
      .first();
    await expect(statusButton).toBeVisible({ timeout: 10000 });
    await statusButton.click();
    const inProgress = page
      .getByRole('option', { name: /In Progress/i })
      .or(page.getByRole('menuitemradio', { name: /In Progress/i }))
      .or(page.getByRole('menuitem', { name: /In Progress/i }))
      .first();
    await expect(inProgress).toBeVisible({ timeout: 10000 });
    await inProgress.click();
    await expect(statusButton).toContainText(/In Progress/i, {
      timeout: 10000,
    });
  });
});
