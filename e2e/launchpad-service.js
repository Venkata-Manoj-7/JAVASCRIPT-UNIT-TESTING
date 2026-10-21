
import { expect } from '@playwright/test';

export class LaunchpadService {
  constructor(page) {
    this.page = page;

    // Header controls
    this.userAvatarButton = page.locator(
      'header button:has(img), header button:has(.avatar)'
    ).last();

    this.globalSearchInput = page.getByRole('button', {
      name: /search/i,
    }).first();

    // Repository sidebar
    this.repoContainer = page.getByText('Top repositories', {
      exact: true,
    });

    this.repoListItems = page.locator(
      'a[href^="/"]:has-text("/")'
    );

 this.repoSearchInput = page.getByTestId(
  'dynamic-side-panel-items-search-input'
);
  }

  async goToLaunchpad() {
    await this.page.goto('https://github.com/');
    await expect(this.page.getByText('Top repositories', {
      exact: true,
    })).toBeVisible();
  }

  async filterRepositories(searchTerm) {
    const repoSearchButton = this.page.getByTestId(
    'dynamic-side-panel-items-search-button'
  );

  await expect(repoSearchButton).toBeVisible();
  await repoSearchButton.click();

  await expect(this.repoSearchInput).toBeVisible();
  await this.repoSearchInput.fill(searchTerm);
  }
}
