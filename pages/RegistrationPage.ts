import {expect, Locator, Page} from '@playwright/test';
import { Header } from './components/Header';

export class RegistrationPage {

    readonly page: Page;

    readonly emailField: Locator;

    readonly firstNameField: Locator;

    readonly lastNameField: Locator;

    readonly passwordField: Locator;

    readonly eyeIconFirst: Locator;

    readonly eyeIconLast: Locator;

    readonly repeatPasswordField: Locator;

    readonly continueButton: Locator;

    readonly checkYourEmailMessageBlock: Locator;

    readonly header: Header;



    constructor(page: Page) {

        this.page = page;

        this.emailField = page.locator('#email');

        this.firstNameField = page.locator('#first_name');

        this.lastNameField = page.locator('#last_name');

        this.passwordField = page.locator('#password');

        this.eyeIconFirst = page.locator('#eyeIcon').first();

        this.eyeIconLast = page.locator('#eyeIcon').last();

        this.repeatPasswordField = page.locator('#password_repeat');

        this.continueButton = page.locator('button[type="submit"]');

        this.checkYourEmailMessageBlock = page.locator('uk-alert-success');

        this.header = new Header(page);

    }

    async fillEmailField() {
        await expect(this.emailField).toBeVisible();
        await expect(this.emailField).toBeEnabled();
        await expect(this.emailField).toHaveAttribute('placeholder', 'Email: we send your confirmations and receipts here.');
        await (this.emailField).fill('qa@gmail.com');
        await expect(this.emailField).toHaveValue('qa@gmail.com');
    }

    async fillFirstNameField() {
        await expect(this.firstNameField).toBeVisible();
        await expect(this.firstNameField).toBeEnabled();
        await expect(this.firstNameField).toHaveAttribute('placeholder', 'First Name');
        await (this.firstNameField).fill('QA');
        await expect(this.firstNameField).toHaveValue('QA');
    }

    async fillLastNameField() {
        await expect(this.lastNameField).toBeVisible();
        await expect(this.lastNameField).toBeEnabled();
        await expect(this.lastNameField).toHaveAttribute('placeholder', 'Last Name');
        await (this.lastNameField).fill('Test');
        await expect(this.lastNameField).toHaveValue('Test');
    }

    async fillPasswordField() {
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        await expect(this.passwordField).toHaveAttribute('placeholder', 'Password (8 characters alphanumeric)');
        await (this.passwordField).fill('testing');
        await expect(this.passwordField).toHaveValue('testing');
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        await (this.eyeIconFirst).click();
        await expect(this.passwordField).toHaveAttribute('type', 'text');
    }

    async fillRepeatPasswordField() {
        await expect(this.repeatPasswordField).toBeVisible();
        await expect(this.repeatPasswordField).toBeEnabled();
        await expect(this.repeatPasswordField).toHaveAttribute('placeholder', 'Repeat Password');
        await (this.repeatPasswordField).fill('testing');
        await expect(this.repeatPasswordField).toHaveValue('testing');
        await expect(this.repeatPasswordField).toHaveAttribute('type', 'password');
        await (this.eyeIconLast).click();
        await expect(this.repeatPasswordField).toHaveAttribute('type', 'text');
    }

    async clickContinueButton() {
        await expect(this.continueButton).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
        await expect(this.continueButton).toHaveAttribute('type', 'submit');
        await (this.continueButton).click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/create_profile.php');
        await expect(this.checkYourEmailMessageBlock).toBeVisible();
        await expect(this.checkYourEmailMessageBlock).toBeEnabled();
        await expect(this.checkYourEmailMessageBlock).toHaveText("Please check your email for your Activation Button. Click it and you'll come right back here and be able to start registering immediately.");
    }
}