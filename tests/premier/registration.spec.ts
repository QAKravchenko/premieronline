import { expect, test } from '@playwright/test';
import { Header } from "../../pages/premier/components/Header";
import { RegistrationPage } from "../../pages/premier/RegistrationPage";
import { HomePage } from "../../pages/premier/HomePage";
import { emailData, firstNameData, lastNameData, passwordData, repeatPasswordData, successfulMessage, getFreshRegistrationData } from "../../data/premier/RegistrationData";

test.describe('Premier Online - User Registration', () => {
    let header: Header;
    let registrationPage: RegistrationPage;
    let homepage: HomePage;
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        registrationPage = new RegistrationPage(page);
        homepage = new HomePage(page);
        await homepage.open();
        await header.registerLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/register');
    });

    test('should display all mandatory registration input fields in initial state', async () => {
        await test.step('Verify all form fields are present', async () => {
            await registrationPage.checkEmailField();
            await registrationPage.checkFirstNameField();
            await registrationPage.checkLastNameField();
            await registrationPage.checkPasswordField();
            await registrationPage.checkRepeatPasswordField();
        });
    });

    test('should complete registration and display activation message with valid data', async () => {
        test.skip(!process.env.RECAPTCHA_BYPASS_TOKEN, 'Automated registration on production is blocked by Google reCAPTCHA Enterprise unless RECAPTCHA_BYPASS_TOKEN is provided');

        await test.step('Check Password Visibility Toggle', async () => {
            await registrationPage.checkPasswordVisibilityToggle();
        });

        await test.step('Fill registration fields with valid data and submit', async () => {
            const freshData = getFreshRegistrationData();
            await registrationPage.register({
                email: freshData.email,
                firstName: freshData.firstName,
                lastName: freshData.lastName,
                password: freshData.password,
                repeatPassword: freshData.repeatPassword
            });
        });

        await test.step('Check successful message', async () => {
            await registrationPage.checkSuccessfulRegistration(successfulMessage);
        });
    });

    test('should display validation error messages when submitting empty registration form', async () => {
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

    test('should display validation error message when submitting malformed email address', async () => {
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

    test('should display validation error message when password confirmation does not match', async () => {
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
