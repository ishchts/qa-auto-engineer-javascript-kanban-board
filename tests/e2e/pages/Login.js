import { expect } from '@playwright/test';

const user = {
    login: 'username',
    password: 'password',
}

export class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async init() {
        await this.page.goto('http://localhost:5173/#/login');
    }

    async fillByLabel(label, value) {
        const field = this.page.getByLabel(label);
        await field.fill(value);
        return field;
    }

    async signIn() {
        const button = this.page.getByRole('button', { name: 'Sign in' });
        await button.click();
    }

    async login() {
        const username = await this.fillByLabel('Username *', user.login);
        const password = await this.fillByLabel('Password *', user.password);
        
        expect(await username.inputValue()).toBe(user.login);
        expect(await password.inputValue()).toBe(user.password);
    
        await this.signIn();
    }

    get profileButton() {
        return this.page.getByLabel('Profile');
    }

    get logoutItem() {
        return this.page.getByRole('menuitem', { name: 'Logout' })
    }
}