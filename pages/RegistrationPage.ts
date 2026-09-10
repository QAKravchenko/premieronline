import { expect, Locator, Page } from '@playwright/test';
import { Header } from './components/Header';
import { BaseActions } from '../config/BaseActions';

export interface RegistrationData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    repeatPassword: string;
}

export class RegistrationPage extends BaseActions {

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

        super(page);

        this.emailField = page.locator('#email');

        this.firstNameField = page.locator('#first_name');

        this.lastNameField = page.locator('#last_name');

        this.passwordField = page.locator('#password');

        this.eyeIconFirst = page.locator('#eyeIcon').first();

        this.eyeIconLast = page.locator('#eyeIcon').last();

        this.repeatPasswordField = page.locator('#password_repeat');

        this.continueButton = page.locator('button[type="submit"]');

        this.checkYourEmailMessageBlock = page.locator('.uk-alert-success');

        this.errorMessageEmptyEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your email address.' });

        this.errorMessageIncorrectEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Your email address is incorrect.' });

        this.errorMessageFirstNameField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your first name.' });

        this.errorMessageLastNameField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter your last name.' });

        this.errorMessagePasswordField = page.locator('.uk-alert-danger').filter({ hasText: 'Please enter a password.' });
        
        this.errorMessageDifferentPasswords = page.locator('.uk-alert-danger').filter({ hasText: "Your passwords don't match." });

        this.header = new Header(page);

    }

    async checkPasswordVisibilityToggle() {
        await this.checkAttribute(this.passwordField, 'type', 'password', 'Password Field');
        await this.click(this.eyeIconFirst, 'First Eye Icon');
        await this.checkAttribute(this.passwordField, 'type', 'text', 'Password Field');
        await this.checkAttribute(this.repeatPasswordField, 'type', 'password', 'Repeat Password Field');
        await this.click(this.eyeIconLast, 'Last Eye Icon');
        await this.checkAttribute(this.repeatPasswordField, 'type', 'text', 'Repeat Password Field');
    }

    async register(data: RegistrationData): Promise<void> {
        await this.fill(this.emailField, data.email, 'Email Field');
        await this.fill(this.firstNameField, data.firstName, 'First Name Field');
        await this.fill(this.lastNameField, data.lastName, 'Last Name Field');
        await this.fill(this.passwordField, data.password, 'Password Field');
        await this.fill(this.repeatPasswordField, data.repeatPassword, 'Repeat Password Field');
        
        await this.checkValue(this.emailField, data.email, 'Email Field');
        await this.checkValue(this.firstNameField, data.firstName, 'First Name Field');
        await this.checkValue(this.lastNameField, data.lastName, 'Last Name Field');
        await this.checkValue(this.passwordField, data.password, 'Password Field');
        await this.checkValue(this.repeatPasswordField, data.repeatPassword, 'Repeat Password Field');
        await this.clickContinueButton();
    }

    async checkEmailField() {
        await this.checkIsVisible(this.emailField, 'Email Field');
        await this.checkIsEnabled(this.emailField, 'Email Field');
        await this.checkAttribute(this.emailField, 'placeholder', 'Email: we send your confirmations and receipts here.', 'Email Field');
    }

    async checkFirstNameField() {
        await this.checkIsVisible(this.firstNameField, 'First Name Field');
        await this.checkIsEnabled(this.firstNameField, 'First Name Field');
        await this.checkAttribute(this.firstNameField, 'placeholder', 'First Name', 'First Name Field');
    }

    async checkLastNameField() {
        await this.checkIsVisible(this.lastNameField, 'Last Name Field');
        await this.checkIsEnabled(this.lastNameField, 'Last Name Field');
        await this.checkAttribute(this.lastNameField, 'placeholder', 'Last Name', 'Last Name Field');
    }

   
    async checkPasswordField() {
        await this.checkIsVisible(this.passwordField, 'Password Field');
        await this.checkIsEnabled(this.passwordField, 'Password Field');
        await this.checkAttribute(this.passwordField, 'placeholder', 'Password (8 characters alphanumeric)', 'Password Field');
    }

    async checkRepeatPasswordField() {
        await this.checkIsVisible(this.repeatPasswordField, 'Repeat Password Field');
        await this.checkIsEnabled(this.repeatPasswordField, 'Repeat Password Field');
        await this.checkAttribute(this.repeatPasswordField, 'placeholder', 'Repeat Password', 'Repeat Password Field');
    }

    async clickContinueButton() {
        await this.checkAttribute(this.continueButton, 'type', 'submit', 'Continue Button');
        await this.click(this.continueButton, 'Continue Button');
    }    

    async checkSuccessfulRegistration(value: string) {    
        await this.checkUrl('https://www.premieronline.com/create_profile.php');
        await this.checkIsVisible(this.checkYourEmailMessageBlock, 'Check Your Email Message Block');
        await this.checkIsEnabled(this.checkYourEmailMessageBlock, 'Check Your Email Message Block');
        await this.checkExactText(this.checkYourEmailMessageBlock, value, 'Check Your Email Message Block');
    }

    async checkErrorMessageEmptyEmailField() {
        await this.checkIsVisible(this.errorMessageEmptyEmailField, 'Error Message Empty Email Field');
        await this.checkIsEnabled(this.errorMessageEmptyEmailField, 'Error Message Empty Email Field');
        await this.checkText(this.errorMessageEmptyEmailField, 'Please enter your email address.', 'Error Message Empty Email Field');
    }

    async checkErrorMessageIncorrectEmailField() {
        await this.checkIsVisible(this.errorMessageIncorrectEmailField, 'Error Message Incorrect Email Field');
        await this.checkIsEnabled(this.errorMessageIncorrectEmailField, 'Error Message Incorrect Email Field');
        await this.checkText(this.errorMessageIncorrectEmailField, 'Your email address is incorrect.', 'Error Message Incorrect Email Field');
    }

    async checkErrorMessageEmptyFirstNameField() {
        await this.checkIsVisible(this.errorMessageFirstNameField, 'Error Message Empty First Name Field');
        await this.checkIsEnabled(this.errorMessageFirstNameField, 'Error Message Empty First Name Field');
        await this.checkText(this.errorMessageFirstNameField, 'Please enter your first name.', 'Error Message Empty First Name Field');
    }

    async checkErrorMessageEmptyLastNameField() {
        await this.checkIsVisible(this.errorMessageLastNameField, 'Error Message Empty Last Name Field');
        await this.checkIsEnabled(this.errorMessageLastNameField, 'Error Message Empty Last Name Field');
        await this.checkText(this.errorMessageLastNameField, 'Please enter your last name.', 'Error Message Empty Last Name Field');
    }

    async checkErrorMessageEmptyPasswordField() {
        await this.checkIsVisible(this.errorMessagePasswordField, 'Error Message Empty Password Field');
        await this.checkIsEnabled(this.errorMessagePasswordField, 'Error Message Empty Password Field');
        await this.checkText(this.errorMessagePasswordField, 'Please enter a password.', 'Error Message Empty Password Field');
    }

    async checkErrorMessageDifferentPasswords() {
        await this.checkIsVisible(this.errorMessageDifferentPasswords, 'Error Message Different Passwords');
        await this.checkIsEnabled(this.errorMessageDifferentPasswords, 'Error Message Different Passwords');
        await this.checkText(this.errorMessageDifferentPasswords, "Your passwords don't match.", 'Error Message Different Passwords');
    }
}