// Simple main.js file for NutroCloud
document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    
    // Load header
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
    
    // Load footer
    if (footerElement) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                footerElement.innerHTML = data;
                
                // Call sidebar events setup if the function exists
                if (typeof setupSidebarEvents === 'function') {
                    setupSidebarEvents();
                }
            })
            .catch(error => console.log('Footer could not be loaded:', error));
    }

    console.log('NutroCloud main.js loaded successfully');
});
