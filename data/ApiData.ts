import { apiCredentials } from './Credentials';

export interface ApiConfig {
    baseUrl: string;
    postsEndpoint: string;
    pagesEndpoint: string;
    auth: {
        username: string;
        password: string;
    };
}

export const apiConfig: ApiConfig = {
    baseUrl: 'https://dev.emeli.in.ua/wp-json/wp/v2',
    postsEndpoint: 'https://dev.emeli.in.ua/wp-json/wp/v2/posts',
    pagesEndpoint: 'https://dev.emeli.in.ua/wp-json/wp/v2/pages',
    auth: {
        username: apiCredentials.username,
        password: apiCredentials.password
    }
};

export const defaultPostData = {
    title: 'Test',
    content: 'New content',
    status: 'draft'
};

export interface ExpectedPostData {
    dateMask: RegExp;
    guidMask: RegExp;
    getExpectedLink: (id: number | string) => string;
    content: {
        raw: string;
        protected: boolean;
        block_version: number;
    };
    excerpt: {
        raw: string;
        rendered: string;
        protected: boolean;
    };
    author: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
}

export const expectedPostData: ExpectedPostData = {
    dateMask: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    guidMask: /^https?:\/\/.*[?&]p=\d+$/,
    getExpectedLink: (id: number | string) => `https://dev.emeli.in.ua/?p=${id}`,
    content: {
        raw: 'New content',
        protected: false,
        block_version: 0
    },
    excerpt: {
        raw: '',
        rendered: '<p>New content</p>\n',
        protected: false
    },
    author: 1,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: ''
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

// ==========================================
// Test Data for Posts
// ==========================================

export const fullPostData = {
    title: 'Full Fields Post Automated Test',
    content: '<p>Comprehensive HTML content for automated testing</p>',
    excerpt: 'Short excerpt summary',
    status: 'draft',
    slug: 'automated-test-post-full-fields',
    comment_status: 'closed',
    ping_status: 'closed',
    format: 'standard',
    sticky: false,
    categories: [1]
};

export const invalidPostData = {
    invalidStatus: { title: 'Test', status: 'invalid_status_xyz' },
    invalidAuthor: { title: 'Test', author: 999999 },
    invalidCommentStatus: { title: 'Test', comment_status: 'invalid_comment_status' },
    invalidPingStatus: { title: 'Test', ping_status: 'invalid_ping_status' },
    invalidFormat: { title: 'Test', format: 'invalid_format_xyz' },
    invalidSticky: { title: 'Test', sticky: 'not_a_boolean' },
    invalidDate: { title: 'Test', date: 'invalid-date-format' }
};

// ==========================================
// Test Data for Pages
// ==========================================

export const defaultPageData = {
    title: 'Default Test Page',
    content: '<p>Default page content</p>',
    status: 'draft'
};

export const fullPageData = {
    title: 'Full Fields Page Automated Test',
    content: '<p>Comprehensive page HTML content for automated testing</p>',
    excerpt: 'Short page excerpt',
    status: 'draft',
    slug: 'automated-test-page-full-fields',
    comment_status: 'closed',
    ping_status: 'closed',
    menu_order: 10
};

export const invalidPageData = {
    invalidStatus: { title: 'Test Page', status: 'invalid_page_status_xyz' },
    invalidAuthor: { title: 'Test Page', author: 999999 },
    invalidCommentStatus: { title: 'Test Page', comment_status: 'invalid_comment_status' },
    invalidPingStatus: { title: 'Test Page', ping_status: 'invalid_ping_status' },
    invalidMenuOrder: { title: 'Test Page', menu_order: 'not_an_integer' },
    invalidDate: { title: 'Test Page', date: 'invalid-date-format' }
};


