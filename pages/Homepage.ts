import { expect, Locator, Page } from '@playwright/test'

export class HomePage {

    readonly page: Page;

    readonly comingEventLink: Locator;

    readonly registerOnEventButton: Locator;

    readonly selectSportDropdown: Locator;

    readonly selectCountryDropDown: Locator;

    readonly searchButton: Locator;

    readonly upcomingEventsTitle: Locator;

    readonly eventsGrid: Locator;

    readonly eventCard: Locator;


    constructor(page: Page) {

        this.page = page;

        this.comingEventLink = page.locator('h2.uk-card-title');

        this.registerOnEventButton = page.locator('a.uk-button-default'); // Register button

        this.selectSportDropdown = page.locator('#txt_cat');

        this.selectCountryDropDown = page.locator('#txt_cnt');

        this.searchButton = page.locator('.btn.btn-outline-primary', { hasText: 'Search' });

        this.upcomingEventsTitle = page.locator('h1', { hasText: 'Upcoming Events' });

        this.eventsGrid = page.locator('.events_flex');

        this.eventCard = page.locator('.events_flex_event').first();
    }


    async open() {
        await this.page.goto('/');
    }

    async clickComingEventLink() {
        await this.comingEventLink.click();
    }

    async clickRegisterOnEventButton() {
        await this.registerOnEventButton.click();
    }

    async clickSelectSportDropdown() {
        await this.selectSportDropdown.click();
    }

    async clickSelectCountryDropDown() {
        await this.selectCountryDropDown.click();
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async checkUpcomingEventsTitle() {
        await expect(this.upcomingEventsTitle).toBeVisible();
    }

    async checkEventsGrid() {
        await expect(this.eventsGrid).toBeVisible();
    }

    async clickEventCard() {
        await this.eventCard.click();
    }

}