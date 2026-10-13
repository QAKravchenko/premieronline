import { expect, Locator, Page } from '@playwright/test'
import { BaseActions } from '../config/BaseActions';

export class HomePage extends BaseActions {

    // readonly page: Page;

    readonly comingEventLink: Locator;

    readonly registerOnEventButton: Locator;

    readonly selectSportDropdown: Locator;

    readonly selectCountryDropDown: Locator;

    readonly searchButton: Locator;

    readonly upcomingEventsTitle: Locator;

    readonly eventsGrid: Locator;

    readonly eventCard: Locator;


    constructor(page: Page) {

        //this.page = page;
        super(page);

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
        //await expect(this.upcomingEventsTitle).toBeVisible(); Старый вариант без использования универсального метода из BaseActions.ts
        await this.checkIsVisible(this.upcomingEventsTitle, 'Check upcoming event title is visible'); //Новый вариант с использованием универсального метода из BaseActions.ts
    }

    async checkEventsGrid() {
        //await expect(this.eventsGrid).toBeVisible();
        await this.
    }

    async clickEventCard() {
        await this.eventCard.click();
    }

}