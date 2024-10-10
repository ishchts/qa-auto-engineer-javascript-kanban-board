// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/Login';

let loginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.init();
});

test('login required validating', async ({ page }) => {
    await loginPage.signIn();

    await expect(page.locator('#username-helper-text')).toBeVisible();
    await expect(page.locator('#password-helper-text')).toBeVisible();
    await expect(page.getByText('The form is not valid. Please')).toBeVisible();
});

test('login/logout', async ({ page }) => {
    await loginPage.login();
    
    await expect(page.getByRole('heading', { name: 'Welcome to the administration'})).toBeVisible();
    await expect(loginPage.profileButton).toBeVisible();

    await loginPage.profileButton.click();
    await expect(loginPage.logoutItem).toBeVisible();
    await loginPage.logoutItem.click();

    await expect(page.getByText('Username *Password *Sign in')).toBeVisible();
});