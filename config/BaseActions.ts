import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

export class BaseActions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async click(locator: Locator, actionDescription: string) {
        try {
            Logger.info(`Action: Click on ${actionDescription}`);
            await expect(locator).toBeVisible();
            await expect(locator).toBeEnabled();
            await locator.click();
            Logger.info(`Successfully clicked on ${actionDescription}`);
        } catch (error) {
            Logger.error(`Failed to click on ${actionDescription}`, error);
            throw error;
        }
    }

    async fill(locator: Locator, text: string, actionDescription: string) {
        try {
            Logger.info(`Action: Fill ${actionDescription} with value '${text}'`);
            await expect(locator).toBeVisible();
            await expect(locator).toBeEnabled();
            await locator.fill(text);
            Logger.info(`Successfully filled ${actionDescription}`);
        } catch (error) {
            Logger.error(`Failed to fill ${actionDescription}`, error);
            throw error;
        }
    }

    async checkIsVisible(locator: Locator, elementDescription: string) {
        try {
            Logger.info(`Check: Is ${elementDescription} visible`);
            await expect(locator).toBeVisible();
            Logger.info(`${elementDescription} is visible`);
        } catch (error) {
            Logger.error(`${elementDescription} is not visible`, error);
            throw error;
        }
    }

    async checkIsEnabled(locator: Locator, elementDescription: string) {
        try {
            Logger.info(`Check: Is ${elementDescription} enabled`);
            await expect(locator).toBeEnabled();
            Logger.info(`${elementDescription} is enabled`);
        } catch (error) {
            Logger.error(`${elementDescription} is not enabled`, error);
            throw error;
        }
    }

    async checkAttribute(locator: Locator, attributeName: string, attributeValue: string, elementDescription: string) {
        try {
            Logger.info(`Check: Does ${elementDescription} have attribute '${attributeName}'='${attributeValue}'`);
            await expect(locator).toHaveAttribute(attributeName, attributeValue);
            Logger.info(`${elementDescription} has expected attribute`);
        } catch (error) {
            Logger.error(`Failed to verify attribute for ${elementDescription}`, error);
            throw error;
        }
    }

    async checkValue(locator: Locator, expectedValue: string, elementDescription: string) {
        try {
            Logger.info(`Check: Does ${elementDescription} have value '${expectedValue}'`);
            await expect(locator).toHaveValue(expectedValue);
            Logger.info(`${elementDescription} has expected value`);
        } catch (error) {
            Logger.error(`Failed to verify value for ${elementDescription}`, error);
            throw error;
        }
    }

    async checkText(locator: Locator, expectedText: string, elementDescription: string) {
        try {
            Logger.info(`Check: Does ${elementDescription} contain text '${expectedText}'`);
            await expect(locator).toContainText(expectedText);
            Logger.info(`${elementDescription} contains expected text`);
        } catch (error) {
            Logger.error(`Failed to verify text for ${elementDescription}`, error);
            throw error;
        }
    }

    async checkExactText(locator: Locator, expectedText: string, elementDescription: string) {
        try {
            Logger.info(`Check: Does ${elementDescription} have exact text '${expectedText}'`);
            await expect(locator).toHaveText(expectedText);
            Logger.info(`${elementDescription} has expected exact text`);
        } catch (error) {
            Logger.error(`Failed to verify exact text for ${elementDescription}`, error);
            throw error;
        }
    }

    async checkUrl(expectedUrl: string) {
        try {
            Logger.info(`Check: Is page URL '${expectedUrl}'`);
            await expect(this.page).toHaveURL(expectedUrl);
            Logger.info(`Page URL is correct`);
        } catch (error) {
            Logger.error(`Failed to verify page URL`, error);
            throw error;
        }
    }
}
