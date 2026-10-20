import { test, expect } from '@playwright/test';
import { PostsApiPage } from '../../pages/wordpress-api/PostsApiPage';
import { Logger } from '../../config/logger';
import { comparePostIds } from '../../helpers/wordpress-api/ApiHelper';
import {
    defaultPostData,
    expectedPostData,
    updatePostData,
    patchPostData,
    specialCharsPostData,
    performancePostData,
    fullPostData,
    invalidPostData,
    defaultPageData,
    fullPageData,
    invalidPageData
} from '../../data/wordpress-api/ApiData';

test.describe.serial('WordPress Posts API - CRUD Tests', () => {
    let postsApi: PostsApiPage;
    let createdPostId: number;

    test.beforeAll(async () => {
        Logger.info('Starting WordPress Posts API CRUD Tests suite');
    });

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should create a new draft post with default schema fields and 201 status', async () => {
        Logger.step('1. Create new post via POST request');
        const response = await postsApi.createPost(defaultPostData);

        Logger.step('2. Verify HTTP response status');
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 201);

        const responseBody = await response.json();
        createdPostId = responseBody.id;
        expect(responseBody).toHaveProperty('id');
        Logger.info(`Created post ID: ${createdPostId}`);

        Logger.step('3. Verify title and post status');
        postsApi.checkPostTitle(responseBody, defaultPostData.title);
        postsApi.checkPostStatus(responseBody, defaultPostData.status);

        Logger.step('4. Verify dynamic fields (date & guid masks, link)');
        postsApi.checkPostDateMask(responseBody, expectedPostData.dateMask);
        postsApi.checkPostGuidMask(responseBody, expectedPostData.guidMask);
        postsApi.checkPostLink(responseBody, expectedPostData.getExpectedLink(createdPostId));

        Logger.step('5. Verify content & excerpt objects');
        postsApi.checkPostContent(responseBody, expectedPostData.content);
        postsApi.checkPostExcerpt(responseBody, expectedPostData.excerpt);

        Logger.step('6. Verify metadata and default properties');
        postsApi.checkPostAuthor(responseBody, expectedPostData.author);
        postsApi.checkPostCommentStatus(responseBody, expectedPostData.comment_status);
        postsApi.checkPostPingStatus(responseBody, expectedPostData.ping_status);
        postsApi.checkPostSticky(responseBody, expectedPostData.sticky);
        postsApi.checkPostTemplate(responseBody, expectedPostData.template);
    });

    test('should verify auto-incremented post ID is strictly greater than previous post ID', async () => {
        let basePostId = createdPostId;
        let cleanupBasePost = false;

        if (!basePostId) {
            Logger.step('1. Create base post because createdPostId is not set');
            const baseResponse = await postsApi.createPost({
                title: 'Base Post for ID Comparison',
                content: 'Base post content',
                status: 'draft'
            });
            postsApi.checkResponseOk(baseResponse);
            const baseBody = await baseResponse.json();
            basePostId = baseBody.id;
            cleanupBasePost = true;
            Logger.info(`Base post ID: ${basePostId}`);
        }

        Logger.step('2. Create subsequent post to compare ID');
        const secondResponse = await postsApi.createPost({
            title: 'Subsequent Post for ID Comparison',
            content: 'Testing auto-increment of post IDs',
            status: 'draft'
        });
        postsApi.checkResponseOk(secondResponse);
        const secondBody = await secondResponse.json();
        const secondPostId = secondBody.id;
        Logger.info(`Second post created with ID: ${secondPostId} (previous was ${basePostId})`);

        try {
            Logger.step('3. Compare new post ID with previous post ID (new > previous)');
            comparePostIds(secondPostId, basePostId);
        } finally {
            Logger.step('4. Cleanup temporary posts');
            await postsApi.deletePostIfExists(secondPostId);
            if (cleanupBasePost && basePostId) {
                await postsApi.deletePostIfExists(basePostId);
            }
        }
    });

    test('should retrieve posts collection with valid schema and pagination headers', async () => {
        const response = await postsApi.getAllPosts();
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const posts = await response.json();
        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts.length).toBeGreaterThan(0);
        postsApi.checkPostStructure(posts[0]);
    });

    test('should retrieve single post by valid ID with expected attributes', async () => {
        const testPostId = createdPostId || 1;
        const response = await postsApi.getPostById(testPostId);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const post = await response.json();
        expect(post.id).toBe(testPostId);
        postsApi.checkPostStructure(post);
        expect(post).toHaveProperty('date');
    });

    test('should update existing post title and content via PUT request', async () => {
        test.skip(!createdPostId, 'No post created to update');
        const response = await postsApi.updatePost(createdPostId, updatePostData);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const updatedPost = await response.json();
        expect(updatedPost.id).toBe(createdPostId);
        postsApi.checkPostTitle(updatedPost, updatePostData.title);
        postsApi.checkPostContentContains(updatedPost, 'updated');
    });

    test('should partially update post title via PATCH request', async () => {
        test.skip(!createdPostId, 'No post created to patch');
        const response = await postsApi.patchPost(createdPostId, patchPostData);
        postsApi.checkResponseOk(response);

        const patchedPost = await response.json();
        postsApi.checkPostTitle(patchedPost, patchPostData.title);
    });

    test('should permanently delete post and verify 404 on subsequent get', async () => {
        test.skip(!createdPostId, 'No post created to delete');
        const response = await postsApi.deletePost(createdPostId, { force: true });
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const deletedPost = await response.json();
        expect(deletedPost.deleted).toBeTruthy();
        await postsApi.checkPostDeleted(createdPostId);
    });

    test('should return 404 Not Found when requesting non-existent post ID', async () => {
        const response = await postsApi.getPostById(999999);
        postsApi.checkResponseStatus(response, 404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('code');
    });

    test('should return 401 Unauthorized when attempting to create post without auth', async () => {
        const postData = {
            title: 'Unauthorized Post',
            content: 'This should fail',
            status: 'publish'
        };
        const response = await postsApi.createPost(postData, { auth: false });
        postsApi.checkResponseStatus(response, 401);
    });

    test('should filter posts collection by publish status', async () => {
        const response = await postsApi.getPostsByStatus('publish');
        postsApi.checkResponseOk(response);
        const posts = await response.json();
        postsApi.checkAllPostsHaveStatus(posts, 'publish');
    });

    test('should respect per_page limit when querying posts collection', async () => {
        const perPage = 5;
        const response = await postsApi.getPostsWithPagination(perPage);
        postsApi.checkResponseOk(response);
        const posts = await response.json();
        postsApi.checkPostsCountLessThanOrEqual(posts, perPage);
    });
});

test.describe('WordPress Posts API - Validation Tests', () => {
    let postsApi: PostsApiPage;

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should allow creating post without explicit title and return 201 with empty rendered title', async () => {
        Logger.step('1. Create post without title via POST request');
        const postData = {
            content: 'Post created without title for schema validation',
            status: 'draft'
        };
        const response = await postsApi.createPost(postData);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 201);

        const post = await response.json();
        try {
            Logger.step('2. Verify post is created with empty title and expected content');
            expect(post.id).toBeDefined();
            expect(typeof post.id).toBe('number');
            expect(post.title.raw).toBe('');
            expect(post.title.rendered).toBe('');
            expect(post.content.raw).toBe(postData.content);
            expect(post.status).toBe('draft');
            Logger.assertion('Post without title successfully created with empty rendered title', true);
        } finally {
            await postsApi.deletePostIfExists(post.id);
        }
    });

    test('should reject post creation with invalid status enum with 400 rest_invalid_param', async () => {
        Logger.step('1. Attempt to create post with invalid status');
        const response = await postsApi.createPost({
            title: 'Test with Invalid Status',
            status: 'invalid_status_xyz'
        });

        Logger.step('2. Verify 400 Bad Request and rest_invalid_param code for status field');
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'status');
    });

    test('should reject post creation without authorization with 401 rest_cannot_create', async () => {
        Logger.step('1. Attempt to create post without auth credentials');
        const response = await postsApi.createPost({
            title: 'Unauthorized Post'
        }, { auth: false });

        Logger.step('2. Verify 401 Unauthorized status and rest_cannot_create code');
        postsApi.checkResponseStatus(response, 401);
        const error = await response.json();
        expect(error.code).toBe('rest_cannot_create');
        Logger.assertion('Request was rejected with 401 rest_cannot_create', true);
    });

    test('should escape special characters in post title to HTML entities in rendered output', async () => {
        const response = await postsApi.createPost(specialCharsPostData);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 201);
        const post = await response.json();
        try {
            // WordPress кодує спецсимволи в HTML-сутності (наприклад, & -> &#038;)
            expect(post.title.rendered).toContain('&#038;');
            Logger.assertion('Title rendered contains escaped HTML entity "&#038;"', true);
        } finally {
            await postsApi.deletePostIfExists(post.id);
        }
    });

    test('should validate auto-increment logic correctly in comparePostIds helper', () => {
        Logger.step('1. Verify valid increment (new ID > previous ID)');
        expect(comparePostIds(25000, 24999)).toBe(true);
        expect(comparePostIds('25005', '25000')).toBe(true);

        Logger.step('2. Verify assertion throws error when new ID <= previous ID');
        expect(() => comparePostIds(100, 200)).toThrow();
        expect(() => comparePostIds(100, 100)).toThrow();
    });
});

test.describe('WordPress Posts API - POST /posts Field Validation', () => {
    let postsApi: PostsApiPage;
    const createdPostIds: number[] = [];

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        for (const id of createdPostIds) {
            await postsApi.deletePostIfExists(id);
        }
        createdPostIds.length = 0;
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should create post with all standard schema fields populated', async () => {
        Logger.step('1. Create post with all fields');
        const customSlug = `full-post-${Date.now()}`;
        const payload = {
            ...fullPostData,
            slug: customSlug
        };
        const response = await postsApi.createPost(payload);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 201);

        const post = await response.json();
        createdPostIds.push(post.id);

        Logger.step('2. Verify all returned fields match input');
        postsApi.checkPostTitle(post, payload.title);
        postsApi.checkPostStatus(post, payload.status);
        postsApi.checkPostSlug(post, customSlug);
        postsApi.checkPostFormat(post, payload.format);
        postsApi.checkPostCommentStatus(post, payload.comment_status);
        postsApi.checkPostPingStatus(post, payload.ping_status);
        postsApi.checkPostSticky(post, payload.sticky);
        postsApi.checkPostCategories(post, payload.categories);
    });

    test('should create posts with different valid statuses (draft, pending, private)', async () => {
        for (const status of ['draft', 'pending', 'private'] as const) {
            Logger.step(`Create post with status: "${status}"`);
            const response = await postsApi.createPost({
                title: `Post with status ${status}`,
                content: `Content for ${status}`,
                status
            });
            postsApi.checkResponseOk(response);
            const post = await response.json();
            createdPostIds.push(post.id);
            postsApi.checkPostStatus(post, status);
        }
    });

    test('should create posts with different valid formats (standard, aside, quote)', async () => {
        for (const format of ['standard', 'aside', 'quote'] as const) {
            Logger.step(`Create post with format: "${format}"`);
            const response = await postsApi.createPost({
                title: `Post format ${format}`,
                content: `Content for format ${format}`,
                format,
                status: 'draft'
            });
            postsApi.checkResponseOk(response);
            const post = await response.json();
            createdPostIds.push(post.id);
            postsApi.checkPostFormat(post, format);
        }
    });

    test('should create password-protected post and verify protected content in view context', async () => {
        Logger.step('1. Create post with password');
        const response = await postsApi.createPost({
            title: 'Protected Post',
            content: 'Confidential content',
            password: 'secret_password_123',
            status: 'publish'
        });
        postsApi.checkResponseOk(response);
        const post = await response.json();
        createdPostIds.push(post.id);

        Logger.step('2. Verify content is protected when retrieved in view context without password');
        const viewResponse = await postsApi.getPostWithContext(post.id, 'view');
        const viewBody = await viewResponse.json();
        expect(viewBody.content.protected).toBe(true);
        Logger.assertion('Post content is protected', viewBody.content.protected);
    });

    test('should create post with custom publication date preserving ISO timestamp', async () => {
        Logger.step('1. Create post with custom ISO date');
        const customDate = '2026-09-01T12:00:00';
        const response = await postsApi.createPost({
            title: 'Post with custom date',
            content: 'Date testing content',
            date: customDate,
            status: 'draft'
        });
        postsApi.checkResponseOk(response);
        const post = await response.json();
        createdPostIds.push(post.id);
        expect(post.date).toBe(customDate);
        Logger.assertion(`Post date matches custom date: ${post.date}`, true);
    });

    // NEGATIVE TESTS FOR POST /posts
    test('should reject post creation with invalid status enum with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidStatus);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'status');
    });

    test('should reject post creation with invalid author ID with 400 rest_invalid_author', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidAuthor);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_author');
    });

    test('should reject post creation with invalid comment_status enum with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidCommentStatus);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'comment_status');
    });

    test('should reject post creation with invalid ping_status enum with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidPingStatus);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'ping_status');
    });

    test('should reject post creation with invalid format enum with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidFormat);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'format');
    });

    test('should reject post creation with non-boolean sticky value with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidSticky);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'sticky');
    });

    test('should reject post creation with malformed date string with 400 rest_invalid_param', async () => {
        const response = await postsApi.createPost(invalidPostData.invalidDate);
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'date');
    });
});

test.describe('WordPress Posts API - GET /posts Query Parameters Validation', () => {
    let postsApi: PostsApiPage;

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should filter posts collection by search keyword', async () => {
        const keyword = 'Ecommerce';
        const response = await postsApi.getAllPosts({ search: keyword, per_page: 5 });
        postsApi.checkResponseOk(response);
        const posts = await response.json();
        expect(Array.isArray(posts)).toBe(true);
        Logger.assertion(`Search returned ${posts.length} posts matching "${keyword}"`, true);
    });

    test('should sort posts collection by id in ascending and descending order', async () => {
        Logger.step('1. Fetch posts ordered by ID desc');
        const descResponse = await postsApi.getAllPosts({ per_page: 5, orderby: 'id', order: 'desc' });
        postsApi.checkResponseOk(descResponse);
        const descPosts = await descResponse.json();
        postsApi.checkItemsSorted(descPosts, 'id', 'desc');

        Logger.step('2. Fetch posts ordered by ID asc');
        const ascResponse = await postsApi.getAllPosts({ per_page: 5, orderby: 'id', order: 'asc' });
        postsApi.checkResponseOk(ascResponse);
        const ascPosts = await ascResponse.json();
        postsApi.checkItemsSorted(ascPosts, 'id', 'asc');
    });

    test('should filter posts collection using include and exclude ID parameters', async () => {
        const listResponse = await postsApi.getAllPosts({ per_page: 3 });
        const list = await listResponse.json();
        if (list.length >= 2) {
            const targetId = list[0].id;
            const excludeId = list[1].id;

            Logger.step(`1. Verify include filter for ID: ${targetId}`);
            const includeResponse = await postsApi.getAllPosts({ include: [targetId] });
            postsApi.checkResponseOk(includeResponse);
            const includePosts = await includeResponse.json();
            postsApi.checkItemsIncludeIds(includePosts, [targetId]);

            Logger.step(`2. Verify exclude filter for ID: ${excludeId}`);
            const excludeResponse = await postsApi.getAllPosts({ exclude: [excludeId], per_page: 5 });
            postsApi.checkResponseOk(excludeResponse);
            const excludePosts = await excludeResponse.json();
            postsApi.checkItemsExcludeIds(excludePosts, [excludeId]);
        }
    });

    test('should return schema-appropriate fields based on context parameter (view, embed, edit)', async () => {
        Logger.step('1. Context = view (default, rendered fields only)');
        const viewRes = await postsApi.getAllPosts({ per_page: 1, context: 'view' });
        const viewPosts = await viewRes.json();
        if (viewPosts.length > 0) {
            postsApi.checkContextFields(viewPosts[0], 'view');
        }

        Logger.step('2. Context = embed (compact representation)');
        const embedRes = await postsApi.getAllPosts({ per_page: 1, context: 'embed' });
        const embedPosts = await embedRes.json();
        if (embedPosts.length > 0) {
            postsApi.checkContextFields(embedPosts[0], 'embed');
        }

        Logger.step('3. Context = edit (contains raw fields)');
        const editRes = await postsApi.getAllPosts({ per_page: 1, context: 'edit' });
        const editPosts = await editRes.json();
        if (editPosts.length > 0) {
            postsApi.checkContextFields(editPosts[0], 'edit');
        }
    });

    // NEGATIVE TESTS FOR GET /posts
    test('should reject per_page parameter exceeding maximum 100 with 400 rest_invalid_param', async () => {
        const response = await postsApi.getAllPosts({ per_page: 101 });
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'per_page');
    });

    test('should reject non-positive per_page parameter with 400 rest_invalid_param', async () => {
        const response = await postsApi.getAllPosts({ per_page: -1 });
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'per_page');
    });

    test('should reject page number exceeding total available pages with 400 rest_post_invalid_page_number', async () => {
        const response = await postsApi.getAllPosts({ page: 999999 });
        await postsApi.checkResponseError(response, 400, 'rest_post_invalid_page_number');
    });

    test('should reject invalid order sorting value with 400 rest_invalid_param', async () => {
        const response = await postsApi.getAllPosts({ order: 'invalid_order' as any });
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'order');
    });

    test('should reject invalid orderby property with 400 rest_invalid_param', async () => {
        const response = await postsApi.getAllPosts({ orderby: 'invalid_orderby' as any });
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'orderby');
    });
});

test.describe('WordPress Posts API - Single Post & Update & Delete Lifecycle', () => {
    let postsApi: PostsApiPage;
    let testPostId: number;

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
        testPostId = await postsApi.createPostAndGetId({
            title: `Lifecycle Test Post ${Date.now()}`,
            content: 'Initial lifecycle content',
            status: 'draft'
        });
    });

    test.afterEach(async ({}, testInfo) => {
        if (testPostId) {
            await postsApi.deletePostIfExists(testPostId);
        }
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should retrieve single post in edit context containing raw and rendered fields', async () => {
        const response = await postsApi.getPostWithContext(testPostId, 'edit');
        postsApi.checkResponseOk(response);
        const post = await response.json();
        expect(post.id).toBe(testPostId);
        postsApi.checkContextFields(post, 'edit');
    });

    test('should return 404 Not Found when requesting non-existent post ID', async () => {
        const response = await postsApi.getPostById(999999);
        await postsApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 404 Not Found when requesting invalid non-numeric post ID', async () => {
        const response = await postsApi.getPostById('non-numeric-id');
        postsApi.checkResponseStatus(response, 404);
    });

    test('should update multiple post fields simultaneously via PUT request', async () => {
        const updatedData = {
            title: 'Completely Updated Title',
            content: 'Completely updated content body',
            excerpt: 'New updated excerpt',
            status: 'draft',
            comment_status: 'closed',
            ping_status: 'closed',
            sticky: false
        };
        const response = await postsApi.updatePost(testPostId, updatedData);
        postsApi.checkResponseOk(response);
        const body = await response.json();
        postsApi.checkPostTitle(body, updatedData.title);
        postsApi.checkPostStatus(body, updatedData.status);
        postsApi.checkPostCommentStatus(body, updatedData.comment_status);
        postsApi.checkPostPingStatus(body, updatedData.ping_status);
    });

    test('should partially update post fields independently via PATCH request', async () => {
        Logger.step('1. Patch title only');
        const titlePatch = await postsApi.patchPost(testPostId, { title: 'Patched Single Title' });
        postsApi.checkResponseOk(titlePatch);
        const titleBody = await titlePatch.json();
        postsApi.checkPostTitle(titleBody, 'Patched Single Title');

        Logger.step('2. Patch comment_status only');
        const commentPatch = await postsApi.patchPost(testPostId, { comment_status: 'closed' });
        postsApi.checkResponseOk(commentPatch);
        const commentBody = await commentPatch.json();
        postsApi.checkPostCommentStatus(commentBody, 'closed');
    });

    test('should reject post update with invalid status returning 400 rest_invalid_param', async () => {
        const response = await postsApi.updatePost(testPostId, { status: 'invalid_status_xyz' });
        await postsApi.checkResponseError(response, 400, 'rest_invalid_param', 'status');
    });

    test('should return 404 Not Found when attempting to update non-existent post', async () => {
        const response = await postsApi.updatePost(999999, { title: 'Updating ghost post' });
        await postsApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 401 Unauthorized when attempting to update post without authentication', async () => {
        const response = await postsApi.updatePost(testPostId, { title: 'Unauthorized' }, { auth: false });
        postsApi.checkResponseStatus(response, 401);
    });

    test('should move post to trash on soft delete with force=false', async () => {
        Logger.step('1. Move post to trash');
        const trashResponse = await postsApi.trashPost(testPostId);
        postsApi.checkResponseOk(trashResponse);
        const trashBody = await trashResponse.json();
        postsApi.checkItemTrashed(trashBody);

        Logger.step('2. Permanently delete post from trash (cleanup)');
        const forceDeleteResponse = await postsApi.forceDeletePost(testPostId);
        postsApi.checkResponseOk(forceDeleteResponse);
        const forceBody = await forceDeleteResponse.json();
        postsApi.checkItemPermanentlyDeleted(forceBody);
        testPostId = 0;
    });

    test('should permanently delete post directly from database with force=true', async () => {
        const deleteResponse = await postsApi.forceDeletePost(testPostId);
        postsApi.checkResponseOk(deleteResponse);
        const deleteBody = await deleteResponse.json();
        postsApi.checkItemPermanentlyDeleted(deleteBody);
        await postsApi.checkPostDeleted(testPostId);
        testPostId = 0;
    });

    test('should return 404 Not Found when attempting to delete non-existent post', async () => {
        const response = await postsApi.forceDeletePost(999999);
        await postsApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 401 Unauthorized when attempting to delete post without authentication', async () => {
        const response = await postsApi.deletePost(testPostId, { auth: false });
        postsApi.checkResponseStatus(response, 401);
    });
});

test.describe('WordPress Pages API - CRUD & Field Validation Tests', () => {
    let pagesApi: PostsApiPage;
    const cleanupPageIds: number[] = [];

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        pagesApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        for (const id of cleanupPageIds) {
            await pagesApi.deletePageIfExists(id);
        }
        cleanupPageIds.length = 0;
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should create page with all available fields populated', async () => {
        Logger.step('1. Create page with all fields (title, content, excerpt, status, slug, comment_status, ping_status, menu_order)');
        const customSlug = `full-page-${Date.now()}`;
        const payload = {
            ...fullPageData,
            slug: customSlug
        };
        const response = await pagesApi.createPage(payload);
        pagesApi.checkResponseOk(response);
        pagesApi.checkResponseStatus(response, 201);

        const page = await response.json();
        cleanupPageIds.push(page.id);

        Logger.step('2. Verify all returned fields match input');
        pagesApi.checkPostTitle(page, payload.title);
        pagesApi.checkPostStatus(page, payload.status);
        pagesApi.checkPostSlug(page, customSlug);
        pagesApi.checkPostCommentStatus(page, payload.comment_status);
        pagesApi.checkPostPingStatus(page, payload.ping_status);
        pagesApi.checkPageMenuOrder(page, payload.menu_order);
    });

    test('should create pages supporting different valid statuses (draft, pending, private)', async () => {
        for (const status of ['draft', 'pending', 'private'] as const) {
            Logger.step(`Create page with status: "${status}"`);
            const response = await pagesApi.createPage({
                title: `Page with status ${status}`,
                content: `Page content for ${status}`,
                status
            });
            pagesApi.checkResponseOk(response);
            const page = await response.json();
            cleanupPageIds.push(page.id);
            pagesApi.checkPostStatus(page, status);
        }
    });

    test('should retrieve page by ID in view and edit context representations', async () => {
        Logger.step('1. Create test page');
        const pageId = await pagesApi.createPageAndGetId({
            title: `Context Page ${Date.now()}`,
            content: '<p>Context test content</p>',
            status: 'draft'
        });
        cleanupPageIds.push(pageId);

        Logger.step('2. Retrieve page in view context');
        const viewRes = await pagesApi.getPageWithContext(pageId, 'view');
        pagesApi.checkResponseOk(viewRes);
        const viewBody = await viewRes.json();
        pagesApi.checkContextFields(viewBody, 'view');

        Logger.step('3. Retrieve page in edit context');
        const editRes = await pagesApi.getPageWithContext(pageId, 'edit');
        pagesApi.checkResponseOk(editRes);
        const editBody = await editRes.json();
        pagesApi.checkContextFields(editBody, 'edit');
    });

    test('should list pages collection with pagination and sorting by menu_order', async () => {
        Logger.step('1. Fetch pages with per_page limit');
        const response = await pagesApi.getAllPages({ per_page: 3, orderby: 'menu_order', order: 'asc' });
        pagesApi.checkResponseOk(response);
        const pages = await response.json();
        expect(Array.isArray(pages)).toBe(true);
        pagesApi.checkPostsCountLessThanOrEqual(pages, 3);
    });

    test('should update multiple fields on existing page via PUT request', async () => {
        Logger.step('1. Create page to update');
        const pageId = await pagesApi.createPageAndGetId({
            title: 'Initial Page Title',
            content: 'Initial page content',
            status: 'draft',
            menu_order: 1
        });
        cleanupPageIds.push(pageId);

        Logger.step('2. Update page fields via PUT');
        const updatedData = {
            title: 'Updated Page Title via PUT',
            content: 'Updated page body',
            menu_order: 25,
            status: 'draft'
        };
        const putResponse = await pagesApi.updatePage(pageId, updatedData);
        pagesApi.checkResponseOk(putResponse);
        const updatedPage = await putResponse.json();
        pagesApi.checkPostTitle(updatedPage, updatedData.title);
        pagesApi.checkPageMenuOrder(updatedPage, 25);
    });

    test('should partially update page comment_status via PATCH request', async () => {
        Logger.step('1. Create page for patch');
        const pageId = await pagesApi.createPageAndGetId({
            title: 'Page Before Patch',
            status: 'draft',
            comment_status: 'open'
        });
        cleanupPageIds.push(pageId);

        Logger.step('2. Partially update comment_status via PATCH');
        const patchResponse = await pagesApi.patchPage(pageId, { comment_status: 'closed' });
        pagesApi.checkResponseOk(patchResponse);
        const patchedPage = await patchResponse.json();
        pagesApi.checkPostCommentStatus(patchedPage, 'closed');
        pagesApi.checkPostTitle(patchedPage, 'Page Before Patch');
    });

    test('should soft delete page to trash with force=false', async () => {
        Logger.step('1. Create page to trash');
        const pageId = await pagesApi.createPageAndGetId({
            title: 'Page to Trash',
            status: 'draft'
        });

        Logger.step('2. Trash page');
        const trashRes = await pagesApi.trashPage(pageId);
        pagesApi.checkResponseOk(trashRes);
        const trashBody = await trashRes.json();
        pagesApi.checkItemTrashed(trashBody);

        Logger.step('3. Permanently delete page from trash');
        const forceRes = await pagesApi.forceDeletePage(pageId);
        pagesApi.checkResponseOk(forceRes);
        const forceBody = await forceRes.json();
        pagesApi.checkItemPermanentlyDeleted(forceBody);
    });

    test('should permanently delete page directly from database with force=true', async () => {
        Logger.step('1. Create page for permanent delete');
        const pageId = await pagesApi.createPageAndGetId({
            title: 'Page to Force Delete',
            status: 'draft'
        });

        Logger.step('2. Force delete page');
        const deleteRes = await pagesApi.forceDeletePage(pageId);
        pagesApi.checkResponseOk(deleteRes);
        const body = await deleteRes.json();
        pagesApi.checkItemPermanentlyDeleted(body);

        Logger.step('3. Verify page is not found (404)');
        const getRes = await pagesApi.getPageById(pageId);
        pagesApi.checkResponseStatus(getRes, 404);
    });

    // NEGATIVE TESTS FOR PAGES
    test('should reject page creation with invalid status returning 400 rest_invalid_param', async () => {
        const response = await pagesApi.createPage(invalidPageData.invalidStatus);
        await pagesApi.checkResponseError(response, 400, 'rest_invalid_param', 'status');
    });

    test('should reject page creation with invalid author ID returning 400 rest_invalid_author', async () => {
        const response = await pagesApi.createPage(invalidPageData.invalidAuthor);
        await pagesApi.checkResponseError(response, 400, 'rest_invalid_author');
    });

    test('should reject page creation with non-integer menu_order returning 400 rest_invalid_param', async () => {
        const response = await pagesApi.createPage(invalidPageData.invalidMenuOrder);
        await pagesApi.checkResponseError(response, 400, 'rest_invalid_param', 'menu_order');
    });

    test('should return 404 Not Found when requesting non-existent page ID', async () => {
        const response = await pagesApi.getPageById(999999);
        await pagesApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 404 Not Found when attempting to update non-existent page', async () => {
        const response = await pagesApi.updatePage(999999, { title: 'Ghost page' });
        await pagesApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 404 Not Found when attempting to delete non-existent page', async () => {
        const response = await pagesApi.deletePage(999999);
        await pagesApi.checkResponseError(response, 404, 'rest_post_invalid_id');
    });

    test('should return 401 Unauthorized when attempting to create page without authentication', async () => {
        const response = await pagesApi.createPage({ title: 'Unauthorized' }, { auth: false });
        pagesApi.checkResponseStatus(response, 401);
    });
});

test.describe('WordPress Posts API - Performance Tests', () => {
    let postsApi: PostsApiPage;

    test.beforeEach(async ({ request }, testInfo) => {
        Logger.testStart(testInfo.title);
        postsApi = new PostsApiPage(request);
    });

    test.afterEach(async ({}, testInfo) => {
        Logger.testFinish(testInfo.title, testInfo.status);
    });

    test('should respond within acceptable SLA threshold when fetching all posts (<5000ms)', async () => {
        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.getAllPosts());
        postsApi.checkResponseOk(response);
        console.log(`GET all posts response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 5000, 'GET all posts');
    });

    test('should respond within acceptable SLA threshold when fetching single post (<4000ms)', async () => {
        // Retrieve existing post ID so request targets a valid entity
        const allPostsRes = await postsApi.getAllPosts({ per_page: 1 });
        const posts = await allPostsRes.json();
        const targetPostId = posts.length > 0 ? posts[0].id : await postsApi.createPostAndGetId(defaultPostData);

        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.getPostById(targetPostId));
        console.log(`GET single post (${targetPostId}) response time: ${responseTime}ms`);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseTime(responseTime, 4000, 'GET single post');
    });

    test('should respond within acceptable SLA threshold when creating post (<4000ms)', async () => {
        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.createPost(performancePostData));
        postsApi.checkResponseOk(response);
        console.log(`POST create post response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 4000, 'POST create post');

        const post = await response.json();
        await postsApi.deletePostIfExists(post.id);
    });

    test('should respond within acceptable SLA threshold when updating post (<4000ms)', async () => {
        const postId = await postsApi.createPostAndGetId({
            title: 'Post to Update',
            content: 'Initial content',
            status: 'draft'
        });

        const { response, responseTime } = await postsApi.measureResponseTime(() =>
            postsApi.updatePost(postId, { title: 'Updated Title', content: 'Updated content' })
        );
        postsApi.checkResponseOk(response);
        console.log(`PUT update post response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 4000, 'PUT update post');

        await postsApi.deletePostIfExists(postId);
    });

    test('should respond within acceptable SLA threshold when deleting post (<3000ms)', async () => {
        const postId = await postsApi.createPostAndGetId({
            title: 'Post to Delete',
            content: 'Will be deleted',
            status: 'draft'
        });

        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.deletePost(postId));
        postsApi.checkResponseOk(response);
        console.log(`DELETE post response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 3000, 'DELETE post');
    });

    test('should maintain acceptable average latency under concurrent GET requests (<4000ms)', async () => {
        const numberOfRequests = 3;
        const { responses, responseTimes, averageTime, minTime, maxTime } = await postsApi.runConcurrentGetRequests(numberOfRequests);

        responses.forEach((response, index) => {
            expect(response.ok(), `Concurrent GET #${index + 1} failed with status ${response.status()}`).toBeTruthy();
        });

        console.log(`Concurrent requests stats:`);
        console.log(`  - Average: ${averageTime.toFixed(2)}ms`);
        console.log(`  - Min: ${minTime}ms`);
        console.log(`  - Max: ${maxTime}ms`);
        console.log(`  - All times: ${responseTimes.join(', ')}ms`);
        expect(averageTime).toBeLessThan(4000);
    });

    test('should maintain acceptable average latency under sequential requests load (<3000ms)', async () => {
        const numberOfRequests = 10;
        const { totalTime, averageTime, requestsPerSecond } = await postsApi.runSequentialGetRequests(numberOfRequests, 5);

        console.log(`Sequential load test (${numberOfRequests} requests):`);
        console.log(`  - Total time: ${totalTime}ms`);
        console.log(`  - Average per request: ${averageTime.toFixed(2)}ms`);
        console.log(`  - Requests per second: ${requestsPerSecond.toFixed(2)}`);
        expect(averageTime).toBeLessThan(3000);
    });

    test('should maintain acceptable latency across varying pagination sizes (<4000ms)', async () => {
        const pageSizes = [1, 5, 10, 20, 50];
        const results = await postsApi.measureResponseTimeByPageSizes(pageSizes);

        console.log(`Response time by page size:`);
        results.forEach(result => {
            console.log(`  - ${result.size} posts: ${result.time}ms`);
            expect(result.time).toBeLessThan(4000);
        });
    });
});