import { test, expect, Page } from '@playwright/test';
 
const BASE = 'https://opensource-demo.orangehrmlive.com';
 
async function login(page: Page, username: string, password: string) {
  await page.goto(`${BASE}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
}
 
test('адмін створює працівника, працівник логіниться', async ({ browser }) => {
  test.setTimeout(90000);
  const id = Date.now().toString().slice(-6);
  const employee = {
    firstName: 'Test',
    lastName: `User${id}`,
    username: `user_${id}`,
    password: `P@ssword${id}!`, // надійний пароль з спецсимволом, цифрами та літерами
  };
 
  // Дві ізольовані сесії
  const adminContext = await browser.newContext();
  const employeeContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const employeePage = await employeeContext.newPage();
 
  // Адмін створює працівника з логіном
  await login(adminPage, 'Admin', 'admin123');
  await adminPage.goto(`${BASE}/web/index.php/pim/addEmployee`);
 
  await adminPage.getByPlaceholder('First Name').fill(employee.firstName);
  await adminPage.getByPlaceholder('Last Name').fill(employee.lastName);
 
  // перемикач "Create Login Details"
  await adminPage.locator('.oxd-switch-input').click();
 
  await adminPage
    .locator('.oxd-input-group', { hasText: 'Username' })
    .first()
    .locator('input')
    .fill(employee.username);
 
  const passwordInputs = adminPage.locator('input[type="password"]');
  await passwordInputs.nth(0).fill(employee.password); // Password
  await passwordInputs.nth(1).fill(employee.password); // Confirm Password
 
  await adminPage.getByRole('button', { name: 'Save' }).click();
  await expect(
    adminPage.getByText('Successfully Saved')
      .or(adminPage.locator('.oxd-toast'))
      .or(adminPage.locator('text=Personal Details'))
  ).toBeVisible({ timeout: 20000 });
 
  // Працівник логіниться у своїй сесії
  await login(employeePage, employee.username, employee.password);
 
  await expect(
    employeePage.locator('.oxd-userdropdown-name')
  ).toContainText(employee.firstName, { timeout: 15000 });
 
  // Звичайний працівник не бачить розділу Admin
  await expect(
    employeePage.getByRole('link', { name: 'Admin' })
  ).toHaveCount(0);
 
  await adminContext.close();
  await employeeContext.close();
});