import { Locator, Page } from '@playwright/test';
import { BaseActions } from '../../config/BaseActions';

export class HomePage extends BaseActions {

    readonly comingEventLink: Locator;

    readonly registerOnEventButton: Locator;

    readonly selectSportDropdown: Locator;

    readonly selectCountryDropDown: Locator;

    readonly searchButton: Locator;

    readonly upcomingEventsTitle: Locator;

    readonly eventsGrid: Locator;

    readonly eventCard: Locator;

    constructor(page: Page) {
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
        await this.goto('/');
    }

    async clickComingEventLink() {
        await this.click(this.comingEventLink, 'Coming event link');
    }

    async clickRegisterOnEventButton() {
        await this.click(this.registerOnEventButton, 'Register on event button');
    }

    async clickSelectSportDropdown() {
        await this.click(this.selectSportDropdown, 'Select sport dropdown');
    }

    async clickSelectCountryDropDown() {
        await this.click(this.selectCountryDropDown, 'Select country dropdown');
    }

    async clickSearchButton() {
        await this.click(this.searchButton, 'Search button');
    }

    async checkUpcomingEventsTitle() {
        await this.checkIsVisible(this.upcomingEventsTitle, 'Upcoming events title');
    }

    async checkEventsGrid() {
        await this.checkIsVisible(this.eventsGrid, 'Events grid');
    }

    async clickEventCard() {
        await this.click(this.eventCard, 'Event card');
    }
}