/**
 * Файл для зберігання облікових даних (Credentials)
 * для авторизації (Login), реєстрації (Registration) та API.
 * 
 * Безпека: конфіденційні дані не зберігаються у відкритому вигляді в репозиторії.
 * Значення завантажуються зі змінних оточення (process.env) або локального файлу .env.
 */

try {
    process.loadEnvFile?.();
} catch {
    // .env відсутній (наприклад, у GitHub Actions CI), змінні беруться з process.env
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
        email: process.env.LOGIN_EMAIL || '',
        password: process.env.LOGIN_PASSWORD || ''
    },
    registration: {
        email: process.env.REGISTRATION_EMAIL || '',
        firstName: process.env.REGISTRATION_FIRST_NAME || '',
        lastName: process.env.REGISTRATION_LAST_NAME || '',
        password: process.env.REGISTRATION_PASSWORD || '',
        repeatPassword: process.env.REGISTRATION_REPEAT_PASSWORD || ''
    },
    api: {
        username: process.env.API_USERNAME || '',
        password: process.env.API_PASSWORD || ''
    }
};

// Зручні іменовані експорти для швидкого імпорту
export const loginCredentials = credentials.login;
export const registrationCredentials = credentials.registration;
export const apiCredentials = credentials.api;

export default credentials;
