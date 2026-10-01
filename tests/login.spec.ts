import { expect, test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from "../pages/LoginPage";
import { Header } from "../pages/components/Header";
import { HomePage } from "../pages/HomePage";
import { emailData, passwordData, successfulMessage } from "../data/AuthorizationData";

test.describe('Check authentication', () => {
    let header: Header;
    let loginPage: LoginPage;
    let homepage: HomePage;

    test.beforeEach(async ({ page }) => {
        await allure.epic('Authentication');
        await allure.feature('Login');
        await allure.owner('QA Team');
        await allure.link('https://www.premieronline.com/action/dologin', 'Login Page');

        header = new Header(page);
        homepage = new HomePage(page);
        loginPage = new LoginPage(page);
        await homepage.open();
        await header.loginLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/dologin');
    });

    test('Check initial state of elements on the authentication page', async () => {
        await allure.story('UI Elements Verification');
        await allure.description('Проверка наличия и начального состояния всех основных элементов формы авторизации (заголовок, поля ввода email/пароля, кнопка входа, ссылки восстановления и регистрации).');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tags('ui', 'auth', 'smoke');

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
        await allure.story('Password Visibility Toggle');
        await allure.description('Проверка функциональности переключения видимости пароля (скрытый/открытый текст).');
        await allure.severity(allure.Severity.MINOR);
        await allure.tags('ui', 'auth', 'password-toggle');

        await test.step('Check Password Visibility Toggle', async () => {
            await loginPage.checkPasswordVisibilityToggle();
        });
    });

    test('POSITIVE - Check successful authentication', async () => {
        await allure.story('Successful Login');
        await allure.description('Проверка успешного входа пользователя с валидными учетными данными и редиректа на главную страницу.');
        await allure.severity(allure.Severity.BLOCKER);
        await allure.tags('auth', 'positive', 'smoke', 'critical');

        await test.step('Fill authentication fields with valid data', async () => {
            await allure.parameter('email', emailData);
            await loginPage.login({
                email: emailData,
                password: passwordData
            });
        });
        
        await test.step('Click on Sign In button', async () => {
            await loginPage.clickSignInButton();
        });

        await test.step('Check successful redirect to home page', async () => {
            await expect(loginPage.page).toHaveURL('https://www.premieronline.com/', { timeout: 15000 });
        });
    });

    test('POSITIVE - Check Forgot your password link is displayed and works correctly', async () => {
        await allure.story('Forgot Password Navigation');
        await allure.description('Проверка перехода по ссылке "Forgot your password" и корректного открытия страницы Reset Password.');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tags('auth', 'password-reset', 'regression');

        await test.step('Click on Forgot your password link', async () => {
            await loginPage.forgotPasswordLink.click();
        });

        await test.step('Check Forgot your password page', async () => {
            await expect(loginPage.page).toHaveURL('https://www.premieronline.com/action/forgot_password');
            await expect(loginPage.page.locator('h2.uk-text-center')).toHaveText('Reset Password');
        });
    });
}); 