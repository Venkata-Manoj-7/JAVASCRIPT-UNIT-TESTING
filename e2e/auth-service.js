// * Helper service for GitHub LaunchPad E2E authentication & navigation actions
export class AuthService {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    //this.launchPadUrl = 'https://github.com/orgs/Bhrish/projects/71';
    this.loginUrl = 'https://github.com/login';
    this.boardBody = page.locator('body');
  }

  // Action: Navigate to the LaunchPad board
  async goToLaunchPad() {
    await this.page.goto(this.loginUrl);
  }

  // Action: Verify main board UI container is visible
  async verifyBoardLoaded() {
    await this.boardBody.waitFor({ state: 'visible' });
  }
}