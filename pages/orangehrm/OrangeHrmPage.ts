import { expect, Page, Locator } from '@playwright/test';
import { BaseActions } from '../../config/BaseActions';

export class OrangeHrmPage extends BaseActions {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createLoginDetailsSwitch: Locator;
  readonly usernameEmployeeInput: Locator;
  readonly employeePasswordInputs: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly userDropdownName: Locator;
  readonly adminLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.createLoginDetailsSwitch = page.locator('.oxd-switch-input');
    this.usernameEmployeeInput = page.locator('.oxd-input-group', { hasText: 'Username' }).first().locator('input');
    this.employeePasswordInputs = page.locator('input[type="password"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Saved').first();
    this.userDropdownName = page.locator('.oxd-userdropdown-name');
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  async login(username: string, password: string) {
    await this.goto('/web/index.php/auth/login');
    await this.fill(this.usernameInput, username, 'Username input');
    await this.fill(this.passwordInput, password, 'Password input');
    await this.click(this.loginButton, 'Login button');
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 20000 });
  }

  async addEmployee(employee: { firstName: string; lastName: string; username: string; password: string }) {
    await this.goto('/web/index.php/pim/addEmployee');
    await this.fill(this.firstNameInput, employee.firstName, 'First Name input');
    await this.fill(this.lastNameInput, employee.lastName, 'Last Name input');
    await this.click(this.createLoginDetailsSwitch, 'Create Login Details switch');
    await this.fill(this.usernameEmployeeInput, employee.username, 'Employee username input');
    await this.fill(this.employeePasswordInputs.nth(0), employee.password, 'Employee password input');
    await this.fill(this.employeePasswordInputs.nth(1), employee.password, 'Employee password confirmation input');
    await this.click(this.saveButton, 'Save button');
    await expect(this.successMessage).toBeVisible({ timeout: 20000 });
  }
}
