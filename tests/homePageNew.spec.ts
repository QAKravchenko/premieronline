import { expect, test } from '@playwright/test';
import { Homepage } from "../pages/Homepage";
import { Header } from "../pages/components/Header";

test.describe('Check homePage elements', () => {
    let header: Header;
    let homepage: Homepage;
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        homepage = new Homepage(page);
        await homepage.open();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Premier Online - leading provider of online event registration for sports events');
    })

    test('Check logo displayig and works corretly', async () => {
        await header.clickLogo();
    });
    
    test('Check eventsLink displayig and works corretly', async () => {
        await header.clickEvents();
    });

    test('Check ratingsLink displayig and works corretly', async () => {
        await header.clickRatings();
    });

    /* BUG
    test('Check helpLink displayig and works corretly', async () => {
        await header.clickHelp();
    });*/ 
    
    test('Check languageLink displayig and works corretly', async () => {
        await header.clickLanguage();
    });

    test('Check loginButton displayig and works corretly', async () => {
        await header.clickLogin();
    });
     
    test('Check registerButton displayig and works corretly', async () => {
        await header.clickRegister();
    });

    test('Check searchField displayig and works corretly', async () => {
        await header.search('Marathon');
    });
});