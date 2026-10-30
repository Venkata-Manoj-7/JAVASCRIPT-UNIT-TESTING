export class AuthService {
  
  constructor(page) {
    this.page = page;
    // Uses GitHub's exact form IDs with getByLabel fallbacks
    this.usernameInput = page.locator('#login_field');
    this.passwordInput = page.locator('#password');
    this.errorMessage = page.locator('.flash-error:visible');
    this.submitButton = page.locator('input[type="submit"][name="commit"]');
  }

  async goToLogin() {
    await this.page.goto('https://github.com/login');
    await this.page.waitForLoadState('domcontentloaded');
  }
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
