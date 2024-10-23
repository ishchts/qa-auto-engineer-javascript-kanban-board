import { expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class TaskPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async gotoTaskPage() {
        await super.goto('tasks');
    }

    getTaskList() {
        return [
            this.page.getByRole('heading', { name: 'To Be Fixed' }),
            this.page.getByRole('heading', { name: 'To Review' }),
            this.page.getByRole('heading', { name: 'To Publish' }),
            this.page.getByRole('heading', { name: 'Draft' }),
            this.page.getByLabel('Assignee'),
            this.page.getByLabel('Status'),
            this.page.getByLabel('Label'),
        ]
    }

    async createTask({
        assignee,
        title,
        content,
        status,
        label,
    }) {
        await this.page.getByRole('link', { name: 'create' }).click();

        await this.page.getByLabel('Assignee').click();
        await this.page.getByRole('option', { name: assignee }).click();

        await this.page.getByLabel('Title').fill(title);
        await this.page.getByLabel('Content', { exact: true }).fill(content);

        await this.page.getByLabel('Status').click();
        await this.page.getByRole('option', { name: status }).click();

        await this.page.getByLabel('Label').click();
        await this.page.getByRole('option', { name: label }).click();
        await this.page.keyboard.press('Escape');

        await this.page.getByRole('button', { name: 'save' }).click();
        await this.gotoTaskPage();
    }

    async filteredByAssignee(name) {
        await this.page.getByLabel('Assignee').click();
        await this.page.getByRole('option', { name }).click();
    }

    async filteredByStatus(name) {
        await this.page.getByLabel('Status').click();
        await this.page.getByRole('option', { name }).click();
    }

    async filteredByLabel(name) {
        await this.page.getByLabel('Label').click();
        await this.page.getByRole('option', { name }).click();
    }

    async moveTaskBetweenColumns(targetColumn, taskTitle) {
        const task = this.page.getByRole('button', { name: taskTitle });
        await expect(task).toBeVisible();

        const dropTarget = this.page.locator(`[data-rfd-droppable-id="${targetColumn}"]`);
        await expect(dropTarget).toBeVisible();

        const taskBox = await task.boundingBox();
        const startX = await taskBox.x + taskBox.width / 2;
        const startY = await taskBox.y + taskBox.height / 2;

        const targetColumnBox = await dropTarget.boundingBox();
        const endX = await targetColumnBox.x + targetColumnBox.width / 2;
        const endY = await targetColumnBox.y + targetColumnBox.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY);
        await this.page.mouse.up();
    }

    async editTask(taskTitle, newTitle) {
        await this.page
            .getByRole('button', { name: taskTitle })
            .getByRole('link', { name: 'edit' }).click();

        await this.page.getByLabel('Title').fill(newTitle);
        await this.page.getByRole('button', { name: 'save' }).click();
    }

    async deleteTask(taskTitle) {
        await this.page
            .getByRole('button', { name: taskTitle })
            .getByRole('link', { name: 'show' }).click();

        await this.page.getByRole('button', { name: 'delete'}).click();
    }
}