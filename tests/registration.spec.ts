import { test, expect } from '@playwright/test';

test.describe('Check Registration modal window elements', () => {
    test.beforeEach(async ({ page }) => {
        const registerLink = page.locator('.uk-navbar-item a', { hasText: 'Create Account' });
        await page.goto('/');
        await registerLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/register');
    })

    test('POSITIVE - Check successful registration', async ({ page }) => {
        await test.step('Type email in the "Email" field', async () => {
            const emailField = page.locator('#email');
            await expect(emailField).toBeVisible();
            await expect(emailField).toBeEnabled();
            await expect(emailField).toHaveAttribute('placeholder', 'Email: we send your confirmations and receipts here.');
            await emailField.fill('qa@gmail.com');
            await expect(emailField).toHaveValue('qa@gmail.com');
        })

        await test.step('Type first name in the "First name" field', async () => {
            const firstNameField = page.locator('#first_name');
            await expect(firstNameField).toBeVisible();
            await expect(firstNameField).toBeEnabled();
            await expect(firstNameField).toHaveAttribute('placeholder', 'First Name');
            await firstNameField.fill('QA');
            await expect(firstNameField).toHaveValue('QA');
        })

        await test.step('Type last name in the "Last name" field', async () => {
            const lastNameField = page.locator('#last_name');
            await expect(lastNameField).toBeVisible();
            await expect(lastNameField).toBeEnabled();
            await expect(lastNameField).toHaveAttribute('placeholder', 'Last Name');
            await lastNameField.fill('Test');
            await expect(lastNameField).toHaveValue('Test');
        })

        await test.step('Type password in the "Password" field', async () => {
            const passwordField = page.locator('#password');
            const iconEye = page.locator('#eyeIcon').first();
            await expect(passwordField).toBeVisible();
            await expect(passwordField).toBeEnabled();
            await expect(passwordField).toHaveAttribute('placeholder', 'Password (8 characters alphanumeric)');
            await passwordField.fill('12345678');
            await expect(passwordField).toHaveValue('12345678');
            await expect(passwordField).toHaveAttribute('type', 'password');
            await iconEye.click();
            await expect(passwordField).toHaveAttribute('type', 'text');
        })

        await test.step('Re-type password in the "Re-type password" field', async () => {
            const retypePasswordField = page.locator('#password_repeat');
            const iconEye = page.locator('#eyeIcon').last();
            await expect(retypePasswordField).toBeVisible();
            await expect(retypePasswordField).toBeEnabled();
            await expect(retypePasswordField).toHaveAttribute('placeholder', 'Repeat Password');
            await retypePasswordField.fill('12345678');
            await expect(retypePasswordField).toHaveValue('12345678');
            await expect(retypePasswordField).toHaveAttribute('type', 'password');
            await iconEye.click();
            await expect(retypePasswordField).toHaveAttribute('type', 'text');
        })

        //Этот кейс не проходит из за капчи
        await test.step('Click on the "Continue" button', async () => {
            const continueButton = page.locator('.uk-button', { hasText: 'Continue' });
            const checkYourEmailMessageBlock = page.locator('uk-alert-success');
            await expect(continueButton).toBeVisible();
            await expect(continueButton).toBeEnabled();
            await expect(continueButton).toHaveAttribute('type', 'submit');
            await continueButton.click();
            await expect(page).toHaveURL('https://www.premieronline.com/create_profile.php');
            await expect(checkYourEmailMessageBlock).toHaveText("Please check your email for your Activation Button. Click it and you'll come right back here and be able to start registering immediately.");
        })
    })

    test('NEGATIVE - Registration with empty fields', async ({ page }) => {
        await test.step('Registration with empty fields', async () => {
            const emailField = page.locator('#email');
            const firstNameField = page.locator('#first_name');
            const lastNameField = page.locator('#last_name');
            const passwordField = page.locator('#password');
            const retypePasswordField = page.locator('#password_repeat');
            const continueButton = page.locator('.uk-button', { hasText: 'Continue' });
            const alertBlock = page.locator('.uk-alert-danger');
            await expect(emailField).toHaveValue('');
            await expect(firstNameField).toHaveValue('');
            await expect(lastNameField).toHaveValue('');
            await expect(passwordField).toHaveValue('');
            await expect(retypePasswordField).toHaveValue('');
            await continueButton.click();
            await expect(page).toHaveURL('https://www.premieronline.com/create_profile.php');
            await expect(alertBlock).toBeVisible();
            await expect(alertBlock).toContainText('Please enter your email address.');
            await expect(alertBlock).toContainText('Please enter your first name.');
            await expect(alertBlock).toContainText('Your first name has invalid characters (The first name must contain alphabatic characters only).');
            await expect(alertBlock).toContainText('Please enter your last name.');
            await expect(alertBlock).toContainText('Your last name has invalid characters (The last name must contain alphabatic characters only).');
            await expect(alertBlock).toContainText('Please enter a password.');
            await expect(alertBlock).toContainText('Your password must be at least 8 characters long.');
            await expect(alertBlock).toContainText('reCAPTCHA verification failed.');
        })
    })

    test('NEGATIVE - Registration with invalid "Email" field', async ({ page }) => {
        await test.step('Registration with invalid "Email" field', async () => {
            const emailField = page.locator('#email');
            const firstNameField = page.locator('#first_name');
            const lastNameField = page.locator('#last_name');
            const passwordField = page.locator('#password');
            const retypePasswordField = page.locator('#password_repeat');
            const continueButton = page.locator('.uk-button', { hasText: 'Continue' });
            await emailField.fill('qagmail.com');
            await expect(emailField).toHaveValue('qagmail.com');
            await firstNameField.fill('QA');
            await expect(firstNameField).toHaveValue('QA');
            await lastNameField.fill('Test');
            await expect(lastNameField).toHaveValue('Test');
            await passwordField.fill('12345678');
            await expect(passwordField).toHaveValue('12345678');
            await retypePasswordField.fill('12345678');
            await expect(retypePasswordField).toHaveValue('12345678');
            await continueButton.click();
            const validationMessage = await emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(validationMessage).toBe("Please include an '@' in the email address. 'qagmail.com' is missing an '@'.");
        })
    })

    test('NEGATIVE - Registration with typing less than 8 characters in the "Password" and "Re-type password" fields', async ({ page }) => {
        await test.step('Registration with typing less than 8 characters in the "Password" and "Re-type password" fields', async () => {
            const emailField = page.locator('#email');
            const firstNameField = page.locator('#first_name');
            const lastNameField = page.locator('#last_name');
            const passwordField = page.locator('#password');
            const retypePasswordField = page.locator('#password_repeat');
            const continueButton = page.locator('.uk-button', { hasText: 'Continue' });
            const alertBlock = page.locator('.uk-alert-danger');
            await emailField.fill('qa@gmail.com');
            await expect(emailField).toHaveValue('qa@gmail.com');
            await firstNameField.fill('QA');
            await expect(firstNameField).toHaveValue('QA');
            await lastNameField.fill('Test');
            await expect(lastNameField).toHaveValue('Test');
            await passwordField.fill('1234567');
            await expect(passwordField).toHaveValue('1234567');
            await retypePasswordField.fill('1234567');
            await expect(retypePasswordField).toHaveValue('1234567');
            await continueButton.click();
            await expect(page).toHaveURL('https://www.premieronline.com/create_profile.php');
            await expect(alertBlock).toBeVisible();
            await expect(alertBlock).toContainText('Your password must be at least 8 characters long.');
        })
    })

    test('NEGATIVE - Registration with different characters in the "Password" and "Re-type password" fields', async ({ page }) => {
        await test.step('Registration with different characters in the "Password" and "Re-type password" fields', async () => {
            const emailField = page.locator('#email');
            const firstNameField = page.locator('#first_name');
            const lastNameField = page.locator('#last_name');
            const passwordField = page.locator('#password');
            const retypePasswordField = page.locator('#password_repeat');
            const continueButton = page.locator('.uk-button', { hasText: 'Continue' });
            const alertBlock = page.locator('.uk-alert-danger');
            await emailField.fill('qa@gmail.com');
            await expect(emailField).toHaveValue('qa@gmail.com');
            await firstNameField.fill('QA');
            await expect(firstNameField).toHaveValue('QA');
            await lastNameField.fill('Test');
            await expect(lastNameField).toHaveValue('Test');
            await passwordField.fill('12345678');
            await expect(passwordField).toHaveValue('12345678');
            await retypePasswordField.fill('12345679');
            await expect(retypePasswordField).toHaveValue('12345679');
            await continueButton.click();
            await expect(page).toHaveURL('https://www.premieronline.com/create_profile.php');
            await expect(alertBlock).toBeVisible();
            await expect(alertBlock).toContainText("Your passwords don't match.");
        })
    })
});