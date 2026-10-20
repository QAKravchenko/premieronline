import { expect, Locator, Page } from '@playwright/test';
import { BaseActions } from '../../config/BaseActions';

export interface TableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class WebTablesPage extends BaseActions {
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
    super(page);

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
   * Navigate to Web Tables page
   */
  async open() {
    await this.goto(this.url);
  }

  /**
   * Open the new record modal dialog
   */
  async openAddForm() {
    await this.click(this.addNewRecordButton, 'Add New Record button');
    await this.checkIsVisible(this.modalContent, 'Record Form Modal');
  }

  /**
   * Fill record form fields
   */
  async fillForm(data: Partial<TableRecord>) {
    if (data.firstName !== undefined) await this.fill(this.firstNameInput, data.firstName, 'First Name input');
    if (data.lastName !== undefined) await this.fill(this.lastNameInput, data.lastName, 'Last Name input');
    if (data.email !== undefined) await this.fill(this.userEmailInput, data.email, 'User Email input');
    if (data.age !== undefined) await this.fill(this.ageInput, data.age, 'Age input');
    if (data.salary !== undefined) await this.fill(this.salaryInput, data.salary, 'Salary input');
    if (data.department !== undefined) await this.fill(this.departmentInput, data.department, 'Department input');
  }

  /**
   * Submit form and verify modal closes
   */
  async submitForm() {
    await this.click(this.submitButton, 'Submit button');
    await expect(this.modalContent).toBeHidden();
  }

  /**
   * Full creation lifecycle (Create)
   */
  async createRecord(record: TableRecord) {
    await this.openAddForm();
    await this.fillForm(record);
    await this.submitForm();
  }

  /**
   * Search / filter table by query (Read)
   */
  async search(query: string) {
    await this.fill(this.searchBox, query, 'Search box');
  }

  /**
   * Get row locator by user email
   */
  getRowByEmail(email: string): Locator {
    return this.tableRows.filter({ hasText: email });
  }

  /**
   * Open edit form for record with given email
   */
  async openEditForm(email: string) {
    const row = this.getRowByEmail(email);
    const editButton = row.locator('[id^="edit-record-"]');
    await this.click(editButton, `Edit button for ${email}`);
    await this.checkIsVisible(this.modalContent, 'Record Form Modal');
  }

  /**
   * Full record update lifecycle (Update)
   */
  async editRecord(email: string, updatedData: Partial<TableRecord>) {
    await this.openEditForm(email);
    await this.fillForm(updatedData);
    await this.submitForm();
  }

  /**
   * Delete record by email (Delete)
   */
  async deleteRecord(email: string) {
    const row = this.getRowByEmail(email);
    const deleteButton = row.locator('[id^="delete-record-"]');
    await this.click(deleteButton, `Delete button for ${email}`);
  }
}
