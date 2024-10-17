import 'dotenv/config';
import path from 'path';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.url = process.env.VITE_APP_BASE_URL;
    }

    async goto(url) {
        await this.page.goto(path.join(this.url, '#', url));
    }
}