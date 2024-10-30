import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/Login';
import { TaskPage } from './pages/TaskPage';
import { UsersPage } from './pages/UsersPage';
import { StatusPage } from './pages/Status';
import { LabelPage } from './pages/LabelPage';

const usersData = [
    {
        email: 'example@mail.ru',
        firstName: 'Vasya',
        lastName: 'Vasilev',
        password: 'Qwerty11',
    },
    {
        email: 'anna.smirnova@gmail.com',
        firstName: 'Anna',
        lastName: 'Smirnova',
        password: 'Password123',
    },
];

const statusesData = [
    { name: 'Новый', slug: 'new' },
    { name: 'В процессе', slug: 'in-progress' },
];

const labelsData = [
    "Label 1",
    "Label 2",
];

let userPage;
let statusPage;
let labelPage;
let taskPage;

const newUser = usersData[0];
const secondUser = usersData[1];

let task1;
let task2;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.init();
    await loginPage.login();

    userPage = new UsersPage(page);
    await userPage.goToUsersPage();
    await userPage.createUser(newUser);
    await userPage.createUser(secondUser);

    statusPage = new StatusPage(page);
    await statusPage.gotoStatusesPage();

    const newStatus = statusesData[0];
    const secondStatus = statusesData[1];
    await statusPage.createStatus(newStatus.name, newStatus.slug);
    await statusPage.createStatus(secondStatus.name, secondStatus.slug);

    labelPage = new LabelPage(page);
    await labelPage.gotoLabelPage();
    await labelPage.createLabel(labelsData[0]);
    await labelPage.createLabel(labelsData[1]);

    taskPage = new TaskPage(page);
    await taskPage.gotoTaskPage();
    task1 = {
        assignee: newUser.email,
        title: 'new task',
        content: 'desc task',
        status: newStatus.name,
        label: labelsData[0],
    };
    await taskPage.createTask(task1);
    task2 = {
        assignee: secondUser.email,
        title: 'second task',
        content: 'second desc',
        status: secondStatus.name,
        label: labelsData[1],
    };
    await taskPage.createTask(task2);
});

test('task list view', async () => {
    const list = await taskPage.getTaskList();

    for (let i = 0; i < list.length; i += 1) {
        await expect(list[i]).toBeVisible();
    }
});

test('filtered by assignee', async ({ page }) => {
    await expect(await page.locator(`text=${task2.title}`)).toBeVisible();
    await taskPage.filteredByAssignee(newUser.email);

    await expect(page.locator(`text=${task2.title}`)).not.toBeVisible();
    await expect(page.locator(`text=${task1.title}`)).toBeVisible();

    // await page.reload();

    // await expect(page.locator(`text=${task2.title}`)).not.toBeVisible();
    // await expect(page.locator(`text=${task1.title}`)).toBeVisible();
});

test('filtered by status', async ({ page }) => {
    await expect(page.locator(`text=${task2.title}`)).toBeVisible();
    await taskPage.filteredByStatus(task1.status);

    await expect(page.locator(`text=${task2.title}`)).not.toBeVisible();
    await expect(page.locator(`text=${task1.title}`)).toBeVisible();
});

test('filtered by label', async ({ page }) => {
    await expect(page.locator(`text=${task1.title}`)).toBeVisible();
    await taskPage.filteredByLabel(task2.label);

    await expect(page.locator(`text=${task2.title}`)).toBeVisible();
    await expect(page.locator(`text=${task1.title}`)).not.toBeVisible();
});

test('should perform drag and drop', async () => {
    await taskPage.moveTaskBetweenColumns(statusesData[1].slug, task1.title);
});

test('edit task', async ({ page }) => {
    const newTitle = 'super new task';
    await expect(page.locator(`text=${newTitle}`)).not.toBeVisible();
    await taskPage.editTask(task1.title, newTitle);
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    await expect(page.locator('text=Element updated')).toBeVisible();
});

test('delete task', async ({ page }) => {
    await expect(page.locator(`text=${task1.title}`)).toBeVisible();
    await taskPage.deleteTask(task1.title);
    await expect(page.locator(`text=${task1.title}`)).not.toBeVisible();
    await expect(page.locator('text=Element deleted')).toBeVisible();
});