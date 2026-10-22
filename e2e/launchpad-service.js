
import { expect } from '@playwright/test';

export class LaunchpadService {
  /**
   * @param {import('@playwright/test').Page} page
   */
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

    // Repository search controls
    this.repoSearchButton = page.getByTestId(
      'dynamic-side-panel-items-search-button'
    );

    this.repoSearchInput = page.getByTestId(
      'dynamic-side-panel-items-search-input'
    );

    // LaunchPad project link
    this.launchpadProjectLink = page.getByRole('link', {
      name: /LaunchPad/i,
    }).first();
  }

  /**
   * Opens GitHub homepage
   */
  async goToLaunchpad() {
    await this.page.goto('https://github.com/');

    await expect(
      this.page.getByText('Top repositories', {
        exact: true,
      })
    ).toBeVisible();
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
      'https://github.com/Bhrish/github-project-training/projects'
    );

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Opens the LaunchPad project dashboard
   */
  async openLaunchpadProject() {
    await this.goToRepositoryProjects();

    await expect(this.launchpadProjectLink).toBeVisible({
      timeout: 15000,
    });

    await this.launchpadProjectLink.click();
  }
}
