import { expect } from '@playwright/test';
import testData from './fixtures/testData.json' with { type: 'json' };

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class LaunchpadService {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header controls
    this.userAvatarButton = page
      .getByRole('button', { name: /open user navigation menu/i })
      .or(page.locator('header button:has(img.avatar)'))
      .first();
    this.globalSearchInput = page.getByRole('button', { name: /search/i }).first();

    // Repository side panel
    this.repoContainer = page.getByText(testData.launchpad.topRepositoriesLabel, { exact: true });
    // TODO: replace with a role/test id found via `npx playwright codegen`
    this.repoListItems = page.locator('a[href^="/"]:has-text("/"):visible');
    this.repoSearchButton = page.getByTestId('dynamic-side-panel-items-search-button');
    this.repoSearchInput = page.getByTestId('dynamic-side-panel-items-search-input');

    // Repository projects page
    this.launchpadProjectLink = page.getByRole('link', {
      name: new RegExp(testData.launchpad.projectLinkName, 'i'),
    });

    // Project board
    this.breadcrumbLaunchpadLink = page
      .getByRole('navigation', { name: 'Breadcrumbs' })
      .getByRole('link', { name: testData.launchpad.projectLinkName });
    this.boardFilterInput = page
      .getByRole('combobox', { name: /filter/i })
      .or(page.getByRole('textbox', { name: /filter/i }))
      .or(page.getByPlaceholder(/filter/i))
      .or(page.locator('input[aria-label*="Filter" i], #filter-input'))
      .first();
    this.matchingItemsMessage = page.getByText(new RegExp(testData.launchpad.matchingItemsPattern));
    this.enabledCards = page.getByRole('button', {
      name: new RegExp(testData.launchpad.cardNamePattern),
      disabled: false,
    });

    // Backlog: card creation
    this.addItemButton = page.getByRole('button', { name: /Add item to Backlog|Add item/i }).first();
    this.addItemInput = page.getByRole('combobox', { name: /Start typing to create an item/i });
    this.createIssueDialog = page.getByRole('dialog');

    // Issue side panel
    this.statusButton = page.getByRole('button', { name: /^Status/i }).first();
  }

  // ---------- Navigation ----------

  async goToLaunchpad() {
    await this.page.goto(testData.urls.launchpad);
    await expect(this.repoContainer).toBeVisible();
  }

  async goToRepositoryProjects() {
    await this.page.goto(testData.urls.repositoryProjects);
  }

  async openLaunchpadProject() {
    await this.goToRepositoryProjects();
    await this.launchpadProjectLink.click();
    await expect(this.page).toHaveURL(new RegExp(testData.launchpad.projectUrlPattern));
    await expect(this.boardFilterInput).toBeVisible();
  }

  // ---------- Repository side panel ----------

  async filterRepositories(searchTerm) {
    await this.repoSearchButton.click();
    await this.repoSearchInput.fill(searchTerm);
  }

  // ---------- Board filter ----------

  async filterBoard(searchTerm) {
    await this.boardFilterInput.fill(searchTerm);
    await this.boardFilterInput.press('Enter');
  }

 boardItemsMatching(searchTerm) {
  return this.cardByTitle(searchTerm).first();
}
  /** Locator for board cards whose name contains the given title. */
  cardByTitle(title) {
    return this.page.getByRole('button', { name: new RegExp(escapeRegExp(title)) });
  }

  // ---------- Card creation ----------

  async openAddItemInput() {
    await this.addItemButton.click();
    await expect(this.addItemInput).toBeVisible();
  }

  /** Types a title and presses Enter, without asserting the outcome. */
  async typeAndSubmit(title) {
    await this.addItemInput.fill(title);
    await this.addItemInput.press('Enter');
  }

  /** Creates an issue from the Backlog column. Callers assert the card appears. */
  async createIssue(issueTitle) {
    await this.openAddItemInput();
    await this.typeAndSubmit(issueTitle);

    await expect(this.createIssueDialog).toBeVisible();
    await expect(
      this.createIssueDialog.getByRole('textbox', { name: /add a title/i })
    ).toHaveValue(issueTitle);

    // Use the Create button when it is shown, otherwise the keyboard shortcut.
    const createButton = this.createIssueDialog.getByTestId('create-issue-button');
    if (await createButton.isVisible()) {
      await createButton.click();
    } else {
      await this.createIssueDialog.press('Control+Enter');
    }

    await expect(this.createIssueDialog).toBeHidden();
  }

  // ---------- Issue side panel ----------

  async openFirstCard() {
    const firstCard = this.enabledCards.first();
    await expect(firstCard).toBeVisible();
    await firstCard.getByRole('heading', { level: 3 }).click();
  }

  async closeSidePanel() {
    await this.page.keyboard.press('Escape');
  }

  statusOption(statusName) {
    const name = new RegExp(statusName, 'i');
    return this.page
      .getByRole('option', { name })
      .or(this.page.getByRole('menuitemradio', { name }))
      .or(this.page.getByRole('menuitem', { name }))
      .first();
  }

  async currentStatusText() {
    await expect(this.statusButton).toBeVisible();
    return this.statusButton.innerText();
  }

  async changeStatus(statusName) {
    await this.statusButton.click();
    const option = this.statusOption(statusName);
    await expect(option).toBeVisible();
    await option.click();
    await expect(option).toBeHidden();
  }
}