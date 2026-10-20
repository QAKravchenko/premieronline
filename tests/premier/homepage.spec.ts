import { expect, test } from '@playwright/test';
import { HomePage } from "../../pages/premier/HomePage";
import { Header } from "../../pages/premier/components/Header";

test.describe('Premier Online - Home Page & Header Navigation', () => {
    let header: Header;
    let homepage: HomePage;
    test.beforeEach(async ({ page }) => {
        header = new Header(page);
        homepage = new HomePage(page);
        await homepage.open();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Premier Online - leading provider of online event registration for sports events');
    });

    test('should display upcoming events section and search filter dropdowns on home page', async () => {
        await homepage.checkUpcomingEventsTitle();
        await homepage.checkEventsGrid();
        await expect(homepage.selectSportDropdown).toBeVisible();
        await expect(homepage.selectCountryDropDown).toBeVisible();
        await expect(homepage.searchButton).toBeVisible();
    });

    test('should display brand logo and reload home page on click', async () => {
        await header.verifyLogoDisplaying();
        await header.clickLogo();
    });
    
    test('should display Events link and navigate to calendar page on click', async () => {
        await header.verifyEventsLinkDisplaying();
        await header.clickEventsLink();
    });

    test('should display Ratings link and navigate to ratings page on click', async () => {
        await header.verifyRatingsLinkDisplaying();
        await header.clickRatingsLink();
    });

    test('should display Help link and navigate to help center on click', async () => {
        await header.verifyHelpLinkDisplaying();
        await header.clickHelpLink();
    });
    
    test('should display language switcher and preserve home page on click', async () => {
        await header.verifyLanguageLinkDisplaying();
        await header.clickLanguageLink();
    });

    test('should display Sign in button and navigate to login page on click', async () => {
        await header.verifyLoginLinkDisplaying();
        await header.clickLoginLink();
    });
     
    test('should display Create Account button and navigate to registration page on click', async () => {
        await header.verifyRegisterLinkDisplaying();
        await header.clickRegisterLink();
    });

    test('should display search field and allow typing event search query', async () => {
        await header.verifySearchFieldDisplaying();
        await header.search('Marathon');
        await expect(header.searchField).toHaveValue('Marathon');
    });
});
