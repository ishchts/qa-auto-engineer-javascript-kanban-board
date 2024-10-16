import { expect } from '@playwright/test';

export class UsersPage {
    static async goto(page) {
        await page.goto('http://localhost:5173/#/users');
    }

    constructor(page) {
        this.page = page;
    }

    createUserLink() {
        return this.page.getByRole('link', { name: 'Create' });
    }

    exportButton() {
        return this.page.getByRole('button', { name: 'Export' });
    }
    
    async columnsVisible() {
        await expect(this.page.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'id' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'First name' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Last name' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Created at' })).toBeVisible();
    }

    getSubmitButton() {
        return this.page.getByRole('button', { name: 'Save' });
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

    deleteButton() {
        return this.page.getByRole('button', { name: 'DELETE' });
    }

    selectRowByIndex(index, email) {
        return this.page.getByRole('row', { name: `Select this row ${index} ${email}` }).getByRole('checkbox');
    }

    selectAllCheckbox() {
        return this.page.getByLabel('Select all').getByRole('checkbox');
    }

    noUserText() {
        return this.page.getByText('No User yet.Do you want to');
    }

    createUserButton() {
        return this.page.getByRole('link', { name: 'Create' });
    }
}