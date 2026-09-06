import { expect, Locator, Page } from '@playwright/test';
import { Header } from './components/Header';

export interface RegistrationData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    repeatPassword: string;
}

export class RegistrationPage {

    readonly page: Page;

    readonly header: Header;

    readonly emailField: Locator;

    readonly firstNameField: Locator;

    readonly lastNameField: Locator;

    readonly passwordField: Locator;

    readonly eyeIconFirst: Locator;

    readonly eyeIconLast: Locator;

    readonly repeatPasswordField: Locator;

    readonly continueButton: Locator;

    readonly checkYourEmailMessageBlock: Locator;

    readonly errorMessageEmptyEmailField: Locator;

    readonly errorMessageIncorrectEmailField: Locator;

    readonly errorMessageFirstNameField: Locator;   

    readonly errorMessageLastNameField: Locator;

    readonly errorMessagePasswordField: Locator;

    readonly errorMessageDifferentPasswords: Locator;

    

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

        this.errorMessageEmptyEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your email address.' });

        this.errorMessageIncorrectEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Your email address is incorrect.' });

        this.errorMessageFirstNameField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your first name.' });

        this.errorMessageLastNameField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your last name.' });

        this.errorMessagePasswordField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter a password.' });
        
        this.errorMessageDifferentPasswords = page.locator('.uk-alert-danger').filter({ hasText: "Your passwords don't match." });

        this.header = new Header(page);

    }

    async checkPasswordVisibilityToggle() {
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        await this.eyeIconFirst.click();
        await expect(this.passwordField).toHaveAttribute('type', 'text');
        await expect(this.repeatPasswordField).toHaveAttribute('type', 'password');
        await this.eyeIconLast.click();
        await expect(this.repeatPasswordField).toHaveAttribute('type', 'text');
    }

    async register(data: RegistrationData): Promise<void> {
        await this.emailField.fill(data.email);
        await this.firstNameField.fill(data.firstName);
        await this.lastNameField.fill(data.lastName);
        await this.passwordField.fill(data.password);
        await this.repeatPasswordField.fill(data.repeatPassword);
        await expect(this.emailField).toHaveValue(data.email);
        await expect(this.firstNameField).toHaveValue(data.firstName);
        await expect(this.lastNameField).toHaveValue(data.lastName);
        await expect(this.passwordField).toHaveValue(data.password);
        await expect(this.repeatPasswordField).toHaveValue(data.repeatPassword);
        await this.clickContinueButton();
    }

    async checkEmailField() {
        await expect(this.emailField).toBeVisible();
        await expect(this.emailField).toBeEnabled();
        await expect(this.emailField).toHaveAttribute('placeholder', 'Email: we send your confirmations and receipts here.');
        //await (this.emailField).fill(email);
        //await expect(this.emailField).toHaveValue();
    }

    async checkFirstNameField() {
        await expect(this.firstNameField).toBeVisible();
        await expect(this.firstNameField).toBeEnabled();
        await expect(this.firstNameField).toHaveAttribute('placeholder', 'First Name');
        //await (this.firstNameField).fill(firstName);
        //await expect(this.firstNameField).toHaveValue(firstName);
    }

    async checkLastNameField() {
        await expect(this.lastNameField).toBeVisible();
        await expect(this.lastNameField).toBeEnabled();
        await expect(this.lastNameField).toHaveAttribute('placeholder', 'Last Name');
        //await (this.lastNameField).fill(lastName);
        //await expect(this.lastNameField).toHaveValue(lastName);
    }

   
    async checkPasswordField() {
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        await expect(this.passwordField).toHaveAttribute('placeholder', 'Password (8 characters alphanumeric)');
        //await (this.passwordField).fill(password);
        //await expect(this.passwordField).toHaveValue(password);
        //await expect(this.passwordField).toHaveAttribute('type', 'password');
        //await this.eyeIconFirst.click();
        //await expect(this.passwordField).toHaveAttribute('type', 'text');
    }

    async checkRepeatPasswordField() {
        await expect(this.repeatPasswordField).toBeVisible();
        await expect(this.repeatPasswordField).toBeEnabled();
        await expect(this.repeatPasswordField).toHaveAttribute('placeholder', 'Repeat Password');
        //await (this.repeatPasswordField).fill(repeatPassword);
        //await expect(this.repeatPasswordField).toHaveValue(repeatPassword);
        //await expect(this.repeatPasswordField).toHaveAttribute('type', 'password');
        //await this.eyeIconLast.click();
        //await expect(this.repeatPasswordField).toHaveAttribute('type', 'text');
    }

    async clickContinueButton() {
        await expect(this.continueButton).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
        await expect(this.continueButton).toHaveAttribute('type', 'submit');
        await this.continueButton.click();
    }    

    async checkSuccessfulRegistration(value: string) {    
        await expect(this.page).toHaveURL('https://www.premieronline.com/create_profile.php');
        await expect(this.checkYourEmailMessageBlock).toBeVisible();
        await expect(this.checkYourEmailMessageBlock).toBeEnabled();
        await expect(this.checkYourEmailMessageBlock).toHaveText(value);
    }

    async checkErrorMessageEmptyEmailField() {
        await expect(this.errorMessageEmptyEmailField).toBeVisible();
        await expect(this.errorMessageEmptyEmailField).toBeEnabled();
        await expect(this.errorMessageEmptyEmailField).toContainText('Please enter your email address.');
    }

    async checkErrorMessageIncorrectEmailField() {
        await expect(this.errorMessageIncorrectEmailField).toBeVisible();
        await expect(this.errorMessageIncorrectEmailField).toBeEnabled();
        await expect(this.errorMessageIncorrectEmailField).toContainText('Your email address is incorrect.');
    }

    async checkErrorMessageEmptyFirstNameField() {
        await expect(this.errorMessageFirstNameField).toBeVisible();
        await expect(this.errorMessageFirstNameField).toBeEnabled();
        await expect(this.errorMessageFirstNameField).toContainText('Please enter your first name.');
    }

    async checkErrorMessageEmptyLastNameField() {
        await expect(this.errorMessageLastNameField).toBeVisible();
        await expect(this.errorMessageLastNameField).toBeEnabled();
        await expect(this.errorMessageLastNameField).toContainText('Please enter your last name.');
    }

    async checkErrorMessageEmptyPasswordField() {
        await expect(this.errorMessagePasswordField).toBeVisible();
        await expect(this.errorMessagePasswordField).toBeEnabled();
        await expect(this.errorMessagePasswordField).toContainText('Please enter a password.');
    }

    async checkErrorMessageDifferentPasswords() {
        await expect(this.errorMessageDifferentPasswords).toBeVisible();
        await expect(this.errorMessageDifferentPasswords).toBeEnabled();
        await expect(this.errorMessageDifferentPasswords).toContainText("Your passwords don't match.");
    }
}