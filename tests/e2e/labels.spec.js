import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/Login';
import { LabelPage } from './pages/LabelPage';

let labelPage;

const data = [
    "Label 1",
    "Label 2",
    "Label 3",
    "Label 4",
    "Label 5"
];

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.init();
    await loginPage.login();

    labelPage = new LabelPage(page);
    await labelPage.gotoLabelPage();
});

test('label list view', async () => {
    const list = await labelPage.getLabelsList();

    for (let i = 0; i < list.length; i += 1) {
        await expect(list[i]).toBeVisible();
    }
});

test('create label', async ({ page }) => {
    await labelPage.createLabel(data[0]);
    await expect(page.locator(`text="${data[0]}"`)).toBeVisible();
});

test('edit label', async ({ page }) => {
    await labelPage.createLabel(data[0]);
    await labelPage.editLabel(data[0], data[1]);

    await expect(page.locator(`text="${data[0]}"`)).not.toBeVisible();
    await expect(page.locator(`text="${data[1]}"`)).toBeVisible();
    await expect(page.getByText('Element updated')).toBeVisible();
});

test('delete label', async ({ page }) => {
    await labelPage.createLabel(data[0]);
    await expect(page.locator(`text=${data[0]}`)).toBeVisible();
    await labelPage.deleteLabel(data[0]);
    await expect(page.locator(`text=${data[0]}`)).not.toBeVisible();
});

test('delete all label', async ({ page }) => {
    await labelPage.deleteAllLabel();
    await expect(page.getByText('No Label yet.')).toBeVisible();
});