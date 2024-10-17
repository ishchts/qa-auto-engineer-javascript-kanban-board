import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
    }
    
    get usernameField() {
        return this.page.getByLabel('Username *');
    }
    
    get passwordField() {
        return this.page.getByLabel('Password *');
    }

    get signInButton() {
        return this.page.getByRole('button', { name: 'Sign in' });
    }

    get usernameHelperText() {
        return this.page.locator('#username-helper-text');
    }

    get passwordHelperText() {
        return this.page.locator('#password-helper-text');
    }

    get formInvalidMessage() {
        return this.page.getByText('The form is not valid. Please');
    }

    get profileButton() {
        return this.page.getByLabel('Profile');
    }

    get logoutItem() {
        return this.page.getByRole('menuitem', { name: 'Logout' })
    }

    async init() {
        await super.goto('login');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillByLabel(label, value) {
        const field = this.page.getByLabel(label);
        await field.fill(value);
        return field;
    }

    async signIn() {
        const button = this.signInButton;
        await button.click();
    }

    async login(user) {
        await this.usernameField.fill(user.login);
        await this.passwordField.fill(user.password);
        
        expect(await this.usernameField.inputValue()).toBe(user.login);
        expect(await this.passwordField.inputValue()).toBe(user.password);
    
        await this.signIn();
    }

    async logout() {
        await this.profileButton.click();
        await expect(this.logoutItem).toBeVisible();
        await this.logoutItem.click();
    }
}