import { expect, test } from '@playwright/test';
import { HomePage } from "../pages/HomePage";
import { Header } from "../pages/components/Header";

test.describe('Check homePage elements', () => {
    let header: Header;
    let homepage: HomePage;
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        homepage = new HomePage(page);
        await homepage.open();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Premier Online - leading provider of online event registration for sports events');
    })

    test('Check logo displayig and works corretly', async () => {
        await header.clickLogo();
    });
    
    test('Check eventsLink displayig and works corretly', async () => {
        await header.clickEventsLink();
    });

    test('Check ratingsLink displayig and works corretly', async () => {
        await header.clickRatingsLink();
    });

    /* BUG
    test('Check helpLink displayig and works corretly', async () => {
        await header.clickHelp();
    });*/ 
    
    test('Check languageLink displayig and works corretly', async () => {
        await header.clickLanguageLink();
    });

    test('Check loginButton displayig and works corretly', async () => {
        await header.clickLoginLink();
    });
     
    test('Check registerButton displayig and works corretly', async () => {
        await header.clickRegisterLink();
    });

    test('Check searchField displayig and works corretly', async () => {
        await header.search('Marathon');
    });
});