// Fix JavaScript errors in price.html
document.addEventListener('DOMContentLoaded', function() {
    console.log('js-error-fix.js loaded');
    
    // Fix for language switcher
    function setupLanguageSwitcher() {
        try {
            // Get language from URL parameter or default to 'en'
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
                el.style.display = lang === 'ar' ? 'block' : '';
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
        } catch (e) {
            console.error('Error in setupLanguageSwitcher:', e);
        }
    }
    
    // Fix for tables
    function setupTables() {
        try {
            // Ensure all required tables exist
            const tableIds = [
                'vps-plans-table', 'wordpress-plans-table', 'shared-plans-table',
                's3-plans-table-en', 's3-plans-table-ar',
                'nodejs-plans-table-en', 'nodejs-plans-table-ar',
                'gpu-plans-table-en', 'gpu-plans-table-ar',
                'deepseek-plans-table-en', 'deepseek-plans-table-ar'
            ];
            
            tableIds.forEach(id => {
                if (!document.getElementById(id)) {
                    console.log(`Creating missing table: ${id}`);
                    // Find the section that should contain this table
                    const sectionId = id.split('-')[0] + '-plans';
                    const section = document.getElementById(sectionId);
                    
                    if (section) {
                        // Find the table container
                        const tableContainer = section.querySelector('.table-responsive table');
                        if (tableContainer) {
                            // Create the missing tbody
                            const tbody = document.createElement('tbody');
                            tbody.id = id;
                            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading...</td></tr>';
                            tableContainer.appendChild(tbody);
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error in setupTables:', e);
        }
    }
    
    // Fix for plan navigation
    function setupPlanNavigation() {
        try {
            // Add click event to navigation buttons
            document.querySelectorAll('.plan-nav-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update active button
                    document.querySelectorAll('.plan-nav-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Get target section ID
                    const targetId = this.getAttribute('href').substring(1) + '-plans';
                    
                    // Hide all sections
                    document.querySelectorAll('.pricing-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Show target section
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, this.getAttribute('href'));
                });
            });
            
            // Handle initial hash
            const hash = window.location.hash || '#vps';
            const activeButton = document.querySelector(`a[href="${hash}"]`);
            if (activeButton) {
                activeButton.click();
            } else {
                // Default to VPS
                const defaultButton = document.querySelector('a[href="#vps"]');
                if (defaultButton) defaultButton.click();
            }
        } catch (e) {
            console.error('Error in setupPlanNavigation:', e);
        }
    }
    
    // Run all setup functions
    setupLanguageSwitcher();
    setupTables();
    setupPlanNavigation();
});
