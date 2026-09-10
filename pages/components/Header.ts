import { expect, Locator, Page } from '@playwright/test';

export class Header {

    readonly page: Page;

    readonly logo: Locator;

    readonly navbar: Locator;

    readonly searchField: Locator;

    readonly searchIcon: Locator;

    readonly searchResultsModal: Locator;

    readonly eventsLink: Locator;

    readonly ratingsLink: Locator;

    readonly helpLink: Locator;

    readonly switchLanguage: Locator;

    readonly loginLink: Locator;

    readonly loginButton: Locator;

    readonly registerLink: Locator;

    readonly registerButton: Locator;

    readonly initialUrl: String;



    constructor(page: Page) {

        this.page = page;

        this.logo = page.locator('.uk-logo');

        this.navbar = page.locator('ul.uk-navbar-nav').first();

        this.searchField = page.locator('#search');

        this.searchIcon = page.locator('.uk-navbar-item .uk-search .uk-search-icon-flip');

        this.searchResultsModal = page.locator('#livesearch');

        this.eventsLink = this.navbar.locator('a', { hasText: 'Events' });

        this.ratingsLink = this.navbar.locator('a', { hasText: 'Ratings' });

        this.helpLink = this.navbar.locator('a', { hasText: 'Help' });

        this.switchLanguage = this.navbar.locator('a', { hasText: 'عربى' });

        this.loginLink = page.locator('.uk-navbar-item a', { hasText: 'Sign in' });

        this.loginButton = page.locator('.uk-navbar-item a .uk-button', { hasText: 'Sign in' });

        this.registerLink = page.locator('.uk-navbar-item a', { hasText: 'Create Account' });

        this.registerButton = page.locator('.uk-navbar-item a .uk-button', { hasText: 'Create Account' });

        this.initialUrl = page.url();
    }

    //Logo
    async verifyLogoDisplaying() {
        await expect(this.logo).toBeVisible();
        await expect(this.logo).toBeEnabled();
        await expect(this.logo).toHaveAttribute('href', 'https://www.premieronline.com');  
    }

    async clickLogo() {
        await this.logo.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com');
    }


    // Events link
    async verifyEventsLinkDisplaying() {
        await expect(this.eventsLink).toBeVisible();
        await expect(this.eventsLink).toBeEnabled();
        await expect(this.eventsLink).toHaveAttribute('href', 'https://www.premieronline.com/calendar');
        await expect(this.eventsLink).toHaveText('Events');
        await this.eventsLink.hover();
        await expect(this.eventsLink).toHaveCSS('color', 'rgb(137, 185, 30)');
        await expect(this.eventsLink).toHaveCSS('font-size', '16.8px');
        await expect(this.eventsLink).toHaveCSS('font-family', 'exo2regular');
    }

    async clickEventsLink() {       
        await this.eventsLink.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/calendar');
    }


    // Ratings link
    async verifyRatingsLinkDisplaying() {
        await expect(this.ratingsLink).toBeVisible();
        await expect(this.ratingsLink).toBeEnabled();
        await expect(this.ratingsLink).toHaveAttribute('href', 'https://www.premieronline.com/event_ratings.php');
        await expect(this.ratingsLink).toHaveText('Ratings');
        await this.ratingsLink.hover();
        await expect(this.eventsLink).toHaveCSS('color', 'rgb(137, 185, 30)');
        await expect(this.eventsLink).toHaveCSS('font-size', '16.8px');
        await expect(this.eventsLink).toHaveCSS('font-family', 'exo2regular');
    }

    async clickRatingsLink() {
        await this.ratingsLink.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/event_ratings.php');
    }


    // Help link
    async verifyHelpLinkDisplaying() {
        await expect(this.helpLink).toBeVisible();
        await expect(this.helpLink).toBeEnabled();
        await expect(this.helpLink).toHaveAttribute('href', 'https://www.premieronline.com/help');
        await expect(this.helpLink).toHaveText('Help');
        await this.helpLink.hover();
        await expect(this.helpLink).toHaveCSS('color', 'rgb(137, 185, 30)');
        await expect(this.helpLink).toHaveCSS('font-size', '16.8px');
        await expect(this.helpLink).toHaveCSS('font-family', 'exo2regular');
    }

    async clickHelpLink() {
        await this.helpLink.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/help');
    }


    // Language link
    async verifyLanguageLinkDisplaying() {
        await expect(this.switchLanguage).toBeVisible();
        await expect(this.switchLanguage).toBeEnabled();
        await expect(this.switchLanguage).toHaveAttribute('href', 'https://www.premieronline.com/');
    }

    async clickLanguageLink() {
        await this.switchLanguage.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/');
    }


    // Login link
    async verifyLoginLinkDisplaying() {
        await expect(this.loginLink).toBeVisible();
        await expect(this.loginButton).toBeEnabled();
        await expect(this.loginLink).toHaveAttribute('href', 'https://www.premieronline.com/action/dologin');
        await expect(this.loginButton).toHaveText('Sign in');
        await expect(this.loginButton).toHaveCSS('background-color', 'rgb(35, 54, 111)');
        await expect(this.loginButton).toHaveCSS('font-size', '16px');
        await expect(this.loginButton).toHaveCSS('font-family', 'exo2medium');
    }

    async clickLoginLink() {
        await this.loginLink.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/action/dologin');
    }


    // Register link
    async verifyRegisterLinkDisplaying() {
        await expect(this.registerLink).toBeVisible();
        await expect(this.registerButton).toBeEnabled();
        await expect(this.registerLink).toHaveAttribute('href', 'https://www.premieronline.com/action/register');
        await expect(this.registerButton).toHaveText('Create Account');
        await expect(this.registerButton).toHaveCSS('background-color', 'rgb(137, 185, 30)');
        await expect(this.registerButton).toHaveCSS('font-size', '16px');
        await expect(this.registerButton).toHaveCSS('font-family', 'exo2medium');
    }

    async clickRegisterLink() {   
        await this.registerLink.click();
        await expect(this.page).toHaveURL('https://www.premieronline.com/action/register');
    }


    // Search field
    async verifySearchFieldDisplaying() {
        await expect(this.searchField).toBeVisible();
        await expect(this.searchField).toBeEnabled();
        await expect(this.searchField).toHaveAttribute('placeholder', 'Search by Event Name or Organiser');
        await expect(this.searchIcon).toBeVisible();
        await expect(this.searchIcon).toBeEnabled();
    }
    
    async search(text: string) {       
        await this.searchField.pressSequentially(text, { delay: 100 });
        await expect(this.page).toHaveURL('/');
    }


    // Search results modal
    async verifySearchResultsModalDisplaying() {
        await expect(this.searchResultsModal).toBeVisible();
        await expect(this.searchResultsModal).toBeEnabled();
    }

}
