import { expect } from '@playwright/test';

export class LaunchpadService {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header controls
    this.userAvatarButton = page
      .locator('header button:has(img), header button:has(.avatar)')
      .last();

    this.globalSearchInput = page
      .getByRole('button', { name: /search/i })
      .first();

    // Repository sidebar
    this.repoContainer = page.getByText('Top repositories', { exact: true });

    this.repoListItems = page.locator('a[href^="/"]:has-text("/")');

    // Repository search controls
    this.repoSearchButton = page.getByTestId(
      'dynamic-side-panel-items-search-button'
    );

    this.repoSearchInput = page.getByTestId(
      'dynamic-side-panel-items-search-input'
    );

    // LaunchPad project link
    this.launchpadProjectLink = page
      .getByRole('link', { name: /LaunchPad/i })
      .first();

    // Board controls
    this.breadcrumbLaunchpadLink = page
      .getByRole('navigation', { name: 'Breadcrumbs' })
      .getByRole('link', { name: 'LaunchPad' });

    this.filterInput = page.getByRole('combobox', {
      name: 'Filter',
      exact: true,
    });

    // Backlog controls
    this.addItemButton = page
      .getByRole('button', { name: /Add item to Backlog|Add item/i })
      .first();

    this.addItemInput = page.getByRole('combobox', {
      name: /Start typing to create an item/i,
    });
  }

  /**
   * Opens GitHub homepage
   */
  async goToLaunchpad() {
    await this.page.goto('https://github.com/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(this.repoContainer).toBeVisible({ timeout: 15000 });
  }

  /**
   * Filters repositories in the sidebar
   * @param {string} searchTerm
   */
  async filterRepositories(searchTerm) {
    await expect(this.repoSearchButton).toBeVisible();
    await this.repoSearchButton.click();

    await expect(this.repoSearchInput).toBeVisible();
    await this.repoSearchInput.fill(searchTerm);
  }

  /**
   * Opens the repository's Projects page
   */
  async goToRepositoryProjects() {
    await this.page.goto(
      'https://github.com/Bhrish/github-project-training/projects',
      { waitUntil: 'domcontentloaded' }
    );
  }

  /**
   * Opens the LaunchPad project dashboard directly
   */
  async openLaunchpadProject() {
    // 1. Navigate until the DOM is parsed (the board hydrates afterwards)
    await this.page.goto('https://github.com/orgs/Bhrish/projects/71', {
      waitUntil: 'domcontentloaded',
    });

    await expect(this.page).toHaveURL(/\/orgs\/Bhrish\/projects\/71/);

    // 2. Breadcrumb link exists in the page's accessibility tree
    await expect(this.breadcrumbLaunchpadLink).toBeVisible({ timeout: 20000 });

    // 3. Board is hydrated once the filter input is available
    await expect(this.filterInput).toBeVisible({ timeout: 20000 });
  }

  /**
   * Creates a new GitHub issue from the LaunchPad board.
   * @param {string} issueTitle
   */
  async createIssue(issueTitle) {
    // Step 1: Click Add item
    await expect(this.addItemButton).toBeVisible({ timeout: 10000 });
    await this.addItemButton.click();

    // Step 2: Wait for the inline input at the bottom of Backlog
    await expect(this.addItemInput).toBeVisible({ timeout: 10000 });

    // Step 3: Enter the issue title
    await this.addItemInput.fill(issueTitle);

    // Step 4: Press Enter to open creation option menu
    await this.addItemInput.press('Enter');

    // Step 5: Wait for the creation dialog modal
    const createDialog = this.page.getByRole('dialog');
    await expect(createDialog).toBeVisible({ timeout: 10000 });

    // Step 6: Verify the title is populated
    await expect(
      createDialog.getByRole('textbox', { name: /add a title/i })
    ).toHaveValue(issueTitle);

    // Step 7: Submit via explicit button or shortcut
    const createButton = createDialog.getByTestId('create-issue-button');

    if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createButton.click();
    } else {
      await createDialog.press('Control+Enter');
    }

    // Step 8: Wait for the dialog to close
    await expect(createDialog).toBeHidden({ timeout: 15000 });

    // Step 9: Verify the issue appears on the board
    await expect(
      this.page.getByText(issueTitle, { exact: true }).first()
    ).toBeVisible({ timeout: 15000 });
  }
}