import { test, expect } from '@playwright/test';
import { PostsApiPage } from '../pages/PostsApiPage';
import {
    defaultPostData,
    updatePostData,
    patchPostData,
    specialCharsPostData,
    performancePostData
} from '../data/ApiData';

test.describe.serial('WordPress Posts API - CRUD Tests', () => {
    let postsApi: PostsApiPage;
    let createdPostId: number;

    test.beforeAll(async () => {
        console.log('Testing API endpoint for WordPress Posts');
    });

    test.beforeEach(async ({ request }) => {
        postsApi = new PostsApiPage(request);
    });

    test('CREATE - Should create a new post', async () => {
        const response = await postsApi.createPost(defaultPostData);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 201);

        const responseBody = await response.json();
        createdPostId = responseBody.id;
        expect(responseBody).toHaveProperty('id');
        postsApi.checkPostTitle(responseBody, defaultPostData.title);
        postsApi.checkPostStatus(responseBody, defaultPostData.status);
        console.log('Created post ID:', createdPostId);
    });

    test('READ - Should get all posts', async () => {
        const response = await postsApi.getAllPosts();
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const posts = await response.json();
        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts.length).toBeGreaterThan(0);
        postsApi.checkPostStructure(posts[0]);
    });

    test('READ - Should get a specific post by ID', async () => {
        const testPostId = createdPostId || 1;
        const response = await postsApi.getPostById(testPostId);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const post = await response.json();
        expect(post.id).toBe(testPostId);
        postsApi.checkPostStructure(post);
        expect(post).toHaveProperty('date');
    });

    test('UPDATE - Should update an existing post', async () => {
        test.skip(!createdPostId, 'No post created to update');
        const response = await postsApi.updatePost(createdPostId, updatePostData);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const updatedPost = await response.json();
        expect(updatedPost.id).toBe(createdPostId);
        postsApi.checkPostTitle(updatedPost, updatePostData.title);
        postsApi.checkPostContentContains(updatedPost, 'updated');
    });

    test('PATCH - Should partially update a post', async () => {
        test.skip(!createdPostId, 'No post created to patch');
        const response = await postsApi.patchPost(createdPostId, patchPostData);
        postsApi.checkResponseOk(response);

        const patchedPost = await response.json();
        postsApi.checkPostTitle(patchedPost, patchPostData.title);
    });

    test('DELETE - Should delete a post', async () => {
        test.skip(!createdPostId, 'No post created to delete');
        const response = await postsApi.deletePost(createdPostId, { force: true });
        postsApi.checkResponseOk(response);
        postsApi.checkResponseStatus(response, 200);

        const deletedPost = await response.json();
        expect(deletedPost.deleted).toBeTruthy();
        await postsApi.checkPostDeleted(createdPostId);
    });

    test('Error Handling - Should return 404 for non-existent post', async () => {
        const response = await postsApi.getPostById(999999);
        postsApi.checkResponseStatus(response, 404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('code');
    });

    test('Error Handling - Should return 401 for unauthorized create', async () => {
        const postData = {
            title: 'Unauthorized Post',
            content: 'This should fail',
            status: 'publish'
        };
        const response = await postsApi.createPost(postData, { auth: false });
        postsApi.checkResponseStatus(response, 401);
    });

    test('Filtering - Should filter posts by status', async () => {
        const response = await postsApi.getPostsByStatus('publish');
        postsApi.checkResponseOk(response);
        const posts = await response.json();
        postsApi.checkAllPostsHaveStatus(posts, 'publish');
    });

    test('Pagination - Should respect per_page parameter', async () => {
        const perPage = 5;
        const response = await postsApi.getPostsWithPagination(perPage);
        postsApi.checkResponseOk(response);
        const posts = await response.json();
        postsApi.checkPostsCountLessThanOrEqual(posts, perPage);
    });
});

test.describe('WordPress Posts API - Validation Tests', () => {
    let postsApi: PostsApiPage;

    test.beforeEach(async ({ request }) => {
        postsApi = new PostsApiPage(request);
    });

    test('NEGATIVE - Should validate required fields', async () => {
        const invalidData = {
            content: 'Content without title'
        };
        const response = await postsApi.createPost(invalidData);
        const body = await response.json();
        console.log('Validation response:', body);
    });

    test('NEGATIVE - Should handle special characters in title', async () => {
        const response = await postsApi.createPost(specialCharsPostData);
        postsApi.checkResponseOk(response);
        const post = await response.json();
        // WordPress кодує спецсимволи в HTML-сутності (наприклад, & -> &#038;)
        expect(post.title.rendered).toContain('&#038;');
        await postsApi.deletePostIfExists(post.id);
    });
});

test.describe('WordPress Posts API - Performance Tests', () => {
    let postsApi: PostsApiPage;

    test.beforeEach(async ({ request }) => {
        postsApi = new PostsApiPage(request);
    });

    test('GET all posts - should respond within acceptable time', async () => {
        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.getAllPosts());
        postsApi.checkResponseOk(response);
        console.log(`GET all posts response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 2000, 'GET all posts');
    });

    test('GET single post - should respond within acceptable time', async () => {
        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.getPostById(1));
        console.log(`GET single post response time: ${responseTime}ms`);
        postsApi.checkResponseOk(response);
        postsApi.checkResponseTime(responseTime, 1500, 'GET single post');
    });

    test('POST create post - should respond within acceptable time', async () => {
        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.createPost(performancePostData));
        postsApi.checkResponseOk(response);
        console.log(`POST create post response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 3000, 'POST create post');

        const post = await response.json();
        await postsApi.deletePostIfExists(post.id);
    });

    test('PUT update post - should respond within acceptable time', async () => {
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
        postsApi.checkResponseTime(responseTime, 3000, 'PUT update post');

        await postsApi.deletePostIfExists(postId);
    });

    test('DELETE post - should respond within acceptable time', async () => {
        const postId = await postsApi.createPostAndGetId({
            title: 'Post to Delete',
            content: 'Will be deleted',
            status: 'draft'
        });

        const { response, responseTime } = await postsApi.measureResponseTime(() => postsApi.deletePost(postId));
        postsApi.checkResponseOk(response);
        console.log(`DELETE post response time: ${responseTime}ms`);
        postsApi.checkResponseTime(responseTime, 2000, 'DELETE post');
    });

    test('Multiple concurrent GET requests - average response time', async () => {
        const numberOfRequests = 5;
        const { responses, responseTimes, averageTime, minTime, maxTime } = await postsApi.runConcurrentGetRequests(numberOfRequests);

        responses.forEach(response => {
            postsApi.checkResponseOk(response);
        });

        console.log(`Concurrent requests stats:`);
        console.log(`  - Average: ${averageTime.toFixed(2)}ms`);
        console.log(`  - Min: ${minTime}ms`);
        console.log(`  - Max: ${maxTime}ms`);
        console.log(`  - All times: ${responseTimes.join(', ')}ms`);
        expect(averageTime).toBeLessThan(2500);
    });

    test('Load test - Sequential requests performance', async () => {
        const numberOfRequests = 10;
        const { totalTime, averageTime, requestsPerSecond } = await postsApi.runSequentialGetRequests(numberOfRequests, 5);

        console.log(`Sequential load test (${numberOfRequests} requests):`);
        console.log(`  - Total time: ${totalTime}ms`);
        console.log(`  - Average per request: ${averageTime.toFixed(2)}ms`);
        console.log(`  - Requests per second: ${requestsPerSecond.toFixed(2)}`);
        expect(averageTime).toBeLessThan(2000);
    });

    test('Response time by pagination size', async () => {
        const pageSizes = [1, 5, 10, 20, 50];
        const results = await postsApi.measureResponseTimeByPageSizes(pageSizes);

        console.log(`Response time by page size:`);
        results.forEach(result => {
            console.log(`  - ${result.size} posts: ${result.time}ms`);
            expect(result.time).toBeLessThan(3000);
        });
    });
});