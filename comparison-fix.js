// إصلاح أزرار المقارنة
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح زر المقارنة الإنجليزي
    const showComparisonBtnEn = document.getElementById('show-comparison-en');
    const comparisonTableEn = document.getElementById('comparison-table-container-en');
    
    if (showComparisonBtnEn && comparisonTableEn) {
        showComparisonBtnEn.onclick = function() {
            if (comparisonTableEn.style.display === 'none') {
                comparisonTableEn.style.display = 'block';
                showComparisonBtnEn.textContent = 'Hide Comparison Table';
            } else {
                comparisonTableEn.style.display = 'none';
                showComparisonBtnEn.textContent = 'Show Full Comparison Table';
            }
        };
    }
    
    // إصلاح زر المقارنة العربي
    const showComparisonBtnAr = document.getElementById('show-comparison-ar');
    const comparisonTableAr = document.getElementById('comparison-table-container-ar');
    
    if (showComparisonBtnAr && comparisonTableAr) {
        showComparisonBtnAr.onclick = function() {
            if (comparisonTableAr.style.display === 'none') {
                comparisonTableAr.style.display = 'block';
                showComparisonBtnAr.textContent = 'إخفاء جدول المقارنة';
            } else {
                comparisonTableAr.style.display = 'none';
                showComparisonBtnAr.textContent = 'عرض جدول المقارنة الكامل';
            }
        };
    }
});