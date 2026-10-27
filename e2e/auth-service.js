export class AuthService {
   constructor(page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username or email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.errorMessage = page.locator('.flash-error');
  }
  async goToLogin() {
    await this.page.goto('https://github.com/login');
  }
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
