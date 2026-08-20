import { test, expect } from '@playwright/test';

test.describe('Check Homepage elements', () => {
    test('Check URL is correct', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL('/');
    })

    test('Check Title is displayed and correct', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle('Premier Online - leading provider of online event registration for sports events');
    })

    test('Check Logo is displayed and clickable', async ({ page }) => {
        await page.goto('/');
        const logo = page.locator('.uk-logo'); 
        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute('href', 'https://www.premieronline.com');
        await logo.click();
        await expect(page).toHaveURL('https://www.premieronline.com');
    })

    test('Check Events link is displayed and clickable', async({ page }) => {
        await page.goto('/');
        const eventsLink = page.locator('.uk-navbar-nav a[href$="/calendar"]');
        await expect(eventsLink).toBeVisible();
        await expect(eventsLink).toHaveAttribute('href', 'https://www.premieronline.com/calendar');
        await expect(eventsLink).toHaveText('Events');
        await eventsLink.hover();
        await expect(eventsLink).toHaveCSS('color', 'rgb(137, 185, 30)');
        await expect(eventsLink).toHaveCSS('font-size', '16.8px');
        await expect(eventsLink).toHaveCSS('font-family', 'exo2regular');
        await eventsLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/calendar');
    })

    test('Check Ratings link is displayed and clickable', async ({ page }) => {
        await page.goto('/');
        const ratingsLink = page.locator('.uk-navbar-nav a[href="https://www.premieronline.com/event_ratings.php"]');
        await expect(ratingsLink).toBeVisible();
        await expect(ratingsLink).toHaveAttribute('href', 'https://www.premieronline.com/event_ratings.php');
        await expect(ratingsLink).toHaveText('Ratings');
        await ratingsLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/event_ratings.php');
    })

    test('Check Help link is displayed and clickable', async ({ page }) => {
        await page.goto('/');
        const helpLink = page.locator('.uk-navbar-nav a[href="https://www.premieronline.com/help"]', {hasText: 'Help'});
        await expect(helpLink).toBeVisible();
        await expect(helpLink).toHaveAttribute('href', 'https://www.premieronline.com/help');
        await expect(helpLink).toHaveText('Help');
        await helpLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/help');
    })

    test('Check Login button is displayed and clickable', async ({ page }) => {
        await page.goto('/');
        const loginLink = page.locator('.uk-navbar-item a', {hasText: 'Sign in'});
        const loginButton = page.locator('.uk-navbar-item a .uk-button', {hasText: 'Sign in'});
        await expect(loginLink).toBeVisible();
        await expect(loginButton).toBeEnabled();
        await expect(loginLink).toHaveAttribute('href', 'https://www.premieronline.com/action/dologin');
        await expect(loginButton).toHaveText('Sign in');
        await expect(loginButton).toHaveCSS('background-color', 'rgb(35, 54, 111)');
        await expect(loginButton).toHaveCSS('font-size', '16px');
        await expect(loginButton).toHaveCSS('font-family', 'exo2medium');
        await loginLink.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/dologin');
    })

    test('Check Register button is displayed and clickable', async ({ page }) => {
        await page.goto('/');
        const registerLink = page.locator('.uk-navbar-item a', {hasText: 'Create Account'});
        const registerButton = page.locator('.uk-navbar-item a .uk-button', {hasText: 'Create Account'});
        await expect(registerLink).toBeVisible();
        await expect(registerButton).toBeEnabled();
        await expect(registerLink).toHaveAttribute('href', 'https://www.premieronline.com/action/register');
        await expect(registerButton).toHaveText('Create Account');
        await expect(registerButton).toHaveCSS('background-color', 'rgb(137, 185, 30)');
        await expect(registerButton).toHaveCSS('font-size', '16px');
        await expect(registerButton).toHaveCSS('font-family', 'exo2medium');
        await registerButton.click();
        await expect(page).toHaveURL('https://www.premieronline.com/action/register');
    })

    test('Search field is displayed and functional', async ({ page }) => {
        await page.goto('/');
        const searchField = page.locator('#search');
        const searchIcon = page.locator('.uk-navbar-item .uk-search .uk-search-icon-flip');
        const searchText = 'Marathon';
        const searchResultsModal = page.locator('#livesearch');
        const initialUrl = page.url();
        await expect(searchField).toBeVisible();
        await expect(searchField).toBeEnabled();
        await expect(searchField).toHaveAttribute('placeholder', 'Search by Event Name or Organiser');
        await expect(searchIcon).toBeVisible();
        await searchField.pressSequentially(searchText, {delay:300});
        await expect(searchResultsModal).toBeVisible();
        await expect(searchResultsModal).toContainText('Events Search Result');
        expect(page.url()).toBe(initialUrl);
    })
})