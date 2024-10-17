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

let usersPage;

test.beforeEach(async ({ page }) => {
    const auth = new LoginPage(page);
    await auth.init();
    await auth.login(user);

    usersPage = new UsersPage(page);
    await usersPage.goToUsersPage();
});

test('users list', async () => {
    const usersList = usersPage.getUsersList();

    for (let i = 0; i < usersList.length; i += 1) {
        await expect(usersList[i]).toBeVisible();
    }
});

test('create new user', async ({ page }) => {
    const newUser = usersData[0];

    await usersPage.createUser(newUser);

    await expect(page.getByRole('cell', { name: newUser.email })).toBeVisible();
    await expect(page.getByRole('cell', { name: newUser.firstName })).toBeVisible();
});

test('edit user', async ({ page }) => {
    const newUser = usersData[0];
    const editableUser = usersData[1];

    await usersPage.createUser(newUser);
    await usersPage.editUser(newUser.email, editableUser);

    await expect(page.getByRole('cell', { name: newUser.email })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: newUser.firstName })).not.toBeVisible();

    await expect(page.getByRole('cell', { name: editableUser.email })).toBeVisible();
    await expect(page.getByText('Element updated')).toBeVisible();
});

test('delete user', async ({ page }) => {
    const newUser = usersData[0];

    await usersPage.createUser(newUser);
    await usersPage.deleteUser(newUser.email);

    await expect(page.getByRole('cell', { name: newUser.email })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: newUser.firstName })).not.toBeVisible();
});

test('delete all users', async () => {
    await usersPage.deleteAllUser();
    await expect(usersPage.noUserText()).toBeVisible();

});
