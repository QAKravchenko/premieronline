import { expect, test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from "../../pages/premier/LoginPage";
import { Header } from "../../pages/premier/components/Header";
import { HomePage } from "../../pages/premier/HomePage";
import { emailData, passwordData } from "../../data/premier/AuthorizationData";

test.describe('Premier Online - Authentication & Login', () => {
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

    test('should display all mandatory login form elements in initial state', async () => {
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

    test('should toggle password visibility between hidden and plain text', async () => {
        await allure.story('Password Visibility Toggle');
        await allure.description('Проверка функциональности переключения видимости пароля (скрытый/открытый текст).');
        await allure.severity(allure.Severity.MINOR);
        await allure.tags('ui', 'auth', 'password-toggle');

        await test.step('Check Password Visibility Toggle', async () => {
            await loginPage.checkPasswordVisibilityToggle();
        });
    });

    test('should authenticate user with valid credentials and redirect to home page', async () => {
        await allure.story('Successful Login');
        await allure.description('Проверка успешного входа пользователя с валидными учетными данными и редиректа на главную страницу.');
        await allure.severity(allure.Severity.BLOCKER);
        await allure.tags('auth', 'positive', 'smoke', 'critical');

        const isPlaceholderCredentials = !process.env.LOGIN_EMAIL || process.env.LOGIN_EMAIL === 'test_user@example.com';
        test.skip(isPlaceholderCredentials, 'Valid user credentials are not configured in .env (LOGIN_EMAIL / LOGIN_PASSWORD)');

        await test.step('Fill authentication fields with valid data', async () => {
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

    test('should navigate to reset password page when clicking Forgot your password link', async () => {
        await allure.story('Forgot Password Navigation');
        await allure.description('Проверка перехода по ссылке "Forgot your password" и корректного открытия страницы Reset Password.');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tags('auth', 'password-reset', 'regression');

        await test.step('Click on Forgot your password link', async () => {
            await loginPage.clickForgotPasswordLink();
        });

        await test.step('Check Forgot your password page', async () => {
            await expect(loginPage.page).toHaveURL('https://www.premieronline.com/action/forgot_password');
            await expect(loginPage.page.locator('h2.uk-text-center')).toHaveText('Reset Password');
        });
    });

    test('should display validation error alert when submitting empty login credentials', async () => {
        await allure.story('Invalid Login');
        await allure.description('Проверка валидации и отображения ошибки при отправке пустой формы авторизации.');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tags('auth', 'negative');

        await test.step('Click Sign In button without credentials', async () => {
            await loginPage.clickSignInButton();
        });

        await test.step('Verify error alert is displayed', async () => {
            await loginPage.checkErrorMessageEmptyEmailField();
        });
    });
});
