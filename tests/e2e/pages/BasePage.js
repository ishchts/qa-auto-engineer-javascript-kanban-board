import 'dotenv/config';
import path from 'path';

const baseUrl = process.env.VITE_APP_BASE_URL || 'http://localhost:5173';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.url = baseUrl;
    }

    async goto(url) {
        await this.page.goto(path.join(this.url, '#', url));
    }
}