async function loadContent() {
    const headerResponse = await fetch('header.html');
    const headerData = await headerResponse.text();
    document.getElementById('header').innerHTML = headerData;

    const footerResponse = await fetch('footer.html');
    const footerData = await footerResponse.text();
    document.getElementById('footer').innerHTML = footerData;

    setupSidebarEvents(); // استدعاء الدالة بعد تحميل الفوتر
}

loadContent();

function setupSidebarEvents() {
    console.log("إعادة تهيئة أحداث القائمة الجانبية...");

    // استهداف الزر الذي يفتح القائمة الجانبية
    const sidebar = document.getElementById('side-bar');
    const closeButton = document.querySelector('.close-icon-menu');
    const dropdownLinks = document.querySelectorAll('.has-droupdown > a');

    if (!sidebar) {
        console.warn("القائمة الجانبية غير موجودة، تأكد من تحميل الفوتر.");
        return;
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            sidebar.classList.remove('open'); // إغلاق القائمة
        });
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // منع التنقل الفوري
            const submenu = link.nextElementSibling;

            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('mm-collapse'); // تبديل حالة القائمة
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
  fetch("https://user.7tteam.com/admin/nutrocloud/banner.php")
    .then(res => res.text())
    .then(data => {
      document.getElementById('promo-banner').innerHTML = data;
    });
});
         