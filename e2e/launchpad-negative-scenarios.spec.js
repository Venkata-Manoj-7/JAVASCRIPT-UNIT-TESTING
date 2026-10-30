import { test, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';
import { AuthService } from './auth-service.js';
import testData from './fixtures/testData.json' with { type: 'json' };

/** Returns the card count once it has stayed the same for three checks in a row. */
async function settledCount(locator) {
  let previous = -1;
  let sameInARow = 0;
  await expect.poll(async () => {
    const current = await locator.count();
    sameInARow = current === previous ? sameInARow + 1 : 0;
    previous = current;
    return sameInARow >= 2;
  }, { intervals: [1000] }).toBe(true);
  return previous;
}

test.describe('LaunchPad board: filter and card creation edge cases', () => {
  let launchpad;

  test.beforeEach(async ({ page }) => {
    launchpad = new LaunchpadService(page);
    await launchpad.openLaunchpadProject();
    await expect(launchpad.enabledCards.first()).toBeVisible();
  });

  test('Filtering the board gives the same cards whether the keyword is upper or lower case', async () => {
    const keyword = testData.launchpad.caseFilterQuery;
    const cards = launchpad.enabledCards;
    const matchesNothing = String(Date.now());

    // Start from an empty result so we know the board has really been filtered
    await launchpad.filterBoard(matchesNothing);
    await expect(cards).toHaveCount(0);

    await launchpad.filterBoard(keyword.toUpperCase());
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    const upperCaseCount = await settledCount(cards);

    await launchpad.filterBoard(matchesNothing);
    await expect(cards).toHaveCount(0);

    await launchpad.filterBoard(keyword.toLowerCase());
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    const lowerCaseCount = await settledCount(cards);

    expect(lowerCaseCount).toBe(upperCaseCount);
  });

  test('User cannot create a card with an empty title', async () => {
    const cardsBefore = await launchpad.enabledCards.count();

    await launchpad.openAddItemInput();
    await launchpad.typeAndSubmit('');

    await expect(launchpad.createIssueDialog).toBeHidden();
    await expect(launchpad.enabledCards).toHaveCount(cardsBefore);
  });
});

test.describe('LaunchPad board: signed-out visitor', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Signed-out visitor cannot add items to the board', async ({ page }) => {
    const launchpad = new LaunchpadService(page);

    await page.goto(testData.urls.launchpadProject);

    // Page has loaded and the visitor is signed out (header link or login button)
    await expect(
      page.getByRole('link', { name: /sign in/i }).or(page.getByRole('button', { name: /sign in/i })).first()
    ).toBeVisible();
    await expect(launchpad.addItemButton).toHaveCount(0);
  });

  test('Visitor with the wrong username or password is rejected with an error message', async ({ page }) => {
    const auth = new AuthService(page);
    const { email, password, expectedErrorMessage } = testData.invalidUser;

    await auth.goToLogin();
    await auth.login(email, password);

    await expect(auth.errorMessage).toBeVisible();
    await expect(auth.errorMessage).toContainText(expectedErrorMessage);
    await expect(auth.usernameInput).toBeVisible();
  });
});