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
    readonly pagesEndpoint: string;
    readonly auth: ApiAuthCredentials;

    constructor(request: APIRequestContext, customConfig?: Partial<ApiConfig>) {
        this.request = request;
        this.baseUrl = customConfig?.baseUrl || apiConfig.baseUrl;
        this.postsEndpoint = customConfig?.postsEndpoint || apiConfig.postsEndpoint;
        this.pagesEndpoint = customConfig?.pagesEndpoint || apiConfig.pagesEndpoint;
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
    // CRUD API запити з логуванням
    // ==========================================

    /**
     * Загальний метод для виконання та детального логування HTTP запитів і відповідей
     */
    private async logAndExecuteRequest(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: string,
        requestFn: () => Promise<APIResponse>,
        options?: { headers?: Record<string, string>; data?: any; params?: any }
    ): Promise<APIResponse> {
        Logger.apiRequest(method, url, options);
        const startTime = Date.now();
        try {
            const response = await requestFn();
            const durationMs = Date.now() - startTime;
            let responseBody: any;
            try {
                const text = await response.text();
                responseBody = text ? JSON.parse(text) : undefined;
            } catch {
                try {
                    responseBody = await response.text();
                } catch {
                    responseBody = undefined;
                }
            }
            Logger.apiResponse(method, url, response.status(), response.statusText(), durationMs, responseBody);
            return response;
        } catch (error) {
            const durationMs = Date.now() - startTime;
            Logger.error(`[API] ${method} ${url} request failed after ${durationMs}ms`, error);
            throw error;
        }
    }

    /**
     * Створення нового поста (POST /posts)
     */
    async createPost(
        data: PostData | Record<string, any>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'POST',
            this.postsEndpoint,
            () => this.request.post(this.postsEndpoint, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Отримання списку всіх постів (GET /posts)
     */
    async getAllPosts(
        params?: PostQueryParams | string,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        let url = this.postsEndpoint;
        let queryParams: any = undefined;

        if (typeof params === 'string') {
            const query = params.startsWith('?') ? params : `?${params}`;
            url = `${this.postsEndpoint}${query}`;
        } else if (params) {
            queryParams = params;
        }

        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());

        return await this.logAndExecuteRequest(
            'GET',
            url,
            () => {
                if (queryParams) {
                    return this.request.get(this.postsEndpoint, { headers, params: queryParams });
                }
                return this.request.get(url, { headers });
            },
            { headers, params: queryParams }
        );
    }

    /**
     * Отримання конкретного поста по ID (GET /posts/:id)
     */
    async getPostById(
        id: number | string,
        options?: { auth?: boolean; headers?: Record<string, string>; params?: any }
    ): Promise<APIResponse> {
        const url = `${this.postsEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'GET',
            url,
            () => this.request.get(url, { headers, params: options?.params }),
            { headers, params: options?.params }
        );
    }

    /**
     * Оновлення поста цілком (PUT /posts/:id)
     */
    async updatePost(
        id: number | string,
        data: PostUpdateData,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const url = `${this.postsEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'PUT',
            url,
            () => this.request.put(url, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Часткове оновлення поста (PATCH /posts/:id)
     */
    async patchPost(
        id: number | string,
        data: Partial<PostData>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const url = `${this.postsEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'PATCH',
            url,
            () => this.request.patch(url, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Видалення поста (DELETE /posts/:id)
     */
    async deletePost(
        id: number | string,
        options?: { auth?: boolean; headers?: Record<string, string>; force?: boolean }
    ): Promise<APIResponse> {
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        const url = options?.force ? `${this.postsEndpoint}/${id}?force=true` : `${this.postsEndpoint}/${id}`;
        return await this.logAndExecuteRequest(
            'DELETE',
            url,
            () => this.request.delete(url, { headers }),
            { headers }
        );
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

    /**
     * Отримання постів з довільними фільтрами (query params)
     */
    async getPostsWithFilters(params: Record<string, any>): Promise<APIResponse> {
        return await this.getAllPosts(params);
    }

    /**
     * Отримання поста з певним контекстом (view | embed | edit) та опціональним паролем
     */
    async getPostWithContext(
        id: number | string,
        context: 'view' | 'embed' | 'edit',
        password?: string
    ): Promise<APIResponse> {
        return await this.getPostById(id, { params: { context, ...(password ? { password } : {}) } });
    }

    /**
     * Переміщення поста до корзини (Soft delete: force=false)
     */
    async trashPost(id: number | string, options?: { auth?: boolean }): Promise<APIResponse> {
        return await this.deletePost(id, { ...options, force: false });
    }

    /**
     * Остаточне видалення поста (Permanent delete: force=true)
     */
    async forceDeletePost(id: number | string, options?: { auth?: boolean }): Promise<APIResponse> {
        return await this.deletePost(id, { ...options, force: true });
    }

    // ==========================================
    // CRUD операції для Сторінок (Pages API: /wp/v2/pages)
    // ==========================================

    /**
     * Створення нової сторінки (POST /pages)
     */
    async createPage(
        data: Record<string, any>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'POST',
            this.pagesEndpoint,
            () => this.request.post(this.pagesEndpoint, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Отримання списку всіх сторінок (GET /pages)
     */
    async getAllPages(
        params?: Record<string, any> | string,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        let url = this.pagesEndpoint;
        let queryParams: any = undefined;

        if (typeof params === 'string') {
            const query = params.startsWith('?') ? params : `?${params}`;
            url = `${this.pagesEndpoint}${query}`;
        } else if (params) {
            queryParams = params;
        }

        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());

        return await this.logAndExecuteRequest(
            'GET',
            url,
            () => {
                if (queryParams) {
                    return this.request.get(this.pagesEndpoint, { headers, params: queryParams });
                }
                return this.request.get(url, { headers });
            },
            { headers, params: queryParams }
        );
    }

    /**
     * Отримання сторінки по ID (GET /pages/:id)
     */
    async getPageById(
        id: number | string,
        options?: { auth?: boolean; headers?: Record<string, string>; params?: any }
    ): Promise<APIResponse> {
        const url = `${this.pagesEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'GET',
            url,
            () => this.request.get(url, { headers, params: options?.params }),
            { headers, params: options?.params }
        );
    }

    /**
     * Отримання сторінки з контекстом (view | embed | edit)
     */
    async getPageWithContext(
        id: number | string,
        context: 'view' | 'embed' | 'edit',
        password?: string
    ): Promise<APIResponse> {
        return await this.getPageById(id, { params: { context, ...(password ? { password } : {}) } });
    }

    /**
     * Оновлення сторінки цілком (PUT /pages/:id)
     */
    async updatePage(
        id: number | string,
        data: Record<string, any>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const url = `${this.pagesEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'PUT',
            url,
            () => this.request.put(url, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Часткове оновлення сторінки (PATCH /pages/:id)
     */
    async patchPage(
        id: number | string,
        data: Record<string, any>,
        options?: { auth?: boolean; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const url = `${this.pagesEndpoint}/${id}`;
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        return await this.logAndExecuteRequest(
            'PATCH',
            url,
            () => this.request.patch(url, { headers, data }),
            { headers, data }
        );
    }

    /**
     * Видалення сторінки (DELETE /pages/:id)
     */
    async deletePage(
        id: number | string,
        options?: { auth?: boolean; headers?: Record<string, string>; force?: boolean }
    ): Promise<APIResponse> {
        const headers = options?.headers ?? (options?.auth === false ? undefined : this.getAuthHeaders());
        const url = options?.force ? `${this.pagesEndpoint}/${id}?force=true` : `${this.pagesEndpoint}/${id}`;
        return await this.logAndExecuteRequest(
            'DELETE',
            url,
            () => this.request.delete(url, { headers }),
            { headers }
        );
    }

    /**
     * Переміщення сторінки до корзини (Soft delete: force=false)
     */
    async trashPage(id: number | string, options?: { auth?: boolean }): Promise<APIResponse> {
        return await this.deletePage(id, { ...options, force: false });
    }

    /**
     * Остаточне видалення сторінки (Permanent delete: force=true)
     */
    async forceDeletePage(id: number | string, options?: { auth?: boolean }): Promise<APIResponse> {
        return await this.deletePage(id, { ...options, force: true });
    }

    /**
     * Безпечне видалення сторінки, якщо вона існує (очищення після тестів)
     */
    async deletePageIfExists(id: number | string): Promise<void> {
        if (!id) return;
        try {
            await this.deletePage(id, { auth: true, force: true });
        } catch {
            // ігноруємо помилки, якщо сторінка вже не існує
        }
    }

    /**
     * Допоміжний метод: створення сторінки та повернення її ID
     */
    async createPageAndGetId(data: Record<string, any>): Promise<number> {
        const response = await this.createPage(data);
        this.checkResponseOk(response);
        const body = await response.json();
        return body.id;
    }

    /**
     * Отримання сторінок з пагінацією
     */
    async getPagesWithPagination(perPage: number, page?: number): Promise<APIResponse> {
        return await this.getAllPages({ per_page: perPage, ...(page ? { page } : {}) });
    }

    // ==========================================
    // Методи перевірок (Check / Assertions)
    // ==========================================

    checkResponseOk(response: APIResponse) {
        try {
            expect(response.ok()).toBeTruthy();
            Logger.assertion('Response is OK (2xx)', true, `Status ${response.status()}`);
        } catch (error) {
            Logger.assertion('Response is OK (2xx)', false, `Status ${response.status()}`);
            Logger.error(`Response is not OK. Actual status: ${response.status()}`, error);
            throw error;
        }
    }

    checkResponseStatus(response: APIResponse, expectedStatus: number) {
        try {
            expect(response.status()).toBe(expectedStatus);
            Logger.assertion(`Response status is ${expectedStatus}`, true, `Actual: ${response.status()}`);
        } catch (error) {
            Logger.assertion(`Response status is ${expectedStatus}`, false, `Actual: ${response.status()}`);
            Logger.error(`Status mismatch. Expected: ${expectedStatus}, Actual: ${response.status()}`, error);
            throw error;
        }
    }

    checkPostStructure(post: any) {
        try {
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('content');
            Logger.assertion(`Post structure contains id, title, content`, true, `Post ID: ${post?.id}`);
        } catch (error) {
            Logger.assertion(`Post structure contains id, title, content`, false, `Post ID: ${post?.id}`);
            Logger.error(`Post structure validation failed`, error);
            throw error;
        }
    }

    checkPostTitle(post: any, expectedTitle: string) {
        try {
            const actualTitle = typeof post.title === 'object' ? post.title.rendered : post.title;
            expect(actualTitle).toBe(expectedTitle);
            Logger.assertion(`Post title matches expected`, true, `Title: "${actualTitle}"`);
        } catch (error) {
            const actualTitle = typeof post.title === 'object' ? post?.title?.rendered : post?.title;
            Logger.assertion(`Post title matches expected`, false, `Expected: "${expectedTitle}", Actual: "${actualTitle}"`);
            Logger.error(`Post title mismatch`, error);
            throw error;
        }
    }

    checkPostContentContains(post: any, expectedSubstring: string) {
        try {
            const actualContent = typeof post.content === 'object' ? post.content.rendered : post.content;
            expect(actualContent).toContain(expectedSubstring);
            Logger.assertion(`Post content contains "${expectedSubstring}"`, true);
        } catch (error) {
            Logger.assertion(`Post content contains "${expectedSubstring}"`, false);
            Logger.error(`Post content check failed`, error);
            throw error;
        }
    }

    checkPostStatus(post: any, expectedStatus: string) {
        try {
            expect(post.status).toBe(expectedStatus);
            Logger.assertion(`Post status is "${expectedStatus}"`, true, `Actual: "${post.status}"`);
        } catch (error) {
            Logger.assertion(`Post status is "${expectedStatus}"`, false, `Actual: "${post?.status}"`);
            Logger.error(`Post status mismatch`, error);
            throw error;
        }
    }

    checkPostDateMask(post: any, mask: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/) {
        try {
            expect(post.date).toMatch(mask);
            Logger.assertion(`Post date matches mask`, true, `Date: "${post.date}", Mask: ${mask}`);
        } catch (error) {
            Logger.assertion(`Post date matches mask`, false, `Date: "${post?.date}", Mask: ${mask}`);
            Logger.error(`Post date mask check failed`, error);
            throw error;
        }
    }

    checkPostGuidMask(post: any, mask: RegExp = /^https?:\/\/.*[?&]p=\d+$/) {
        const actualGuid = typeof post.guid === 'object' ? (post.guid.raw || post.guid.rendered) : post.guid;
        try {
            expect(actualGuid).toMatch(mask);
            if (typeof post.guid === 'object' && post.guid.raw !== undefined) {
                expect(post.guid.raw).toMatch(mask);
            }
            Logger.assertion(`Post GUID matches mask`, true, `GUID: "${actualGuid}", Mask: ${mask}`);
        } catch (error) {
            Logger.assertion(`Post GUID matches mask`, false, `GUID: "${actualGuid}", Mask: ${mask}`);
            Logger.error(`Post guid mask check failed`, error);
            throw error;
        }
    }

    checkPostLink(post: any, expectedLink?: string | RegExp) {
        try {
            if (expectedLink instanceof RegExp) {
                expect(post.link).toMatch(expectedLink);
            } else if (typeof expectedLink === 'string') {
                expect(post.link).toBe(expectedLink);
            } else {
                expect(post.link).toMatch(new RegExp(`^https?:\\/\\/.*[?&]p=${post.id}$`));
            }
            Logger.assertion(`Post link is valid`, true, `Link: "${post.link}"`);
        } catch (error) {
            Logger.assertion(`Post link is valid`, false, `Actual: "${post?.link}", Expected: "${expectedLink}"`);
            Logger.error(`Post link check failed`, error);
            throw error;
        }
    }

    checkPostContent(
        post: any,
        expectedContent: { raw?: string; protected?: boolean; block_version?: number; rendered?: string }
    ) {
        try {
            expect(post).toHaveProperty('content');
            if (expectedContent.raw !== undefined) {
                expect(post.content.raw).toBe(expectedContent.raw);
            }
            if (expectedContent.protected !== undefined) {
                expect(post.content.protected).toBe(expectedContent.protected);
            }
            if (expectedContent.block_version !== undefined) {
                expect(post.content.block_version).toBe(expectedContent.block_version);
            }
            if (expectedContent.rendered !== undefined) {
                expect(post.content.rendered).toBe(expectedContent.rendered);
            }
            Logger.assertion(`Post content verified`, true, `raw="${post.content?.raw}", protected=${post.content?.protected}, block_version=${post.content?.block_version}`);
        } catch (error) {
            Logger.assertion(`Post content verified`, false, JSON.stringify(expectedContent));
            Logger.error(`Post content check failed`, error);
            throw error;
        }
    }

    checkPostExcerpt(
        post: any,
        expectedExcerpt: { raw?: string; rendered?: string; protected?: boolean }
    ) {
        try {
            expect(post).toHaveProperty('excerpt');
            if (expectedExcerpt.raw !== undefined) {
                expect(post.excerpt.raw).toBe(expectedExcerpt.raw);
            }
            if (expectedExcerpt.rendered !== undefined) {
                expect(post.excerpt.rendered).toBe(expectedExcerpt.rendered);
            }
            if (expectedExcerpt.protected !== undefined) {
                expect(post.excerpt.protected).toBe(expectedExcerpt.protected);
            }
            Logger.assertion(`Post excerpt verified`, true, `raw="${post.excerpt?.raw}", protected=${post.excerpt?.protected}`);
        } catch (error) {
            Logger.assertion(`Post excerpt verified`, false, JSON.stringify(expectedExcerpt));
            Logger.error(`Post excerpt check failed`, error);
            throw error;
        }
    }

    checkPostAuthor(post: any, expectedAuthor: number = 1) {
        try {
            expect(post.author).toBe(expectedAuthor);
            Logger.assertion(`Post author matches`, true, `Expected: ${expectedAuthor}, Actual: ${post.author}`);
        } catch (error) {
            Logger.assertion(`Post author matches`, false, `Expected: ${expectedAuthor}, Actual: ${post?.author}`);
            Logger.error(`Post author mismatch`, error);
            throw error;
        }
    }

    checkPostCommentStatus(post: any, expectedStatus: string = 'open') {
        try {
            expect(post.comment_status).toBe(expectedStatus);
            Logger.assertion(`Post comment_status matches`, true, `"${post.comment_status}"`);
        } catch (error) {
            Logger.assertion(`Post comment_status matches`, false, `Expected: "${expectedStatus}", Actual: "${post?.comment_status}"`);
            Logger.error(`Post comment_status mismatch`, error);
            throw error;
        }
    }

    checkPostPingStatus(post: any, expectedStatus: string = 'open') {
        try {
            expect(post.ping_status).toBe(expectedStatus);
            Logger.assertion(`Post ping_status matches`, true, `"${post.ping_status}"`);
        } catch (error) {
            Logger.assertion(`Post ping_status matches`, false, `Expected: "${expectedStatus}", Actual: "${post?.ping_status}"`);
            Logger.error(`Post ping_status mismatch`, error);
            throw error;
        }
    }

    checkPostSticky(post: any, expectedSticky: boolean = false) {
        try {
            expect(post.sticky).toBe(expectedSticky);
            Logger.assertion(`Post sticky matches`, true, `Actual: ${post.sticky}`);
        } catch (error) {
            Logger.assertion(`Post sticky matches`, false, `Expected: ${expectedSticky}, Actual: ${post?.sticky}`);
            Logger.error(`Post sticky mismatch`, error);
            throw error;
        }
    }

    checkPostTemplate(post: any, expectedTemplate: string = '') {
        try {
            expect(post.template).toBe(expectedTemplate);
            Logger.assertion(`Post template matches`, true, `"${post.template}"`);
        } catch (error) {
            Logger.assertion(`Post template matches`, false, `Expected: "${expectedTemplate}", Actual: "${post?.template}"`);
            Logger.error(`Post template mismatch`, error);
            throw error;
        }
    }

    checkPostFields(
        post: any,
        expected: {
            dateMask?: RegExp;
            guidMask?: RegExp;
            link?: string | RegExp;
            content?: { raw?: string; protected?: boolean; block_version?: number; rendered?: string };
            excerpt?: { raw?: string; rendered?: string; protected?: boolean };
            author?: number;
            comment_status?: string;
            ping_status?: string;
            sticky?: boolean;
            template?: string;
        }
    ) {
        Logger.step('Verifying post fields batch');
        if (expected.dateMask) this.checkPostDateMask(post, expected.dateMask);
        if (expected.guidMask) this.checkPostGuidMask(post, expected.guidMask);
        if (expected.link !== undefined) this.checkPostLink(post, expected.link);
        if (expected.content) this.checkPostContent(post, expected.content);
        if (expected.excerpt) this.checkPostExcerpt(post, expected.excerpt);
        if (expected.author !== undefined) this.checkPostAuthor(post, expected.author);
        if (expected.comment_status !== undefined) this.checkPostCommentStatus(post, expected.comment_status);
        if (expected.ping_status !== undefined) this.checkPostPingStatus(post, expected.ping_status);
        if (expected.sticky !== undefined) this.checkPostSticky(post, expected.sticky);
        if (expected.template !== undefined) this.checkPostTemplate(post, expected.template);
    }

    async checkPostDeleted(id: number | string) {
        try {
            const getResponse = await this.getPostById(id);
            expect(getResponse.status()).toBe(404);
            Logger.assertion(`Post ${id} is confirmed deleted (GET returned 404)`, true);
        } catch (error) {
            Logger.assertion(`Post ${id} is confirmed deleted`, false);
            Logger.error(`Failed to verify post ${id} deletion`, error);
            throw error;
        }
    }

    checkAllPostsHaveStatus(posts: any[], expectedStatus: string) {
        try {
            posts.forEach((post: any) => {
                expect(post.status).toBe(expectedStatus);
            });
            Logger.assertion(`All ${posts.length} posts have status "${expectedStatus}"`, true);
        } catch (error) {
            Logger.assertion(`All posts have status "${expectedStatus}"`, false);
            Logger.error(`Filtering check failed`, error);
            throw error;
        }
    }

    checkPostsCountLessThanOrEqual(posts: any[], maxCount: number) {
        try {
            expect(posts.length).toBeLessThanOrEqual(maxCount);
            Logger.assertion(`Posts count (${posts.length}) is <= ${maxCount}`, true);
        } catch (error) {
            Logger.assertion(`Posts count (${posts.length}) is <= ${maxCount}`, false);
            Logger.error(`Posts count exceeded limit`, error);
            throw error;
        }
    }

    /**
     * Перевірка, що новий ID поста більший за попередній ID (автоінкремент)
     */
    checkPostIdGreaterThan(newPostId: number | string, previousPostId: number | string): boolean {
        const currentId = Number(newPostId);
        const prevId = Number(previousPostId);

        expect(Number.isFinite(currentId), `Новий ID має бути валідним числом: ${newPostId}`).toBeTruthy();
        expect(Number.isFinite(prevId), `Попередній ID має бути валідним числом: ${previousPostId}`).toBeTruthy();

        const isGreater = currentId > prevId;
        Logger.assertion(
            `Перевірка автоінкременту ID: новий ID (${currentId}) більший за попередній ID (${prevId})`,
            isGreater,
            `Різниця: +${currentId - prevId}`
        );

        try {
            expect(currentId).toBeGreaterThan(prevId);
            return true;
        } catch (error) {
            Logger.error(`Помилка перевірки ID: новий ID ${currentId} не більший за попередній ${prevId}`, error);
            throw error;
        }
    }

    /**
     * Перевірка коду та параметрів помилки у відповіді (4xx / 5xx)
     */
    async checkResponseError(
        response: APIResponse,
        expectedStatus: number,
        expectedErrorCode?: string,
        expectedParam?: string
    ): Promise<any> {
        this.checkResponseStatus(response, expectedStatus);
        const body = await response.json();
        try {
            expect(body).toHaveProperty('code');
            if (expectedErrorCode) {
                expect(body.code).toBe(expectedErrorCode);
            }
            if (expectedParam && body.data?.params) {
                expect(body.data.params).toHaveProperty(expectedParam);
            }
            Logger.assertion(
                `Response error matches expected (status: ${expectedStatus}, code: "${body.code}")`,
                true
            );
            return body;
        } catch (error) {
            Logger.assertion(`Response error matches expected`, false, `Actual code: "${body?.code}"`);
            Logger.error(`Error response validation failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка slug сутності (поста або сторінки)
     */
    checkPostSlug(post: any, expectedSlug: string) {
        try {
            expect(post.slug).toBe(expectedSlug);
            Logger.assertion(`Slug matches "${expectedSlug}"`, true, `Actual: "${post.slug}"`);
        } catch (error) {
            Logger.assertion(`Slug matches "${expectedSlug}"`, false, `Actual: "${post?.slug}"`);
            Logger.error(`Slug check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка format поста
     */
    checkPostFormat(post: any, expectedFormat: string) {
        try {
            expect(post.format).toBe(expectedFormat);
            Logger.assertion(`Post format is "${expectedFormat}"`, true, `Actual: "${post.format}"`);
        } catch (error) {
            Logger.assertion(`Post format is "${expectedFormat}"`, false, `Actual: "${post?.format}"`);
            Logger.error(`Post format check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка категорій поста
     */
    checkPostCategories(post: any, expectedCategories: number[]) {
        try {
            expect(Array.isArray(post.categories)).toBeTruthy();
            expectedCategories.forEach(catId => {
                expect(post.categories).toContain(catId);
            });
            Logger.assertion(`Post categories contain expected: [${expectedCategories.join(', ')}]`, true);
        } catch (error) {
            Logger.assertion(`Post categories check failed`, false);
            Logger.error(`Post categories check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка menu_order сторінки (Page specific field)
     */
    checkPageMenuOrder(page: any, expectedMenuOrder: number) {
        try {
            expect(page.menu_order).toBe(expectedMenuOrder);
            Logger.assertion(`Page menu_order is ${expectedMenuOrder}`, true, `Actual: ${page.menu_order}`);
        } catch (error) {
            Logger.assertion(`Page menu_order matches`, false, `Expected: ${expectedMenuOrder}, Actual: ${page?.menu_order}`);
            Logger.error(`Page menu_order check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка переміщення до корзини (status === 'trash')
     */
    checkItemTrashed(responseBody: any) {
        try {
            expect(responseBody.status).toBe('trash');
            Logger.assertion(`Item status is "trash"`, true);
        } catch (error) {
            Logger.assertion(`Item status is "trash"`, false, `Actual: "${responseBody?.status}"`);
            Logger.error(`Item trash check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка остаточного видалення (deleted === true)
     */
    checkItemPermanentlyDeleted(responseBody: any) {
        try {
            expect(responseBody.deleted).toBe(true);
            Logger.assertion(`Item is permanently deleted (deleted: true)`, true);
        } catch (error) {
            Logger.assertion(`Item is permanently deleted`, false, `Actual: ${responseBody?.deleted}`);
            Logger.error(`Item permanent deletion check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка полів залежно від context (view, embed, edit)
     */
    checkContextFields(item: any, context: 'view' | 'embed' | 'edit') {
        try {
            if (context === 'edit') {
                expect(item.title).toHaveProperty('raw');
                expect(item.content).toHaveProperty('raw');
                Logger.assertion(`Context "edit" contains raw fields for title and content`, true);
            } else if (context === 'view') {
                expect(item.title).toHaveProperty('rendered');
                expect(item.title.raw).toBeUndefined();
                Logger.assertion(`Context "view" contains rendered fields without raw`, true);
            } else if (context === 'embed') {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('title');
                Logger.assertion(`Context "embed" contains basic fields`, true);
            }
        } catch (error) {
            Logger.assertion(`Context "${context}" fields check failed`, false);
            Logger.error(`Context fields check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка сортування елементів
     */
    checkItemsSorted(items: any[], field: 'id' | 'date' | 'menu_order' = 'id', order: 'asc' | 'desc' = 'desc') {
        try {
            expect(Array.isArray(items)).toBeTruthy();
            if (items.length < 2) {
                Logger.info(`Items list has less than 2 items, skipping order check`);
                return;
            }
            for (let i = 0; i < items.length - 1; i++) {
                const currentVal = field === 'date' ? new Date(items[i].date).getTime() : Number(items[i][field]);
                const nextVal = field === 'date' ? new Date(items[i + 1].date).getTime() : Number(items[i + 1][field]);
                if (order === 'asc') {
                    expect(currentVal).toBeLessThanOrEqual(nextVal);
                } else {
                    expect(currentVal).toBeGreaterThanOrEqual(nextVal);
                }
            }
            Logger.assertion(`Items are correctly sorted by ${field} ${order}`, true, `${items.length} items checked`);
        } catch (error) {
            Logger.assertion(`Items sorting check by ${field} ${order} failed`, false);
            Logger.error(`Sorting check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка наявності списку ID у вибірці
     */
    checkItemsIncludeIds(items: any[], expectedIds: number[]) {
        try {
            const actualIds = items.map((p: any) => p.id);
            expectedIds.forEach(id => {
                expect(actualIds).toContain(id);
            });
            Logger.assertion(`Items include expected IDs: [${expectedIds.join(', ')}]`, true);
        } catch (error) {
            Logger.assertion(`Items include expected IDs check failed`, false);
            Logger.error(`Include IDs check failed`, error);
            throw error;
        }
    }

    /**
     * Перевірка відсутності виключених ID у вибірці
     */
    checkItemsExcludeIds(items: any[], excludedIds: number[]) {
        try {
            const actualIds = items.map((p: any) => p.id);
            excludedIds.forEach(id => {
                expect(actualIds).not.toContain(id);
            });
            Logger.assertion(`Items exclude specified IDs: [${excludedIds.join(', ')}]`, true);
        } catch (error) {
            Logger.assertion(`Items exclude IDs check failed`, false);
            Logger.error(`Exclude IDs check failed`, error);
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
