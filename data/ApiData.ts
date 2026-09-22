export interface ApiConfig {
    baseUrl: string;
    postsEndpoint: string;
    auth: {
        username: string;
        password: string;
    };
}

export const apiConfig: ApiConfig = {
    baseUrl: 'https://dev.emeli.in.ua/wp-json/wp/v2',
    postsEndpoint: 'https://dev.emeli.in.ua/wp-json/wp/v2/posts',
    auth: {
        username: 'admin',
        password: 'Engineer_123'
    }
};

export const defaultPostData = {
    title: 'Test Post from Playwright',
    content: 'This is test content created via API automation',
    status: 'publish',
    excerpt: 'Test excerpt'
};

export const updatePostData = {
    title: 'Updated Test Post',
    content: 'This content has been updated via API',
    excerpt: 'Updated excerpt'
};

export const patchPostData = {
    title: 'Patched Title Only'
};

export const specialCharsPostData = {
    title: 'Test with  & symbols <>"',
    content: 'Testing special characters',
    status: 'draft'
};

export const performancePostData = {
    title: 'Performance Test Post',
    content: 'Testing POST request speed',
    status: 'draft'
};
