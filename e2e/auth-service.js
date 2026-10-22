// e2e/auth-service.js

export class AuthService {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Core locators for GitHub Login page
    this.usernameInput = page.getByLabel('Username or email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.errorMessage = page.locator('.flash-error');
  }

  /**
   * Navigates directly to the GitHub login page
   */
  async goToLogin() {
    await this.page.goto('https://github.com/login');
  }

  /**
   * Fills in credentials and submits the login form
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}