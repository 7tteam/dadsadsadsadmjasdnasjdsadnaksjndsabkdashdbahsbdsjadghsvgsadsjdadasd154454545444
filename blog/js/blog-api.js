/**
 * Blog API Client
 * 
 * This file handles communication with the blog API
 */

// API configuration
const API_CONFIG = {
    baseUrl: '/blog-api/',
    apiKey: 'nutro-cloud-api-key-123456',
    siteId: 1
};

/**
 * Fetch data from the API
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves to the API response
 */
async function fetchFromApi(endpoint, params = {}) {
    // Build URL with query parameters
    const url = new URL(API_CONFIG.baseUrl + endpoint, window.location.origin);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_CONFIG.apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Post data to the API
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @param {string} method - HTTP method (POST, PUT, DELETE)
 * @returns {Promise} - Promise that resolves to the API response
 */
async function postToApi(endpoint, data, method = 'POST') {
    try {
        const response = await fetch(API_CONFIG.baseUrl + endpoint, {
            method: method,
            headers: {
                'X-API-KEY': API_CONFIG.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Get blog posts
 * 
 * @param {Object} options - Query options
 * @returns {Promise} - Promise that resolves to the posts data
 */
async function getPosts(options = {}) {
    const params = {
        page: options.page || 1,
        per_page: options.perPage || 10,
        category: options.category,
        tag: options.tag,
        author: options.author,
        search: options.search,
        sort: options.sort || 'published_at',
        order: options.order || 'desc'
    };
    
    return fetchFromApi('posts', params);
}

/**
 * Get a single post by ID or slug
 * 
 * @param {number|string} idOrSlug - Post ID or slug
 * @returns {Promise} - Promise that resolves to the post data
 */
async function getPost(idOrSlug) {
    const params = {};
    
    // Check if idOrSlug is a number or string
    if (!isNaN(idOrSlug)) {
        params.id = idOrSlug;
    } else {
        params.slug = idOrSlug;
    }
    
    return fetchFromApi('posts', params);
}

/**
 * Get categories
 * 
 * @returns {Promise} - Promise that resolves to the categories data
 */
async function getCategories() {
    return fetchFromApi('categories');
}

/**
 * Get a single category by ID or slug
 * 
 * @param {number|string} idOrSlug - Category ID or slug
 * @returns {Promise} - Promise that resolves to the category data
 */
async function getCategory(idOrSlug) {
    const params = {};
    
    // Check if idOrSlug is a number or string
    if (!isNaN(idOrSlug)) {
        params.id = idOrSlug;
    } else {
        params.slug = idOrSlug;
    }
    
    return fetchFromApi('categories', params);
}

/**
 * Get tags
 * 
 * @returns {Promise} - Promise that resolves to the tags data
 */
async function getTags() {
    return fetchFromApi('tags');
}

/**
 * Get a single tag by ID or slug
 * 
 * @param {number|string} idOrSlug - Tag ID or slug
 * @returns {Promise} - Promise that resolves to the tag data
 */
async function getTag(idOrSlug) {
    const params = {};
    
    // Check if idOrSlug is a number or string
    if (!isNaN(idOrSlug)) {
        params.id = idOrSlug;
    } else {
        params.slug = idOrSlug;
    }
    
    return fetchFromApi('tags', params);
}

/**
 * Get authors
 * 
 * @returns {Promise} - Promise that resolves to the authors data
 */
async function getAuthors() {
    return fetchFromApi('authors');
}

/**
 * Get a single author by ID or slug
 * 
 * @param {number|string} idOrSlug - Author ID or slug
 * @returns {Promise} - Promise that resolves to the author data
 */
async function getAuthor(idOrSlug) {
    const params = {};
    
    // Check if idOrSlug is a number or string
    if (!isNaN(idOrSlug)) {
        params.id = idOrSlug;
    } else {
        params.slug = idOrSlug;
    }
    
    return fetchFromApi('authors', params);
}

/**
 * Submit a comment
 * 
 * @param {number} postId - Post ID
 * @param {Object} commentData - Comment data
 * @returns {Promise} - Promise that resolves to the comment submission result
 */
async function submitComment(postId, commentData) {
    const data = {
        post_id: postId,
        author_name: commentData.name,
        author_email: commentData.email,
        author_website: commentData.website,
        content: commentData.content,
        parent_id: commentData.parentId || null
    };
    
    return postToApi('comments', data);
}

/**
 * Search posts
 * 
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise} - Promise that resolves to the search results
 */
async function searchPosts(query, options = {}) {
    const params = {
        search: query,
        page: options.page || 1,
        per_page: options.perPage || 10,
        category: options.category,
        tag: options.tag
    };
    
    return fetchFromApi('posts', params);
}

/**
 * Get blog stats
 * 
 * @returns {Promise} - Promise that resolves to the blog stats
 */
async function getBlogStats() {
    return fetchFromApi('stats');
}

// Export API functions
window.BlogAPI = {
    getPosts,
    getPost,
    getCategories,
    getCategory,
    getTags,
    getTag,
    getAuthors,
    getAuthor,
    submitComment,
    searchPosts,
    getBlogStats
};