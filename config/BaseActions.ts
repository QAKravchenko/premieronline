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

    async checkUrl(expectedUrl: string | RegExp) {
        try {
            Logger.info(`Check: Is page URL '${expectedUrl}'`);
            await expect(this.page).toHaveURL(expectedUrl);
            Logger.info(`Page URL is correct`);
        } catch (error) {
            Logger.error(`Failed to verify page URL`, error);
            throw error;
        }
    }

    async hover(locator: Locator, actionDescription: string) {
        try {
            Logger.info(`Action: Hover over ${actionDescription}`);
            await locator.hover();
            Logger.info(`Successfully hovered over ${actionDescription}`);
        } catch (error) {
            Logger.error(`Failed to hover over ${actionDescription}`, error);
            throw error;
        }
    }

    async checkCSS(locator: Locator, cssProperty: string, cssValue: string | RegExp, elementDescription: string) {
        try {
            Logger.info(`Check: Does ${elementDescription} have CSS property '${cssProperty}'='${cssValue}'`);
            await expect(locator).toHaveCSS(cssProperty, cssValue);
            Logger.info(`${elementDescription} has expected CSS property '${cssProperty}'`);
        } catch (error) {
            Logger.error(`Failed to verify CSS property '${cssProperty}' for ${elementDescription}`, error);
            throw error;
        }
    }

    async pressSequentially(locator: Locator, text: string, actionDescription: string, delay: number = 100) {
        try {
            Logger.info(`Action: Press sequentially on ${actionDescription} with value '${text}'`);
            await locator.pressSequentially(text, { delay });
            Logger.info(`Successfully pressed sequentially on ${actionDescription}`);
        } catch (error) {
            Logger.error(`Failed to press sequentially on ${actionDescription}`, error);
            throw error;
        }
    }

    async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'; timeout?: number }) {
        try {
            Logger.info(`Action: Navigate to URL '${url}'`);
            await this.page.goto(url, { waitUntil: 'domcontentloaded', ...options });
            Logger.info(`Successfully navigated to URL '${url}'`);
        } catch (error) {
            Logger.error(`Failed to navigate to URL '${url}'`, error);
            throw error;
        }
    }

    async checkTitle(expectedTitle: string | RegExp) {
        try {
            Logger.info(`Check: Does page title match '${expectedTitle}'`);
            await expect(this.page).toHaveTitle(expectedTitle);
            Logger.info(`Page title matches expected`);
        } catch (error) {
            Logger.error(`Failed to verify page title`, error);
            throw error;
        }
    }
}
