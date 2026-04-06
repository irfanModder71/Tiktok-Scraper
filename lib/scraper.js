const axios = require('axios');
const { HEADERS, TIMEOUT } = require('./constants');
const { extractUniversalData, parseUserData } = require('./parser');

class IrfanTikTokScraper {
    constructor() {
        this.client = axios.create({
            timeout: TIMEOUT,
            headers: HEADERS
        });
    }

    async getProfile(username) {
        if (username.startsWith('@')) username = username.slice(1);

        const url = `https://www.tiktok.com/@${username}`;

        try {
            const response = await this.client.get(url);

            if (response.status !== 200) {
                throw new Error(`HTTP Status: ${response.status}`);
            }

            const html = response.data;
            const rawData = extractUniversalData(html);

            if (!rawData) {
                throw new Error("Tidak menemukan __UNIVERSAL_DATA_FOR_REHYDRATION__");
            }

            const profile = parseUserData(rawData);

            return {
                success: true,
                ...profile
            };

        } catch (error) {
            return {
                success: false,
                username,
                error: error.message
            };
        }
    }
}

module.exports = IrfanTikTokScraper;
