import { test, expect } from '@playwright/test';
import { UsersPage } from './pages/Users';
import { LoginPage } from './pages/Login';

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
    {
        email: 'petr.ivanov@yahoo.com',
        firstName: 'Petr',
        lastName: 'Ivanov',
        password: 'Ivanov456!',
    },
    {
        email: 'katya.sidorova@mail.ru',
        firstName: 'Katya',
        lastName: 'Sidorova',
        password: 'Katya2021',
    }
];

const user = {
    login: usersData[0].firstName,
    password: usersData[0].firstName,
}

test.beforeEach(async ({ page }) => {
    const auth = new LoginPage(page);
    await auth.init();
    await auth.login(user);
    await UsersPage.goto(page);
});

test('users list', async ({ page }) => {
    const users = new UsersPage(page);

    await expect(users.createUserLink()).toBeVisible();
    await expect(users.exportButton()).toBeVisible();

    await users.columnsVisible();
});

test('create/edit user', async ({ page }) => {
    const newUser = usersData[0];
    const editableUser = usersData[1];

    const users = new UsersPage(page);

    await users.createUserLink().click();
    const submitButton = users.getSubmitButton();
    await expect(submitButton).toBeDisabled();

    await users.fillNewUser(newUser.email, newUser.firstName, newUser.lastName, newUser.password);
    
    await expect(submitButton).not.toBeDisabled();
    await submitButton.click();
    
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(submitButton).toBeDisabled();

    await page.getByRole('menuitem', { name: 'Users' }).click();
    await expect(page.getByRole('cell', { name: newUser.email })).toBeVisible();

    await page.getByRole('cell', { name: newUser.email }).click();
    await users.fillNewUser(editableUser.email, editableUser.firstName, editableUser.lastName, editableUser.password);
    await submitButton.click();

    await expect(page.getByRole('cell', { name: newUser.email })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: editableUser.email })).toBeVisible();
    await expect(page.getByText('Element updated')).toBeVisible();
});

test('delete user', async ({ page }) => {
    const newUser = usersData[0];
    const users = new UsersPage(page);

    const submitButton = users.getSubmitButton();

    await users.createUserLink().click();
    await users.fillNewUser(newUser.email, newUser.firstName, newUser.lastName, newUser.password);
    await submitButton.click();

    await expect(users.deleteButton()).toBeVisible();
    await users.deleteButton().click();

    await expect(page.getByRole('cell', { name: newUser.email })).not.toBeVisible();

    const firstCell = await users.selectRowByIndex(1, 'john@google');
    const twoCell = await users.selectRowByIndex(2, 'jack@yahoo.');

    await firstCell.click();
    await twoCell.click();

    await expect(users.deleteButton()).toBeVisible();
    await users.deleteButton().click();

    await expect(firstCell).not.toBeVisible();
    await expect(twoCell).not.toBeVisible();

    await users.selectAllCheckbox().check();
    await users.deleteButton().click();

    await expect(users.noUserText()).toBeVisible();
    await expect(users.createUserButton()).toBeVisible();
});