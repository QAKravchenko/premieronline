import { Locator, Page } from '@playwright/test';
import { BaseActions } from '../../../config/BaseActions';

export class Header extends BaseActions {

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

    constructor(page: Page) {
        super(page);

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
    }

    // Logo
    async verifyLogoDisplaying() {
        await this.checkIsVisible(this.logo, 'Logo');
        await this.checkIsEnabled(this.logo, 'Logo');
        await this.checkAttribute(this.logo, 'href', 'https://www.premieronline.com', 'Logo');
    }

    async clickLogo() {
        await this.click(this.logo, 'Logo');
        await this.checkUrl(/https:\/\/www\.premieronline\.com\/?/);
    }

    // Events link
    async verifyEventsLinkDisplaying() {
        await this.checkIsVisible(this.eventsLink, 'Events link');
        await this.checkIsEnabled(this.eventsLink, 'Events link');
        await this.checkAttribute(this.eventsLink, 'href', 'https://www.premieronline.com/calendar', 'Events link');
        await this.checkExactText(this.eventsLink, 'Events', 'Events link');
        await this.hover(this.eventsLink, 'Events link');
        await this.checkCSS(this.eventsLink, 'color', 'rgb(137, 185, 30)', 'Events link');
        await this.checkCSS(this.eventsLink, 'font-size', '16.8px', 'Events link');
        await this.checkCSS(this.eventsLink, 'font-family', 'exo2regular', 'Events link');
    }

    async clickEventsLink() {
        await this.click(this.eventsLink, 'Events link');
        await this.checkUrl('https://www.premieronline.com/calendar');
    }

    // Ratings link
    async verifyRatingsLinkDisplaying() {
        await this.checkIsVisible(this.ratingsLink, 'Ratings link');
        await this.checkIsEnabled(this.ratingsLink, 'Ratings link');
        await this.checkAttribute(this.ratingsLink, 'href', 'https://www.premieronline.com/event_ratings.php', 'Ratings link');
        await this.checkExactText(this.ratingsLink, 'Ratings', 'Ratings link');
        await this.hover(this.ratingsLink, 'Ratings link');
        await this.checkCSS(this.ratingsLink, 'color', 'rgb(137, 185, 30)', 'Ratings link');
        await this.checkCSS(this.ratingsLink, 'font-size', '16.8px', 'Ratings link');
        await this.checkCSS(this.ratingsLink, 'font-family', 'exo2regular', 'Ratings link');
    }

    async clickRatingsLink() {
        await this.click(this.ratingsLink, 'Ratings link');
        await this.checkUrl('https://www.premieronline.com/event_ratings.php');
    }

    // Help link
    async verifyHelpLinkDisplaying() {
        await this.checkIsVisible(this.helpLink, 'Help link');
        await this.checkIsEnabled(this.helpLink, 'Help link');
        await this.checkAttribute(this.helpLink, 'href', 'https://www.premieronline.com/help', 'Help link');
        await this.checkExactText(this.helpLink, 'Help', 'Help link');
        await this.hover(this.helpLink, 'Help link');
        await this.checkCSS(this.helpLink, 'color', 'rgb(137, 185, 30)', 'Help link');
        await this.checkCSS(this.helpLink, 'font-size', '16.8px', 'Help link');
        await this.checkCSS(this.helpLink, 'font-family', 'exo2regular', 'Help link');
    }

    async clickHelpLink() {
        await this.click(this.helpLink, 'Help link');
        await this.checkUrl(/https:\/\/www\.premieronline\.com\/.*help/);
    }

    // Language link
    async verifyLanguageLinkDisplaying() {
        await this.checkIsVisible(this.switchLanguage, 'Switch language link');
        await this.checkIsEnabled(this.switchLanguage, 'Switch language link');
        await this.checkAttribute(this.switchLanguage, 'href', 'https://www.premieronline.com/action/lang.php?lang=ar', 'Switch language link');
    }

    async clickLanguageLink() {
        await this.click(this.switchLanguage, 'Switch language link');
        await this.checkUrl(/https:\/\/www\.premieronline\.com\//);
    }

    // Login link
    async verifyLoginLinkDisplaying() {
        await this.checkIsVisible(this.loginLink, 'Login link');
        await this.checkIsEnabled(this.loginButton, 'Login button');
        await this.checkAttribute(this.loginLink, 'href', 'https://www.premieronline.com/action/dologin', 'Login link');
        await this.checkExactText(this.loginButton, 'Sign in', 'Login button');
        await this.checkCSS(this.loginButton, 'background-color', 'rgb(35, 54, 111)', 'Login button');
        await this.checkCSS(this.loginButton, 'font-size', '16px', 'Login button');
        await this.checkCSS(this.loginButton, 'font-family', 'exo2medium', 'Login button');
    }

    async clickLoginLink() {
        await this.click(this.loginLink, 'Login link');
        await this.checkUrl('https://www.premieronline.com/action/dologin');
    }

    // Register link
    async verifyRegisterLinkDisplaying() {
        await this.checkIsVisible(this.registerLink, 'Register link');
        await this.checkIsEnabled(this.registerButton, 'Register button');
        await this.checkAttribute(this.registerLink, 'href', 'https://www.premieronline.com/action/register', 'Register link');
        await this.checkExactText(this.registerButton, 'Create Account', 'Register button');
        await this.checkCSS(this.registerButton, 'background-color', 'rgb(137, 185, 30)', 'Register button');
        await this.checkCSS(this.registerButton, 'font-size', '16px', 'Register button');
        await this.checkCSS(this.registerButton, 'font-family', 'exo2medium', 'Register button');
    }

    async clickRegisterLink() {   
        await this.click(this.registerLink, 'Register link');
        await this.checkUrl('https://www.premieronline.com/action/register');
    }

    // Search field
    async verifySearchFieldDisplaying() {
        await this.checkIsVisible(this.searchField, 'Search field');
        await this.checkIsEnabled(this.searchField, 'Search field');
        await this.checkAttribute(this.searchField, 'placeholder', 'Search by Event Name or Organiser', 'Search field');
        await this.checkIsVisible(this.searchIcon, 'Search icon');
        await this.checkIsEnabled(this.searchIcon, 'Search icon');
    }
    
    async search(text: string) {       
        await this.pressSequentially(this.searchField, text, 'Search field', 100);
        await this.checkUrl(/https:\/\/www\.premieronline\.com\/?/);
    }

    // Search results modal
    async verifySearchResultsModalDisplaying() {
        await this.checkIsVisible(this.searchResultsModal, 'Search results modal');
        await this.checkIsEnabled(this.searchResultsModal, 'Search results modal');
    }
}
