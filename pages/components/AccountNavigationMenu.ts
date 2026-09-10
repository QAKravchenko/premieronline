import { Locator, Page } from '@playwright/test';

import { BaseActions} from '../../config/BaseActions';


export class AccountNavigationMenu extends BaseActions {

    readonly accountLink: Locator;

    readonly friendsLink: Locator;

    readonly messagesLink: Locator;

    readonly subscriptionsLink: Locator;

    
    constructor(page: Page) {

        super(page);

        this.accountLink = page.locator('a[href="/personal_regs"]');

        this.friendsLink = page.locator('a[href="/friends.php"]');

        this.messagesLink = page.locator('a[href="/messages.php"]');
    
        this.subscriptionsLink = page.locator('a[href="/communications"]');
    }


    async checkAccountNavigationMenuLinks() {
        await this.checkAccountLink();
        await this.checkFriendsLink();
        await this.checkMessagesLink();
        await this.checkSubscriptionsLink();
    }

    private async verifyMenuLinks(locator: Locator, expectedText: string, description: string) {
        await this.checkIsVisible(locator, `${description} is visible`);
        await this.checkIsEnabled(locator, `${description} is enabled`);
        await this.checkText(locator, expectedText, `${description} has text "${expectedText}"`);
    }

    async checkAccountLink() {
        await this.verifyMenuLinks(this.accountLink, 'Account', 'Account link');
    }

    async checkFriendsLink() {
        await this.verifyMenuLinks(this.friendsLink, 'Friends', 'Friends link');
    }

    async checkMessagesLink() {
        await this.verifyMenuLinks(this.messagesLink, 'Messages', 'Messages link')
    }

    async checkSubscriptionsLink() {
        await this.verifyMenuLinks(this.subscriptionsLink, 'Subscriptions', 'Subscriptions link');
    }
}