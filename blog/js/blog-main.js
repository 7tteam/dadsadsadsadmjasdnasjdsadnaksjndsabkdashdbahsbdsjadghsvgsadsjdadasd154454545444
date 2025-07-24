/**
 * Blog Main JavaScript
 * 
 * This file handles the blog frontend functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the blog
    initBlog();
});

/**
 * Initialize the blog
 */
function initBlog() {
    // Get current page
    const currentPage = getCurrentPage();
    
    // Initialize page-specific functionality
    switch (currentPage) {
        case 'home':
            initHomePage();
            break;
            
        case 'post':
            initPostPage();
            break;
            
        case 'category':
            initCategoryPage();
            break;
            
        case 'tag':
            initTagPage();
            break;
            
        case 'author':
            initAuthorPage();
            break;
            
        case 'search':
            initSearchPage();
            break;
    }
    
    // Initialize common functionality
    initSearch();
    initCommentForm();
    initSidebar();
}

/**
 * Get current page type
 * 
 * @returns {string} Page type
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path.endsWith('/post.html') || path.includes('/post/')) {
        return 'post';
    } else if (path.endsWith('/category.html') || path.includes('/category/')) {
        return 'category';
    } else if (path.endsWith('/tag.html') || path.includes('/tag/')) {
        return 'tag';
    } else if (path.endsWith('/author.html') || path.includes('/author/')) {
        return 'author';
    } else if (path.endsWith('/search.html') || search.includes('?q=')) {
        return 'search';
    } else {
        return 'home';
    }
}

/**
 * Initialize home page
 */
async function initHomePage() {
    try {
        // Get featured posts
        const featuredResponse = await BlogAPI.getPosts({
            perPage: 3,
            sort: 'views',
            order: 'desc'
        });
        
        if (featuredResponse.status === 'success') {
            renderFeaturedPosts(featuredResponse.data.posts);
        }
        
        // Get latest posts
        const latestResponse = await BlogAPI.getPosts({
            perPage: 6,
            sort: 'published_at',
            order: 'desc'
        });
        
        if (latestResponse.status === 'success') {
            renderLatestPosts(latestResponse.data.posts);
            renderPagination(latestResponse.data.pagination);
        }
        
        // Get categories for sidebar
        const categoriesResponse = await BlogAPI.getCategories();
        
        if (categoriesResponse.status === 'success') {
            renderCategories(categoriesResponse.data);
        }
    } catch (error) {
        console.error('Failed to initialize home page:', error);
        showErrorMessage('Failed to load blog content. Please try again later.');
    }
}

/**
 * Initialize post page
 */
async function initPostPage() {
    try {
        // Get post ID or slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            showErrorMessage('Post not found');
            return;
        }
        
        // Get post data
        const response = await BlogAPI.getPost(postId);
        
        if (response.status === 'success') {
            renderPost(response.data);
            
            // Update page title and meta tags
            document.title = `${response.data.title} - Nutro Cloud Blog`;
            updateMetaTags(response.data);
            
            // Update schema data
            updatePostSchema(response.data);
        } else {
            showErrorMessage('Post not found');
        }
    } catch (error) {
        console.error('Failed to initialize post page:', error);
        showErrorMessage('Failed to load post. Please try again later.');
    }
}

/**
 * Initialize category page
 */
async function initCategoryPage() {
    try {
        // Get category slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const categorySlug = urlParams.get('cat');
        
        if (!categorySlug) {
            showErrorMessage('Category not found');
            return;
        }
        
        // Get category data
        const categoryResponse = await BlogAPI.getCategory(categorySlug);
        
        if (categoryResponse.status !== 'success') {
            showErrorMessage('Category not found');
            return;
        }
        
        const category = categoryResponse.data;
        
        // Update page title and header
        document.title = `${category.name} - Nutro Cloud Blog`;
        document.querySelector('.banner-title').textContent = category.name;
        document.querySelector('.slogan').textContent = category.description || 'Articles in this category';
        
        // Get posts in this category
        const postsResponse = await BlogAPI.getPosts({
            category: categorySlug,
            perPage: 9
        });
        
        if (postsResponse.status === 'success') {
            renderLatestPosts(postsResponse.data.posts);
            renderPagination(postsResponse.data.pagination);
        }
    } catch (error) {
        console.error('Failed to initialize category page:', error);
        showErrorMessage('Failed to load category. Please try again later.');
    }
}

/**
 * Initialize tag page
 */
async function initTagPage() {
    try {
        // Get tag slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const tagSlug = urlParams.get('tag');
        
        if (!tagSlug) {
            showErrorMessage('Tag not found');
            return;
        }
        
        // Get tag data
        const tagResponse = await BlogAPI.getTag(tagSlug);
        
        if (tagResponse.status !== 'success') {
            showErrorMessage('Tag not found');
            return;
        }
        
        const tag = tagResponse.data;
        
        // Update page title and header
        document.title = `${tag.name} - Nutro Cloud Blog`;
        document.querySelector('.banner-title').textContent = `Tag: ${tag.name}`;
        document.querySelector('.slogan').textContent = `Articles tagged with "${tag.name}"`;
        
        // Get posts with this tag
        const postsResponse = await BlogAPI.getPosts({
            tag: tagSlug,
            perPage: 9
        });
        
        if (postsResponse.status === 'success') {
            renderLatestPosts(postsResponse.data.posts);
            renderPagination(postsResponse.data.pagination);
        }
    } catch (error) {
        console.error('Failed to initialize tag page:', error);
        showErrorMessage('Failed to load tag. Please try again later.');
    }
}

/**
 * Initialize author page
 */
async function initAuthorPage() {
    try {
        // Get author slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const authorSlug = urlParams.get('author');
        
        if (!authorSlug) {
            showErrorMessage('Author not found');
            return;
        }
        
        // Get author data
        const authorResponse = await BlogAPI.getAuthor(authorSlug);
        
        if (authorResponse.status !== 'success') {
            showErrorMessage('Author not found');
            return;
        }
        
        const author = authorResponse.data;
        
        // Update page title and header
        document.title = `${author.name} - Nutro Cloud Blog`;
        document.querySelector('.banner-title').textContent = author.name;
        document.querySelector('.slogan').textContent = author.bio || 'Articles by this author';
        
        // Get posts by this author
        const postsResponse = await BlogAPI.getPosts({
            author: authorSlug,
            perPage: 9
        });
        
        if (postsResponse.status === 'success') {
            renderLatestPosts(postsResponse.data.posts);
            renderPagination(postsResponse.data.pagination);
        }
    } catch (error) {
        console.error('Failed to initialize author page:', error);
        showErrorMessage('Failed to load author. Please try again later.');
    }
}

/**
 * Initialize search page
 */
async function initSearchPage() {
    try {
        // Get search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (!query) {
            document.querySelector('.banner-title').textContent = 'Search';
            document.querySelector('.slogan').textContent = 'Enter a search term to find articles';
            return;
        }
        
        // Update page title and header
        document.title = `Search: ${query} - Nutro Cloud Blog`;
        document.querySelector('.banner-title').textContent = `Search Results: ${query}`;
        
        // Get search results
        const searchResponse = await BlogAPI.searchPosts(query);
        
        if (searchResponse.status === 'success') {
            const totalResults = searchResponse.data.pagination.total;
            document.querySelector('.slogan').textContent = `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`;
            
            renderLatestPosts(searchResponse.data.posts);
            renderPagination(searchResponse.data.pagination);
        }
    } catch (error) {
        console.error('Failed to initialize search page:', error);
        showErrorMessage('Failed to load search results. Please try again later.');
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchForm = document.querySelector('.search-widget form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const searchInput = this.querySelector('input[name="q"]');
            const query = searchInput.value.trim();
            
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

/**
 * Initialize comment form
 */
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const website = this.querySelector('input[name="website"]')?.value.trim();
            const content = this.querySelector('textarea[name="comment"]').value.trim();
            
            // Get post ID
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');
            
            if (!postId) {
                showErrorMessage('Cannot submit comment: Post ID not found');
                return;
            }
            
            // Validate form
            if (!name || !email || !content) {
                showErrorMessage('Please fill in all required fields');
                return;
            }
            
            try {
                // Submit comment
                const response = await BlogAPI.submitComment(postId, {
                    name,
                    email,
                    website,
                    content
                });
                
                if (response.status === 'success') {
                    showSuccessMessage('Comment submitted successfully! It will be visible after approval.');
                    commentForm.reset();
                } else {
                    showErrorMessage(response.message || 'Failed to submit comment');
                }
            } catch (error) {
                console.error('Failed to submit comment:', error);
                showErrorMessage('Failed to submit comment. Please try again later.');
            }
        });
    }
}

/**
 * Initialize sidebar
 */
async function initSidebar() {
    try {
        // Get categories
        const categoriesResponse = await BlogAPI.getCategories();
        
        if (categoriesResponse.status === 'success') {
            renderSidebarCategories(categoriesResponse.data);
        }
        
        // Get recent posts
        const recentPostsResponse = await BlogAPI.getPosts({
            perPage: 3,
            sort: 'published_at',
            order: 'desc'
        });
        
        if (recentPostsResponse.status === 'success') {
            renderSidebarRecentPosts(recentPostsResponse.data.posts);
        }
        
        // Get tags
        const tagsResponse = await BlogAPI.getTags();
        
        if (tagsResponse.status === 'success') {
            renderSidebarTags(tagsResponse.data);
        }
    } catch (error) {
        console.error('Failed to initialize sidebar:', error);
    }
}

/**
 * Render featured posts
 * 
 * @param {Array} posts - Featured posts
 */
function renderFeaturedPosts(posts) {
    const container = document.getElementById('featured-posts-container');
    
    if (!container) {
        return;
    }
    
    // Clear loading spinner
    container.innerHTML = '';
    
    // Render posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-lg-4 col-md-6';
        
        postElement.innerHTML = `
            <div class="single-post featured-post">
                <a href="post.html?id=${post.id}" class="post-image">
                    <img src="${post.featured_image || '../assets/images/blog/blog-list-1.png'}" alt="${post.title}">
                </a>
                <div class="post-meta">
                    <div class="post-category">
                        <a href="category.html?cat=${post.category_slug}">${post.category_name}</a>
                    </div>
                    <h3 class="post-title">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <div class="post-info">
                        <span class="post-date">
                            <i class="fa-regular fa-calendar"></i> ${formatDate(post.published_at)}
                        </span>
                        <span class="post-author">
                            <i class="fa-regular fa-user"></i> ${post.author_name}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(postElement);
    });
}

/**
 * Render latest posts
 * 
 * @param {Array} posts - Latest posts
 */
function renderLatestPosts(posts) {
    const container = document.getElementById('latest-posts-container');
    
    if (!container) {
        return;
    }
    
    // Clear loading spinner
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="no-posts">No posts found</p></div>';
        return;
    }
    
    // Render posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-lg-6 col-md-6';
        
        postElement.innerHTML = `
            <div class="single-post">
                <a href="post.html?id=${post.id}">
                    <img src="${post.featured_image || '../assets/images/blog/blog-list-1.png'}" alt="${post.title}">
                </a>
                <div class="single-post__meta">
                    <div class="author__date__cat">
                        <div class="author"><i class="fa-regular fa-circle-user"></i> By <a href="author.html?author=${post.author_slug || ''}">${post.author_name}</a></div>
                        <span class="date"><i class="fa-regular fa-clock"></i> ${formatDate(post.published_at)}</span>
                        <div class="cat"><i class="fa-regular fa-tags"></i> <a href="category.html?cat=${post.category_slug}">${post.category_name}</a></div>
                    </div>
                    <a href="post.html?id=${post.id}" class="title fw-bold">${post.title}</a>
                    <p class="excerpt">${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="readmore__btn rts-btn rts-btn-primary">read more</a>
                </div>
            </div>
        `;
        
        container.appendChild(postElement);
    });
}

/**
 * Render pagination
 * 
 * @param {Object} pagination - Pagination data
 */
function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    
    if (!container || pagination.total_pages <= 1) {
        return;
    }
    
    container.innerHTML = '';
    
    // Previous page
    const prevLi = document.createElement('li');
    if (pagination.current_page > 1) {
        prevLi.innerHTML = `<a href="${pagination.links.prev}"><i class="fa-regular fa-chevron-left"></i></a>`;
    } else {
        prevLi.innerHTML = `<span class="disabled"><i class="fa-regular fa-chevron-left"></i></span>`;
    }
    container.appendChild(prevLi);
    
    // Page numbers
    const maxPages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    // First page
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.innerHTML = `<a href="${pagination.links.first}">1</a>`;
        container.appendChild(firstLi);
        
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.textContent = '...';
            container.appendChild(ellipsisLi);
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        const url = new URL(pagination.links.first);
        url.searchParams.set('page', i);
        
        if (i === pagination.current_page) {
            pageLi.innerHTML = `<a class="active" href="${url.toString()}">${i}</a>`;
        } else {
            pageLi.innerHTML = `<a href="${url.toString()}">${i}</a>`;
        }
        
        container.appendChild(pageLi);
    }
    
    // Last page
    if (endPage < pagination.total_pages) {
        if (endPage < pagination.total_pages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.textContent = '...';
            container.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.innerHTML = `<a href="${pagination.links.last}">${pagination.total_pages}</a>`;
        container.appendChild(lastLi);
    }
    
    // Next page
    const nextLi = document.createElement('li');
    if (pagination.current_page < pagination.total_pages) {
        nextLi.innerHTML = `<a href="${pagination.links.next}"><i class="fa-regular fa-chevron-right"></i></a>`;
    } else {
        nextLi.innerHTML = `<span class="disabled"><i class="fa-regular fa-chevron-right"></i></span>`;
    }
    container.appendChild(nextLi);
}

/**
 * Render categories
 * 
 * @param {Array} categories - Categories
 */
function renderCategories(categories) {
    const container = document.getElementById('categories-container');
    
    if (!container) {
        return;
    }
    
    container.innerHTML = '';
    
    // Render categories
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'col-lg-4 col-md-6';
        
        categoryElement.innerHTML = `
            <div class="category-card">
                <h3 class="category-title">
                    <a href="category.html?cat=${category.slug}">${category.name}</a>
                </h3>
                <p class="category-count">${category.post_count} article${category.post_count !== 1 ? 's' : ''}</p>
                <a href="category.html?cat=${category.slug}" class="category-link">View Articles <i class="fa-regular fa-arrow-right"></i></a>
            </div>
        `;
        
        container.appendChild(categoryElement);
    });
}

/**
 * Render sidebar categories
 * 
 * @param {Array} categories - Categories
 */
function renderSidebarCategories(categories) {
    const container = document.querySelector('.category-widget .cat__counter');
    
    if (!container) {
        return;
    }
    
    container.innerHTML = '';
    
    // Render categories
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'single-cat';
        
        li.innerHTML = `
            <a href="category.html?cat=${category.slug}">${category.name} <span><i class="fa-regular fa-arrow-right"></i></span></a>
        `;
        
        container.appendChild(li);
    });
}

/**
 * Render sidebar recent posts
 * 
 * @param {Array} posts - Recent posts
 */
function renderSidebarRecentPosts(posts) {
    const container = document.querySelector('.recentpost-widget .recent-posts');
    
    if (!container) {
        return;
    }
    
    container.innerHTML = '';
    
    // Render posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'single-post';
        
        postElement.innerHTML = `
            <div class="thumb">
                <img src="${post.featured_image || '../assets/images/blog/blog-recent-1.png'}" alt="${post.title}" height="85" width="85">
            </div>
            <div class="meta">
                <span class="published"><i class="fa-regular fa-clock"></i> ${formatDate(post.published_at)}</span>
                <h6 class="title"><a href="post.html?id=${post.id}">${post.title}</a></h6>
            </div>
        `;
        
        container.appendChild(postElement);
    });
}

/**
 * Render sidebar tags
 * 
 * @param {Array} tags - Tags
 */
function renderSidebarTags(tags) {
    const container = document.querySelector('.tags-widget .tags-style');
    
    if (!container) {
        return;
    }
    
    container.innerHTML = '';
    
    // Render tags
    tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'tags';
        
        li.innerHTML = `<a href="tag.html?tag=${tag.slug}">${tag.name}</a>`;
        
        container.appendChild(li);
    });
}

/**
 * Render post
 * 
 * @param {Object} post - Post data
 */
function renderPost(post) {
    // Set post title
    const titleElement = document.getElementById('post-title');
    if (titleElement) {
        titleElement.textContent = post.title;
    }
    
    // Set post author
    const authorElement = document.getElementById('post-author');
    if (authorElement) {
        authorElement.textContent = post.author_name;
        authorElement.href = `author.html?author=${post.author_slug || ''}`;
    }
    
    // Set post date
    const dateElement = document.getElementById('post-date');
    if (dateElement) {
        dateElement.innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatDate(post.published_at)}`;
    }
    
    // Set post category
    const categoryElement = document.getElementById('post-category');
    if (categoryElement) {
        categoryElement.innerHTML = `<i class="fa-regular fa-folder"></i> <a href="category.html?cat=${post.category_slug}">${post.category_name}</a>`;
    }
    
    // Set post image
    const imageElement = document.getElementById('post-image');
    if (imageElement && post.featured_image) {
        imageElement.src = post.featured_image;
        imageElement.alt = post.title;
    }
    
    // Set post content
    const contentElement = document.getElementById('post-content');
    if (contentElement) {
        contentElement.innerHTML = post.content;
    }
    
    // Set post tags
    const tagsContainer = document.querySelector('.post-tags .tags-list');
    if (tagsContainer && post.tags && post.tags.length > 0) {
        tagsContainer.innerHTML = '';
        
        post.tags.forEach(tag => {
            const tagLink = document.createElement('a');
            tagLink.href = `tag.html?tag=${tag.slug}`;
            tagLink.textContent = tag.name;
            
            tagsContainer.appendChild(tagLink);
        });
    }
    
    // Set related posts
    if (post.related_posts && post.related_posts.length > 0) {
        const relatedContainer = document.querySelector('.related-posts .row');
        
        if (relatedContainer) {
            relatedContainer.innerHTML = '';
            
            post.related_posts.forEach(relatedPost => {
                const postElement = document.createElement('div');
                postElement.className = 'col-md-6';
                
                postElement.innerHTML = `
                    <div class="related-post-item">
                        <a href="post.html?id=${relatedPost.id}" class="post-image">
                            <img src="${relatedPost.featured_image || '../assets/images/blog/blog-list-1.png'}" alt="${relatedPost.title}">
                        </a>
                        <div class="post-info">
                            <span class="post-date"><i class="fa-regular fa-calendar"></i> ${formatDate(relatedPost.published_at)}</span>
                            <h4 class="post-title"><a href="post.html?id=${relatedPost.id}">${relatedPost.title}</a></h4>
                        </div>
                    </div>
                `;
                
                relatedContainer.appendChild(postElement);
            });
        }
    }
    
    // Set comments
    if (post.comments_enabled && post.comments) {
        const commentsContainer = document.querySelector('.comment-list');
        const commentsTitle = document.querySelector('.comments-section .section-title');
        
        if (commentsContainer && commentsTitle) {
            commentsContainer.innerHTML = '';
            commentsTitle.textContent = `Comments (${post.comments.length})`;
            
            post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment-item';
                
                commentElement.innerHTML = `
                    <div class="comment-avatar">
                        <img src="../assets/images/blog/comment-1.jpg" alt="${comment.author_name}">
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <h4 class="commenter-name">${comment.author_name}</h4>
                            <span class="comment-date">${formatDate(comment.created_at)}</span>
                        </div>
                        <div class="comment-text">
                            <p>${comment.content}</p>
                        </div>
                        <div class="comment-actions">
                            <a href="#" class="reply-btn" data-comment-id="${comment.id}">Reply</a>
                        </div>
                    </div>
                `;
                
                commentsContainer.appendChild(commentElement);
            });
        }
    }
}

/**
 * Update meta tags
 * 
 * @param {Object} post - Post data
 */
function updateMetaTags(post) {
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', post.meta_description || post.excerpt);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', post.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', post.meta_description || post.excerpt);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && post.featured_image) {
        ogImage.setAttribute('content', post.featured_image);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.setAttribute('content', window.location.href);
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', post.title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', post.meta_description || post.excerpt);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && post.featured_image) {
        twitterImage.setAttribute('content', post.featured_image);
    }
}

/**
 * Update post schema
 * 
 * @param {Object} post - Post data
 */
function updatePostSchema(post) {
    const articleSchema = document.getElementById('article-schema');
    
    if (articleSchema) {
        const schemaData = JSON.parse(articleSchema.textContent);
        
        schemaData.headline = post.title;
        schemaData.description = post.meta_description || post.excerpt;
        schemaData.image = post.featured_image || schemaData.image;
        schemaData.datePublished = post.published_at;
        schemaData.dateModified = post.updated_at;
        schemaData.author.name = post.author_name;
        schemaData.mainEntityOfPage['@id'] = window.location.href;
        
        articleSchema.textContent = JSON.stringify(schemaData);
    }
    
    const breadcrumbSchema = document.getElementById('breadcrumb-schema');
    
    if (breadcrumbSchema) {
        const schemaData = JSON.parse(breadcrumbSchema.textContent);
        
        schemaData.itemListElement[2].name = post.title;
        schemaData.itemListElement[2].item = window.location.href;
        
        breadcrumbSchema.textContent = JSON.stringify(schemaData);
    }
}

/**
 * Format date
 * 
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Show error message
 * 
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Add to page
    document.body.appendChild(errorElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

/**
 * Show success message
 * 
 * @param {string} message - Success message
 */
function showSuccessMessage(message) {
    // Create success message element
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    
    // Add to page
    document.body.appendChild(successElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}