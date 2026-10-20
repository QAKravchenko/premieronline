import { Locator, Page } from '@playwright/test';
import { Header } from './components/Header';
import { BaseActions } from '../../config/BaseActions';

export interface LoginData {
    email: string;
    password: string;
}

export class LoginPage extends BaseActions {

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

        super(page);

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
        await this.fill(this.emailField, data.email, 'Email field');
        await this.fill(this.passwordField, data.password, 'Password field');
        await this.checkValue(this.emailField, data.email, 'Email field');
        await this.checkValue(this.passwordField, data.password, 'Password field');
    }

    async checkSignInTitle() {
        await this.checkIsVisible(this.signInTitle, 'Sign in title');
        await this.checkIsEnabled(this.signInTitle, 'Sign in title');
        await this.checkExactText(this.signInTitle, 'Sign in', 'Sign in title');
    }

    async checkEmailField() {
        await this.checkIsVisible(this.emailField, 'Email field');
        await this.checkIsEnabled(this.emailField, 'Email field');
        await this.checkAttribute(this.emailField, 'placeholder', 'Email address', 'Email field');
    }

    async checkPasswordField() {
        await this.checkIsVisible(this.passwordField, 'Password field');
        await this.checkIsEnabled(this.passwordField, 'Password field');
        await this.checkAttribute(this.passwordField, 'placeholder', 'Password', 'Password field');
    }

    async checkPasswordVisibilityToggle() {
        await this.checkAttribute(this.passwordField, 'type', 'password', 'Password field');
        await this.click(this.eyeIconFirst, 'Eye icon');
        await this.checkAttribute(this.passwordField, 'type', 'text', 'Password field');
    }    

    async checkSignInButton() {
        await this.checkIsVisible(this.signInButton, 'Sign in button');
        await this.checkIsEnabled(this.signInButton, 'Sign in button');
        await this.checkExactText(this.signInButton, 'Sign in', 'Sign in button');
    }

    async clickSignInButton() {
        await this.click(this.signInButton, 'Sign in button');
    }

    // Forgot your password? link 
    async checkForgotPasswordLink() {
        await this.checkIsVisible(this.forgotPasswordLink, 'Forgot your password link');
        await this.checkIsEnabled(this.forgotPasswordLink, 'Forgot your password link');
        await this.checkExactText(this.forgotPasswordLink, 'Forgot your password?', 'Forgot your password link');
    }

    async clickForgotPasswordLink() {
        await this.click(this.forgotPasswordLink, 'Forgot your password link');
    }

    // Create an account link 
    async checkCreateAccountLink() {
        await this.checkIsVisible(this.createAccountLink, 'Create Account link');
        await this.checkIsEnabled(this.createAccountLink, 'Create Account link');
        await this.checkExactText(this.createAccountLink, 'Create Account', 'Create Account link');
    }

    async clickCreateAccountLink() {
        await this.click(this.createAccountLink, 'Create Account link');
    }

    // Register as a guest link
    async checkRegisterGuestLink() {
        await this.checkIsVisible(this.registerGuestLink, 'Register as a Guest link');
        await this.checkIsEnabled(this.registerGuestLink, 'Register as a Guest link');
        await this.checkExactText(this.registerGuestLink, 'Register as a Guest', 'Register as a Guest link');
    }

    async clickRegisterGuestLink() {
        await this.click(this.registerGuestLink, 'Register as a Guest link');
    }

    // Error messages verification
    async checkErrorMessageEmptyEmailField() {
        await this.checkIsVisible(this.errorMessageEmptyEmailField, 'Error message empty email field');
        await this.checkIsEnabled(this.errorMessageEmptyEmailField, 'Error message empty email field');
        await this.checkText(this.errorMessageEmptyEmailField, 'Sorry, you were not recognized', 'Error message empty email field');
    }

    async checkErrorMessageEmptyPasswordField() {
        await this.checkIsVisible(this.errorMessageEmptyPasswordField, 'Error message empty password field');
        await this.checkIsEnabled(this.errorMessageEmptyPasswordField, 'Error message empty password field');
        await this.checkText(this.errorMessageEmptyPasswordField, 'Sorry, you were not recognized', 'Error message empty password field');
    }

    async checkErrorMessageIncorrectEmailField() {
        await this.checkIsVisible(this.errorMessageIncorrectEmailField, 'Error message incorrect email field');
        await this.checkIsEnabled(this.errorMessageIncorrectEmailField, 'Error message incorrect email field');
        await this.checkText(this.errorMessageIncorrectEmailField, 'Sorry, you were not recognized', 'Error message incorrect email field');
    }

    async checkErrorMessageIncorrectPasswordField() {
        await this.checkIsVisible(this.errorMessageIncorrectPasswordField, 'Error message incorrect password field');
        await this.checkIsEnabled(this.errorMessageIncorrectPasswordField, 'Error message incorrect password field');
        await this.checkText(this.errorMessageIncorrectPasswordField, 'Sorry, you were not recognized', 'Error message incorrect password field');
    }
}
