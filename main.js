// NutroCloud Main.js - يعمل مع جميع القوائم والصفحات

document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');

    // تحميل الهيدر
    if (headerElement) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                headerElement.innerHTML = data;
            })
            .catch(error => console.log('Header could not be loaded:', error));
    }

    // تحميل الفوتر
    if (footerElement) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                footerElement.innerHTML = data;
            })
            .catch(error => console.log('Footer could not be loaded:', error));
    }

    console.log('NutroCloud main.js loaded successfully');
});

// تفعيل جميع القوائم المنسدلة (submenus) في كل الصفحات ولكل القوائم
document.addEventListener("click", function(event) {
    let mainLink = event.target.closest('.main');
    if (mainLink) {
        event.preventDefault();

        // إغلاق أي قائمة أخرى مفتوحة (اختياري)
        document.querySelectorAll('.submenu.mm-show').forEach(function(openSubmenu) {
            if (openSubmenu !== mainLink.nextElementSibling) {
                openSubmenu.classList.remove('mm-show');
                openSubmenu.classList.add('mm-collapse');
            }
        });

        // فتح/إغلاق القائمة الخاصة بالعنصر الحالي
        let submenu = mainLink.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('mm-show');
            submenu.classList.toggle('mm-collapse');
        }
    }
});
