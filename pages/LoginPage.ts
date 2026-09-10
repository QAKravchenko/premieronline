import { expect, Locator, Page } from '@playwright/test';
import { Header } from './components/Header';

export interface LoginData {
    email: string;
    password: string;
}

export class LoginPage {

    readonly page: Page;

    readonly header: Header;

    readonly signInTitle: Locator;

    readonly emailField: Locator;

    readonly passwordField: Locator;

    readonly eyeIconFirst: Locator;

    readonly signInButton: Locator;

    readonly errorMessageEmptyEmailField: Locator;

    readonly errorMessageEmptyPasswordField: Locator;

    readonly errorMessageIncorrectEmailField: Locator;

    readonly errorMessageIncorrectPasswordField: Locator;

    readonly forgotPasswordLink: Locator;

    readonly createAccountLink: Locator;

    readonly registerGuestLink: Locator;



    constructor(page: Page) {

        this.page = page;

        this.signInTitle = page.locator('h2', { hasText: 'Sign in' });

        this.emailField = page.locator('#login_name');

        this.passwordField = page.locator('#password');

        this.signInButton = page.locator('button.uk-button-large', { hasText: 'Sign in' });

        this.eyeIconFirst = page.locator('#eyeIcon').first();

        this.errorMessageEmptyEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Sorry, you were not recognized' });

        this.errorMessageEmptyPasswordField = page.locator('.uk-alert-danger').filter({ hasText: 'Sorry, you were not recognized' });

        this.errorMessageIncorrectEmailField = page.locator('.uk-alert-danger').filter({ hasText: 'Sorry, you were not recognized' });

        this.errorMessageIncorrectPasswordField = page.locator('.uk-alert-danger').filter({ hasText: 'Sorry, you were not recognized' });

        this.forgotPasswordLink = page.locator('a[href*="forgot_password"]');

        this.createAccountLink = page.locator('.uk-width-1-2 a[href*="register"]');

        this.registerGuestLink = page.locator('a[href*="guest_add_create.php"]');

        this.header = new Header(page);
    
    };

    //Login form elements verification
    async verifyLoginPageElements(): Promise<void> {
        await this.checkSignInTitle();
        await this.checkEmailField();
        await this.checkPasswordField();
        await this.checkSignInButton();
        await this.checkForgotPasswordLink();
        await this.checkCreateAccountLink();
        await this.checkRegisterGuestLink();
    }

    async login(data: LoginData): Promise<void> {
        await this.emailField.fill(data.email);
        await this.passwordField.fill(data.password);
        await expect(this.emailField).toHaveValue(data.email);
        await expect(this.passwordField).toHaveValue(data.password);
    }

    async checkSignInTitle() {
        await expect(this.signInTitle).toBeVisible();
        await expect(this.signInTitle).toBeEnabled();
        await expect(this.signInTitle).toHaveText('Sign in');
    }

    async checkEmailField() {
        await expect(this.emailField).toBeVisible();
        await expect(this.emailField).toBeEnabled();
        await expect(this.emailField).toHaveAttribute('placeholder', 'Email address');
    }

    async checkPasswordField() {
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEnabled();
        await expect(this.passwordField).toHaveAttribute('placeholder', 'Password');
    }

    async checkPasswordVisibilityToggle() {
        await expect(this.passwordField).toHaveAttribute('type', 'password');
        await this.eyeIconFirst.click();
        await expect(this.passwordField).toHaveAttribute('type', 'text');
    }    

    async checkSignInButton() {
        await expect(this.signInButton).toBeVisible();
        await expect(this.signInButton).toBeEnabled();
        await expect(this.signInButton).toHaveText('Sign in');
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }


    //Forgot your password? link 
    async checkForgotPasswordLink() {
        await expect(this.forgotPasswordLink).toBeVisible();
        await expect(this.forgotPasswordLink).toBeEnabled();
        await expect(this.forgotPasswordLink).toHaveText('Forgot your password?');
    }

    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
    }


    //Create an account link 
    async checkCreateAccountLink() {
        await expect(this.createAccountLink).toBeVisible();
        await expect(this.createAccountLink).toBeEnabled();
        await expect(this.createAccountLink).toHaveText('Create Account');
    }

    async clickCreateAccountLink() {
        await this.createAccountLink.click();
    }


    //Register as a guest link
    async checkRegisterGuestLink() {
        await expect(this.registerGuestLink).toBeVisible();
        await expect(this.registerGuestLink).toBeEnabled();
        await expect(this.registerGuestLink).toHaveText('Register as a Guest');
    }

    async clickRegisterGuestLink() {
        await this.registerGuestLink.click();
    }
    

    // Error messages verification
    async checkErrorMessageEmptyEmailField() {
        await expect(this.errorMessageEmptyEmailField).toBeVisible();
        await expect(this.errorMessageEmptyEmailField).toBeEnabled();
        await expect(this.errorMessageEmptyEmailField).toContainText('Sorry, you were not recognized');
    }

    async checkErrorMessageEmptyPasswordField() {
        await expect(this.errorMessageEmptyPasswordField).toBeVisible();
        await expect(this.errorMessageEmptyPasswordField).toBeEnabled();
        await expect(this.errorMessageEmptyPasswordField).toContainText('Sorry, you were not recognized');
    }

    async checkErrorMessageIncorrectEmailField() {
        await expect(this.errorMessageIncorrectEmailField).toBeVisible();
        await expect(this.errorMessageIncorrectEmailField).toBeEnabled();
        await expect(this.errorMessageIncorrectEmailField).toContainText('Sorry, you were not recognized');
    }

    async checkErrorMessageIncorrectPasswordField() {
        await expect(this.errorMessageIncorrectPasswordField).toBeVisible();
        await expect(this.errorMessageIncorrectPasswordField).toBeEnabled();
        await expect(this.errorMessageIncorrectPasswordField).toContainText('Sorry, you were not recognized');
    }
    

};