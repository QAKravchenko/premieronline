import { test, expect, Page } from '@playwright/test';
 
/**

* CRUD tests for https://demoqa.com/webtables

*

* Covers:

*  - Create a new record

*  - Read / search for a record

*  - Update an existing record

*  - Delete a record

*/
 
const URL = 'https://demoqa.com/webtables';
 
type Record = {

  firstName: string;

  lastName: string;

  email: string;

  age: string;

  salary: string;

  department: string;

};
 
async function openAddForm(page: Page) {

  await page.click('#addNewRecordButton');

  await expect(page.locator('.modal-content')).toBeVisible();

  await expect(page.locator('.modal-content')).toBeEnabled();

}
 
async function fillForm(page: Page, rec: Record) {

  await page.fill('#firstName', rec.firstName);

  await page.fill('#lastName', rec.lastName);

  await page.fill('#userEmail', rec.email);

  await page.fill('#age', rec.age);

  await page.fill('#salary', rec.salary);

  await page.fill('#department', rec.department);

}
 
async function submitForm(page: Page) {

  await page.click('#submit');

  await expect(page.locator('.modal-content')).toBeHidden();

}
 
function rowByEmail(page: Page, email: string) {

  return page.locator('tbody tr', { hasText: email });

}
 
test.describe('DemoQA Web Tables — полный CRUD над одной записью', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto(URL);

    await expect(page.locator('#addNewRecordButton')).toBeVisible();

    await expect(page.locator('#addNewRecordButton')).toBeEnabled();

  });
 
  test('Create → Read → Update → Delete одной и той же записи', async ({ page }) => {

    // ---------- CREATE ----------

    const original: Record = {

      firstName: 'John',

      lastName: 'Doe',

      email: 'john.doe@example.com',

      age: '30',

      salary: '50000',

      department: 'Engineering',

    };
 
    await openAddForm(page);

    await fillForm(page, original);

    await submitForm(page);
 
    let row = rowByEmail(page, original.email);

    await expect(row).toContainText(original.firstName);

    await expect(row).toContainText(original.lastName);

    await expect(row).toContainText(original.age);

    await expect(row).toContainText(original.salary);

    await expect(row).toContainText(original.department);
 
    // ---------- READ ----------

    await page.fill('#searchBox', original.email);

    row = rowByEmail(page, original.email);

    await expect(row).toBeVisible();

    await expect(page.locator('.table-striped').first);
 
    // ---------- UPDATE ----------

    await row.locator('[id^="edit-record-"]').click();

    await expect(page.locator('.modal-content')).toBeVisible();
 
    const updated: Partial<Record> = {

      firstName: 'Johnny',

      salary: '55000',

      department: 'Product',

    };
 
    await page.fill('#firstName', '');

    await page.fill('#firstName', updated.firstName!);

    await page.fill('#salary', '');

    await page.fill('#salary', updated.salary!);

    await page.fill('#department', '');

    await page.fill('#department', updated.department!);

    await submitForm(page);
 
    // Email не менялся, поэтому запись всё ещё находится по нему.

    await page.fill('#searchBox', original.email);

    row = rowByEmail(page, original.email);

    await expect(row).toContainText(updated.firstName!);

    await expect(row).toContainText(updated.salary!);

    await expect(row).toContainText(updated.department!);

    // Поля, которые не трогали, должны остаться прежними.

    await expect(row).toContainText(original.lastName);

    await expect(row).toContainText(original.age);
 
    // ---------- DELETE ----------

    await row.locator('[id^="delete-record-"]').click();
 
    await page.fill('#searchBox', original.email);

    await expect(page.locator('tbody tr', { hasText: 'john.doe@example.com' })).toHaveCount(0);

  });

});

 