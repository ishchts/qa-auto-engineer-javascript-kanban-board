import { test, expect } from "@playwright/test";
import { LoginPage } from './pages/Login';
import { StatusPage } from './pages/Status';

const user = {
    login: 'user',
    password: 'user',
}

const statusesData = [
    { name: 'Новый', slug: 'new' },
    { name: 'В процессе', slug: 'in-progress' },
    { name: 'Завершено', slug: 'completed' },
    { name: 'Отложено', slug: 'on-hold' },
    { name: 'Отменено', slug: 'canceled' },
    { name: 'На проверке', slug: 'under-review' },
    { name: 'Одобрено', slug: 'approved' },
    { name: 'Отклонено', slug: 'rejected' },
    { name: 'На утверждении', slug: 'pending-approval' },
    { name: 'Архивировано', slug: 'archived' }
];

let statusPage;

test.beforeEach(async ({ page }) => {
    const auth = new LoginPage(page);
    await auth.init();
    await auth.login(user);

    statusPage = new StatusPage(page);
    await statusPage.goto('task_statuses')
});

test('status list view', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'create' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'export' })).toBeVisible();
    
    const statusList = statusPage.getStatusList();

    for (let i = 0; i < statusList.length; i +=1) {
        await expect(statusList[i]).toBeVisible();
    }
});

test('new status creation', async ({ page }) => {
    const newStatus = statusesData[0];

    await statusPage.createStatus(newStatus.name, newStatus.slug);

    await expect(page.getByRole('cell', { name: newStatus.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: newStatus.slug })).toBeVisible();
});

test('editing status information', async ({ page }) => {
    const newStatus = statusesData[0];
    const editableStatus = statusesData[1];

    await statusPage.createStatus(newStatus.name, newStatus.slug);
    await statusPage.editStatus(newStatus.name, editableStatus.name, editableStatus.slug);

    await expect(page.getByRole('cell', { name: newStatus.name })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: newStatus.slug })).not.toBeVisible();

    await expect(page.getByRole('cell', { name: editableStatus.name })).toBeVisible();
    await expect(page.getByRole('cell', { name: editableStatus.slug })).toBeVisible();
});

test('deletion of statuses', async ({ page }) => {
    await statusPage.deleteStatusByName('Draft');
    await expect(page.locator('text="Draft"')).not.toBeVisible();
    await expect(page.locator('text="Element deleted"')).toBeVisible();
});

test('deletion all statuses', async ({ page }) => {
    await statusPage.deleteAllStatuses();
    await expect(page.getByText('No Task status yet.')).toBeVisible();
    await expect(page.getByText('Do you want to add one?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'create' })).toBeVisible();
});

