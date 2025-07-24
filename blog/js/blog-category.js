/**
 * Blog Category JavaScript - Nutro Cloud Blog
 * 
 * هذا الملف يحتوي على الدوال المسؤولة عن تحميل وعرض مقالات القسم المحدد
 */

document.addEventListener('DOMContentLoaded', function() {
    // الحصول على معرف القسم من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const categorySlug = urlParams.get('slug');
    
    if (!categorySlug) {
        // إذا لم يتم تحديد معرف القسم، يتم التوجيه إلى الصفحة الرئيسية للمدونة
        window.location.href = 'index.html';
        return;
    }
    
    // تحميل بيانات القسم
    loadCategory(categorySlug);
    
    // إعداد نموذج البحث في الشريط الجانبي
    setupSidebarSearch();
    
    // إعداد نموذج النشرة البريدية في الشريط الجانبي
    setupSidebarNewsletterForm();
});

/**
 * دالة لتحميل بيانات القسم
 * @param {string} slug - المعرف الفريد للقسم
 */
async function loadCategory(slug) {
    const categoryTitle = document.getElementById('category-title');
    const categoryDescription = document.getElementById('category-description');
    const categoryNameBreadcrumb = document.getElementById('category-name-breadcrumb');
    const categoryPostsContainer = document.getElementById('category-posts-container');
    const categoryPagination = document.getElementById('category-pagination');
    
    try {
        // تحميل بيانات القسم
        const category = await window.blogAPI.getCategoryBySlug(slug);
        
        if (!category) {
            categoryPostsContainer.innerHTML = '<div class="alert alert-danger">القسم غير موجود</div>';
            return;
        }
        
        // تحديث عنوان الصفحة ووصفها
        document.title = `قسم: ${category.name} | مدونة نوترو كلاود`;
        document.querySelector('meta[name="description"]').setAttribute('content', `تصفح جميع المقالات في قسم ${category.name} في مدونة نوترو كلاود. نصائح وإرشادات متخصصة في مجال استضافة المواقع والتقنيات الحديثة.`);
        
        // تحديث وسوم Open Graph
        document.querySelector('meta[property="og:title"]').setAttribute('content', `قسم: ${category.name} | مدونة نوترو كلاود`);
        document.querySelector('meta[property="og:description"]').setAttribute('content', `تصفح جميع المقالات في قسم ${category.name} في مدونة نوترو كلاود`);
        document.querySelector('meta[property="og:url"]').setAttribute('content', `https://www.nutro.cloud/blog/category.html?slug=${slug}`);
        
        // تحديث وسوم Twitter Card
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', `قسم: ${category.name} | مدونة نوترو كلاود`);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', `تصفح جميع المقالات في قسم ${category.name} في مدونة نوترو كلاود`);
        
        // تحديث الرابط القانوني
        document.querySelector('link[rel="canonical"]').setAttribute('href', `https://www.nutro.cloud/blog/category.html?slug=${slug}`);
        
        // تحديث هيكل البيانات المنظمة للقسم
        updateCategorySchema(category);
        
        // تحديث هيكل البيانات المنظمة لمسار التنقل
        updateBreadcrumbSchema(category.name, slug);
        
        // تحديث عنوان القسم ووصفه
        categoryTitle.textContent = `قسم: ${category.name}`;
        categoryDescription.textContent = category.description || `جميع المقالات في قسم ${category.name}`;
        categoryNameBreadcrumb.textContent = category.name;
        
        // تحميل مقالات القسم
        loadCategoryPosts(slug, 1);
        
        // تحميل الأقسام في الشريط الجانبي
        loadSidebarCategories(slug);
        
        // تحميل المقالات الشائعة في الشريط الجانبي
        loadPopularPosts();
        
        // تحميل الوسوم الشائعة في الشريط الجانبي
        loadPopularTags();
    } catch (error) {
        console.error('خطأ في تحميل القسم:', error);
        categoryPostsContainer.innerHTML = '<div class="alert alert-danger">حدث خطأ أثناء تحميل القسم</div>';
    }
}

/**
 * دالة لتحميل مقالات القسم
 * @param {string} slug - المعرف الفريد للقسم
 * @param {number} page - رقم الصفحة
 */
async function loadCategoryPosts(slug, page = 1) {
    const categoryPostsContainer = document.getElementById('category-posts-container');
    const categoryPagination = document.getElementById('category-pagination');
    
    try {
        const result = await window.blogAPI.getPostsByCategory(slug, page, 6);
        const { posts, totalPages, currentPage } = result;
        
        if (posts.length === 0) {
            categoryPostsContainer.innerHTML = '<div class="alert alert-info">لا توجد مقالات في هذا القسم</div>';
            categoryPagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        posts.forEach(post => {
            html += `
                <div class="blog-card horizontal-card">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="thumbnail">
                                <a href="post.html?slug=${post.slug}">
                                    <img src="${post.featuredImage || '../assets/images/blog/default-post.jpg'}" alt="${post.title}">
                                </a>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="blog-content">
                                <div class="blog-meta">
                                    <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.publishedAt)}</span>
                                    <span><i class="fa-regular fa-user"></i> ${post.author.name}</span>
                                </div>
                                <h3 class="title"><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                                <p class="excerpt">${post.excerpt}</p>
                                <a href="post.html?slug=${post.slug}" class="read-more">قراءة المزيد <i class="fa-solid fa-arrow-left"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        categoryPostsContainer.innerHTML = html;
        
        // إنشاء أزرار التنقل بين الصفحات
        createPagination(categoryPagination, totalPages, currentPage, (page) => loadCategoryPosts(slug, page));
    } catch (error) {
        console.error('خطأ في تحميل مقالات القسم:', error);
        categoryPostsContainer.innerHTML = '<div class="alert alert-danger">حدث خطأ أثناء تحميل المقالات</div>';
        categoryPagination.innerHTML = '';
    }
}

/**
 * دالة لتحميل الأقسام في الشريط الجانبي
 * @param {string} currentSlug - المعرف الفريد للقسم الحالي
 */
async function loadSidebarCategories(currentSlug) {
    const sidebarCategoriesContainer = document.getElementById('sidebar-categories');
    
    try {
        const categories = await window.blogAPI.getAllCategories();
        
        if (categories.length === 0) {
            sidebarCategoriesContainer.innerHTML = '<li>لا توجد أقسام</li>';
            return;
        }
        
        let html = '';
        
        categories.forEach(category => {
            const isActive = category.slug === currentSlug ? 'active' : '';
            
            html += `
                <li class="${isActive}">
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
 * دالة لتحميل الوسوم الشائعة في الشريط الجانبي
 */
async function loadPopularTags() {
    const popularTagsContainer = document.getElementById('popular-tags');
    
    try {
        const popularTags = await window.blogAPI.getPopularTags(15);
        
        if (popularTags.length === 0) {
            popularTagsContainer.innerHTML = '<p>لا توجد وسوم شائعة</p>';
            return;
        }
        
        let html = '';
        
        popularTags.forEach(tag => {
            html += `<a href="tag.html?slug=${tag.slug}">${tag.name}</a>`;
        });
        
        popularTagsContainer.innerHTML = html;
    } catch (error) {
        console.error('خطأ في تحميل الوسوم الشائعة:', error);
        popularTagsContainer.innerHTML = '<p>حدث خطأ أثناء تحميل الوسوم الشائعة</p>';
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
 * دالة لتحديث هيكل البيانات المنظمة للقسم
 * @param {Object} category - بيانات القسم
 */
function updateCategorySchema(category) {
    const categorySchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `قسم: ${category.name} | مدونة نوترو كلاود`,
        "description": category.description || `جميع المقالات في قسم ${category.name}`,
        "url": `https://www.nutro.cloud/blog/category.html?slug=${category.slug}`,
        "publisher": {
            "@type": "Organization",
            "name": "نوترو كلاود",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.nutro.cloud/assets/images/logo/logo2.png"
            }
        }
    };
    
    document.getElementById('category-schema').textContent = JSON.stringify(categorySchema);
}

/**
 * دالة لتحديث هيكل البيانات المنظمة لمسار التنقل
 * @param {string} categoryName - اسم القسم
 * @param {string} slug - المعرف الفريد للقسم
 */
function updateBreadcrumbSchema(categoryName, slug) {
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
                "name": categoryName,
                "item": `https://www.nutro.cloud/blog/category.html?slug=${slug}`
            }
        ]
    };
    
    document.getElementById('breadcrumb-schema').textContent = JSON.stringify(breadcrumbSchema);
}

/**
 * دالة لإنشاء أزرار التنقل بين الصفحات
 * @param {HTMLElement} container - العنصر الذي سيحتوي على أزرار التنقل
 * @param {number} totalPages - إجمالي عدد الصفحات
 * @param {number} currentPage - الصفحة الحالية
 * @param {Function} loadFunction - الدالة التي سيتم استدعاؤها عند النقر على زر الصفحة
 */
function createPagination(container, totalPages, currentPage, loadFunction) {
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // زر الصفحة السابقة
    if (currentPage > 1) {
        html += `<a href="#" data-page="${currentPage - 1}"><i class="fa-solid fa-chevron-right"></i></a>`;
    }
    
    // أزرار الصفحات
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        html += `<a href="#" data-page="1">1</a>`;
        if (startPage > 2) {
            html += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<span class="active">${i}</span>`;
        } else {
            html += `<a href="#" data-page="${i}">${i}</a>`;
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span>...</span>`;
        }
        html += `<a href="#" data-page="${totalPages}">${totalPages}</a>`;
    }
    
    // زر الصفحة التالية
    if (currentPage < totalPages) {
        html += `<a href="#" data-page="${currentPage + 1}"><i class="fa-solid fa-chevron-left"></i></a>`;
    }
    
    container.innerHTML = html;
    
    // إضافة مستمعي الأحداث لأزرار التنقل
    const pageLinks = container.querySelectorAll('a[data-page]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            loadFunction(page);
            
            // التمرير إلى أعلى الصفحة
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
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