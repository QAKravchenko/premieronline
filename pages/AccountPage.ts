import { Locator, Page } from '@playwright/test';

import { BaseActions } from '../config/BaseActions'; 


export class AccountPage extends BaseActions {

    readonly breadcrumbs: Locator;

    readonly personalDetailsTitle: Locator;

    readonly emergencyContactTitle: Locator;

    readonly medicalInfoTitle: Locator;

    readonly editLink: Locator;

    readonly changePasswordLink: Locator;

    readonly changeEmailLink: Locator;

    readonly deactivateAccountLink: Locator;


    constructor(page: Page) {

        super(page);

        this.breadcrumbs = page.locator('.uk-breadcrumb').getByText('Personal Details');

        this.personalDetailsTitle = page.locator('.title', { hasText: 'Personal Details' });

        this.emergencyContactTitle = page.locator('.uk-align-left', { hasText: 'Emergency Contact'} );

        this.medicalInfoTitle = page.locator('.title', { hasText: 'Medical Info'} );

        this.editLink = page.locator('a[href="/personal_details_edit.php"]');

        this.changePasswordLink = page.locator('a[href="/password_change"]');

        this.changeEmailLink = page.locator('a[href="/email_change"]');

        this.deactivateAccountLink = page.locator('a[href="delete_account"]');
    }


    async checkAccountPageElements() {
        await this.checkBreadcrumbs();
        await this.checkPersonalDetailsTitle();
        await this.checkEmergencyContactTitle();
        await this.checkMedicalInfoTitle();
        await this.checkEditLink();
        await this.checkChangePasswordLink();
        await this.checkChangeEmailLink();
        await this.checkDeactivateAccountLink();
    }

    private async verifyAccountPageElements(locator: Locator, expectedText: string, description: string) {
        await this.checkIsVisible(locator, `${description} is visible`);
        await this.checkIsEnabled(locator, `${description} is enabled`);
        await this.checkText(locator, expectedText, `${description} has text "${expectedText}"`);
    }

    async checkBreadcrumbs() {
        await this.verifyAccountPageElements(this.breadcrumbs, 'Personal Details', '"Breadcrumbs" text');
    }

    async checkPersonalDetailsTitle() {
        await this.verifyAccountPageElements(this.personalDetailsTitle, 'Personal Details', '"Personal Details" text');
    }

    async checkEmergencyContactTitle() {
        await this.verifyAccountPageElements(this.emergencyContactTitle, 'Emergency Contact', '"Emergency Contact" text');
    }

    async checkMedicalInfoTitle() {
        await this.verifyAccountPageElements(this.medicalInfoTitle, 'Medical Info', '"Medical Info" text');
    }

    async checkEditLink() {
        await this.verifyAccountPageElements(this.editLink, 'Edit', '"Edit" text');
    }

    async checkChangePasswordLink() {
        await this.verifyAccountPageElements(this.changePasswordLink, 'Change Password', '"Change Password" text');
    }

    async checkChangeEmailLink() {
        await this.verifyAccountPageElements(this.changeEmailLink, 'Change Email', '"Change Email" text');
    }

    async checkDeactivateAccountLink() {
        await this.verifyAccountPageElements(this.deactivateAccountLink, 'Deactivate Account', '"Deactivate Account" text');
    }
}