import { expect, Locator, Page } from '@playwright/test';

export interface TableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class WebTablesPage {
  readonly page: Page;
  readonly url: string = 'https://demoqa.com/webtables';

  // Locators
  readonly addNewRecordButton: Locator;
  readonly modalContent: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly userEmailInput: Locator;
  readonly ageInput: Locator;
  readonly salaryInput: Locator;
  readonly departmentInput: Locator;
  readonly submitButton: Locator;
  readonly searchBox: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addNewRecordButton = page.locator('#addNewRecordButton');
    this.modalContent = page.locator('.modal-content');
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.userEmailInput = page.locator('#userEmail');
    this.ageInput = page.locator('#age');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.submitButton = page.locator('#submit');
    this.searchBox = page.locator('#searchBox');
    this.tableRows = page.locator('tbody tr');
  }

  /**
   * Открыть страницу Web Tables
   */
  async open() {
    await this.page.goto(this.url);
  }

  /**
   * Открыть модальную форму добавления записи
   */
  async openAddForm() {
    await this.addNewRecordButton.click();
    await expect(this.modalContent).toBeVisible();
  }

  /**
   * Заполнить поля формы
   */
  async fillForm(data: Partial<TableRecord>) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.email !== undefined) await this.userEmailInput.fill(data.email);
    if (data.age !== undefined) await this.ageInput.fill(data.age);
    if (data.salary !== undefined) await this.salaryInput.fill(data.salary);
    if (data.department !== undefined) await this.departmentInput.fill(data.department);
  }

  /**
   * Нажать Submit и дождаться закрытия модальной формы
   */
  async submitForm() {
    await this.submitButton.click();
    await expect(this.modalContent).toBeHidden();
  }

  /**
   * Полный цикл создания записи (Create)
   */
  async createRecord(record: TableRecord) {
    await this.openAddForm();
    await this.fillForm(record);
    await this.submitForm();
  }

  /**
   * Поиск по строке в таблице (Read / Filter)
   */
  async search(query: string) {
    await this.searchBox.fill(query);
  }

  /**
   * Получить локатор строки по email
   */
  getRowByEmail(email: string): Locator {
    return this.tableRows.filter({ hasText: email });
  }

  /**
   * Открыть форму редактирования для записи с указанным email
   */
  async openEditForm(email: string) {
    const row = this.getRowByEmail(email);
    await row.locator('[id^="edit-record-"]').click();
    await expect(this.modalContent).toBeVisible();
  }

  /**
   * Полный цикл редактирования записи (Update)
   */
  async editRecord(email: string, updatedData: Partial<TableRecord>) {
    await this.openEditForm(email);
    await this.fillForm(updatedData);
    await this.submitForm();
  }

  /**
   * Удалить запись по email (Delete)
   */
  async deleteRecord(email: string) {
    const row = this.getRowByEmail(email);
    await row.locator('[id^="delete-record-"]').click();
  }
}
