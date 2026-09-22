import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Logger } from '../config/logger';
import { apiConfig, ApiConfig } from '../data/ApiData';

export interface PostData {
    title: string;
    content?: string;
    status?: 'publish' | 'future' | 'draft' | 'pending' | 'private' | string;
    excerpt?: string;
    [key: string]: any;
}

export interface PostUpdateData {
    title?: string;
    content?: string;
    status?: string;
    excerpt?: string;
    [key: string]: any;
}

export interface PostQueryParams {
    status?: string;
    per_page?: number;
    page?: number;
    search?: string;
    order?: 'asc' | 'desc';
    orderby?: string;
    [key: string]: any;
}

export interface ApiAuthCredentials {
    username: string;
    password: string;
}

export class PostsApiPage {
    readonly request: APIRequestContext;
    readonly baseUrl: string;
    readonly postsEndpoint: string;
    readonly auth: ApiAuthCredentials;

    constructor(request: APIRequestContext, customConfig?: Partial<ApiConfig>) {
        this.request = request;
        this.baseUrl = customConfig?.baseUrl || apiConfig.baseUrl;
        this.postsEndpoint = customConfig?.postsEndpoint || apiConfig.postsEndpoint;
        this.auth = customConfig?.auth || apiConfig.auth;
    }

    /**
     * Формує заголовки авторизації (Basic Auth) та Content-Type
     */
    getAuthHeaders(customAuth?: ApiAuthCredentials): Record<string, string> {
        const credentials = customAuth || this.auth;
        const encoded = globalThis.btoa(`${credentials.username}:${credentials.password}`);
        return {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/json'
        };
    }

    // ==========================================
    // CRUD API запити
    // ==========================================

    /**
     * Створення нового поста (POST /posts)
     */
    async createPost(
        data: PostData | Record<string, any>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Create post with title '${data.title || 'without title'}'`);
            const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
            const response = await this.request.post(this.postsEndpoint, {
                headers,
                data
            });
            Logger.info(`[API] Create post status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to create post`, error);
            throw error;
        }
    }

    /**
     * Отримання списку всіх постів (GET /posts)
     */
    async getAllPosts(params?: PostQueryParams | string): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Get all posts`);
            let response: APIResponse;

            if (typeof params === 'string') {
                const query = params.startsWith('?') ? params : `?${params}`;
                response = await this.request.get(`${this.postsEndpoint}${query}`);
            } else if (params) {
                response = await this.request.get(this.postsEndpoint, { params });
            } else {
                response = await this.request.get(this.postsEndpoint);
            }

            Logger.info(`[API] Get all posts status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to get all posts`, error);
            throw error;
        }
    }

    /**
     * Отримання конкретного поста по ID (GET /posts/:id)
     */
    async getPostById(id: number | string): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Get post by ID: ${id}`);
            const response = await this.request.get(`${this.postsEndpoint}/${id}`);
            Logger.info(`[API] Get post by ID ${id} status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to get post by ID ${id}`, error);
            throw error;
        }
    }

    /**
     * Оновлення поста цілком (PUT /posts/:id)
     */
    async updatePost(
        id: number | string,
        data: PostUpdateData,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Update post ID: ${id}`);
            const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
            const response = await this.request.put(`${this.postsEndpoint}/${id}`, {
                headers,
                data
            });
            Logger.info(`[API] Update post ${id} status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to update post ${id}`, error);
            throw error;
        }
    }

    /**
     * Часткове оновлення поста (PATCH /posts/:id)
     */
    async patchPost(
        id: number | string,
        data: Partial<PostData>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Patch post ID: ${id}`);
            const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
            const response = await this.request.patch(`${this.postsEndpoint}/${id}`, {
                headers,
                data
            });
            Logger.info(`[API] Patch post ${id} status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to patch post ${id}`, error);
            throw error;
        }
    }

    /**
     * Видалення поста (DELETE /posts/:id)
     */
    async deletePost(
        id: number | string,
        options?: { auth?: boolean; headers?: Record<string, string>; force?: boolean }
    ): Promise<APIResponse> {
        try {
            Logger.info(`[API] Action: Delete post ID: ${id}`);
            const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
            const url = options?.force ? `${this.postsEndpoint}/${id}?force=true` : `${this.postsEndpoint}/${id}`;
            const response = await this.request.delete(url, { headers });
            Logger.info(`[API] Delete post ${id} status: ${response.status()}`);
            return response;
        } catch (error) {
            Logger.error(`[API] Failed to delete post ${id}`, error);
            throw error;
        }
    }

    /**
     * Безпечне видалення поста, якщо він існує (для очищення після тестів)
     */
    async deletePostIfExists(id: number | string): Promise<void> {
        if (!id) return;
        try {
            await this.deletePost(id, { auth: true });
        } catch {
            // ігноруємо помилки, якщо пост уже видалено
        }
    }

    /**
     * Допоміжний метод: створення поста та повернення його ID
     */
    async createPostAndGetId(data: PostData): Promise<number> {
        const response = await this.createPost(data);
        this.checkResponseOk(response);
        const body = await response.json();
        return body.id;
    }

    /**
     * Фільтрація постів за статусом
     */
    async getPostsByStatus(status: string): Promise<APIResponse> {
        return await this.getAllPosts({ status });
    }

    /**
     * Отримання постів з пагінацією
     */
    async getPostsWithPagination(perPage: number, page?: number): Promise<APIResponse> {
        return await this.getAllPosts({ per_page: perPage, ...(page ? { page } : {}) });
    }

    // ==========================================
    // Методи перевірок (Check / Assertions)
    // ==========================================

    checkResponseOk(response: APIResponse) {
        try {
            Logger.info(`Check: Is response OK (status 2xx)`);
            expect(response.ok()).toBeTruthy();
            Logger.info(`Response is OK (status: ${response.status()})`);
        } catch (error) {
            Logger.error(`Response is not OK. Actual status: ${response.status()}`, error);
            throw error;
        }
    }

    checkResponseStatus(response: APIResponse, expectedStatus: number) {
        try {
            Logger.info(`Check: Does response have status ${expectedStatus}`);
            expect(response.status()).toBe(expectedStatus);
            Logger.info(`Response has expected status ${expectedStatus}`);
        } catch (error) {
            Logger.error(`Status mismatch. Expected: ${expectedStatus}, Actual: ${response.status()}`, error);
            throw error;
        }
    }

    checkPostStructure(post: any) {
        try {
            Logger.info(`Check: Verify post structure for ID ${post?.id}`);
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('content');
            Logger.info(`Post structure is valid`);
        } catch (error) {
            Logger.error(`Post structure validation failed`, error);
            throw error;
        }
    }

    checkPostTitle(post: any, expectedTitle: string) {
        try {
            Logger.info(`Check: Post title rendered matches '${expectedTitle}'`);
            const actualTitle = typeof post.title === 'object' ? post.title.rendered : post.title;
            expect(actualTitle).toBe(expectedTitle);
            Logger.info(`Post title matches expected`);
        } catch (error) {
            Logger.error(`Post title mismatch`, error);
            throw error;
        }
    }

    checkPostContentContains(post: any, expectedSubstring: string) {
        try {
            Logger.info(`Check: Post content contains '${expectedSubstring}'`);
            const actualContent = typeof post.content === 'object' ? post.content.rendered : post.content;
            expect(actualContent).toContain(expectedSubstring);
            Logger.info(`Post content contains expected substring`);
        } catch (error) {
            Logger.error(`Post content check failed`, error);
            throw error;
        }
    }

    checkPostStatus(post: any, expectedStatus: string) {
        try {
            Logger.info(`Check: Post status is '${expectedStatus}'`);
            expect(post.status).toBe(expectedStatus);
            Logger.info(`Post status is correct`);
        } catch (error) {
            Logger.error(`Post status mismatch`, error);
            throw error;
        }
    }

    async checkPostDeleted(id: number | string) {
        try {
            Logger.info(`Check: Is post ${id} deleted (GET returns 404)`);
            const getResponse = await this.getPostById(id);
            expect(getResponse.status()).toBe(404);
            Logger.info(`Post ${id} is confirmed deleted`);
        } catch (error) {
            Logger.error(`Failed to verify post ${id} deletion`, error);
            throw error;
        }
    }

    checkAllPostsHaveStatus(posts: any[], expectedStatus: string) {
        try {
            Logger.info(`Check: All ${posts.length} posts have status '${expectedStatus}'`);
            posts.forEach((post: any) => {
                expect(post.status).toBe(expectedStatus);
            });
            Logger.info(`All posts have status '${expectedStatus}'`);
        } catch (error) {
            Logger.error(`Filtering check failed`, error);
            throw error;
        }
    }

    checkPostsCountLessThanOrEqual(posts: any[], maxCount: number) {
        try {
            Logger.info(`Check: Posts count (${posts.length}) <= ${maxCount}`);
            expect(posts.length).toBeLessThanOrEqual(maxCount);
            Logger.info(`Posts count is within expected limit`);
        } catch (error) {
            Logger.error(`Posts count exceeded limit`, error);
            throw error;
        }
    }

    // ==========================================
    // Методи для тестування продуктивності
    // ==========================================

    /**
     * Замір часу виконання окремого API запиту
     */
    async measureResponseTime(requestFn: () => Promise<APIResponse>): Promise<{ response: APIResponse; responseTime: number }> {
        const startTime = Date.now();
        const response = await requestFn();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        return { response, responseTime };
    }

    /**
     * Перевірка часу відповіді із попередженням при перевищенні порогу
     */
    checkResponseTime(responseTime: number, maxExpectedMs: number, operationDescription: string = 'Operation') {
        try {
            Logger.info(`Check: ${operationDescription} response time (${responseTime}ms) < ${maxExpectedMs}ms`);
            if (responseTime > maxExpectedMs * 0.7) {
                console.warn(` Warning: ${operationDescription} response time ${responseTime}ms is close to limit ${maxExpectedMs}ms`);
            }
            expect(responseTime).toBeLessThan(maxExpectedMs);
            Logger.info(`${operationDescription} response time is acceptable`);
        } catch (error) {
            Logger.error(`${operationDescription} exceeded response time limit of ${maxExpectedMs}ms`, error);
            throw error;
        }
    }

    /**
     * Виконання паралельних запитів з обчисленням статистики
     */
    async runConcurrentGetRequests(count: number, params?: PostQueryParams): Promise<{
        responses: APIResponse[];
        responseTimes: number[];
        averageTime: number;
        minTime: number;
        maxTime: number;
    }> {
        Logger.info(`[API] Running ${count} concurrent GET requests`);
        const responseTimes: number[] = [];

        const requests = Array.from({ length: count }, async () => {
            const { response, responseTime } = await this.measureResponseTime(() => this.getAllPosts(params));
            responseTimes.push(responseTime);
            return response;
        });

        const responses = await Promise.all(requests);
        const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minTime = Math.min(...responseTimes);
        const maxTime = Math.max(...responseTimes);

        return { responses, responseTimes, averageTime, minTime, maxTime };
    }

    /**
     * Виконання послідовних запитів (навантажувальний тест)
     */
    async runSequentialGetRequests(count: number, perPage: number = 5): Promise<{
        responseTimes: number[];
        totalTime: number;
        averageTime: number;
        requestsPerSecond: number;
    }> {
        Logger.info(`[API] Running ${count} sequential GET requests`);
        const responseTimes: number[] = [];
        const startTotal = Date.now();

        for (let i = 0; i < count; i++) {
            const { response, responseTime } = await this.measureResponseTime(() => this.getPostsWithPagination(perPage));
            this.checkResponseOk(response);
            responseTimes.push(responseTime);
        }

        const totalTime = Date.now() - startTotal;
        const averageTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const requestsPerSecond = count / (totalTime / 1000);

        return { responseTimes, totalTime, averageTime, requestsPerSecond };
    }

    /**
     * Замір часу відповіді залежно від розміру пагінації
     */
    async measureResponseTimeByPageSizes(pageSizes: number[]): Promise<{ size: number; time: number }[]> {
        Logger.info(`[API] Measuring response times for page sizes: ${pageSizes.join(', ')}`);
        const results: { size: number; time: number }[] = [];

        for (const size of pageSizes) {
            const { response, responseTime } = await this.measureResponseTime(() => this.getPostsWithPagination(size));
            this.checkResponseOk(response);
            results.push({ size, time: responseTime });
        }

        return results;
    }
}

export { PostsApiPage as PostsPage };
