import { expect, Locator, Page } from '@playwright/test';

export class Header {

    readonly page: Page;

    // Locators

    readonly logo: Locator;

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



    constructor(page: Page) {

        this.page = page;

        this.logo = page.locator('.uk-logo');

        this.searchField = page.locator('#search');

        this.searchIcon = page.locator('.uk-navbar-item .uk-search .uk-search-icon-flip');

        this.searchResultsModal = page.locator('#livesearch');

        this.eventsLink = page.locator('.uk-navbar-nav a[href$="/calendar"]');

        this.ratingsLink = page.locator('.uk-navbar-nav a[href="https://www.premieronline.com/event_ratings.php"]');

        this.helpLink = page.locator('.uk-navbar-nav a[href="https://www.premieronline.com/help"]');

        this.switchLanguage = page.locator('a[href="https://www.premieronline.com/action/lang.php?lang=ar"]');

        this.loginLink = page.locator('.uk-navbar-item a', { hasText: 'Sign in' });

        this.loginButton = page.locator('.uk-navbar-item a .uk-button', { hasText: 'Sign in' });

        this.registerLink = page.locator('.uk-navbar-item a', { hasText: 'Create Account' });

        this.registerButton = page.locator('.uk-navbar-item a .uk-button', { hasText: 'Create Account' });

        

    }

    async open() {

        await this.page.goto('/');

    }

    async clickLogo() {

        await this.logo.click();

    }

    async clickEvents() {

        await this.eventsLink.click();

    }

    async clickRatings() {

        await this.ratingsLink.click();

    }

    async clickHelp() {

        await this.helpLink.click();

    }

    async clickLanguage() {

        await this.switchLanguage.click();
    }

    async clickLogin() {

        await this.loginLink.click();

    }

    async clickRegister() {

        await this.registerLink.click();

    }

    async search(text: string) {

        await this.searchField.pressSequentially(text, {

            delay: 300

        });

    }

}
