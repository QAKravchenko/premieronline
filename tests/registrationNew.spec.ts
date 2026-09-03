import { expect, test } from '@playwright/test';
import { Header } from "../pages/components/Header";
import { RegistrationPage } from "../pages/RegistrationPage";


test.describe('Check registration', () => {
    let header: Header;
    let registrationPage: RegistrationPage;
    const emailData = 'qa@gmail.com';
    const firstNameData = 'QA';
    const lastNameData = 'Test';
    const passwordData = 'testing1';
    const repeatPasswordData = 'testing1';
    const successfulMessage = "Please check your email for your Activation Button. Click it and you'll come right back here and be able to start registering immediately.";
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        registrationPage = new RegistrationPage(page);
        await page.goto('/');
        await header.registerLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/register');
    });

    test('Check initial state of registration fields', async () => {
        await test.step('Verify all form fields are present', async () => {
            await registrationPage.checkEmailField();
            await registrationPage.checkFirstNameField();
            await registrationPage.checkLastNameField();
            await registrationPage.checkPasswordField();
            await registrationPage.checkRepeatPasswordField();
        });
    });

    test('POSITIVE - Check successful registration', async () => {
        await test.step('Check Password Visibility Toggle', async () => {
            await registrationPage.checkPasswordVisibilityToggle();
        })

        await test.step('Fill registration fields with valid data', async () => {
            await registrationPage.register({
                email: emailData,
                firstName: firstNameData,
                lastName: lastNameData,
                password: passwordData,
                repeatPassword: repeatPasswordData
            });
        })

        await test.step('Check successful message', async () => {
            await registrationPage.checkSuccessfulRegistration(successfulMessage);
        });
    });

    test('NEGATIVE - Check registration with empty fields', async () => {
        await test.step('Leave all registration fields empty and click on "Continue" button', async () => {
            await registrationPage.clickContinueButton();
        });

        await test.step('Check error messages for empty fields', async () => {
            await registrationPage.checkErrorMessageEmptyEmailField();
            await registrationPage.checkErrorMessageEmptyFirstNameField();
            await registrationPage.checkErrorMessageEmptyLastNameField();
            await registrationPage.checkErrorMessageEmptyPasswordField();
        });
    });

    test('NEGATIVE - Check registration with invalid email', async () => {
        await test.step('Fill registration fields with invalid email and click on "Continue" button', async () => {
            await registrationPage.register({
                email: 'test@test',
                firstName: firstNameData,
                lastName: lastNameData,
                password: passwordData,
                repeatPassword: repeatPasswordData
            });
        });

        await test.step('Check error message for invalid email', async () => {
            await registrationPage.checkErrorMessageIncorrectEmailField();
        });
    });

    test('NEGATIVE - Check registration with different passwords', async () => {
        await test.step('Fill registration fields with different passwords and click on "Continue" button', async () => {
            await registrationPage.register({
                email: emailData,
                firstName: firstNameData,
                lastName: lastNameData,
                password: passwordData,
                repeatPassword: 'differentPassword'
            });
        });

        await test.step('Check error message for different passwords', async () => {
            await registrationPage.checkErrorMessageDifferentPasswords();
        });
    });
});       