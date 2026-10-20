import { expect } from '@playwright/test';
import { Logger } from '../../config/logger';

/**
 * Функція для порівняння ID нового створеного поста з попереднім ID.
 * Перевіряє, що номер нового ID більший за попередній (newPostId > previousPostId).
 *
 * @param newPostId - ID щойно створеного поста (number або string)
 * @param previousPostId - ID попереднього поста (number або string)
 * @returns boolean - true, якщо новий ID більший за попередній
 */
export function comparePostIds(newPostId: number | string, previousPostId: number | string): boolean {
    const currentId = Number(newPostId);
    const prevId = Number(previousPostId);

    expect(Number.isFinite(currentId), `Новий ID поста має бути валідним числом: ${newPostId}`).toBeTruthy();
    expect(Number.isFinite(prevId), `Попередній ID поста має бути валідним числом: ${previousPostId}`).toBeTruthy();

    const isGreater = currentId > prevId;
    Logger.assertion(
        `Перевірка автоінкременту ID: новий ID (${currentId}) більший за попередній ID (${prevId})`,
        isGreater,
        `Різниця: +${currentId - prevId}`
    );

    try {
        expect(currentId).toBeGreaterThan(prevId);
    } catch (error) {
        Logger.error(`Помилка валідації ID: новий ID (${currentId}) не більший за попередній ID (${prevId})`, error);
        throw error;
    }

    return isGreater;
}
