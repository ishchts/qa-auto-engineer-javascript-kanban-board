import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class UsersPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async goToUsersPage() {
        await super.goto('users');
    }

    createUserLink() {
        return this.page.getByRole('link', { name: 'Create' });
    }

    async fillNewUserBy(name, value) {
        const filed = this.page.getByLabel(name);
        await expect(filed).toBeVisible();
        await filed.fill(value);
    }

    async fillNewUser(email, firstName, lastName, password) {
        await this.fillNewUserBy('Email', email);
        await this.fillNewUserBy('First name', firstName);
        await this.fillNewUserBy('Last name', lastName);
        await this.fillNewUserBy('Password', password);
    }

    noUserText() {
        return this.page.getByText('No User yet.Do you want to');
    }

    getUsersList() {
        const elements = [
            this.page.getByRole('columnheader', { name: 'Select all' }),
            this.page.getByRole('columnheader', { name: 'id' }),
            this.page.getByRole('columnheader', { name: 'Email' }),
            this.page.getByRole('columnheader', { name: 'First name' }),
            this.page.getByRole('columnheader', { name: 'Last name' }),
            this.page.getByRole('columnheader', { name: 'Created at' }),
            this.createUserLink(),
            this.page.getByRole('button', { name: 'Export' })
        ];

        return elements;
    }

    async createUser(user) {
        await this.createUserLink().click();

        const saveButton = this.page.getByRole('button', { name: 'Save' });
        
        await expect(saveButton).toBeDisabled();
        
        await this.fillNewUser(
            user.email,
            user.firstName,
            user.lastName,
            user.password
        );

        await expect(saveButton).not.toBeDisabled();

        await saveButton.click();

        await expect(saveButton).toBeDisabled();
        const textLocator = this.page.getByText('Element created');
        await textLocator.waitFor();

        await this.goToUsersPage();
    }

    async editUser(name, user) {
        await this.page.getByRole('cell', { name }).click();

        await this.fillNewUser(
            user.email,
            user.firstName,
            user.lastName,
            user.password
        );

        const saveButton = this.page.getByRole('button', { name: 'Save' });
        await saveButton.click();
    }

    async deleteUser(email) {
        await this.page.getByRole('cell', { name: email }).click();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }

    async deleteAllUser() {
        await this.page.getByLabel('Select all').getByRole('checkbox').check();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }
}