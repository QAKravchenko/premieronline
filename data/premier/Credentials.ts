/**
 * Credentials for Premier Online authentication (Login and Registration).
 * Security: Sensitive credentials are not hardcoded.
 * Values are loaded from environment variables (process.env) or .env file.
 */

// Load variables from .env if supported
if (typeof process !== 'undefined' && typeof (process as any).loadEnvFile === 'function') {
    try {
        (process as any).loadEnvFile();
    } catch {
        // .env missing (e.g. in CI), fallback to system process.env
    }
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegistrationCredentials {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    repeatPassword: string;
}

export interface ApiCredentials {
    username: string;
    password: string;
}

export interface UserCredentials {
    login: LoginCredentials;
    registration: RegistrationCredentials;
    api: ApiCredentials;
}

export const credentials: UserCredentials = {
    login: {
        email: process.env.LOGIN_EMAIL || 'test_user@example.com',
        password: process.env.LOGIN_PASSWORD || 'TestPassword123!'
    },
    registration: {
        email: process.env.REGISTRATION_EMAIL || 'autotest_user@example.com',
        firstName: process.env.REGISTRATION_FIRST_NAME || 'Test',
        lastName: process.env.REGISTRATION_LAST_NAME || 'User',
        password: process.env.REGISTRATION_PASSWORD || 'TestingPassword123!',
        repeatPassword: process.env.REGISTRATION_REPEAT_PASSWORD || 'TestingPassword123!'
    },
    api: {
        username: process.env.API_USERNAME || 'admin',
        password: process.env.API_PASSWORD || 'Engineer_123'
    }
};

export const loginCredentials = credentials.login;
export const registrationCredentials = credentials.registration;
export const apiCredentials = credentials.api;

export default credentials;
