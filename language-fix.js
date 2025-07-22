// Fix language display
document.addEventListener('DOMContentLoaded', function() {
  // Set language based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') || 'en';
  
  // Set HTML lang and dir attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Hide all language content
  document.querySelectorAll('.en-content, .ar-content').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show only content for selected language
  document.querySelectorAll(`.${lang}-content`).forEach(el => {
    el.style.display = 'block';
  });
  
  // Update language buttons
  const enBtn = document.getElementById('en-lang');
  const arBtn = document.getElementById('ar-lang');
  
  if (enBtn && arBtn) {
    if (lang === 'ar') {
      enBtn.classList.remove('active');
      enBtn.style.background = '#eee';
      enBtn.style.color = '#333';
      arBtn.classList.add('active');
      arBtn.style.background = '#673de6';
      arBtn.style.color = 'white';
    } else {
      arBtn.classList.remove('active');
      arBtn.style.background = '#eee';
      arBtn.style.color = '#333';
      enBtn.classList.add('active');
      enBtn.style.background = '#673de6';
      enBtn.style.color = 'white';
    }
  }
});