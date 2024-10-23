import { BasePage } from "./BasePage";

export class StatusPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async gotoStatusesPage() {
        await this.goto('task_statuses');
    }

    getStatusList() {
        const list = [
            this.page.getByRole('columnheader', { name: 'Sort by Name descending' }),
            this.page.getByRole('columnheader', { name: 'Sort by Slug descending' }),
            this.page.getByRole('columnheader', { name: 'Sort by Created at descending' })
        ];

        return list;
    }

    async createStatus(name, slug) {
        await this.page.getByRole('link', { name: 'create' }).click();

        const nameField = this.page.getByLabel('Name');
        const slugField = this.page.getByLabel('slug');
        const save = this.page.getByRole('button', { name: 'save' });

        await nameField.fill(name);
        await slugField.fill(slug);
    
        await save.click();
        const textLocator = this.page.getByText('Element created');
        await textLocator.waitFor();

        await this.goto('task_statuses');
    }

    async editStatus(oldName, newName, newSlug) {
        await this.page.getByRole('cell', { name: oldName }).click();

        const nameField = this.page.getByLabel('Name');
        const slugField = this.page.getByLabel('slug');
        const save = this.page.getByRole('button', { name: 'save' });

        await nameField.fill(newName);
        await slugField.fill(newSlug);

        await save.click();
        const textLocator = this.page.getByText('Element updated');
        await textLocator.waitFor();
    }

    async deleteStatusByName(name) {
        await this.page.getByText(name, { exact: true }).click();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }

    async deleteAllStatuses() {
        await this.page.getByLabel('Select all').getByRole('checkbox').check();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }
}