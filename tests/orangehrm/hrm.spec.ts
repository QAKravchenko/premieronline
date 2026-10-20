import { test, expect } from '@playwright/test';
import { OrangeHrmPage } from '../../pages/orangehrm/OrangeHrmPage';

test.describe('OrangeHRM - Employee Management & Access Control', () => {
  test('should allow admin to create an employee and verify employee can log in with restricted access', async ({ browser }) => {
    test.setTimeout(90000);
    const id = Date.now().toString().slice(-6);
    const employee = {
      firstName: 'Test',
      lastName: `User${id}`,
      username: `user_${id}`,
      password: `P@ssword${id}!`,
    };

    // Дві ізольовані сесії
    const adminContext = await browser.newContext();
    const employeeContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const employeePage = await employeeContext.newPage();

    const adminHrm = new OrangeHrmPage(adminPage);
    const employeeHrm = new OrangeHrmPage(employeePage);

    // Адмін створює працівника з логіном
    await adminHrm.login('Admin', 'admin123');
    await adminHrm.addEmployee(employee);

    // Працівник логіниться у своїй сесії
    await employeeHrm.login(employee.username, employee.password);

    await expect(employeeHrm.userDropdownName).toContainText(employee.firstName, { timeout: 15000 });

    // Звичайний працівник не бачить розділу Admin
    await expect(employeeHrm.adminLink).toHaveCount(0);

    await adminContext.close();
    await employeeContext.close();
  });
});
