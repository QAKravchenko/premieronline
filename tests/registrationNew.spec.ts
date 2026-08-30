import { expect, test } from '@playwright/test';
import { Header } from "../pages/components/Header";
import { RegistrationPage } from "../pages/RegistrationPage";


test.describe('Check registration', () => {
        let header: Header;
        let registrationPage: RegistrationPage;
        test.beforeEach(async ({ page }) => {
            header = new Header(page);
            registrationPage = new RegistrationPage(page);
        await page.goto('/');
        await header.registerLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/register');
    })

test('POSITIVE - Check successful registration', async () => {
        await test.step('Type email in the "Email" field', async () => {
            await registrationPage.fillEmailField();
        })

        await test.step('Type first name in the "First Name" field', async () => {
            await registrationPage.fillFirstNameField();
        })

        await test.step('Type last name in the "Last Name" field', async () => {
            await registrationPage.fillLastNameField();
        })

        await test.step('Type password in the "Password" field', async () => {
            await registrationPage.fillPasswordField();
        })

        await test.step('Re-type password in the "Repeat password" field', async () => {
            await registrationPage.fillRepeatPasswordField();
        })

        await test.step('Click on "Continue" button', async () => {
            await registrationPage.clickContinueButton();
        })
    });
});           