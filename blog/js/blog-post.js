/**
 * Blog Post JavaScript - Nutro Cloud Blog
 * 
 * هذا الملف يحتوي على الدوال المسؤولة عن تحميل وعرض محتوى المقال الفردي
 */

document.addEventListener('DOMContentLoaded', function() {
    // الحصول على معرف المقال من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');
    
    if (!postSlug) {
        // إذا لم يتم تحديد معرف المقال، يتم التوجيه إلى الصفحة الرئيسية للمدونة
        window.location.href = 'index.html';
        return;
    }
    
    // تحميل بيانات المقال
    loadPost(postSlug);
    
    // إعداد نموذج التعليقات
    setupCommentForm(postSlug);
    
    // إعداد أزرار المشاركة
    setupShareButtons();
    
    // إعداد نموذج البحث في الشريط الجانبي
    setupSidebarSearch();
    
    // إعداد نموذج النشرة البريدية في الشريط الجانبي
    setupSidebarNewsletterForm();
});

/**
 * دالة لتحميل بيانات المقال
 * @param {string} slug - المعرف الفريد للمقال
 */
async function loadPost(slug) {
    const blogPostContainer = document.getElementById('blog-post');
    const authorInfoContainer = document.getElementById('author-info');
    const relatedPostsContainer = document.getElementById('related-posts-container');
    const commentsContainer = document.getElementById('comments-container');
    const commentsCountElement = document.getElementById('comments-count');
    const postTitleBreadcrumb = document.getElementById('post-title-breadcrumb');
    const postTagsContainer = document.getElementById('post-tags');
    
    try {
        // تحميل بيانات المقال
        const post = await window.blogAPI.getPostBySlug(slug);
        
        if (!post) {
            blogPostContainer.innerHTML = '<div class="alert alert-danger">المقال غير موجود</div>';
            return;
        }
        
        // تحديث عنوان الصفحة ووصفها
        document.title = `${post.title} | مدونة نوترو كلاود`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[name="keywords"]').setAttribute('content', post.tags.map(tag => tag.name).join(', '));
        
        // تحديث وسوم Open Graph
        document.querySelector('meta[property="og:title"]').setAttribute('content', `${post.title} | مدونة نوترو كلاود`);
        document.querySelector('meta[property="og:description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[property="og:image"]').setAttribute('content', post.featuredImage || 'https://www.nutro.cloud/assets/images/blog/default-post.jpg');
        document.querySelector('meta[property="og:url"]').setAttribute('content', `https://www.nutro.cloud/blog/post.html?slug=${slug}`);
        
        // تحديث وسوم Twitter Card
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', `${post.title} | مدونة نوترو كلاود`);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[name="twitter:image"]').setAttribute('content', post.featuredImage || 'https://www.nutro.cloud/assets/images/blog/default-post.jpg');
        
        // تحديث الرابط القانوني
        document.querySelector('link[rel="canonical"]').setAttribute('href', `https://www.nutro.cloud/blog/post.html?slug=${slug}`);
        
        // تحديث هيكل البيانات المنظمة للمقال
        updateArticleSchema(post);
        
        // تحديث هيكل البيانات المنظمة لمسار التنقل
        updateBreadcrumbSchema(post.title, slug);
        
        // تحديث مسار التنقل
        postTitleBreadcrumb.textContent = post.title;
        
        // إنشاء محتوى المقال
        let postHTML = `
            <div class="post-header">
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <img src="${post.author.avatar || '../assets/images/blog/default-avatar.jpg'}" alt="${post.author.name}" class="author-img">
                    <span class="author-name">${post.author.name}</span>
                    <span class="post-date"><i class="fa-regular fa-calendar"></i> ${formatDate(post.publishedAt)}</span>
                    <span class="post-category"><i class="fa-regular fa-folder"></i> ${post.category.name}</span>
                    <span class="post-comments"><i class="fa-regular fa-comment"></i> ${post.commentsCount} تعليق</span>
                </div>
            </div>
            <div class="post-featured-image">
                <img src="${post.featuredImage || '../assets/images/blog/default-post.jpg'}" alt="${post.title}">
            </div>
            <div class="post-content">
                ${post.content}
            </div>
        `;
        
        blogPostContainer.innerHTML = postHTML;
        
        // إنشاء معلومات الكاتب
        let authorHTML = `
            <img src="${post.author.avatar || '../assets/images/blog/default-avatar.jpg'}" alt="${post.author.name}" class="author-img">
            <div class="author-details">
                <h4>${post.author.name}</h4>
                <p>${post.author.bio || 'كاتب في مدونة نوترو كلاود'}</p>
                <div class="author-social">
                    ${post.author.twitter ? `<a href="${post.author.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                    ${post.author.linkedin ? `<a href="${post.author.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
                    ${post.author.facebook ? `<a href="${post.author.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                    ${post.author.instagram ? `<a href="${post.author.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
            </div>
        `;
        
        authorInfoContainer.innerHTML = authorHTML;
        
        // إنشاء الوسوم
        if (post.tags && post.tags.length > 0) {
            let tagsHTML = '';
            post.tags.forEach(tag => {
                tagsHTML += `<a href="tag.html?slug=${tag.slug}">${tag.name}</a>`;
            });
            postTagsContainer.innerHTML = tagsHTML;
        }
        
        // تحميل المقالات ذات الصلة
        loadRelatedPosts(slug, relatedPostsContainer);
        
        // تحميل التعليقات
        loadComments(slug, commentsContainer, commentsCountElement);
        
        // تحميل الأقسام في الشريط الجانبي
        loadSidebarCategories();
        
        // تحميل المقالات الشائعة في الشريط الجانبي
        loadPopularPosts();
    } catch (error) {
        console.error('خطأ في تحميل المقال:', error);
        blogPostContainer.innerHTML = '<div class="alert alert-danger">حدث خطأ أثناء تحميل المقال</div>';
    }
}

/**
 * دالة لتحميل المقالات ذات الصلة
 * @param {string} slug - المعرف الفريد للمقال الحالي
 * @param {HTMLElement} container - العنصر الذي سيحتوي على المقالات ذات الصلة
 */
async function loadRelatedPosts(slug, container) {
    try {
        const relatedPosts = await window.blogAPI.getRelatedPosts(slug, 3);
        
        if (relatedPosts.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center">لا توجد مقالات ذات صلة</p></div>';
            return;
        }
        
        let html = '';
        
        relatedPosts.forEach(post => {
            html += `
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <div class="thumbnail">
                            <a href="post.html?slug=${post.slug}">
                                <img src="${post.featuredImage || '../assets/images/blog/default-post.jpg'}" alt="${post.title}">
                            </a>
                        </div>
                        <div class="blog-content">
                            <div class="blog-meta">
                                <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.publishedAt)}</span>
                            </div>
                            <h3 class="title"><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                            <a href="post.html?slug=${post.slug}" class="read-more">قراءة المزيد <i class="fa-solid fa-arrow-left"></i></a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('خطأ في تحميل المقالات ذات الصلة:', error);
        container.innerHTML = '<div class="col-12"><p class="text-center">حدث خطأ أثناء تحميل المقالات ذات الصلة</p></div>';
    }
}

/**
 * دالة لتحميل تعليقات المقال
 * @param {string} slug - المعرف الفريد للمقال
 * @param {HTMLElement} container - العنصر الذي سيحتوي على التعليقات
 * @param {HTMLElement} countElement - العنصر الذي سيعرض عدد التعليقات
 */
async function loadComments(slug, container, countElement) {
    try {
        const comments = await window.blogAPI.getPostComments(slug);
        
        countElement.textContent = comments.length;
        
        if (comments.length === 0) {
            container.innerHTML = '<p class="no-comments">لا توجد تعليقات حالياً. كن أول من يعلق!</p>';
            return;
        }
        
        let html = '';
        
        comments.forEach(comment => {
            html += `
                <div class="comment">
                    <div class="comment-header">
                        <img src="${comment.avatar || '../assets/images/blog/default-avatar.jpg'}" alt="${comment.name}" class="comment-avatar">
                        <div class="comment-info">
                            <h5>${comment.name}</h5>
                            <span class="comment-date">${formatDate(comment.createdAt)}</span>
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>${comment.content}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('خطأ في تحميل التعليقات:', error);
        container.innerHTML = '<p class="text-center">حدث خطأ أثناء تحميل التعليقات</p>';
        countElement.textContent = '0';
    }
}

/**
 * دالة لإعداد نموذج التعليقات
 * @param {string} slug - المعرف الفريد للمقال
 */
function setupCommentForm(slug) {
    const commentForm = document.getElementById('comment-form');
    
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('comment-name');
        const emailInput = document.getElementById('comment-email');
        const contentInput = document.getElementById('comment-content');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!name || !email || !content) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        try {
            const commentData = { name, email, content };
            await window.blogAPI.addComment(slug, commentData);
            
            // إعادة تحميل التعليقات بعد إضافة تعليق جديد
            const commentsContainer = document.getElementById('comments-container');
            const commentsCountElement = document.getElementById('comments-count');
            await loadComments(slug, commentsContainer, commentsCountElement);
            
            // مسح حقول النموذج
            nameInput.value = '';
            emailInput.value = '';
            contentInput.value = '';
            
            alert('تم إضافة التعليق بنجاح');
        } catch (error) {
            console.error('خطأ في إضافة التعليق:', error);
            alert('حدث خطأ أثناء إضافة التعليق');
        }
    });
}

/**
 * دالة لإعداد أزرار المشاركة
 */
function setupShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    // مشاركة على فيسبوك
    document.getElementById('share-facebook').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, 'facebook-share', 'width=580,height=296');
    });
    
    // مشاركة على تويتر
    document.getElementById('share-twitter').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, 'twitter-share', 'width=580,height=296');
    });
    
    // مشاركة على لينكد إن
    document.getElementById('share-linkedin').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, 'linkedin-share', 'width=580,height=296');
    });
    
    // مشاركة على واتساب
    document.getElementById('share-whatsapp').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://api.whatsapp.com/send?text=${title} ${url}`, 'whatsapp-share', 'width=580,height=296');
    });
}

/**
 * دالة لتحميل الأقسام في الشريط الجانبي
 */
async function loadSidebarCategories() {
    const sidebarCategoriesContainer = document.getElementById('sidebar-categories');
    
    try {
        const categories = await window.blogAPI.getAllCategories();
        
        if (categories.length === 0) {
            sidebarCategoriesContainer.innerHTML = '<li>لا توجد أقسام</li>';
            return;
        }
        
        let html = '';
        
        categories.forEach(category => {
            html += `
                <li>
                    <a href="category.html?slug=${category.slug}">
                        ${category.name}
                        <span>${category.postsCount}</span>
                    </a>
                </li>
            `;
        });
        
        sidebarCategoriesContainer.innerHTML = html;
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
        sidebarCategoriesContainer.innerHTML = '<li>حدث خطأ أثناء تحميل الأقسام</li>';
    }
}

/**
 * دالة لتحميل المقالات الشائعة في الشريط الجانبي
 */
async function loadPopularPosts() {
    const popularPostsContainer = document.getElementById('popular-posts');
    
    try {
        const popularPosts = await window.blogAPI.getPopularPosts(5);
        
        if (popularPosts.length === 0) {
            popularPostsContainer.innerHTML = '<p>لا توجد مقالات شائعة</p>';
            return;
        }
        
        let html = '';
        
        popularPosts.forEach(post => {
            html += `
                <div class="popular-post">
                    <div class="post-thumb">
                        <a href="post.html?slug=${post.slug}">
                            <img src="${post.featuredImage || '../assets/images/blog/default-post.jpg'}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="post-info">
                        <h5><a href="post.html?slug=${post.slug}">${post.title}</a></h5>
                        <span class="post-date">${formatDate(post.publishedAt)}</span>
                    </div>
                </div>
            `;
        });
        
        popularPostsContainer.innerHTML = html;
    } catch (error) {
        console.error('خطأ في تحميل المقالات الشائعة:', error);
        popularPostsContainer.innerHTML = '<p>حدث خطأ أثناء تحميل المقالات الشائعة</p>';
    }
}

/**
 * دالة لإعداد نموذج البحث في الشريط الجانبي
 */
function setupSidebarSearch() {
    const searchInput = document.getElementById('sidebar-search');
    const searchBtn = document.getElementById('sidebar-search-btn');
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

/**
 * دالة لإعداد نموذج النشرة البريدية في الشريط الجانبي
 */
function setupSidebarNewsletterForm() {
    const newsletterForm = document.getElementById('sidebar-newsletter-form');
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        try {
            const result = await window.blogAPI.subscribeToNewsletter(email);
            alert('تم الاشتراك بنجاح في النشرة البريدية');
            emailInput.value = '';
        } catch (error) {
            alert('حدث خطأ أثناء الاشتراك في النشرة البريدية');
            console.error('خطأ في الاشتراك بالنشرة البريدية:', error);
        }
    });
}

/**
 * دالة لتحديث هيكل البيانات المنظمة للمقال
 * @param {Object} post - بيانات المقال
 */
function updateArticleSchema(post) {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.featuredImage || "https://www.nutro.cloud/assets/images/blog/default-post.jpg",
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt || post.publishedAt,
        "author": {
            "@type": "Person",
            "name": post.author.name
        },
        "publisher": {
            "@type": "Organization",
            "name": "نوترو كلاود",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.nutro.cloud/assets/images/logo/logo2.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.nutro.cloud/blog/post.html?slug=${post.slug}`
        }
    };
    
    document.getElementById('article-schema').textContent = JSON.stringify(articleSchema);
}

/**
 * دالة لتحديث هيكل البيانات المنظمة لمسار التنقل
 * @param {string} title - عنوان المقال
 * @param {string} slug - المعرف الفريد للمقال
 */
function updateBreadcrumbSchema(title, slug) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": "https://www.nutro.cloud/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "المدونة",
                "item": "https://www.nutro.cloud/blog/"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `https://www.nutro.cloud/blog/post.html?slug=${slug}`
            }
        ]
    };
    
    document.getElementById('breadcrumb-schema').textContent = JSON.stringify(breadcrumbSchema);
}

/**
 * دالة لتنسيق التاريخ
 * @param {string} dateString - التاريخ بصيغة نصية
 * @returns {string} - التاريخ المنسق
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}