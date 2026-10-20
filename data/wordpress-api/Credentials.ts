/**
 * Credentials for WordPress REST API testing.
 * Values are loaded from environment variables (process.env) or .env file.
 */
export interface ApiCredentials {
    username: string;
    password: string;
}

export const apiCredentials: ApiCredentials = {
    username: process.env.API_USERNAME || 'admin',
    password: process.env.API_PASSWORD || 'Engineer_123'
};

export const credentials = {
    api: apiCredentials
};

export default apiCredentials;
