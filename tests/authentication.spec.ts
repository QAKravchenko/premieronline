import { expect, test } from '@playwright/test';
import { AuthenticationPage } from "../pages/AuthenticationPage";
import { Header } from "../pages/components/Header";

test.describe('Check authentication', () => {
    let header: Header;
    let authenticationPage: AuthenticationPage;
    const emailData = 'qakravchenko@gmail.com';
    const passwordData = 'testing1';
    const successfulMessage = "Welcome back! You have successfully signed in.";
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        authenticationPage = new AuthenticationPage(page);
        await page.goto('/');
        await header.loginLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/dologin');
    });

    test('Check initial state of elements on the authentication page', async () => {
        await test.step('Verify all form fields are present', async () => {
            await authenticationPage.checkSignInTitle();
            await authenticationPage.checkEmailField();
            await authenticationPage.checkPasswordField();
            await authenticationPage.checkSignInButton();
            await authenticationPage.checkForgotPasswordLink();
            await authenticationPage.checkCreateAccountLink();
            await authenticationPage.checkRegisterGuestLink();
        });
    });


    test('Check Password Toggle', async () => {
        await test.step('Check Password Visibility Toggle', async () => {
            await authenticationPage.checkPasswordVisibilityToggle();
        })
    });


    test('POSITIVE - Check successful authentication', async () => {
        await test.step('Fill authentication fields with valid data', async () => {
            await authenticationPage.authenticate({
                email: emailData,
                password: passwordData
            });
        })
        
        await test.step('Click on Sign In button', async () => {
            await authenticationPage.clickSignInButton();
        });

        await test.step('Check successful message', async () => {
            await expect(authenticationPage.page).toHaveURL('https://www.premieronline.com/');
            await expect(authenticationPage.page.locator('div.welcome-message')).toHaveText(successfulMessage);
        });
    });


    test('POSITIVE - Check Forgot your password link is displayed and works correctly', async () => {
        await test.step('Click on Forgot your password link', async () => {
            await authenticationPage.forgotPasswordLink.click();
        });

        await test.step('Check Forgot your password page', async () => {
            await expect(authenticationPage.page).toHaveURL('https://www.premieronline.com/action/forgot_password');
            await expect(authenticationPage.page.locator('h1')).toHaveText('Forgot your password?');
        });
    });
}); 