// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/Login';

const userData = {
    login: 'username',
    password: 'password',
}

let loginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.init();
});

test('login required validating', async () => {
    await loginPage.signIn();

    await expect(loginPage.usernameHelperText).toBeVisible();
    await expect(loginPage.passwordHelperText).toBeVisible();
    await expect(loginPage.formInvalidMessage).toBeVisible();
});

test('login/logout', async ({ page }) => {
    await loginPage.login(userData);
    
    await expect(page.getByRole('heading', { name: 'Welcome to the administration' })).toBeVisible();
    await expect(loginPage.profileButton).toBeVisible();

    await loginPage.logout();

    await expect(page.getByText('Username *Password *Sign in')).toBeVisible();
});