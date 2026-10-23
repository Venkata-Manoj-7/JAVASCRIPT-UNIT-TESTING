import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';

const describe = it.describe;

/**
 * Board cards are exposed as buttons whose accessible name contains the
 * issue reference. Enabled cards read "<title> Open issue github-project-training #639"
 * (with a space before #), while disabled cards read
 * "<title> Bhrish/github-project-training#642". Cards that don't match the
 * active view filter are disabled, so only enabled cards are clickable.
 */
const enabledCards = (page) =>
  page.getByRole('button', {
    name: /github-project-training\s?#\d+/,
    disabled: false,
  });

describe('E2E Suite: LaunchPad Side-Panel & Status Transitions', () => {

  // Test 1: Open card side-panel and verify details
  it('should open issue side-panel and verify content', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();

    // Click the first clickable card on the board
    const firstCard = enabledCards(page).first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.getByRole('heading', { level: 3 }).click();

    // GitHub Projects opens the side panel and reflects it in the URL
    await expect(page).toHaveURL(/[?&]pane=issue/, { timeout: 10000 });
    await expect(page).toHaveURL(/[?&]itemId=/);

    // Close the panel with Escape and verify the URL no longer shows it
    await page.keyboard.press('Escape');
    await expect(page).not.toHaveURL(/[?&]pane=issue/, { timeout: 10000 });
  });

  // Test 2: Transition card status from Backlog to In Progress
  it('should transition card status from Backlog to In Progress', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();

    // Open a card from the board
    const card = enabledCards(page).first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.getByRole('heading', { level: 3 }).click();
    await expect(page).toHaveURL(/[?&]pane=issue/, { timeout: 10000 });

    // Open the Status field in the side panel
    const statusButton = page
      .getByRole('button', { name: /^Status/i })
      .first();
    await expect(statusButton).toBeVisible({ timeout: 10000 });
    await statusButton.click();

    // Pick "In Progress" from the list (role differs between menu/listbox UIs)
    const inProgress = page
      .getByRole('option', { name: /In Progress/i })
      .or(page.getByRole('menuitemradio', { name: /In Progress/i }))
      .or(page.getByRole('menuitem', { name: /In Progress/i }))
      .first();
    await expect(inProgress).toBeVisible({ timeout: 10000 });
    await inProgress.click();

    // Verify the Status field now shows "In Progress"
    await expect(statusButton).toContainText(/In Progress/i, {
      timeout: 10000,
    });
  });

});