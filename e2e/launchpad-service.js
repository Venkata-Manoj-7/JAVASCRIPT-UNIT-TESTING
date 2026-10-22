import { expect } from '@playwright/test';
import testData from './fixtures/testData.json' with { type: 'json' };

export class LaunchpadService {
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
      name: /LaunchPad/i,
    }).first();
  }

  async goToLaunchpad() {
    await this.page.goto(testData.urls.launchpad);
    await expect(this.repoContainer).toBeVisible();
  }

  async filterRepositories(searchTerm) {
    await this.repoSearchButton.click();
    await this.repoSearchInput.fill(searchTerm);
  }

  async goToRepositoryProjects() {
    await this.page.goto(testData.urls.repositoryProjects);
  }

  async openLaunchpadProject() {
    await this.goToRepositoryProjects();
    await this.launchpadProjectLink.click();
  }
}