import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/LoginPage";
import { Header } from "../pages/components/Header";
import { HomePage } from "../pages/HomePage";
import { emailData, passwordData, successfulMessage } from "../data/AuthorizationData";

test.describe('Check authentication', () => {
    let header: Header;
    let loginPage: LoginPage;
    let homepage: HomePage;
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        homepage = new HomePage(page);
        loginPage = new LoginPage(page);
        await homepage.open();
        await header.loginLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/dologin');
    });

    test('Check initial state of elements on the authentication page', async () => {
        await test.step('Verify all form fields are present', async () => {
            await loginPage.checkSignInTitle();
            await loginPage.checkEmailField();
            await loginPage.checkPasswordField();
            await loginPage.checkSignInButton();
            await loginPage.checkForgotPasswordLink();
            await loginPage.checkCreateAccountLink();
            await loginPage.checkRegisterGuestLink();
        });
    });


    test('Check Password Toggle', async () => {
        await test.step('Check Password Visibility Toggle', async () => {
            await loginPage.checkPasswordVisibilityToggle();
        })
    });


    test('POSITIVE - Check successful authentication', async () => {
        await test.step('Fill authentication fields with valid data', async () => {
            await loginPage.login({
                email: emailData,
                password: passwordData
            });
        })
        
        await test.step('Click on Sign In button', async () => {
            await loginPage.clickSignInButton();
        });

        await test.step('Check successful message', async () => {
            await expect(loginPage.page).toHaveURL('https://www.premieronline.com/', { timeout: 15000 });
        });
    });


    test('POSITIVE - Check Forgot your password link is displayed and works correctly', async () => {
        await test.step('Click on Forgot your password link', async () => {
            await loginPage.forgotPasswordLink.click();
        });

        await test.step('Check Forgot your password page', async () => {
            await expect(loginPage.page).toHaveURL('https://www.premieronline.com/action/forgot_password');
            await expect(loginPage.page.locator('h2.uk-text-center')).toHaveText('Reset Password');
        });
    });
}); 