import { BasePage } from './BasePage';

export class LabelPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async gotoLabelPage() {
        await super.goto('labels');
    }

    getLabelsList() {
        const elements = [
            this.page.getByRole('columnheader', { name: 'Sort by Id descending' }),
            this.page.getByRole('columnheader', { name: 'Sort by Name descending' }),
            this.page.getByRole('columnheader', { name: 'Select all' })
        ];

        return elements;
    }

    async createLabel(value) {
        await this.page.getByRole('link', { name: 'create' }).click();
        await this.page.getByLabel('Name').fill(value);
        await this.page.getByRole('button', { name: 'save' }).click();
        await this.gotoLabelPage();
    }

    async editLabel(oldName, newName) {
        await this.page.getByRole('cell', { name: oldName }).click();
        await this.page.getByLabel('Name').fill(newName);
        await this.page.getByRole('button', { name: 'save' }).click();
    }

    async deleteLabel(name) {
        await this.page.getByRole('cell', { name }).click();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }

    async deleteAllLabel() {
        await this.page.getByRole('columnheader', { name: 'Select all' }).click();
        await this.page.getByRole('button', { name: 'delete' }).click();
    }
}