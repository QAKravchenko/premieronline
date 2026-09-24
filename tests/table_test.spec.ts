import { test, expect } from '@playwright/test';
import { WebTablesPage, TableRecord } from '../pages/WebTablesPage';

/**
 * CRUD tests for https://demoqa.com/webtables
 *
 * Covers:
 *  - Create a new record
 *  - Read / search for a record
 *  - Update an existing record
 *  - Delete a record
 */
test.describe('DemoQA Web Tables — полный CRUD над одной записью', () => {
  let webTablesPage: WebTablesPage;

  test.beforeEach(async ({ page }) => {
    webTablesPage = new WebTablesPage(page);
    await webTablesPage.open();
  });

  test('Create → Read → Update → Delete одной и той же записи', async () => {
    // ---------- CREATE ----------
    const original: TableRecord = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: '30',
      salary: '50000',
      department: 'Engineering',
    };

    await webTablesPage.createRecord(original);

    let row = webTablesPage.getRowByEmail(original.email);
    await expect(row).toContainText(original.firstName);
    await expect(row).toContainText(original.lastName);
    await expect(row).toContainText(original.age);
    await expect(row).toContainText(original.salary);
    await expect(row).toContainText(original.department);

    // ---------- READ ----------
    await webTablesPage.search(original.email);
    row = webTablesPage.getRowByEmail(original.email);
    await expect(row).toBeVisible();

    // ---------- UPDATE ----------
    const updated: Partial<TableRecord> = {
      firstName: 'Johnny',
      salary: '55000',
      department: 'Product',
    };

    await webTablesPage.editRecord(original.email, updated);

    // Email не менялся, поэтому запись всё ещё находится по нему
    await webTablesPage.search(original.email);
    row = webTablesPage.getRowByEmail(original.email);
    await expect(row).toContainText(updated.firstName!);
    await expect(row).toContainText(updated.salary!);
    await expect(row).toContainText(updated.department!);

    // Поля, которые не меняли, должны остаться прежними
    await expect(row).toContainText(original.lastName);
    await expect(row).toContainText(original.age);

    // ---------- DELETE ----------
    await webTablesPage.deleteRecord(original.email);

    await webTablesPage.search(original.email);
    await expect(webTablesPage.getRowByEmail(original.email)).toHaveCount(0);
  });
});