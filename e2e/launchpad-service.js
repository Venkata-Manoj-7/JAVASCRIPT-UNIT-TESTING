import { expect } from '@playwright/test';
export class LaunchpadService {
  constructor(page) {
    this.page = page;
    this.userAvatarButton = page
      .locator('header button:has(img), header button:has(.avatar)')
      .last();
    this.globalSearchInput = page
      .getByRole('button', { name: /search/i })
      .first();
    this.repoContainer = page.getByText('Top repositories', { exact: true });
    this.repoListItems = page.locator('a[href^="/"]:has-text("/")');
    this.repoSearchButton = page.getByTestId(
      'dynamic-side-panel-items-search-button'
    );
    this.repoSearchInput = page.getByTestId(
      'dynamic-side-panel-items-search-input'
    );
    this.launchpadProjectLink = page
      .getByRole('link', { name: /LaunchPad/i })
      .first();
    this.breadcrumbLaunchpadLink = page
      .getByRole('navigation', { name: 'Breadcrumbs' })
      .getByRole('link', { name: 'LaunchPad' });

    this.filterInput = page.getByRole('combobox', {
      name: 'Filter',
      exact: true,
    });
    this.addItemButton = page
      .getByRole('button', { name: /Add item to Backlog|Add item/i })
      .first();

    this.addItemInput = page.getByRole('combobox', {
      name: /Start typing to create an item/i,
    });
  }
  async goToLaunchpad() {
    await this.page.goto('https://github.com/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(this.repoContainer).toBeVisible({ timeout: 15000 });
  }
  async filterRepositories(searchTerm) {
    await expect(this.repoSearchButton).toBeVisible();
    await this.repoSearchButton.click();

    await expect(this.repoSearchInput).toBeVisible();
    await this.repoSearchInput.fill(searchTerm);
  }
  async goToRepositoryProjects() {
    await this.page.goto(
      'https://github.com/Bhrish/github-project-training/projects',
      { waitUntil: 'domcontentloaded' }
    );
  }

  async openLaunchpadProject() {
    await this.page.goto('https://github.com/orgs/Bhrish/projects/71', {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.page).toHaveURL(/\/orgs\/Bhrish\/projects\/71/);
    await expect(this.breadcrumbLaunchpadLink).toBeVisible({ timeout: 20000 });
    await expect(this.filterInput).toBeVisible({ timeout: 20000 });
  }
  async createIssue(issueTitle) {
    await expect(this.addItemButton).toBeVisible({ timeout: 10000 });
    await this.addItemButton.click();
    await expect(this.addItemInput).toBeVisible({ timeout: 10000 });
    await this.addItemInput.fill(issueTitle);
    await this.addItemInput.press('Enter');
    const createDialog = this.page.getByRole('dialog');
    await expect(createDialog).toBeVisible({ timeout: 10000 });
    await expect(
      createDialog.getByRole('textbox', { name: /add a title/i })
    ).toHaveValue(issueTitle)
    const createButton = createDialog.getByTestId('create-issue-button');
    if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createButton.click();
    } else {
      await createDialog.press('Control+Enter');
    }
    await expect(createDialog).toBeHidden({ timeout: 15000 });
    const escapedTitle = issueTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(
      this.page.getByRole('button', { name: new RegExp(escapedTitle) }).first()
    ).toBeVisible({ timeout: 15000 });
  }
}
